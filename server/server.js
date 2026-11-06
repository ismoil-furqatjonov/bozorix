/**
 * Bozorix — Rasmiy Backend Server (server.js)
 * Node.js o'rnatilgan modullari (http, fs, path, crypto) asosida
 * yuqori tezlikda va barqaror ishlaydigan REST API hamda statik fayllar serveri.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const ROOT_DIR = path.join(__dirname, '..');
const JWT_SECRET = 'bozorix_jwt_secret_key_2026_super_secure';
const SALT = 'bozorix_secure_salt_2026';

// ==========================================
// Ma'lumotlar Bazasi Yordamchilari
// ==========================================
function loadDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("DB o'qishda xatolik:", err);
    return { products: [], categories: [], users: [], orders: [], coupons: [], settings: {} };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("DB yozishda xatolik:", err);
    return false;
  }
}

// Parolni xavfsiz heshlash
function hashPassword(password) {
  return crypto.createHmac('sha256', SALT).update(password).digest('hex');
}

// Token yaratish va tekshirish
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 kun
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  return `${str}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [str, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(str).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function getAuthUser(req) {
  const authHeader = req.headers['authorization'] || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }
  return verifyToken(token);
}

// ==========================================
// HTTP Yordamchilari
// ==========================================
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token'
  });
  res.end(JSON.stringify(data));
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error("So'rov hajmi juda katta"));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Noto'g'ri JSON formati"));
      }
    });
    req.on('error', reject);
  });
}

// MIME turlari
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function serveStatic(req, res, pathname) {
  let safePath = path.normalize(decodeURIComponent(pathname));
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }
  const filePath = path.join(ROOT_DIR, safePath);

  // Path traversal himoyasi
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Ruxsat berilmagan!');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // index.html ga yo'naltirish (SPA fallback)
      const indexPath = path.join(ROOT_DIR, 'index.html');
      fs.readFile(indexPath, (err2, content) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end('Sahifa topilmadi');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

// ==========================================
// Asosiy Server So'rovlarini Boshqarish
// ==========================================
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token'
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const method = req.method;

  // Faqat /api/ bilan boshlangan so'rovlarni API sifatida qabul qilamiz
  if (pathname.startsWith('/api/')) {
    try {
      const db = loadDB();

      // 1. Health Check
      if (pathname === '/api/health' && method === 'GET') {
        return sendJSON(res, 200, { status: 'ok', server: 'Bozorix API v2.0', time: new Date().toISOString() });
      }

      // 2. Do'kon Sozlamalari (Settings)
      if (pathname === '/api/settings' && method === 'GET') {
        return sendJSON(res, 200, db.settings || {});
      }

      // ==========================================
      // AUTHENTICATION
      // ==========================================
      // Register
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { name, email, phone, password } = body;

        if (!name || !email || !password || !phone) {
          return sendJSON(res, 400, { error: "Barcha maydonlarni to'ldirish shart!" });
        }
        if (password.length < 6) {
          return sendJSON(res, 400, { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = db.users.find(u => u.email.toLowerCase() === normalizedEmail || u.phone === phone);
        if (existing) {
          return sendJSON(res, 409, { error: "Bu email yoki telefon raqam allaqachon ro'yxatdan o'tgan!" });
        }

        const newUser = {
          id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          role: 'user',
          passwordHash: hashPassword(password),
          city: body.city || "Toshkent shahri",
          address: body.address || "",
          registeredAt: new Date().toISOString()
        };

        db.users.push(newUser);
        saveDB(db);

        const token = generateToken(newUser);
        const safeUser = { ...newUser };
        delete safeUser.passwordHash;

        return sendJSON(res, 201, {
          message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
          token,
          user: safeUser
        });
      }

      // Login
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { login, password } = body;

        if (!login || !password) {
          return sendJSON(res, 400, { error: "Login (email/telefon) va parolni kiriting!" });
        }

        const normalizedLogin = login.toLowerCase().trim();
        const user = db.users.find(u => 
          u.email.toLowerCase() === normalizedLogin || u.phone.replace(/\s+/g, '') === normalizedLogin.replace(/\s+/g, '')
        );

        if (!user) {
          return sendJSON(res, 401, { error: "Foydalanuvchi topilmadi yoki parol noto'g'ri!" });
        }

        const expectedHash = hashPassword(password);
        if (user.passwordHash !== expectedHash) {
          return sendJSON(res, 401, { error: "Login yoki parol noto'g'ri!" });
        }

        const token = generateToken(user);
        const safeUser = { ...user };
        delete safeUser.passwordHash;

        return sendJSON(res, 200, {
          message: "Tizimga muvaffaqiyatli kirdingiz!",
          token,
          user: safeUser
        });
      }

      // Me (Current User + Orders)
      if (pathname === '/api/auth/me' && method === 'GET') {
        const auth = getAuthUser(req);
        if (!auth) {
          return sendJSON(res, 401, { error: "Avtorizatsiyadan o'tilmagan" });
        }
        const user = db.users.find(u => u.id === auth.id);
        if (!user) {
          return sendJSON(res, 404, { error: "Foydalanuvchi topilmadi" });
        }

        const safeUser = { ...user };
        delete safeUser.passwordHash;

        // Foydalanuvchi buyurtmalarini topish
        const userOrders = db.orders.filter(o => o.userId === user.id || o.customerPhone === user.phone);

        return sendJSON(res, 200, {
          user: safeUser,
          orders: userOrders
        });
      }

      // Update Profile
      if (pathname === '/api/auth/profile' && method === 'PUT') {
        const auth = getAuthUser(req);
        if (!auth) return sendJSON(res, 401, { error: "Avtorizatsiyadan o'tilmagan" });
        
        const body = await parseJSONBody(req);
        const userIdx = db.users.findIndex(u => u.id === auth.id);
        if (userIdx === -1) return sendJSON(res, 404, { error: "Foydalanuvchi topilmadi" });

        if (body.name) db.users[userIdx].name = body.name.trim();
        if (body.phone) db.users[userIdx].phone = body.phone.trim();
        if (body.city) db.users[userIdx].city = body.city;
        if (body.address) db.users[userIdx].address = body.address.trim();

        if (body.newPassword && body.newPassword.length >= 6) {
          db.users[userIdx].passwordHash = hashPassword(body.newPassword);
        }

        saveDB(db);

        const safeUser = { ...db.users[userIdx] };
        delete safeUser.passwordHash;
        return sendJSON(res, 200, { message: "Profil muvaffaqiyatli yangilandi!", user: safeUser });
      }

      // ==========================================
      // KATEGORIYALAR (Categories)
      // ==========================================
      if (pathname === '/api/categories' && method === 'GET') {
        // Kategoriyalar sonini haqiqiy mahsulotlar bo'yicha hisoblash
        const categories = (db.categories || []).map(cat => {
          if (cat.id === 'all') {
            return { ...cat, count: db.products.length };
          }
          const count = db.products.filter(p => p.category === cat.id).length;
          return { ...cat, count };
        });
        return sendJSON(res, 200, categories);
      }

      // ==========================================
      // MAHSULOTLAR (Products CRUD)
      // ==========================================
      // List Products
      if (pathname === '/api/products' && method === 'GET') {
        let results = [...db.products];

        // Toifa bo'yicha
        if (query.category && query.category !== 'all') {
          results = results.filter(p => p.category === query.category);
        }

        // Qidiruv
        if (query.search) {
          const q = query.search.toLowerCase().trim();
          results = results.filter(p => 
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.categoryName && p.categoryName.toLowerCase().includes(q))
          );
        }

        // Nishon (Badge)
        if (query.badge) {
          results = results.filter(p => p.badge && p.badge.toUpperCase() === query.badge.toUpperCase());
        }

        // Narx oralig'i
        if (query.minPrice) {
          results = results.filter(p => p.price >= Number(query.minPrice));
        }
        if (query.maxPrice) {
          results = results.filter(p => p.price <= Number(query.maxPrice));
        }

        // Saralash (Sort)
        if (query.sort === 'price-asc') {
          results.sort((a, b) => a.price - b.price);
        } else if (query.sort === 'price-desc') {
          results.sort((a, b) => b.price - a.price);
        } else if (query.sort === 'rating') {
          results.sort((a, b) => b.rating - a.rating);
        } else if (query.sort === 'discount') {
          results.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        } else if (query.sort === 'newest') {
          results.sort((a, b) => (b.badge === 'YANGI' ? 1 : 0) - (a.badge === 'YANGI' ? 1 : 0));
        } else {
          // Ommabop
          results.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        }

        return sendJSON(res, 200, results);
      }

      // Single Product
      const productMatch = pathname.match(/^\/api\/products\/(\d+)$/);
      if (productMatch && method === 'GET') {
        const id = Number(productMatch[1]);
        const product = db.products.find(p => p.id === id);
        if (!product) return sendJSON(res, 404, { error: "Mahsulot topilmadi" });
        return sendJSON(res, 200, product);
      }

      // Add Review to Product
      const reviewMatch = pathname.match(/^\/api\/products\/(\d+)\/reviews$/);
      if (reviewMatch && method === 'POST') {
        const id = Number(reviewMatch[1]);
        const pIdx = db.products.findIndex(p => p.id === id);
        if (pIdx === -1) return sendJSON(res, 404, { error: "Mahsulot topilmadi" });

        const body = await parseJSONBody(req);
        const { rating, comment, userName } = body;
        if (!rating || !comment) {
          return sendJSON(res, 400, { error: "Baho (1-5) va sharh matnini kiriting!" });
        }

        const newReview = {
          id: Date.now(),
          userName: (userName || "Xaridor").trim(),
          rating: Math.max(1, Math.min(5, Number(rating))),
          date: new Date().toISOString().split('T')[0],
          comment: comment.trim()
        };

        if (!Array.isArray(db.products[pIdx].reviews)) {
          db.products[pIdx].reviews = [];
        }
        db.products[pIdx].reviews.unshift(newReview);

        // O'rtacha reytingni qayta hisoblash
        const totalRating = db.products[pIdx].reviews.reduce((sum, r) => sum + r.rating, 0);
        db.products[pIdx].reviewsCount = db.products[pIdx].reviews.length;
        db.products[pIdx].rating = Number((totalRating / db.products[pIdx].reviewsCount).toFixed(1));

        saveDB(db);
        return sendJSON(res, 201, {
          message: "Sharhingiz uchun rahmat! Sharh qabul qilindi.",
          product: db.products[pIdx]
        });
      }

      // Create Product (Admin)
      if (pathname === '/api/products' && method === 'POST') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin mahsulot qo'sha oladi!" });
        }

        const body = await parseJSONBody(req);
        if (!body.name || !body.price || !body.category) {
          return sendJSON(res, 400, { error: "Nom, narx va toifa kiritilishi shart!" });
        }

        const newId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
        const newProduct = {
          id: newId,
          name: body.name.trim(),
          category: body.category,
          categoryName: body.categoryName || body.category,
          price: Number(body.price),
          oldPrice: body.oldPrice ? Number(body.oldPrice) : Math.round(Number(body.price) * 1.1),
          monthlyPrice: Math.round(Number(body.price) / 12),
          discount: body.discount ? Number(body.discount) : 0,
          rating: 5.0,
          reviewsCount: 0,
          image: body.image || "assets/products/iphone-15-pro.svg",
          gallery: body.gallery && body.gallery.length > 0 ? body.gallery : [body.image || "assets/products/iphone-15-pro.svg"],
          badge: body.badge || "YANGI",
          inStock: body.inStock !== false,
          stockCount: body.stockCount ? Number(body.stockCount) : 10,
          isFeatured: !!body.isFeatured,
          isFlashSale: !!body.isFlashSale,
          description: body.description || "",
          features: body.features || {},
          storageOptions: body.storageOptions || [],
          colors: body.colors || ["#000000", "#ffffff"],
          reviews: []
        };

        db.products.unshift(newProduct);
        saveDB(db);

        return sendJSON(res, 201, { message: "Yangi mahsulot qo'shildi!", product: newProduct });
      }

      // Update Product (Admin)
      if (productMatch && method === 'PUT') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin mahsulotni tahrirlashi mumkin!" });
        }

        const id = Number(productMatch[1]);
        const pIdx = db.products.findIndex(p => p.id === id);
        if (pIdx === -1) return sendJSON(res, 404, { error: "Mahsulot topilmadi" });

        const body = await parseJSONBody(req);
        db.products[pIdx] = {
          ...db.products[pIdx],
          ...body,
          id // ID o'zgarmasligi kerak
        };

        if (body.price) {
          db.products[pIdx].price = Number(body.price);
          db.products[pIdx].monthlyPrice = Math.round(Number(body.price) / 12);
        }

        saveDB(db);
        return sendJSON(res, 200, { message: "Mahsulot muvaffaqiyatli yangilandi!", product: db.products[pIdx] });
      }

      // Delete Product (Admin)
      if (productMatch && method === 'DELETE') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin mahsulotni o'chira oladi!" });
        }

        const id = Number(productMatch[1]);
        const pIdx = db.products.findIndex(p => p.id === id);
        if (pIdx === -1) return sendJSON(res, 404, { error: "Mahsulot topilmadi" });

        const deleted = db.products.splice(pIdx, 1)[0];
        saveDB(db);
        return sendJSON(res, 200, { message: "Mahsulot o'chirildi!", product: deleted });
      }

      // ==========================================
      // BUYURTMALAR (Orders)
      // ==========================================
      // List Orders (User: own orders, Admin: all orders)
      if (pathname === '/api/orders' && method === 'GET') {
        const auth = getAuthUser(req);
        if (!auth) {
          return sendJSON(res, 401, { error: "Avtorizatsiyadan o'ting" });
        }

        if (auth.role === 'admin') {
          return sendJSON(res, 200, db.orders || []);
        }

        // Oddiy mijoz o'z buyurtmalarini ko'radi
        const myOrders = (db.orders || []).filter(o => o.userId === auth.id || o.customerPhone === auth.phone);
        return sendJSON(res, 200, myOrders);
      }

      // Create Order (Haqiqiy buyurtma berish)
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { items, customerName, customerPhone, customerCity, customerAddress, paymentMethod, appliedCoupon, notes } = body;

        if (!customerName || !customerPhone || !items || !items.length) {
          return sendJSON(res, 400, { error: "Ism, telefon raqami va tovarlar ro'yxati talab qilinadi!" });
        }

        const auth = getAuthUser(req);
        const userId = auth ? auth.id : null;

        // Subtotal hisoblash va zaxiradan kamaytirish
        let subtotal = 0;
        const processedItems = [];

        for (const item of items) {
          const product = db.products.find(p => p.id === item.productId || p.id === item.id);
          const price = item.price || (product ? product.price : 0);
          const qty = Math.max(1, Number(item.quantity) || 1);
          subtotal += price * qty;

          // Ombordagi tovar sonini kamaytirish
          if (product && typeof product.stockCount === 'number') {
            product.stockCount = Math.max(0, product.stockCount - qty);
            if (product.stockCount === 0) product.inStock = false;
          }

          processedItems.push({
            productId: product ? product.id : item.id,
            name: product ? product.name : (item.name || "Noma'lum tovar"),
            price: price,
            quantity: qty,
            image: product ? product.image : (item.image || "assets/products/iphone-15-pro.svg"),
            storage: item.storage || null,
            color: item.color || null
          });
        }

        // Chegirma
        let discountAmount = 0;
        let couponCode = null;
        if (appliedCoupon) {
          const couponObj = (db.coupons || []).find(c => c.code.toUpperCase() === String(appliedCoupon).toUpperCase() && c.active);
          if (couponObj) {
            discountAmount = Math.round((subtotal * couponObj.discount) / 100);
            couponCode = couponObj.code;
          }
        }

        const freeShippingThreshold = db.settings?.freeShippingThreshold || 1000000;
        const shippingFee = subtotal >= freeShippingThreshold ? 0 : (db.settings?.standardShippingFee || 35000);
        const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

        // Yangi buyurtma ID yaratish: #BZX-2026-XXXXXX
        const orderId = `BZX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const nowIso = new Date().toISOString();

        const newOrder = {
          id: orderId,
          userId: userId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerCity: customerCity || "Toshkent shahri",
          customerAddress: (customerAddress || "Aniqlanmoqda").trim(),
          paymentMethod: paymentMethod || "cash",
          paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid_or_pending',
          status: 'yangi', // yangi | yigilmoqda | yetkazilmoqda | yetkazildi | bekor
          statusHistory: [
            { status: 'yangi', title: 'Buyurtma qabul qilindi', timestamp: nowIso, note: "Operator tasdiqlashi kutilmoqda" }
          ],
          items: processedItems,
          subtotal,
          discountAmount,
          appliedCoupon: couponCode,
          shippingFee,
          totalAmount,
          notes: notes ? notes.trim() : "",
          createdAt: nowIso
        };

        if (!Array.isArray(db.orders)) db.orders = [];
        db.orders.unshift(newOrder);
        saveDB(db);

        return sendJSON(res, 201, {
          message: "Buyurtmangiz muvaffaqiyatli qabul qilindi!",
          order: newOrder
        });
      }

      // Public Order Tracking: /api/orders/track/:orderId
      const trackMatch = pathname.match(/^\/api\/orders\/track\/(.+)$/);
      if (trackMatch && method === 'GET') {
        const orderIdParam = decodeURIComponent(trackMatch[1]).trim().toUpperCase().replace('#', '');
        const order = db.orders.find(o => o.id.toUpperCase() === orderIdParam || o.id.toUpperCase() === `BZX-${orderIdParam}`);

        if (!order) {
          return sendJSON(res, 404, { error: `"#${orderIdParam}" raqamli buyurtma topilmadi. Raqamni tekshirib qayta kiriting.` });
        }

        // Barcha bosqichlar holatini belgilash
        const steps = [
          { status: 'yangi', label: "Qabul qilindi", desc: "Buyurtma tizimga kiritildi", icon: "fa-solid fa-file-invoice" },
          { status: 'yigilmoqda', label: "Omborda yig'ilmoqda", desc: "Tovar tekshirilib qadoqlanmoqda", icon: "fa-solid fa-box-open" },
          { status: 'yetkazilmoqda', label: "Kuryer yetkazmoqda", desc: "Kuryer ko'rsatilgan manzilga yo'l oldi", icon: "fa-solid fa-truck-fast" },
          { status: 'yetkazildi', label: "Yetkazib berildi", desc: "Buyurtma xaridorga topshirildi", icon: "fa-solid fa-circle-check" }
        ];

        const statusRanks = { 'yangi': 1, 'yigilmoqda': 2, 'yetkazilmoqda': 3, 'yetkazildi': 4, 'bekor': 0 };
        const currentRank = statusRanks[order.status] || 1;

        const timeline = steps.map((s, idx) => {
          const stepRank = idx + 1;
          const isDone = currentRank >= stepRank && order.status !== 'bekor';
          const isCurrent = currentRank === stepRank && order.status !== 'bekor';
          const historyEntry = (order.statusHistory || []).find(h => h.status === s.status);

          return {
            ...s,
            completed: isDone,
            current: isCurrent,
            timestamp: historyEntry ? historyEntry.timestamp : null
          };
        });

        return sendJSON(res, 200, {
          orderId: order.id,
          status: order.status,
          isCancelled: order.status === 'bekor',
          customerName: order.customerName,
          customerCity: order.customerCity,
          customerAddress: order.customerAddress,
          createdAt: order.createdAt,
          totalAmount: order.totalAmount,
          itemsCount: order.items.length,
          items: order.items,
          timeline
        });
      }

      // Change Order Status (Admin)
      const orderStatusMatch = pathname.match(/^\/api\/orders\/([^\/]+)\/status$/);
      if (orderStatusMatch && method === 'PATCH') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin buyurtma holatini o'zgartira oladi!" });
        }

        const orderId = decodeURIComponent(orderStatusMatch[1]);
        const oIdx = db.orders.findIndex(o => o.id === orderId);
        if (oIdx === -1) return sendJSON(res, 404, { error: "Buyurtma topilmadi" });

        const body = await parseJSONBody(req);
        const { status, note } = body;
        const validStatuses = ['yangi', 'yigilmoqda', 'yetkazilmoqda', 'yetkazildi', 'bekor'];
        if (!validStatuses.includes(status)) {
          return sendJSON(res, 400, { error: "Noto'g'ri holat kiritildi!" });
        }

        const titles = {
          'yangi': "Buyurtma qabul qilindi",
          'yigilmoqda': "Omborda qadoqlandi",
          'yetkazilmoqda': "Kuryer yo'lga chiqdi",
          'yetkazildi': "Mijozga yetkazib berildi",
          'bekor': "Buyurtma bekor qilindi"
        };

        db.orders[oIdx].status = status;
        if (!Array.isArray(db.orders[oIdx].statusHistory)) {
          db.orders[oIdx].statusHistory = [];
        }
        db.orders[oIdx].statusHistory.push({
          status: status,
          title: titles[status] || status,
          timestamp: new Date().toISOString(),
          note: note || ""
        });

        if (status === 'yetkazildi' && db.orders[oIdx].paymentMethod === 'cash') {
          db.orders[oIdx].paymentStatus = 'paid';
        }

        saveDB(db);
        return sendJSON(res, 200, {
          message: "Buyurtma holati yangilandi!",
          order: db.orders[oIdx]
        });
      }

      // ==========================================
      // KUPONLAR (Coupons)
      // ==========================================
      // Validate Coupon
      if (pathname === '/api/coupons/validate' && method === 'POST') {
        const body = await parseJSONBody(req);
        const code = String(body.code || '').trim().toUpperCase();

        const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === code && c.active);
        if (!coupon) {
          return sendJSON(res, 404, { valid: false, error: "Bunday promokod mavjud emas yoki muddati o'tgan!" });
        }

        return sendJSON(res, 200, {
          valid: true,
          code: coupon.code,
          discount: coupon.discount,
          description: coupon.description
        });
      }

      // List Coupons (Admin)
      if (pathname === '/api/coupons' && method === 'GET') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          // Oddiy foydalanuvchilar faqat ochiq kuponlarni ko'rishi mumkin
          return sendJSON(res, 200, (db.coupons || []).filter(c => c.active));
        }
        return sendJSON(res, 200, db.coupons || []);
      }

      // Add Coupon (Admin)
      if (pathname === '/api/coupons' && method === 'POST') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin yangi kupon qo'sha oladi!" });
        }

        const body = await parseJSONBody(req);
        const { code, discount, description } = body;
        if (!code || !discount) {
          return sendJSON(res, 400, { error: "Kupon kodi va chegirma foizini kiriting!" });
        }

        const upperCode = code.trim().toUpperCase();
        const existingIdx = (db.coupons || []).findIndex(c => c.code.toUpperCase() === upperCode);
        const newCoupon = {
          code: upperCode,
          discount: Math.max(1, Math.min(90, Number(discount))),
          description: description || `${discount}% chegirma kuponi`,
          active: true
        };

        if (existingIdx > -1) {
          db.coupons[existingIdx] = newCoupon;
        } else {
          db.coupons.push(newCoupon);
        }

        saveDB(db);
        return sendJSON(res, 201, { message: "Promokod muvaffaqiyatli saqlandi!", coupon: newCoupon });
      }

      // Delete Coupon (Admin)
      const couponDeleteMatch = pathname.match(/^\/api\/coupons\/(.+)$/);
      if (couponDeleteMatch && method === 'DELETE') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin kuponni o'chira oladi!" });
        }
        const code = decodeURIComponent(couponDeleteMatch[1]).toUpperCase();
        db.coupons = (db.coupons || []).filter(c => c.code.toUpperCase() !== code);
        saveDB(db);
        return sendJSON(res, 200, { message: "Kupon o'chirildi!" });
      }

      // ==========================================
      // ADMIN STATISTIKA (Dashboard Analytics)
      // ==========================================
      if (pathname === '/api/admin/stats' && method === 'GET') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin statistikani ko'ra oladi!" });
        }

        const orders = db.orders || [];
        const products = db.products || [];
        const users = db.users || [];

        const totalRevenue = orders
          .filter(o => o.status !== 'bekor')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const totalOrders = orders.length;
        const totalCustomers = users.filter(u => u.role === 'user').length;
        const lowStockCount = products.filter(p => (p.stockCount || 0) <= 5).length;

        // Oxirgi 5 ta buyurtma
        const recentOrders = orders.slice(0, 5);

        // Kategoriya bo'yicha tushum
        const categoryStats = {};
        orders.filter(o => o.status !== 'bekor').forEach(order => {
          (order.items || []).forEach(item => {
            const prod = products.find(p => p.id === item.productId);
            const catName = prod ? prod.categoryName : "Boshqa";
            categoryStats[catName] = (categoryStats[catName] || 0) + (item.price * item.quantity);
          });
        });

        return sendJSON(res, 200, {
          totalRevenue,
          totalOrders,
          totalCustomers,
          lowStockCount,
          recentOrders,
          categoryStats
        });
      }

      // List Users (Admin)
      if (pathname === '/api/admin/users' && method === 'GET') {
        const auth = getAuthUser(req);
        if (!auth || auth.role !== 'admin') {
          return sendJSON(res, 403, { error: "Faqat admin foydalanuvchilar ro'yxatini ko'ra oladi!" });
        }

        const safeUsers = (db.users || []).map(u => {
          const userOrders = (db.orders || []).filter(o => o.userId === u.id);
          const totalSpent = userOrders.filter(o => o.status !== 'bekor').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            city: u.city,
            address: u.address,
            ordersCount: userOrders.length,
            totalSpent,
            registeredAt: u.registeredAt
          };
        });

        return sendJSON(res, 200, safeUsers);
      }

      // ==========================================
      // TO'LOV INTEGRATSIYALARI (Payme & Click)
      // ==========================================
      // Payme Checkout Link Generator
      if (pathname === '/api/payments/payme/create' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { orderId, amount } = body;
        if (!orderId || !amount) {
          return sendJSON(res, 400, { error: "Order ID va to'lov summasi talab qilinadi!" });
        }

        const merchantId = db.settings?.payme?.merchantId || "654321abcdef0987654321";
        const amountTiyn = Math.round(Number(amount) * 100); // Payme tiyinda hisoblaydi

        // Rasmiy Payme redirect parametri: m={merchantId};ac.order_id={orderId};a={amountTiyn}
        const rawParams = `m=${merchantId};ac.order_id=${orderId};a=${amountTiyn}`;
        const base64Params = Buffer.from(rawParams).toString('base64');
        const paymeUrl = `https://checkout.paycom.uz/${base64Params}`;

        return sendJSON(res, 200, {
          provider: "payme",
          orderId,
          amount,
          amountTiyn,
          merchantId,
          paymeUrl,
          testMode: true,
          instructions: "Haqiqiy to'lov uchun Merchant ID ni server/data/db.json sozlamalariga kiriting. Test rejimida to'lov muvaffaqiyatli o'tadi."
        });
      }

      // Click Checkout Link Generator
      if (pathname === '/api/payments/click/create' && method === 'POST') {
        const body = await parseJSONBody(req);
        const { orderId, amount } = body;
        if (!orderId || !amount) {
          return sendJSON(res, 400, { error: "Order ID va to'lov summasi talab qilinadi!" });
        }

        const serviceId = db.settings?.click?.serviceId || "24810";
        const merchantId = db.settings?.click?.merchantId || "19320";

        // Rasmiy Click redirect formati:
        // https://my.click.uz/services/pay?service_id={serviceId}&merchant_id={merchantId}&amount={amount}&transaction_param={orderId}
        const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${orderId}`;

        return sendJSON(res, 200, {
          provider: "click",
          orderId,
          amount,
          serviceId,
          merchantId,
          clickUrl,
          testMode: true,
          instructions: "Haqiqiy Click to'lovi uchun Service ID va Merchant ID ni server/data/db.json sozlamalariga kiriting."
        });
      }

      // Agar birorta ham API route mos kelmasa
      return sendJSON(res, 404, { error: "API yo'li topilmadi: " + pathname });

    } catch (apiErr) {
      console.error("Server API xatosi:", apiErr);
      return sendJSON(res, 500, { error: "Ichki server xatoligi: " + apiErr.message });
    }
  }

  // Statik fayllarni uzatish
  serveStatic(req, res, pathname);
});

// Serverni ishga tushirish
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`⚡ Bozorix E-Commerce Serveri Muvaffaqiyatli Ishga Tushdi!`);
    console.log(`🌐 Manzil: http://localhost:${PORT}`);
    console.log(`📁 Statik fayllar: ${ROOT_DIR}`);
    console.log(`💾 Baza fayli: ${DB_PATH}`);
    console.log(`🔑 Admin kirish: admin@bozorix.uz / parol: admin123`);
    console.log(`👤 Mijoz kirish: xaridor@bozorix.uz / parol: xaridor123`);
    console.log(`===============================================`);
  });
}

module.exports = server;

