/**
 * Bozorix — Asosiy Ilova Skripti (app.js v2.0)
 * To'liq ishlaydigan elektron savdo platformasi:
 * REST API & Baza sinxronizatsiyasi, Auth & Shaxsiy Kabinet,
 * Admin Panel, Haqiqiy Buyurtma & To'lov, Jonli Kuzatish, Sharhlar.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Xavfsiz LocalStorage Yordamchisi
  // ==========================================
  function safeGetStorage(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.warn("Storage parse error:", key, e);
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write error:", key, e);
    }
  }

  // ==========================================
  // 2. API & Baza Klienti (Backend + Local Hybrid)
  // ==========================================
  const isHttp = window.location.protocol === 'http:' || window.location.protocol === 'https:';
  const API_BASE = isHttp ? '/api' : null;

  const api = {
    async request(endpoint, options = {}) {
      if (!API_BASE) {
        throw new Error("Local fallback rejimi");
      }
      const token = safeGetStorage('bozorix_token', null);
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Server xatosi: ${res.status}`);
      }
      return data;
    },

    // Mahsulotlar
    async getProducts(params = {}) {
      if (API_BASE) {
        const query = new URLSearchParams(params).toString();
        return await this.request(`/products${query ? '?' + query : ''}`);
      }
      return localStore.getProducts(params);
    },

    async addReview(productId, reviewData) {
      if (API_BASE) {
        return await this.request(`/products/${productId}/reviews`, {
          method: 'POST',
          body: JSON.stringify(reviewData)
        });
      }
      return localStore.addReview(productId, reviewData);
    },

    async saveProduct(productData) {
      if (API_BASE) {
        if (productData.id) {
          return await this.request(`/products/${productData.id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
          });
        }
        return await this.request('/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
      }
      return localStore.saveProduct(productData);
    },

    async deleteProduct(productId) {
      if (API_BASE) {
        return await this.request(`/products/${productId}`, { method: 'DELETE' });
      }
      return localStore.deleteProduct(productId);
    },

    // Auth
    async login(login, password) {
      if (API_BASE) {
        return await this.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ login, password })
        });
      }
      return localStore.login(login, password);
    },

    async register(userData) {
      if (API_BASE) {
        return await this.request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
      }
      return localStore.register(userData);
    },

    async getMe() {
      if (API_BASE) {
        return await this.request('/auth/me');
      }
      return localStore.getMe();
    },

    async updateProfile(profileData) {
      if (API_BASE) {
        return await this.request('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(profileData)
        });
      }
      return localStore.updateProfile(profileData);
    },

    // Buyurtmalar
    async createOrder(orderData) {
      if (API_BASE) {
        return await this.request('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });
      }
      return localStore.createOrder(orderData);
    },

    async trackOrder(orderId) {
      if (API_BASE) {
        return await this.request(`/orders/track/${encodeURIComponent(orderId)}`);
      }
      return localStore.trackOrder(orderId);
    },

    async getOrders() {
      if (API_BASE) {
        return await this.request('/orders');
      }
      return localStore.getOrders();
    },

    async updateOrderStatus(orderId, status, note) {
      if (API_BASE) {
        return await this.request(`/orders/${encodeURIComponent(orderId)}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status, note })
        });
      }
      return localStore.updateOrderStatus(orderId, status, note);
    },

    // Promokodlar
    async validateCoupon(code) {
      if (API_BASE) {
        return await this.request('/coupons/validate', {
          method: 'POST',
          body: JSON.stringify({ code })
        });
      }
      return localStore.validateCoupon(code);
    },

    async getCoupons() {
      if (API_BASE) {
        return await this.request('/coupons');
      }
      return localStore.getCoupons();
    },

    async saveCoupon(couponData) {
      if (API_BASE) {
        return await this.request('/coupons', {
          method: 'POST',
          body: JSON.stringify(couponData)
        });
      }
      return localStore.saveCoupon(couponData);
    },

    async deleteCoupon(code) {
      if (API_BASE) {
        return await this.request(`/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' });
      }
      return localStore.deleteCoupon(code);
    },

    // Admin Statistika & Foydalanuvchilar
    async getAdminStats() {
      if (API_BASE) {
        return await this.request('/admin/stats');
      }
      return localStore.getAdminStats();
    },

    async getAdminUsers() {
      if (API_BASE) {
        return await this.request('/admin/users');
      }
      return localStore.getAdminUsers();
    },

    // To'lov havolalari
    async createPaymeLink(orderId, amount) {
      if (API_BASE) {
        return await this.request('/payments/payme/create', {
          method: 'POST',
          body: JSON.stringify({ orderId, amount })
        });
      }
      return {
        provider: "payme",
        orderId,
        amount,
        paymeUrl: `https://checkout.paycom.uz/${btoa(`m=654321abcdef0987654321;ac.order_id=${orderId};a=${Math.round(amount * 100)}`)}`,
        testMode: true
      };
    },

    async createClickLink(orderId, amount) {
      if (API_BASE) {
        return await this.request('/payments/click/create', {
          method: 'POST',
          body: JSON.stringify({ orderId, amount })
        });
      }
      return {
        provider: "click",
        orderId,
        amount,
        clickUrl: `https://my.click.uz/services/pay?service_id=24810&merchant_id=19320&amount=${amount}&transaction_param=${orderId}`,
        testMode: true
      };
    }
  };

  // ==========================================
  // 3. LocalStore Fallback (Oflayn yoki file:/// uchun)
  // ==========================================
  const localStore = {
    init() {
      if (!localStorage.getItem('bozorix_local_db_init')) {
        safeSetStorage('bozorix_products', productsData);
        safeSetStorage('bozorix_users', [
          {
            id: "usr_admin_1",
            name: "Bozorix Boshqaruvchi",
            email: "admin@bozorix.uz",
            phone: "+998901234567",
            role: "admin",
            password: "admin123",
            city: "Toshkent shahri",
            address: "Navoiy ko'chasi 14"
          },
          {
            id: "usr_client_1",
            name: "Alisher Navoiy",
            email: "xaridor@bozorix.uz",
            phone: "+998977654321",
            role: "user",
            password: "xaridor123",
            city: "Toshkent shahri",
            address: "Yunusobod 4-mavze, 18-uy"
          }
        ]);
        safeSetStorage('bozorix_orders', [
          {
            id: "BZX-2026-104921",
            userId: "usr_client_1",
            customerName: "Alisher Navoiy",
            customerPhone: "+998 97 765 43 21",
            customerCity: "Toshkent shahri",
            customerAddress: "Yunusobod 4-mavze, 18-uy",
            paymentMethod: "payme",
            paymentStatus: "paid",
            status: "yetkazildi",
            statusHistory: [
              { status: "yangi", title: "Buyurtma qabul qilindi", timestamp: "2026-10-25T10:15:00Z" },
              { status: "yigilmoqda", title: "Omborda qadoqlandi", timestamp: "2026-10-25T11:00:00Z" },
              { status: "yetkazilmoqda", title: "Kuryerga topshirildi", timestamp: "2026-10-25T12:30:00Z" },
              { status: "yetkazildi", title: "Mijozga yetkazib berildi", timestamp: "2026-10-25T14:00:00Z" }
            ],
            items: [
              { productId: 8, name: "Apple AirPods Pro 2 (USB-C)", price: 3100000, quantity: 1, image: "assets/products/airpods-pro-2.svg" }
            ],
            subtotal: 3100000,
            discountAmount: 620000,
            appliedCoupon: "BOZORIX20",
            shippingFee: 0,
            totalAmount: 2480000,
            createdAt: "2026-10-25T10:15:00Z"
          }
        ]);
        safeSetStorage('bozorix_coupons', [
          { code: "BOZORIX20", discount: 20, description: "Bozorix maxsus chegirmasi (-20%)", active: true },
          { code: "USTOZ20", discount: 20, description: "Ustoz uchun maxsus chegirma (-20%)", active: true },
          { code: "YANGI10", discount: 10, description: "Yangi mijozlar uchun chegirma (-10%)", active: true },
          { code: "BAHOR15", discount: 15, description: "Mavsumiy chegirma (-15%)", active: true }
        ]);
        localStorage.setItem('bozorix_local_db_init', 'true');
      }
    },

    getProducts(params = {}) {
      let prods = safeGetStorage('bozorix_products', productsData);
      if (params.category && params.category !== 'all') {
        prods = prods.filter(p => p.category === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        prods = prods.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
      }
      return prods;
    },

    addReview(productId, reviewData) {
      const prods = safeGetStorage('bozorix_products', productsData);
      const pIdx = prods.findIndex(p => p.id === productId);
      if (pIdx > -1) {
        if (!Array.isArray(prods[pIdx].reviews)) prods[pIdx].reviews = [];
        prods[pIdx].reviews.unshift({
          id: Date.now(),
          userName: reviewData.userName || "Xaridor",
          rating: Number(reviewData.rating) || 5,
          date: new Date().toISOString().split('T')[0],
          comment: reviewData.comment
        });
        const totalRating = prods[pIdx].reviews.reduce((sum, r) => sum + r.rating, 0);
        prods[pIdx].reviewsCount = prods[pIdx].reviews.length;
        prods[pIdx].rating = Number((totalRating / prods[pIdx].reviewsCount).toFixed(1));
        safeSetStorage('bozorix_products', prods);
        return { message: "Sharh saqlandi", product: prods[pIdx] };
      }
      throw new Error("Mahsulot topilmadi");
    },

    saveProduct(productData) {
      const prods = safeGetStorage('bozorix_products', productsData);
      if (productData.id) {
        const idx = prods.findIndex(p => p.id === productData.id);
        if (idx > -1) {
          prods[idx] = { ...prods[idx], ...productData };
          safeSetStorage('bozorix_products', prods);
          return { message: "Yangilandi", product: prods[idx] };
        }
      }
      const newId = prods.length > 0 ? Math.max(...prods.map(p => p.id)) + 1 : 1;
      const newProd = {
        ...productData,
        id: newId,
        rating: 5.0,
        reviewsCount: 0,
        reviews: []
      };
      prods.unshift(newProd);
      safeSetStorage('bozorix_products', prods);
      return { message: "Qo'shildi", product: newProd };
    },

    deleteProduct(id) {
      let prods = safeGetStorage('bozorix_products', productsData);
      prods = prods.filter(p => p.id !== id);
      safeSetStorage('bozorix_products', prods);
      return { message: "O'chirildi" };
    },

    login(login, password) {
      const users = safeGetStorage('bozorix_users', []);
      const user = users.find(u => 
        (u.email.toLowerCase() === login.toLowerCase().trim() || u.phone.replace(/\s+/g,'') === login.replace(/\s+/g,'')) &&
        (u.password === password || u.passwordHash)
      );
      if (!user) throw new Error("Foydalanuvchi topilmadi yoki parol noto'g'ri!");
      const token = "mock_jwt_token_" + user.id;
      return { message: "Xush kelibsiz!", token, user };
    },

    register(userData) {
      const users = safeGetStorage('bozorix_users', []);
      const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase().trim());
      if (existing) throw new Error("Bu email ro'yxatdan o'tgan!");
      const newUser = {
        id: "usr_" + Date.now(),
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone,
        role: "user",
        password: userData.password,
        city: userData.city || "Toshkent shahri",
        address: userData.address || ""
      };
      users.push(newUser);
      safeSetStorage('bozorix_users', users);
      const token = "mock_jwt_token_" + newUser.id;
      return { message: "Ro'yxatdan o'tdingiz!", token, user: newUser };
    },

    getMe() {
      const currentUser = safeGetStorage('bozorix_user', null);
      if (!currentUser) throw new Error("Tizimga kirmagansiz");
      const orders = safeGetStorage('bozorix_orders', []).filter(o => o.userId === currentUser.id || o.customerPhone === currentUser.phone);
      return { user: currentUser, orders };
    },

    updateProfile(data) {
      const users = safeGetStorage('bozorix_users', []);
      const currentUser = safeGetStorage('bozorix_user', null);
      if (!currentUser) throw new Error("Tizimga kirmagansiz");
      const idx = users.findIndex(u => u.id === currentUser.id);
      if (idx > -1) {
        users[idx] = { ...users[idx], ...data };
        safeSetStorage('bozorix_users', users);
        safeSetStorage('bozorix_user', users[idx]);
        return { message: "Yangilandi", user: users[idx] };
      }
      throw new Error("Topilmadi");
    },

    createOrder(orderData) {
      const orders = safeGetStorage('bozorix_orders', []);
      const orderId = `BZX-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const nowIso = new Date().toISOString();

      const newOrder = {
        id: orderId,
        userId: orderData.userId || null,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerCity: orderData.customerCity,
        customerAddress: orderData.customerAddress,
        paymentMethod: orderData.paymentMethod || "cash",
        paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'paid',
        status: 'yangi',
        statusHistory: [
          { status: 'yangi', title: 'Buyurtma qabul qilindi', timestamp: nowIso }
        ],
        items: orderData.items,
        subtotal: orderData.subtotal,
        discountAmount: orderData.discountAmount || 0,
        appliedCoupon: orderData.appliedCoupon || null,
        shippingFee: orderData.shippingFee || 0,
        totalAmount: orderData.totalAmount,
        notes: orderData.notes || "",
        createdAt: nowIso
      };

      orders.unshift(newOrder);
      safeSetStorage('bozorix_orders', orders);
      return { message: "Buyurtma qabul qilindi!", order: newOrder };
    },

    trackOrder(orderId) {
      const orders = safeGetStorage('bozorix_orders', []);
      const cleanId = orderId.toUpperCase().replace('#', '').trim();
      const order = orders.find(o => o.id.toUpperCase() === cleanId || o.id.toUpperCase() === `BZX-${cleanId}`);
      if (!order) throw new Error(`"#${orderId}" buyurtma topilmadi`);

      const steps = [
        { status: 'yangi', label: "Qabul qilindi", desc: "Buyurtma tizimga kiritildi", icon: "fa-solid fa-file-invoice" },
        { status: 'yigilmoqda', label: "Omborda yig'ilmoqda", desc: "Tovar tekshirilib qadoqlanmoqda", icon: "fa-solid fa-box-open" },
        { status: 'yetkazilmoqda', label: "Kuryer yetkazmoqda", desc: "Kuryer manzilga yo'l oldi", icon: "fa-solid fa-truck-fast" },
        { status: 'yetkazildi', label: "Yetkazib berildi", desc: "Buyurtma topshirildi", icon: "fa-solid fa-circle-check" }
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

      return {
        orderId: order.id,
        status: order.status,
        customerName: order.customerName,
        customerCity: order.customerCity,
        customerAddress: order.customerAddress,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        items: order.items,
        timeline
      };
    },

    getOrders() {
      return safeGetStorage('bozorix_orders', []);
    },

    updateOrderStatus(orderId, status, note) {
      const orders = safeGetStorage('bozorix_orders', []);
      const idx = orders.findIndex(o => o.id === orderId);
      if (idx > -1) {
        orders[idx].status = status;
        if (!Array.isArray(orders[idx].statusHistory)) orders[idx].statusHistory = [];
        orders[idx].statusHistory.push({
          status,
          title: status === 'yetkazildi' ? 'Yetkazildi' : status,
          timestamp: new Date().toISOString(),
          note: note || ""
        });
        safeSetStorage('bozorix_orders', orders);
        return { message: "Holat yangilandi", order: orders[idx] };
      }
      throw new Error("Buyurtma topilmadi");
    },

    validateCoupon(code) {
      const coupons = safeGetStorage('bozorix_coupons', []);
      const c = coupons.find(item => item.code.toUpperCase() === code.toUpperCase() && item.active);
      if (!c) throw new Error("Promokod noto'g'ri yoki muddati o'tgan!");
      return { valid: true, code: c.code, discount: c.discount, description: c.description };
    },

    getCoupons() {
      return safeGetStorage('bozorix_coupons', []);
    },

    saveCoupon(coupon) {
      const coupons = safeGetStorage('bozorix_coupons', []);
      const upper = coupon.code.toUpperCase();
      const idx = coupons.findIndex(c => c.code.toUpperCase() === upper);
      const newC = { code: upper, discount: Number(coupon.discount), description: coupon.description || "", active: true };
      if (idx > -1) coupons[idx] = newC;
      else coupons.push(newC);
      safeSetStorage('bozorix_coupons', coupons);
      return { message: "Kupon saqlandi", coupon: newC };
    },

    deleteCoupon(code) {
      let coupons = safeGetStorage('bozorix_coupons', []);
      coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
      safeSetStorage('bozorix_coupons', coupons);
      return { message: "O'chirildi" };
    },

    getAdminStats() {
      const orders = safeGetStorage('bozorix_orders', []);
      const prods = safeGetStorage('bozorix_products', productsData);
      const users = safeGetStorage('bozorix_users', []);
      const totalRevenue = orders.filter(o => o.status !== 'bekor').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      return {
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: users.filter(u => u.role === 'user').length,
        lowStockCount: prods.filter(p => (p.stockCount || 0) <= 5).length,
        recentOrders: orders.slice(0, 5)
      };
    },

    getAdminUsers() {
      const users = safeGetStorage('bozorix_users', []);
      const orders = safeGetStorage('bozorix_orders', []);
      return users.map(u => ({
        ...u,
        ordersCount: orders.filter(o => o.userId === u.id).length,
        totalSpent: orders.filter(o => o.userId === u.id && o.status !== 'bekor').reduce((s, o) => s + o.totalAmount, 0)
      }));
    }
  };

  localStore.init();

  // ==========================================
  // 4. Dastur Holati (State)
  // ==========================================
  const state = {
    products: [...productsData],
    categories: [...categoriesData],
    cart: safeGetStorage('bozorix_cart', []),
    wishlist: safeGetStorage('bozorix_wishlist', []),
    currentUser: safeGetStorage('bozorix_user', null),
    token: safeGetStorage('bozorix_token', null),
    activeCategory: 'all',
    searchQuery: '',
    maxPrice: 30000000,
    selectedBadges: [],
    sortBy: 'popular',
    viewMode: 'grid',
    activeSlide: 0,
    slideInterval: null,
    appliedCoupon: safeGetStorage('bozorix_coupon', null),
    fastBuyProduct: null,
    selectedStorageIndex: 0,
    selectedColorIndex: 0,
    lang: safeGetStorage('bozorix_lang', 'uz'),
    a11y: safeGetStorage('bozorix_a11y', {
      speechEnabled: false,
      speechRate: 1.0,
      fontSize: 'md',
      contrast: 'default',
      readableFont: false,
      bigCursor: false,
      highlightLinks: false,
      reduceMotion: false
    })
  };
  window.currentLang = state.lang;

  // ==========================================
  // 5. DOM Elementlari
  // ==========================================
  const productsGrid = document.getElementById('productsGrid');
  const productsCountEl = document.getElementById('productsCount');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const sortSelect = document.getElementById('sortSelect');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const categoryFilterList = document.getElementById('categoryFilterList');
  const priceSlider = document.getElementById('priceSlider');
  const priceInputMax = document.getElementById('priceInputMax');
  const priceInputMin = document.getElementById('priceInputMin');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');

  // Badjlar va Hisoblagichlar
  const cartBadge = document.getElementById('cartBadge');
  const cartBadgeMobile = document.getElementById('cartBadgeMobile');
  const cartHeaderTotal = document.getElementById('cartHeaderTotal');
  const wishBadge = document.getElementById('wishBadge');
  const wishBadgeMobile = document.getElementById('wishBadgeMobile');

  // Modallar va Drawerlar
  const modalBackdrop = document.getElementById('modalBackdrop');
  const cartDrawer = document.getElementById('cartDrawer');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const quickViewModal = document.getElementById('quickViewModal');
  const checkoutModal = document.getElementById('checkoutModal');
  const fastBuyModal = document.getElementById('fastBuyModal');
  const successModal = document.getElementById('successModal');
  const authModal = document.getElementById('authModal');
  const userCabinetModal = document.getElementById('userCabinetModal');
  const adminModal = document.getElementById('adminModal');
  const orderTrackingModal = document.getElementById('orderTrackingModal');
  const deliveryModal = document.getElementById('deliveryModal');
  const a11yModal = document.getElementById('a11yModal');

  // Maxsus Imkoniyatlar & Til Elementlari
  const openA11yBtn = document.getElementById('openA11yBtn');
  const floatingA11yBtn = document.getElementById('floatingA11yBtn');
  const quickVoiceBtn = document.getElementById('quickVoiceBtn');
  const quickVoiceText = document.getElementById('quickVoiceText');
  const langSelect = document.getElementById('langSelect');
  const a11yAnnouncer = document.getElementById('a11yAnnouncer');
  const a11yVoiceToggle = document.getElementById('a11yVoiceToggle');
  const a11yVoiceLabel = document.getElementById('a11yVoiceLabel');
  const a11yReadPageBtn = document.getElementById('a11yReadPageBtn');
  const a11yStopVoiceBtn = document.getElementById('a11yStopVoiceBtn');
  const a11yReadableFontToggle = document.getElementById('a11yReadableFontToggle');
  const a11yHighlightLinksToggle = document.getElementById('a11yHighlightLinksToggle');
  const a11yBigCursorToggle = document.getElementById('a11yBigCursorToggle');
  const a11yReduceMotionToggle = document.getElementById('a11yReduceMotionToggle');
  const a11yResetBtn = document.getElementById('a11yResetBtn');

  // Auth & Admin Tugmalari
  const openAuthBtn = document.getElementById('openAuthBtn');
  const openAuthMobile = document.getElementById('openAuthMobile');
  const authBtnText = document.getElementById('authBtnText');
  const authBtnIcon = document.getElementById('authBtnIcon');
  const adminPanelBtn = document.getElementById('adminPanelBtn');
  const openTrackOrderBtn = document.getElementById('openTrackOrderBtn');
  const openDeliveryInfoBtn = document.getElementById('openDeliveryInfoBtn');

  // Savatcha elementlari
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartItemsCountEl = document.getElementById('cartItemsCount');
  const freeShippingText = document.getElementById('freeShippingText');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const couponInput = document.getElementById('couponInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponAppliedBox = document.getElementById('couponAppliedBox');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // ==========================================
  // Ovozli O'qish (TTS / Screen Reader) Yordamchisi
  // ==========================================
  let voiceHoverTimer = null;

  function speak(text, interrupt = true) {
    if (!state.a11y || !state.a11y.speechEnabled) return;
    if (!('speechSynthesis' in window)) return;
    if (interrupt) {
      window.speechSynthesis.cancel();
      document.querySelectorAll('.a11y-speaking').forEach(el => el.classList.remove('a11y-speaking'));
    }
    if (!text) return;
    const cleanText = String(text).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = state.a11y.speechRate || 1.0;
    utterance.pitch = 1.0;

    const lang = state.lang || 'uz';
    const voices = window.speechSynthesis.getVoices() || [];
    if (lang === 'ru') {
      utterance.lang = 'ru-RU';
      const ruVoice = voices.find(v => v.lang.startsWith('ru'));
      if (ruVoice) utterance.voice = ruVoice;
    } else if (lang === 'en') {
      utterance.lang = 'en-US';
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    } else {
      const uzVoice = voices.find(v => v.lang.startsWith('uz'));
      const trVoice = voices.find(v => v.lang.startsWith('tr'));
      if (uzVoice) {
        utterance.lang = 'uz-UZ';
        utterance.voice = uzVoice;
      } else if (trVoice) {
        utterance.lang = 'tr-TR';
        utterance.voice = trVoice;
      } else {
        utterance.lang = 'ru-RU';
      }
    }

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.a11y-speaking').forEach(el => el.classList.remove('a11y-speaking'));
  }

  function announceA11y(text) {
    if (a11yAnnouncer) {
      a11yAnnouncer.textContent = text;
    }
    if (state.a11y && state.a11y.speechEnabled) {
      speak(text, true);
    }
  }

  function toggleVoiceReader(forceState = null) {
    state.a11y.speechEnabled = forceState !== null ? forceState : !state.a11y.speechEnabled;
    safeSetStorage('bozorix_a11y', state.a11y);
    updateVoiceButtonUI();
    if (state.a11y.speechEnabled) {
      showToast(t('toast_voice_enabled', state.lang), 'success');
      const msg = state.lang === 'uz'
        ? "Ovozli o'qish yoqildi. Element ustiga sichqoncha borganda yoki Tab orqali o'tganda ovozli o'qiladi."
        : state.lang === 'ru'
        ? "Голосовое чтение включено. Элементы озвучиваются при наведении или навигации клавишей Tab."
        : "Screen reader voice enabled. Elements will be read aloud on focus or hover.";
      speak(msg, true);
    } else {
      stopSpeaking();
      showToast(t('toast_voice_disabled', state.lang), 'info');
    }
  }

  function updateVoiceButtonUI() {
    const isVoice = !!(state.a11y && state.a11y.speechEnabled);
    if (quickVoiceBtn) {
      quickVoiceBtn.classList.toggle('voice-active', isVoice);
    }
    if (quickVoiceText) {
      quickVoiceText.textContent = isVoice ? t('voice_on', state.lang) : t('voice_reader', state.lang);
    }
    if (floatingA11yBtn) {
      floatingA11yBtn.classList.toggle('voice-active', isVoice);
    }
    if (a11yVoiceToggle) {
      a11yVoiceToggle.classList.toggle('active', isVoice);
    }
    if (a11yVoiceLabel) {
      a11yVoiceLabel.textContent = isVoice ? t('voice_on', state.lang) : t('a11y_voice_toggle', state.lang);
    }
  }

  function readPageSummary() {
    stopSpeaking();
    const count = state.products ? state.products.length : 20;
    const catName = getLocalizedCategoryName(state.activeCategory, state.lang);
    let msg = "";
    if (state.lang === 'uz') {
      msg = `Bozorix elektron savdo do'koni. Joriy toifa: ${catName}. Ko'rsatilayotgan tovarlar soni: ${count} ta. Navigatsiya qilish uchun Tab tugmasidan foydalaning. Maxsus imkoniyatlar paneli uchun Alt va A tugmalarini bosing.`;
    } else if (state.lang === 'ru') {
      msg = `Интернет-магазин Bozorix. Текущая категория: ${catName}. Всего товаров: ${count}. Для навигации нажимайте клавишу Tab. Меню доступности: Alt и A.`;
    } else {
      msg = `Bozorix e-commerce platform. Current category: ${catName}. Total products shown: ${count}. Use Tab key to navigate items. Press Alt and A for accessibility settings.`;
    }
    speak(msg, true);
  }

  // ==========================================
  // Maxsus Imkoniyatlar (A11y) Boshqaruvi
  // ==========================================
  function applyA11ySettings() {
    const a11y = state.a11y || {};
    // 1. Shrift o'lchami
    document.documentElement.classList.remove('font-size-md', 'font-size-lg', 'font-size-xl', 'font-size-2xl');
    document.documentElement.classList.add(`font-size-${a11y.fontSize || 'md'}`);
    document.querySelectorAll('.a11y-opt-btn[data-font]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-font') === a11y.fontSize);
    });

    // 2. Kontrast
    document.body.classList.toggle('a11y-high-contrast', a11y.contrast === 'high');
    document.body.classList.toggle('a11y-grayscale', a11y.contrast === 'grayscale');
    document.body.classList.toggle('a11y-invert', a11y.contrast === 'invert');
    document.querySelectorAll('.a11y-opt-btn[data-contrast]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-contrast') === a11y.contrast);
    });

    // 3. Readable font
    document.body.classList.toggle('a11y-readable-font', !!a11y.readableFont);
    if (a11yReadableFontToggle) a11yReadableFontToggle.classList.toggle('active', !!a11y.readableFont);

    // 4. Highlight links
    document.body.classList.toggle('a11y-highlight-links', !!a11y.highlightLinks);
    if (a11yHighlightLinksToggle) a11yHighlightLinksToggle.classList.toggle('active', !!a11y.highlightLinks);

    // 5. Big cursor
    document.body.classList.toggle('a11y-big-cursor', !!a11y.bigCursor);
    if (a11yBigCursorToggle) a11yBigCursorToggle.classList.toggle('active', !!a11y.bigCursor);

    // 6. Reduce motion
    document.body.classList.toggle('a11y-reduce-motion', !!a11y.reduceMotion);
    if (a11yReduceMotionToggle) a11yReduceMotionToggle.classList.toggle('active', !!a11y.reduceMotion);

    updateVoiceButtonUI();
    safeSetStorage('bozorix_a11y', a11y);
  }

  function resetA11ySettings() {
    state.a11y = {
      speechEnabled: false,
      speechRate: 1.0,
      fontSize: 'md',
      contrast: 'default',
      readableFont: false,
      bigCursor: false,
      highlightLinks: false,
      reduceMotion: false
    };
    stopSpeaking();
    applyA11ySettings();
    showToast(t('toast_a11y_reset', state.lang), 'info');
    announceA11y(state.lang === 'uz' ? "Maxsus imkoniyatlar dastlabki holatga qaytarildi" : state.lang === 'ru' ? "Настройки доступности сброшены" : "Accessibility settings reset to default");
  }

  // ==========================================
  // Ko'p Tillilik (i18n) Boshqaruvi (UZ / RU / EN)
  // ==========================================
  function setLanguage(lang) {
    if (!['uz', 'ru', 'en'].includes(lang)) lang = 'uz';
    state.lang = lang;
    window.currentLang = lang;
    safeSetStorage('bozorix_lang', lang);
    document.documentElement.lang = lang;

    if (langSelect) langSelect.value = lang;

    // data-i18n elementlarini yangilash
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = t(key, lang);
      if (text) el.innerHTML = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key, lang);
      if (text) el.placeholder = text;
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const text = t(key, lang);
      if (text) el.title = text;
    });

    // Qayta render qilish
    renderCategories();
    renderCatalog();
    renderCartDrawer();
    renderWishlistDrawer();
    updateAuthUI();
    updateVoiceButtonUI();

    const changeMsg = lang === 'uz' 
      ? "Sayt tili o'zbekchaga o'zgartirildi" 
      : lang === 'ru' 
      ? "Язык сайта изменен на русский" 
      : "Site language set to English";
    showToast(changeMsg, 'info');
    announceA11y(changeMsg);
  }

  // ==========================================
  // 6. Xabarnoma (Toast) Tizimi
  // ==========================================
  function showToast(message, type = 'info', actionText = null, actionCallback = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const icons = {
      success: 'fa-solid fa-circle-check',
      warning: 'fa-solid fa-triangle-exclamation',
      error: 'fa-solid fa-circle-xmark',
      info: 'fa-solid fa-circle-info'
    };

    let actionBtnHtml = '';
    if (actionText) {
      actionBtnHtml = `<button class="toast-action-btn" style="background: rgba(255,255,255,0.25); border: none; color: inherit; padding: 2px 8px; border-radius: 4px; font-weight: 800; cursor: pointer; margin-left: 8px;">${actionText}</button>`;
    }

    toast.innerHTML = `
      <i class="${icons[type] || icons.info}"></i>
      <span style="flex: 1;">${message}</span>
      ${actionBtnHtml}
      <button class="toast-close" style="background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; margin-left: 6px;" aria-label="Yopish">&times;</button>
    `;

    container.appendChild(toast);

    if (state.a11y && state.a11y.speechEnabled) {
      speak(message, false);
    }
    if (a11yAnnouncer) {
      a11yAnnouncer.textContent = message;
    }

    if (actionText && actionCallback) {
      const btn = toast.querySelector('.toast-action-btn');
      if (btn) btn.addEventListener('click', () => { actionCallback(); toast.remove(); });
    }

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) closeBtn.addEventListener('click', () => toast.remove());

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // 7. Modallarni Boshqarish
  // ==========================================
  function openModal(modalEl) {
    if (!modalEl) return;
    closeAllModals();
    if (modalBackdrop) modalBackdrop.classList.add('active');
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    [
      cartDrawer, wishlistDrawer, quickViewModal, checkoutModal,
      fastBuyModal, successModal, authModal, userCabinetModal,
      adminModal, orderTrackingModal, deliveryModal, a11yModal
    ].forEach(m => {
      if (m) m.classList.remove('active');
    });
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (filterSidebar) filterSidebar.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', closeAllModals));
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeAllModals);

  // ==========================================
  // 8. Auth Holatini Yangilash (Header & User State)
  // ==========================================
  function updateAuthUI() {
    const user = state.currentUser;
    if (user) {
      const firstName = user.name.split(' ')[0] || user.name;
      if (authBtnText) authBtnText.textContent = firstName;
      if (authBtnIcon) {
        authBtnIcon.className = "fa-solid fa-circle-user";
        authBtnIcon.style.color = "#10b981";
      }
      const authMobileText = document.getElementById('authMobileText');
      if (authMobileText) authMobileText.textContent = firstName;

      // Admin panel tugmasi
      if (adminPanelBtn) {
        if (user.role === 'admin') {
          adminPanelBtn.style.display = 'inline-flex';
        } else {
          adminPanelBtn.style.display = 'none';
        }
      }
    } else {
      if (authBtnText) authBtnText.textContent = t('login', state.lang);
      if (authBtnIcon) {
        authBtnIcon.className = "fa-regular fa-user";
        authBtnIcon.style.color = "";
      }
      const authMobileText = document.getElementById('authMobileText');
      if (authMobileText) authMobileText.textContent = t('profile', state.lang);
      if (adminPanelBtn) adminPanelBtn.style.display = 'none';
    }
  }

  // ==========================================
  // 9. Mahsulotlarni Yuklash va Render Qilish
  // ==========================================
  async function loadProducts() {
    try {
      const prods = await api.getProducts();
      if (Array.isArray(prods) && prods.length > 0) {
        state.products = prods;
      }
    } catch (err) {
      console.warn("API dan yuklashda xatolik, lokal bazadan o'qildi:", err);
      state.products = localStore.getProducts();
    }
    renderCatalog();
    renderCategories();
  }

  function renderCatalog() {
    if (!productsGrid) return;

    let filtered = [...state.products];

    // Toifa filtri
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === state.activeCategory);
    }

    // Qidiruv
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // Narx oralig'i
    filtered = filtered.filter(p => p.price <= state.maxPrice);

    // Nishonlar
    if (state.selectedBadges.length > 0) {
      filtered = filtered.filter(p => p.badge && state.selectedBadges.includes(p.badge.toUpperCase()));
    }

    // Saralash
    if (state.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (state.sortBy === 'discount') {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else if (state.sortBy === 'newest') {
      filtered.sort((a, b) => (b.badge === 'YANGI' ? 1 : 0) - (a.badge === 'YANGI' ? 1 : 0));
    } else {
      // Ommabop
      filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    if (productsCountEl) {
      productsCountEl.textContent = `${filtered.length} ${t('products_count', state.lang)}`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3.5rem; color: var(--text-muted); margin-bottom: 1rem;">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main);">${t('no_products_found', state.lang)}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.25rem; margin-bottom: 1.5rem;">${t('no_products_desc', state.lang)}</p>
          <button class="hero-btn" id="emptyResetBtn" style="background: var(--primary); color: #fff; margin: 0 auto;">
            <i class="fa-solid fa-rotate-left"></i> ${t('filter_reset', state.lang)}
          </button>
        </div>
      `;
      document.getElementById('emptyResetBtn')?.addEventListener('click', resetAllFilters);
      return;
    }

    productsGrid.className = `products-grid ${state.viewMode === 'list' ? 'list-view' : ''}`;

    productsGrid.innerHTML = filtered.map(product => {
      const loc = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(product, state.lang) : product;
      const isWish = state.wishlist.includes(product.id);
      const cartItem = state.cart.find(i => i.product.id === product.id);
      const inCart = !!cartItem;
      const cartQty = inCart ? cartItem.quantity : 0;

      const badgeClasses = {
        'HIT': 'badge-hit',
        'YANGI': 'badge-yangi',
        'CHEGIRMA': 'badge-chegirma',
        'TAVSIYA': 'badge-tavsiya'
      };
      const badgeClass = badgeClasses[product.badge] || 'badge-hit';
      const badgeKey = product.badge ? 'badge_' + product.badge.toLowerCase() : '';
      const badgeText = product.badge ? (t(badgeKey, state.lang) || product.badge) : '';

      return `
        <div class="product-card" data-id="${product.id}" tabindex="0" role="region" aria-label="${loc.name}, ${formatPrice(product.price, state.lang)}">
          <div class="product-card-img-wrap" data-action="quickview" data-id="${product.id}">
            <div class="product-badge-group">
              ${product.badge ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
              <span class="delivery-badge"><i class="fa-solid fa-truck-fast"></i> ${t('delivery_1_day', state.lang)}</span>
            </div>

            <div class="product-quick-actions">
              <button class="quick-action-btn btn-wishlist ${isWish ? 'active' : ''}" data-id="${product.id}" title="${isWish ? t('toast_wish_removed', state.lang) : t('toast_wish_added', state.lang)}" aria-label="${loc.name} - ${isWish ? t('toast_wish_removed', state.lang) : t('toast_wish_added', state.lang)}">
                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
              <button class="quick-action-btn btn-speak-product" data-id="${product.id}" title="${t('listen_product', state.lang)}" aria-label="${t('listen_product', state.lang)}: ${loc.name}">
                <i class="fa-solid fa-volume-high"></i>
              </button>
              <button class="quick-action-btn btn-quickview" data-id="${product.id}" title="${t('quick_view', state.lang)}" aria-label="${loc.name} - ${t('quick_view', state.lang)}">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>

            <img src="${product.image}" alt="${loc.name}" class="product-card-img" onerror="this.onerror=null; this.src='assets/products/iphone-15-pro.svg';">
          </div>

          <div class="product-card-body">
            <div>
              <div class="product-card-category">${typeof getLocalizedCategoryName === 'function' ? getLocalizedCategoryName(product.category, state.lang) : (product.categoryName || 'Texnika')}</div>
              <h3 class="product-card-title" data-action="quickview" data-id="${product.id}" title="${loc.name}">
                ${loc.name}
              </h3>
            </div>

            <div class="product-card-meta">
              <div class="product-rating">
                <i class="fa-solid fa-star star-filled"></i>
                <span class="rating-num">${product.rating || '5.0'}</span>
                <span class="reviews-count">(${product.reviewsCount || 0} ${t('reviews_count_label', state.lang)})</span>
              </div>
              <span class="stock-status in-stock"><i class="fa-solid fa-check"></i> ${t('in_stock', state.lang)}</span>
            </div>

            <div class="monthly-price-badge">
              <i class="fa-solid fa-calendar-check"></i>
              <span>${t('monthly_prefix', state.lang)} <strong>${formatPrice(product.monthlyPrice, state.lang)}</strong> ${t('monthly_suffix', state.lang)}</span>
            </div>

            <div class="product-pricing">
              <div>
                <div class="price-current">${formatPrice(product.price, state.lang)}</div>
                ${product.oldPrice ? `<div class="price-old">${formatPrice(product.oldPrice, state.lang)}</div>` : ''}
              </div>
              ${product.discount ? `<span class="discount-pill">-${product.discount}%</span>` : ''}
            </div>

            <div class="product-card-actions">
              ${inCart ? `
                <div class="card-cart-controls">
                  <button class="card-qty-btn btn-dec" data-id="${product.id}" aria-label="1 dona kamaytirish">-</button>
                  <span class="card-qty-value">${t('in_cart', state.lang)} <strong>${cartQty}</strong> ${t('pieces', state.lang)}</span>
                  <button class="card-qty-btn btn-inc" data-id="${product.id}" aria-label="1 dona ko'paytirish">+</button>
                </div>
              ` : `
                <button class="btn-add-cart" data-id="${product.id}" aria-label="${loc.name} - ${t('add_to_cart', state.lang)}">
                  <i class="fa-solid fa-cart-plus"></i> ${t('add_to_cart', state.lang)}
                </button>
              `}

              <button class="btn-buy-fast" data-id="${product.id}" aria-label="${loc.name} - ${t('buy_fast', state.lang)}">
                <i class="fa-solid fa-bolt-lightning" style="color: #f59e0b;"></i> ${t('buy_fast', state.lang)}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCategories() {
    if (!categoryPillsContainer) return;
    const cats = state.categories || categoriesData;

    categoryPillsContainer.innerHTML = cats.map(cat => {
      const catTitle = typeof getLocalizedCategoryName === 'function' ? getLocalizedCategoryName(cat.id, state.lang) : cat.name;
      return `
        <button class="cat-pill ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" aria-label="Kategoriya: ${catTitle}">
          <i class="${cat.icon}"></i>
          <span>${catTitle}</span>
        </button>
      `;
    }).join('');

    if (categoryFilterList) {
      categoryFilterList.innerHTML = cats.map(cat => {
        const catTitle = typeof getLocalizedCategoryName === 'function' ? getLocalizedCategoryName(cat.id, state.lang) : cat.name;
        const count = cat.id === 'all' 
          ? state.products.length 
          : state.products.filter(p => p.category === cat.id).length;

        return `
          <div class="category-filter-item ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" role="button" tabindex="0" aria-label="${catTitle}, ${count} tovar">
            <span><i class="${cat.icon}" style="margin-right: 0.5rem; width: 16px;"></i> ${catTitle}</span>
            <span class="category-filter-count">${count}</span>
          </div>
        `;
      }).join('');
    }
  }

  function resetAllFilters() {
    state.activeCategory = 'all';
    state.searchQuery = '';
    state.maxPrice = 30000000;
    state.selectedBadges = [];
    state.sortBy = 'popular';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.classList.remove('active');
    if (priceSlider) priceSlider.value = 30000000;
    if (priceInputMax) priceInputMax.value = '30 000 000';
    if (sortSelect) sortSelect.value = 'popular';
    document.querySelectorAll('.checkbox-filter-list input[type="checkbox"]').forEach(c => c.checked = false);
    renderCategories();
    renderCatalog();
    showToast("Barcha filtrlar tozalandi", "info");
  }

  // ==========================================
  // 10. Quick View & Sharhlar (Reviews)
  // ==========================================
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const loc = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(product, state.lang) : product;
    const modalBody = document.getElementById('quickViewModalBody');
    if (!modalBody) return;

    state.selectedStorageIndex = 0;
    state.selectedColorIndex = 0;
    const isWish = state.wishlist.includes(product.id);
    const cartItem = state.cart.find(i => i.product.id === product.id);
    const inCart = !!cartItem;

    let currentPrice = product.price;

    const fullStars = Math.floor(product.rating || 5);
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += (i < fullStars) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }

    const specsRows = Object.entries(product.features || {}).map(([key, val]) => `
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-light); font-size: 0.85rem;">
        <span style="color: var(--text-muted);">${key}:</span>
        <span style="font-weight: 700; color: var(--text-main); text-align: right; max-width: 60%;">${val}</span>
      </div>
    `).join('');

    const storageOptionsHtml = (product.storageOptions && product.storageOptions.length > 0) ? `
      <div style="margin-bottom: 1.25rem;">
        <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">${t('storage_size', state.lang)}</label>
        <div style="display: flex; gap: 0.5rem;" id="quickViewStorageOptions">
          ${product.storageOptions.map((opt, idx) => `
            <button class="cat-pill storage-opt-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" data-price="${opt.price}" style="font-size: 0.825rem; padding: 0.45rem 0.95rem;">
              ${opt.size}
            </button>
          `).join('')}
        </div>
      </div>
    ` : '';

    const colorsHtml = (product.colors && product.colors.length > 0) ? `
      <div style="margin-bottom: 1.25rem;">
        <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.5rem;">${t('color', state.lang)}</label>
        <div style="display: flex; gap: 0.65rem;" id="quickViewColors">
          ${product.colors.map((c, idx) => `
            <div class="color-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" style="background-color: ${c}; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 0 2px ${idx === 0 ? 'var(--primary)' : 'var(--border-light)'};"></div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const galleryHtml = (product.gallery && product.gallery.length > 1) ? `
      <div style="display: flex; gap: 0.5rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 4px;">
        ${product.gallery.map((img, idx) => `
          <img src="${img}" class="quick-gallery-thumb ${idx === 0 ? 'active' : ''}" data-src="${img}" style="width: 60px; height: 60px; object-fit: contain; border-radius: var(--radius-md); border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-light)'}; background: #fff; cursor: pointer; padding: 2px;" alt="${loc.name}">
        `).join('')}
      </div>
    ` : '';

    // Sharhlar ro'yxati
    const reviews = product.reviews || [];
    const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
      <div class="review-item">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);"><i class="fa-solid fa-circle-user" style="color: var(--primary); margin-right: 4px;"></i> ${r.userName}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${r.date}</span>
        </div>
        <div style="color: #f59e0b; font-size: 0.8rem; margin-bottom: 0.4rem;">
          ${Array.from({length: 5}, (_, i) => i < r.rating ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>').join('')}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">${r.comment}</p>
      </div>
    `).join('') : `<p style="color: var(--text-muted); font-size: 0.85rem;">Hozircha sharhlar yo'q. Birinchi bo'lib sharh qoldiring!</p>`;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.15fr; gap: 2rem; padding: 2rem;" class="quickview-grid">
        <!-- Rasm ustuni -->
        <div>
          <div style="background: var(--bg-surface); border-radius: var(--radius-2xl); height: 340px; display: flex; align-items: center; justify-content: center; padding: 1.5rem; position: relative;">
            <img id="quickMainImg" src="${product.image}" alt="${loc.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.onerror=null; this.src='assets/products/iphone-15-pro.svg';">
          </div>
          ${galleryHtml}
        </div>

        <!-- Ma'lumot ustuni -->
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span class="product-badge badge-hit" style="margin-bottom: 0.5rem;">${product.badge || 'HIT'}</span>
              <button class="quick-action-btn btn-wishlist ${isWish ? 'active' : ''}" data-id="${product.id}" style="width: 38px; height: 38px;">
                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
            </div>

            <h2 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">${loc.name}</h2>

            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem;">
              <div style="color: #f59e0b; display: flex; gap: 2px; font-size: 0.875rem;">${starsHtml}</div>
              <span style="font-weight: 800; font-size: 0.875rem;">${product.rating || '5.0'}</span>
              <span style="color: var(--text-muted); font-size: 0.85rem;">(${product.reviewsCount || 0} ${t('reviews_count_label', state.lang)})</span>
            </div>

            <div style="margin-bottom: 0.65rem;">
              <button id="qvSpeakBtn" style="background: var(--bg-surface); color: var(--text-main); border: 1.5px solid var(--border-light); padding: 0.35rem 0.75rem; border-radius: var(--radius-md); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem;" title="${t('listen_details', state.lang)}" aria-label="${t('listen_details', state.lang)}">
                <i class="fa-solid fa-volume-high" style="color: var(--primary);"></i> <span>${t('listen_details', state.lang)}</span>
              </button>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <div style="font-size: 1.65rem; font-weight: 900; color: var(--primary);" id="quickPriceDisplay">${formatPrice(currentPrice, state.lang)}</div>
              ${product.oldPrice ? `<div style="font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through;">${formatPrice(product.oldPrice, state.lang)}</div>` : ''}
            </div>

            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
              ${loc.description}
            </p>

            ${storageOptionsHtml}
            ${colorsHtml}
          </div>

          <div>
            <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
              <button class="btn-add-cart" id="quickAddToCartBtn" data-id="${product.id}" style="flex: 1; padding: 0.85rem;">
                <i class="fa-solid fa-cart-plus"></i> ${t('add_to_cart', state.lang)}
              </button>
              <button class="btn-buy-fast" id="quickBuyFastBtn" data-id="${product.id}" style="flex: 1; padding: 0.85rem;">
                <i class="fa-solid fa-bolt-lightning" style="color: #f59e0b;"></i> ${t('buy_fast', state.lang)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Texnik parametrlar va Sharhlar -->
      <div style="padding: 1.5rem 2rem 2rem; border-top: 1px solid var(--border-light);">
        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-main);"><i class="fa-solid fa-list-check" style="color: var(--primary);"></i> ${t('features_title', state.lang)}</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 2rem;">
          ${specsRows}
        </div>

        <!-- Sharhlar bloki -->
        <div class="reviews-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 0;">
              <i class="fa-solid fa-comments" style="color: #f59e0b;"></i> ${t('reviews_title', state.lang)} (${reviews.length})
            </h4>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem;" class="reviews-grid-wrap">
            <!-- Mavjud sharhlar -->
            <div style="max-height: 280px; overflow-y: auto; padding-right: 0.5rem;">
              ${reviewsHtml}
            </div>

            <!-- Yangi sharh qoldirish formasi -->
            <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-light);">
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main);">${t('leave_review', state.lang)}</div>
              <form id="addReviewForm" data-product-id="${product.id}">
                <div style="margin-bottom: 0.65rem;">
                  <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: block;">${t('your_rating', state.lang)}</label>
                  <div class="star-picker" id="starPicker">
                    <i class="fa-solid fa-star active" data-rating="1"></i>
                    <i class="fa-solid fa-star active" data-rating="2"></i>
                    <i class="fa-solid fa-star active" data-rating="3"></i>
                    <i class="fa-solid fa-star active" data-rating="4"></i>
                    <i class="fa-solid fa-star active" data-rating="5"></i>
                  </div>
                  <input type="hidden" id="reviewRatingInput" value="5">
                </div>
                <div style="margin-bottom: 0.65rem;">
                  <input type="text" id="reviewAuthorInput" class="form-input" placeholder="${t('your_name', state.lang)}" value="${state.currentUser ? state.currentUser.name : ''}" required style="padding: 0.45rem 0.75rem; font-size: 0.85rem;">
                </div>
                <div style="margin-bottom: 0.75rem;">
                  <textarea id="reviewCommentInput" class="form-textarea" placeholder="${t('your_comment', state.lang)}" required style="height: 65px; padding: 0.5rem 0.75rem; font-size: 0.85rem;"></textarea>
                </div>
                <button type="submit" class="checkout-btn" style="padding: 0.65rem; font-size: 0.85rem;">
                  <i class="fa-solid fa-paper-plane"></i> ${t('submit_review', state.lang)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('qvSpeakBtn')?.addEventListener('click', () => {
      const speech = `${loc.name}. ${formatPrice(currentPrice, state.lang)}. ${loc.description}`;
      const utterance = new SpeechSynthesisUtterance(speech);
      utterance.lang = state.lang === 'ru' ? 'ru-RU' : state.lang === 'en' ? 'en-US' : 'uz-UZ';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      showToast(loc.name, 'info');
    });

    // Galereya rasmlarini almashtirish
    modalBody.querySelectorAll('.quick-gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        modalBody.querySelectorAll('.quick-gallery-thumb').forEach(t => t.style.borderColor = 'var(--border-light)');
        thumb.style.borderColor = 'var(--primary)';
        const mainImg = document.getElementById('quickMainImg');
        if (mainImg) mainImg.src = thumb.dataset.src;
      });
    });

    // Xotira o'lchamini tanlaganda narxni yangilash
    modalBody.querySelectorAll('.storage-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modalBody.querySelectorAll('.storage-opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedStorageIndex = Number(btn.dataset.index);
        currentPrice = Number(btn.dataset.price);
        const priceDisp = document.getElementById('quickPriceDisplay');
        if (priceDisp) priceDisp.textContent = formatPrice(currentPrice);
      });
    });

    // Rang tanlash
    modalBody.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        modalBody.querySelectorAll('.color-dot').forEach(d => d.style.boxShadow = '0 0 0 2px var(--border-light)');
        dot.style.boxShadow = '0 0 0 2px var(--primary)';
        state.selectedColorIndex = Number(dot.dataset.index);
      });
    });

    // Sharh yulduzchalari
    const starPicker = document.getElementById('starPicker');
    if (starPicker) {
      starPicker.querySelectorAll('i').forEach(star => {
        star.addEventListener('click', () => {
          const rating = Number(star.dataset.rating);
          document.getElementById('reviewRatingInput').value = rating;
          starPicker.querySelectorAll('i').forEach(s => {
            if (Number(s.dataset.rating) <= rating) {
              s.className = "fa-solid fa-star active";
            } else {
              s.className = "fa-regular fa-star";
            }
          });
        });
      });
    }

    // Sharh yuborish formasi
    const addReviewForm = document.getElementById('addReviewForm');
    if (addReviewForm) {
      addReviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = Number(document.getElementById('reviewRatingInput').value) || 5;
        const userName = document.getElementById('reviewAuthorInput').value.trim();
        const comment = document.getElementById('reviewCommentInput').value.trim();

        try {
          await api.addReview(product.id, { rating, userName, comment });
          showToast("Sharhingiz qabul qilindi, rahmat!", "success");
          await loadProducts();
          openQuickView(product.id); // oynani yangilash
        } catch (err) {
          showToast(err.message, "error");
        }
      });
    }

    // Savatga qo'shish
    document.getElementById('quickAddToCartBtn')?.addEventListener('click', () => {
      addToCart(product.id, 1, currentPrice);
      closeAllModals();
      renderCartDrawer();
      openModal(cartDrawer);
    });

    // Tezkor xarid
    document.getElementById('quickBuyFastBtn')?.addEventListener('click', () => {
      closeAllModals();
      openFastBuy(product.id);
    });

    openModal(quickViewModal);
  }

  // ==========================================
  // 11. Savatcha Funksiyalari
  // ==========================================
  function addToCart(productId, quantity = 1, customPrice = null) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(i => i.product.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
      showToast(`"${product.name.substring(0, 26)}..." miqdori oshirildi (+${quantity})`, "info", "Savatni ko'rish", () => {
        renderCartDrawer();
        openModal(cartDrawer);
      });
    } else {
      const productToAdd = customPrice ? { ...product, price: customPrice } : { ...product };
      state.cart.push({ product: productToAdd, quantity });
      showToast(`"${product.name.substring(0, 26)}..." savatga qo'shildi!`, "success", "Savatni ko'rish", () => {
        renderCartDrawer();
        openModal(cartDrawer);
      });
    }

    safeSetStorage('bozorix_cart', state.cart);
    updateCartBadges();
    renderCatalog();
  }

  function updateCartQuantity(productId, delta) {
    const idx = state.cart.findIndex(i => i.product.id === productId);
    if (idx === -1) return;

    state.cart[idx].quantity += delta;
    if (state.cart[idx].quantity <= 0) {
      state.cart.splice(idx, 1);
    }

    safeSetStorage('bozorix_cart', state.cart);
    updateCartBadges();
    renderCartDrawer();
    renderCatalog();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.product.id !== productId);
    safeSetStorage('bozorix_cart', state.cart);
    updateCartBadges();
    renderCartDrawer();
    renderCatalog();
    showToast("Mahsulot savatdan o'chirildi", "info");
  }

  function clearCart() {
    state.cart = [];
    state.appliedCoupon = null;
    safeSetStorage('bozorix_cart', state.cart);
    safeSetStorage('bozorix_coupon', null);
    updateCartBadges();
    renderCartDrawer();
    renderCatalog();
    showToast("Savatcha tozalandi", "info");
  }

  function updateCartBadges() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    if (cartBadge) cartBadge.textContent = totalCount;
    if (cartBadgeMobile) cartBadgeMobile.textContent = totalCount;
    if (cartHeaderTotal) cartHeaderTotal.textContent = formatPrice(subtotal);
    if (cartItemsCountEl) cartItemsCountEl.textContent = `(${totalCount})`;
  }

  function renderCartDrawer() {
    if (!cartItemsList) return;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--bg-surface); color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem;">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
          <h4 style="font-weight: 800; font-size: 1.15rem; color: var(--text-main);">${t('cart_empty_title', state.lang)}</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">${t('cart_empty_desc', state.lang)}</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(0, state.lang);
      if (cartTotalEl) cartTotalEl.textContent = formatPrice(0, state.lang);
      if (cartShippingEl) cartShippingEl.textContent = formatPrice(0, state.lang);
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
      if (shippingProgressFill) shippingProgressFill.style.width = '0%';
      if (freeShippingText) freeShippingText.textContent = t('free_shipping_hint', state.lang);
      if (couponAppliedBox) couponAppliedBox.innerHTML = '';
      return;
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = state.appliedCoupon ? Math.round((subtotal * state.appliedCoupon.discount) / 100) : 0;
    const freeThreshold = 1000000;
    const shipping = subtotal >= freeThreshold ? 0 : 35000;
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    // Bepul yetkazish progressi
    const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
    if (shippingProgressFill) shippingProgressFill.style.width = `${progressPercent}%`;
    if (freeShippingText) {
      if (subtotal >= freeThreshold) {
        freeShippingText.innerHTML = `<span style="color: #10b981; font-weight: 800;"><i class="fa-solid fa-circle-check"></i> ${t('free_shipping_unlocked', state.lang)}</span>`;
      } else {
        const remaining = freeThreshold - subtotal;
        freeShippingText.innerHTML = `${formatPrice(remaining, state.lang)} ${t('free_shipping_remaining', state.lang)}`;
      }
    }

    cartItemsList.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">${t('cart_title', state.lang)} (${state.cart.length}):</span>
        <button id="clearAllCartBtn" style="background: none; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer;">
          <i class="fa-regular fa-trash-can"></i> ${t('clear_cart', state.lang)}
        </button>
      </div>

      ${state.cart.map(item => {
        const locItem = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(item.product, state.lang) : item.product;
        return `
          <div class="cart-item" data-id="${item.product.id}">
            <img src="${item.product.image}" class="cart-item-img" alt="${locItem.name}" onerror="this.onerror=null; this.src='assets/products/iphone-15-pro.svg';">
            <div class="cart-item-info">
              <h4 class="cart-item-title">${locItem.name}</h4>
              <div class="cart-item-price">${formatPrice(item.product.price, state.lang)}</div>
              <div class="cart-item-controls">
                <div class="cart-qty-wrapper">
                  <button class="cart-qty-btn btn-cart-dec" data-id="${item.product.id}" aria-label="1 dona kamaytirish">-</button>
                  <span class="cart-qty-num">${item.quantity}</span>
                  <button class="cart-qty-btn btn-cart-inc" data-id="${item.product.id}" aria-label="1 dona ko'paytirish">+</button>
                </div>
                <button class="cart-item-remove btn-cart-remove" data-id="${item.product.id}" title="O'chirish" aria-label="Savatdan o'chirish">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;

    document.getElementById('clearAllCartBtn')?.addEventListener('click', clearCart);

    cartItemsList.querySelectorAll('.btn-cart-inc').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.id), 1));
    });
    cartItemsList.querySelectorAll('.btn-cart-dec').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.id), -1));
    });
    cartItemsList.querySelectorAll('.btn-cart-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal, state.lang);
    if (cartShippingEl) {
      cartShippingEl.textContent = shipping === 0 ? t('shipping_free', state.lang) : formatPrice(shipping, state.lang);
      cartShippingEl.style.color = shipping === 0 ? "#10b981" : "inherit";
    }

    if (discountAmount > 0 && state.appliedCoupon) {
      if (cartDiscountRow) cartDiscountRow.style.display = 'flex';
      if (cartDiscountEl) cartDiscountEl.textContent = `-${formatPrice(discountAmount, state.lang)}`;
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    }

    if (cartTotalEl) cartTotalEl.textContent = formatPrice(grandTotal, state.lang);

    // Qo'llanilgan kupon bloki
    if (couponAppliedBox) {
      if (state.appliedCoupon) {
        couponAppliedBox.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #065f46; border-radius: var(--radius-md); padding: 0.45rem 0.75rem; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <span><i class="fa-solid fa-tag"></i> <strong>${state.appliedCoupon.code}</strong> (-${state.appliedCoupon.discount}%)</span>
            <button id="removeCouponBtn" style="background: none; border: none; cursor: pointer; color: #065f46; font-size: 0.9rem;">&times;</button>
          </div>
        `;
        document.getElementById('removeCouponBtn')?.addEventListener('click', () => {
          state.appliedCoupon = null;
          safeSetStorage('bozorix_coupon', null);
          renderCartDrawer();
          showToast("Promokod bekor qilindi", "info");
        });
      } else {
        couponAppliedBox.innerHTML = '';
      }
    }
  }

  // ==========================================
  // 12. Sevimlilar (Wishlist) Funksiyalari
  // ==========================================
  function toggleWishlist(productId) {
    const idx = state.wishlist.indexOf(productId);
    const prod = state.products.find(p => p.id === productId);

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`"${prod?.name.substring(0, 24)}..." sevimlilardan olindi`, "info");
    } else {
      state.wishlist.push(productId);
      showToast(`"${prod?.name.substring(0, 24)}..." sevimlilarga qo'shildi!`, "success");
    }

    safeSetStorage('bozorix_wishlist', state.wishlist);
    updateWishlistBadges();
    renderCatalog();
    renderWishlistDrawer();
  }

  function updateWishlistBadges() {
    const count = state.wishlist.length;
    if (wishBadge) wishBadge.textContent = count;
    if (wishBadgeMobile) wishBadgeMobile.textContent = count;
    const wishItemsCount = document.getElementById('wishItemsCount');
    if (wishItemsCount) wishItemsCount.textContent = `(${count})`;
  }

  function renderWishlistDrawer() {
    const wishItemsList = document.getElementById('wishItemsList');
    if (!wishItemsList) return;

    if (state.wishlist.length === 0) {
      wishItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--bg-surface); color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1rem;">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h4 style="font-weight: 800; font-size: 1.15rem; color: var(--text-main);">${t('wish_empty_title', state.lang)}</h4>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">${t('wish_empty_desc', state.lang)}</p>
        </div>
      `;
      return;
    }

    const wishProducts = state.products.filter(p => state.wishlist.includes(p.id));

    wishItemsList.innerHTML = wishProducts.map(p => {
      const locP = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(p, state.lang) : p;
      return `
        <div class="cart-item">
          <img src="${p.image}" class="cart-item-img" alt="${locP.name}" onerror="this.onerror=null; this.src='assets/products/iphone-15-pro.svg';">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${locP.name}</h4>
            <div class="cart-item-price">${formatPrice(p.price, state.lang)}</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 0.65rem;">
              <button class="hero-btn btn-wish-add-cart" data-id="${p.id}" style="background: var(--primary); color: #fff; padding: 0.35rem 0.75rem; font-size: 0.75rem; border: none;">
                <i class="fa-solid fa-cart-plus"></i> ${t('move_to_cart', state.lang)}
              </button>
              <button class="hero-btn btn-wish-remove" data-id="${p.id}" style="background: var(--bg-surface); color: #ef4444; border: 1px solid var(--border-light); padding: 0.35rem 0.65rem; font-size: 0.75rem;" aria-label="Sevimlilardan o'chirish">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    wishItemsList.querySelectorAll('.btn-wish-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        addToCart(Number(btn.dataset.id));
        closeAllModals();
        renderCartDrawer();
        openModal(cartDrawer);
      });
    });

    wishItemsList.querySelectorAll('.btn-wish-remove').forEach(btn => {
      btn.addEventListener('click', () => toggleWishlist(Number(btn.dataset.id)));
    });
  }

  // ==========================================
  // 13. Promokod Tekshiruvi
  // ==========================================
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', async () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        showToast("Promokodni kiriting!", "warning");
        return;
      }

      try {
        const res = await api.validateCoupon(code);
        state.appliedCoupon = { code: res.code, discount: res.discount, name: res.description };
        safeSetStorage('bozorix_coupon', state.appliedCoupon);
        couponInput.value = '';
        renderCartDrawer();
        showToast(`"${res.code}" promokodi qo'llandi! -${res.discount}% chegirma`, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================
  // 14. 1-Bosishda Tezkor Xarid (Fast Buy)
  // ==========================================
  function openFastBuy(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.fastBuyProduct = product;
    const fastBuyProductBox = document.getElementById('fastBuyProductBox');
    if (fastBuyProductBox) {
      fastBuyProductBox.innerHTML = `
        <img src="${product.image}" style="width: 60px; height: 60px; object-fit: contain; background: #fff; border-radius: var(--radius-md); padding: 4px;" alt="${product.name}" onerror="this.onerror=null; this.src='assets/products/iphone-15-pro.svg';">
        <div>
          <div style="font-weight: 800; font-size: 0.9rem; line-height: 1.3;">${product.name}</div>
          <div style="color: var(--primary); font-weight: 800; font-size: 1rem; margin-top: 2px;">${formatPrice(product.price)}</div>
        </div>
      `;
    }

    // Foydalanuvchi tizimga kirgan bo'lsa avtomatik to'ldirish
    if (state.currentUser) {
      const fastName = document.getElementById('fastName');
      const fastPhone = document.getElementById('fastPhone');
      if (fastName) fastName.value = state.currentUser.name;
      if (fastPhone) fastPhone.value = state.currentUser.phone;
    }

    openModal(fastBuyModal);
  }

  const fastBuyForm = document.getElementById('fastBuyForm');
  if (fastBuyForm) {
    fastBuyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('fastName').value.trim();
      const phone = document.getElementById('fastPhone').value.trim();

      if (!name || phone.length < 9) {
        showToast("Iltimos, ism va to'g'ri telefon raqamingizni kiriting!", "error");
        return;
      }

      if (!state.fastBuyProduct) return;

      try {
        const orderRes = await api.createOrder({
          userId: state.currentUser ? state.currentUser.id : null,
          customerName: name,
          customerPhone: phone,
          customerCity: "Toshkent shahri",
          customerAddress: "Operator orqali aniqlanadi",
          paymentMethod: "cash",
          items: [
            {
              productId: state.fastBuyProduct.id,
              name: state.fastBuyProduct.name,
              price: state.fastBuyProduct.price,
              quantity: 1,
              image: state.fastBuyProduct.image
            }
          ],
          subtotal: state.fastBuyProduct.price,
          totalAmount: state.fastBuyProduct.price,
          shippingFee: 0,
          notes: "1 bosishda tezkor xarid"
        });

        closeAllModals();
        showReceiptModal(orderRes.order);
        showToast("Tezkor buyurtmangiz muvaffaqiyatli qabul qilindi!", "success");
        fastBuyForm.reset();
        await loadProducts(); // zaxirani yangilash
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================
  // 15. To'liq Buyurtma Rasmiylashtirish (Checkout)
  // ==========================================
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast("Savatchangiz bo'sh. Avval mahsulot tanlang!", "error");
      return;
    }
    closeAllModals();

    const checkoutSummaryEl = document.getElementById('checkoutSummary');
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = state.appliedCoupon ? Math.round((subtotal * state.appliedCoupon.discount) / 100) : 0;
    const shipping = subtotal >= 1000000 ? 0 : 35000;
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    if (checkoutSummaryEl) {
      checkoutSummaryEl.innerHTML = `
        <div style="background: var(--bg-surface); padding: 1.15rem; border-radius: var(--radius-xl); margin-bottom: 1.35rem; border: 1px solid var(--border-light);">
          <div style="font-weight: 800; margin-bottom: 0.65rem; font-size: 0.95rem;">Buyurtma tarkibi (${state.cart.length} xil tovar):</div>
          ${state.cart.map(i => `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.35rem;">
              <span>${i.product.name.substring(0, 32)}... x ${i.quantity}</span>
              <span style="font-weight: 700;">${formatPrice(i.product.price * i.quantity)}</span>
            </div>
          `).join('')}

          ${discountAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #10b981; font-weight: 700; margin-top: 0.35rem;">
              <span>Promokod chegirmasi (${state.appliedCoupon.code}):</span>
              <span>-${formatPrice(discountAmount)}</span>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
            <span>Yetkazib berish:</span>
            <span style="font-weight: 700; color: ${shipping === 0 ? '#10b981' : 'inherit'};">${shipping === 0 ? 'Bepul' : formatPrice(shipping)}</span>
          </div>

          <div style="border-top: 1.5px dashed var(--border-light); margin-top: 0.65rem; padding-top: 0.65rem; display: flex; justify-content: space-between; font-weight: 800; font-size: 1.15rem; color: var(--primary);">
            <span>Jami to'lov:</span>
            <span>${formatPrice(grandTotal)}</span>
          </div>
        </div>
      `;
    }

    // Foydalanuvchi ma'lumotlarini avtomatik to'ldirish
    if (state.currentUser) {
      const nameInput = document.getElementById('customerName');
      const phoneInput = document.getElementById('customerPhone');
      const cityInput = document.getElementById('customerCity');
      const addressInput = document.getElementById('customerAddress');
      if (nameInput) nameInput.value = state.currentUser.name || '';
      if (phoneInput) phoneInput.value = state.currentUser.phone || '';
      if (cityInput && state.currentUser.city) cityInput.value = state.currentUser.city;
      if (addressInput && state.currentUser.address) addressInput.value = state.currentUser.address;
    }

    openModal(checkoutModal);
  }

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = e.target;
      const name = form.customerName.value.trim();
      const phone = form.customerPhone.value.trim();
      const city = form.customerCity.value;
      const address = form.customerAddress.value.trim();
      const paymentMethod = form.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';
      const notes = form.customerNotes.value.trim();

      if (!name || phone.length < 9 || !address) {
        showToast("Iltimos, ism, telefon raqam va manzilni to'liq kiriting!", "error");
        return;
      }

      const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const discountAmount = state.appliedCoupon ? Math.round((subtotal * state.appliedCoupon.discount) / 100) : 0;
      const shipping = subtotal >= 1000000 ? 0 : 35000;
      const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

      try {
        const orderPayload = {
          userId: state.currentUser ? state.currentUser.id : null,
          customerName: name,
          customerPhone: phone,
          customerCity: city,
          customerAddress: address,
          paymentMethod,
          appliedCoupon: state.appliedCoupon ? state.appliedCoupon.code : null,
          items: state.cart.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image
          })),
          subtotal,
          discountAmount,
          shippingFee: shipping,
          totalAmount: grandTotal,
          notes
        };

        const res = await api.createOrder(orderPayload);
        const order = res.order;

        // Savatni tozalash
        state.cart = [];
        state.appliedCoupon = null;
        safeSetStorage('bozorix_cart', state.cart);
        safeSetStorage('bozorix_coupon', null);
        updateCartBadges();
        renderCartDrawer();
        renderCatalog();

        closeAllModals();

        // Agar Payme yoki Click tanlangan bo'lsa, to'lov havolasini generatsiya qilish
        if (paymentMethod === 'payme') {
          const paymeData = await api.createPaymeLink(order.id, order.totalAmount);
          showReceiptModal(order, paymeData);
        } else if (paymentMethod === 'click') {
          const clickData = await api.createClickLink(order.id, order.totalAmount);
          showReceiptModal(order, clickData);
        } else {
          showReceiptModal(order);
        }

        showToast("Buyurtmangiz muvaffaqiyatli qabul qilindi!", "success");
        form.reset();
        await loadProducts(); // zaxirani yangilash
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================
  // 16. Rasmiy Kvitansiya (Receipt Modal)
  // ==========================================
  function showReceiptModal(order, paymentInfo = null) {
    const receiptBox = document.getElementById('receiptBox');
    if (!receiptBox) return;

    let paymentMethodText = "Qabul qilganda naqd pul";
    if (order.paymentMethod === 'payme') paymentMethodText = "Payme to'lov tizimi";
    if (order.paymentMethod === 'click') paymentMethodText = "Click Up to'lov tizimi";
    if (order.paymentMethod === 'card') paymentMethodText = "Bank kartasi (Uzcard / Humo)";

    let onlinePaymentBox = '';
    if (paymentInfo && paymentInfo.provider === 'payme') {
      onlinePaymentBox = `
        <div class="payment-preview-box" style="border-color: #00cccc;">
          <div class="payment-provider-header">
            <span style="font-weight: 800; color: #00cccc; font-size: 1.1rem;"><i class="fa-solid fa-credit-card"></i> Payme To'lov Shlyuzi</span>
            <span class="order-status-badge status-yangi">Test & Real rejim</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
            Buyurtma: <strong>#${order.id}</strong> · Summa: <strong>${formatPrice(order.totalAmount)}</strong>
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="${paymentInfo.paymeUrl}" target="_blank" class="payment-action-btn payme-btn">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Payme orqali to'lash
            </a>
            <button class="payment-action-btn" id="confirmPaymentBtn" style="background: #10b981; color: #fff;">
              <i class="fa-solid fa-circle-check"></i> To'lovni tasdiqlash (Test)
            </button>
          </div>
        </div>
      `;
    } else if (paymentInfo && paymentInfo.provider === 'click') {
      onlinePaymentBox = `
        <div class="payment-preview-box" style="border-color: #0073ff;">
          <div class="payment-provider-header">
            <span style="font-weight: 800; color: #0073ff; font-size: 1.1rem;"><i class="fa-solid fa-mobile-screen"></i> Click Up To'lov Shlyuzi</span>
            <span class="order-status-badge status-yangi">Test & Real rejim</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
            Buyurtma: <strong>#${order.id}</strong> · Summa: <strong>${formatPrice(order.totalAmount)}</strong>
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="${paymentInfo.clickUrl}" target="_blank" class="payment-action-btn click-btn">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Click orqali to'lash
            </a>
            <button class="payment-action-btn" id="confirmPaymentBtn" style="background: #10b981; color: #fff;">
              <i class="fa-solid fa-circle-check"></i> To'lovni tasdiqlash (Test)
            </button>
          </div>
        </div>
      `;
    }

    receiptBox.innerHTML = `
      <div class="receipt-success-icon">
        <i class="fa-solid fa-check"></i>
      </div>
      <h2 class="receipt-title">Buyurtmangiz qabul qilindi!</h2>
      <div class="receipt-order-id">Buyurtma raqami: #${order.id}</div>
      <p class="receipt-subtitle">
        Hurmatli <strong>${order.customerName}</strong>, xaridingiz uchun tashakkur! Kuryerimiz tez orada <strong>${order.customerPhone}</strong> raqami orqali siz bilan bog'lanadi.
      </p>

      ${onlinePaymentBox}

      <div class="receipt-items-table">
        <div class="receipt-item-row">
          <span>Manzil:</span>
          <span style="font-weight: 700;">${order.customerCity}, ${order.customerAddress}</span>
        </div>
        <div class="receipt-item-row">
          <span>To'lov usuli:</span>
          <span style="font-weight: 700;">${paymentMethodText}</span>
        </div>

        <div style="border-top: 1px solid var(--border-light); margin: 0.5rem 0; padding-top: 0.5rem;">
          <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 0.35rem; color: var(--text-muted);">Mahsulotlar:</div>
          ${order.items.map(item => `
            <div class="receipt-item-row" style="margin-bottom: 0.25rem;">
              <span>${item.name} x ${item.quantity}</span>
              <span style="font-weight: 700;">${formatPrice(item.price * item.quantity)}</span>
            </div>
          `).join('')}
        </div>

        ${order.discountAmount > 0 ? `
          <div class="receipt-item-row" style="color: #10b981; font-weight: 700;">
            <span>Chegirma (${order.appliedCoupon || ''}):</span>
            <span>-${formatPrice(order.discountAmount)}</span>
          </div>
        ` : ''}

        <div class="receipt-item-row">
          <span>Yetkazib berish:</span>
          <span style="color: #10b981; font-weight: 700;">${order.shippingFee === 0 ? 'Bepul' : formatPrice(order.shippingFee)}</span>
        </div>

        <div class="receipt-item-row receipt-total-row">
          <span>Jami to'lov:</span>
          <span>${formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap;">
        <button class="hero-btn" id="printReceiptBtn" style="background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-light);">
          <i class="fa-solid fa-print"></i> Chekni chop etish
        </button>
        <button class="hero-btn" id="trackThisOrderBtn" style="background: #ede9fe; color: #6d28d9; border: none;">
          <i class="fa-solid fa-truck-fast"></i> Buyurtmani kuzatish
        </button>
        <button class="hero-btn" id="continueShoppingBtn" style="background: var(--primary); color: #ffffff;">
          Xaridni davom ettirish
        </button>
      </div>
    `;

    document.getElementById('printReceiptBtn')?.addEventListener('click', () => window.print());
    document.getElementById('continueShoppingBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('trackThisOrderBtn')?.addEventListener('click', () => {
      closeAllModals();
      openOrderTracking(order.id);
    });

    document.getElementById('confirmPaymentBtn')?.addEventListener('click', async () => {
      showToast("To'lov muvaffaqiyatli tasdiqlandi! Buyurtma holati yangilandi.", "success");
      try {
        await api.updateOrderStatus(order.id, 'yigilmoqda', "To'lov qabul qilindi");
      } catch (e) {}
    });

    openModal(successModal);
  }

  // ==========================================
  // 17. Buyurtmani Jonli Kuzatish (Tracking)
  // ==========================================
  async function openOrderTracking(prefillId = '') {
    const trackInput = document.getElementById('trackInput');
    const resultBox = document.getElementById('trackingResultBox');
    if (trackInput && prefillId) {
      trackInput.value = prefillId;
    }
    if (resultBox) resultBox.innerHTML = '';

    openModal(orderTrackingModal);

    if (prefillId) {
      doTrackOrder(prefillId);
    }
  }

  async function doTrackOrder(orderId) {
    const resultBox = document.getElementById('trackingResultBox');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i>
        <p style="margin-top: 0.5rem; color: var(--text-muted);">Buyurtma ma'lumotlari qidirilmoqda...</p>
      </div>
    `;

    try {
      const data = await api.trackOrder(orderId);

      const statusBadges = {
        'yangi': '<span class="order-status-badge status-yangi"><i class="fa-solid fa-clock"></i> Qabul qilindi</span>',
        'yigilmoqda': '<span class="order-status-badge status-yigilmoqda"><i class="fa-solid fa-box"></i> Omborda yig\'ilmoqda</span>',
        'yetkazilmoqda': '<span class="order-status-badge status-yetkazilmoqda"><i class="fa-solid fa-truck-fast"></i> Kuryer yetkazmoqda</span>',
        'yetkazildi': '<span class="order-status-badge status-yetkazildi"><i class="fa-solid fa-circle-check"></i> Yetkazib berildi</span>',
        'bekor': '<span class="order-status-badge status-bekor"><i class="fa-solid fa-ban"></i> Bekor qilingan</span>'
      };

      resultBox.innerHTML = `
        <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-light); margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 1.15rem; color: var(--primary);">#${data.orderId}</span>
            ${statusBadges[data.status] || ''}
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            Qabul qiluvchi: <strong>${data.customerName}</strong><br>
            Manzil: <strong>${data.customerCity}, ${data.customerAddress}</strong><br>
            Jami summa: <strong>${formatPrice(data.totalAmount)}</strong> (${data.items?.length || 1} ta tovar)
          </div>
        </div>

        <div class="track-stepper">
          ${data.timeline.map(step => `
            <div class="track-step ${step.completed ? 'done' : ''} ${step.current ? 'current' : ''}">
              <div class="track-step-dot">
                <i class="${step.icon}"></i>
              </div>
              <div class="track-step-title">${step.label}</div>
              <div class="track-step-desc">${step.desc}</div>
              ${step.timestamp ? `<div class="track-step-time">${new Date(step.timestamp).toLocaleString('uz-UZ')}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      resultBox.innerHTML = `
        <div style="background: #fee2e2; border: 1px solid #f87171; color: #b91c1c; padding: 1.25rem; border-radius: var(--radius-xl); text-align: center;">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 1.8rem; margin-bottom: 0.5rem;"></i>
          <div style="font-weight: 800; font-size: 1rem;">Buyurtma topilmadi</div>
          <div style="font-size: 0.85rem; margin-top: 0.25rem;">${err.message}</div>
        </div>
      `;
    }
  }

  const trackOrderForm = document.getElementById('trackOrderForm');
  if (trackOrderForm) {
    trackOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('trackInput').value.trim();
      if (val) doTrackOrder(val);
    });
  }

  if (openTrackOrderBtn) {
    openTrackOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openOrderTracking();
    });
  }

  // ==========================================
  // 18. Auth Modal (Login / Register)
  // ==========================================
  function openAuth() {
    if (state.currentUser) {
      openUserCabinet();
    } else {
      openModal(authModal);
    }
  }

  if (openAuthBtn) openAuthBtn.addEventListener('click', openAuth);
  if (openAuthMobile) openAuthMobile.addEventListener('click', openAuth);

  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authModalTitle = document.getElementById('authModalTitle');

  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
      if (authModalTitle) authModalTitle.textContent = "Bozorix hisobiga kirish";
    });

    tabRegisterBtn.addEventListener('click', () => {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      if (registerForm) registerForm.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
      if (authModalTitle) authModalTitle.textContent = "Yangi hisob yaratish";
    });
  }

  // Tezkor demo kirish tugmalari
  document.getElementById('quickLoginAdmin')?.addEventListener('click', async () => {
    try {
      const res = await api.login('admin@bozorix.uz', 'admin123');
      state.currentUser = res.user;
      state.token = res.token;
      safeSetStorage('bozorix_user', res.user);
      safeSetStorage('bozorix_token', res.token);
      updateAuthUI();
      closeAllModals();
      showToast("👑 Xush kelibsiz, Admin!", "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  });

  document.getElementById('quickLoginClient')?.addEventListener('click', async () => {
    try {
      const res = await api.login('xaridor@bozorix.uz', 'xaridor123');
      state.currentUser = res.user;
      state.token = res.token;
      safeSetStorage('bozorix_user', res.user);
      safeSetStorage('bozorix_token', res.token);
      updateAuthUI();
      closeAllModals();
      showToast(`👤 Xush kelibsiz, ${res.user.name}!`, "success");
    } catch (e) {
      showToast(e.message, "error");
    }
  });

  // Parol ko'rsatish/yashirish
  document.getElementById('toggleLoginPass')?.addEventListener('click', () => {
    const input = document.getElementById('loginPassword');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  });

  // Login form submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const login = document.getElementById('loginAccount').value.trim();
      const pass = document.getElementById('loginPassword').value;

      try {
        const res = await api.login(login, pass);
        state.currentUser = res.user;
        state.token = res.token;
        safeSetStorage('bozorix_user', res.user);
        safeSetStorage('bozorix_token', res.token);
        updateAuthUI();
        closeAllModals();
        showToast(res.message, "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Register form submit
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;

      try {
        const res = await api.register({ name, phone, email, password });
        state.currentUser = res.user;
        state.token = res.token;
        safeSetStorage('bozorix_user', res.user);
        safeSetStorage('bozorix_token', res.token);
        updateAuthUI();
        closeAllModals();
        showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // ==========================================
  // 19. Shaxsiy Kabinet (User Cabinet)
  // ==========================================
  async function openUserCabinet() {
    if (!state.currentUser) {
      openAuth();
      return;
    }

    const u = state.currentUser;
    document.getElementById('cabAvatarLetter').textContent = (u.name[0] || 'U').toUpperCase();
    document.getElementById('cabUserName').textContent = u.name;
    document.getElementById('cabUserEmail').textContent = u.email;
    document.getElementById('cabUserPhone').textContent = u.phone;
    document.getElementById('cabUserRole').textContent = u.role === 'admin' ? 'Boshqaruvchi (Admin)' : 'Xaridor';

    // Profil formani to'ldirish
    const cabEditName = document.getElementById('cabEditName');
    const cabEditPhone = document.getElementById('cabEditPhone');
    const cabEditCity = document.getElementById('cabEditCity');
    const cabEditAddress = document.getElementById('cabEditAddress');
    if (cabEditName) cabEditName.value = u.name || '';
    if (cabEditPhone) cabEditPhone.value = u.phone || '';
    if (cabEditCity) cabEditCity.value = u.city || 'Toshkent shahri';
    if (cabEditAddress) cabEditAddress.value = u.address || '';

    // Buyurtmalar tarixini yuklash
    renderUserOrders();

    openModal(userCabinetModal);
  }

  async function renderUserOrders() {
    const listEl = document.getElementById('cabOrdersList');
    if (!listEl) return;

    listEl.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">Buyurtmalar yuklanmoqda...</p>
      </div>
    `;

    try {
      const data = await api.getMe();
      const orders = data.orders || [];

      if (orders.length === 0) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem;">
            <i class="fa-solid fa-box-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 0.75rem;"></i>
            <h4 style="font-weight: 800; font-size: 1.1rem; color: var(--text-main);">Sizda hali buyurtmalar yo'q</h4>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">Do'konimizdan birinchi xaridingizni amalga oshiring!</p>
          </div>
        `;
        return;
      }

      const statusMap = {
        'yangi': '<span class="order-status-badge status-yangi"><i class="fa-solid fa-clock"></i> Qabul qilindi</span>',
        'yigilmoqda': '<span class="order-status-badge status-yigilmoqda"><i class="fa-solid fa-box"></i> Omborda yig\'ilmoqda</span>',
        'yetkazilmoqda': '<span class="order-status-badge status-yetkazilmoqda"><i class="fa-solid fa-truck-fast"></i> Kuryer yo\'lda</span>',
        'yetkazildi': '<span class="order-status-badge status-yetkazildi"><i class="fa-solid fa-circle-check"></i> Yetkazildi</span>',
        'bekor': '<span class="order-status-badge status-bekor"><i class="fa-solid fa-ban"></i> Bekor qilingan</span>'
      };

      listEl.innerHTML = orders.map(o => `
        <div class="order-card">
          <div class="order-card-header">
            <div>
              <span style="font-weight: 900; color: var(--primary); font-size: 1rem;">#${o.id}</span>
              <span style="font-size: 0.775rem; color: var(--text-muted); margin-left: 0.5rem;">${new Date(o.createdAt).toLocaleDateString('uz-UZ')}</span>
            </div>
            ${statusMap[o.status] || ''}
          </div>

          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
            ${(o.items || []).map(i => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
                <span>• ${i.name} x ${i.quantity}</span>
                <span style="font-weight: 700;">${formatPrice(i.price * i.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-light); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">
              Jami: <span style="color: var(--primary);">${formatPrice(o.totalAmount)}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="hero-btn btn-track-order" data-id="${o.id}" style="background: #ede9fe; color: #6d28d9; border: none; padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                <i class="fa-solid fa-truck-fast"></i> Kuzatish
              </button>
              <button class="hero-btn btn-view-receipt" data-id="${o.id}" style="background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-light); padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                <i class="fa-solid fa-receipt"></i> Chek
              </button>
            </div>
          </div>
        </div>
      `).join('');

      listEl.querySelectorAll('.btn-track-order').forEach(btn => {
        btn.addEventListener('click', () => {
          closeAllModals();
          openOrderTracking(btn.dataset.id);
        });
      });

      listEl.querySelectorAll('.btn-view-receipt').forEach(btn => {
        btn.addEventListener('click', () => {
          const ord = orders.find(o => o.id === btn.dataset.id);
          if (ord) showReceiptModal(ord);
        });
      });

    } catch (err) {
      listEl.innerHTML = `<p style="color: #ef4444; font-size: 0.85rem;">Xatolik: ${err.message}</p>`;
    }
  }

  // Cabinet Tabs
  const cabTabOrdersBtn = document.getElementById('cabTabOrdersBtn');
  const cabTabProfileBtn = document.getElementById('cabTabProfileBtn');
  const cabOrdersSection = document.getElementById('cabOrdersSection');
  const cabProfileSection = document.getElementById('cabProfileSection');

  if (cabTabOrdersBtn && cabTabProfileBtn) {
    cabTabOrdersBtn.addEventListener('click', () => {
      cabTabOrdersBtn.classList.add('active');
      cabTabProfileBtn.classList.remove('active');
      if (cabOrdersSection) cabOrdersSection.style.display = 'block';
      if (cabProfileSection) cabProfileSection.style.display = 'none';
      renderUserOrders();
    });

    cabTabProfileBtn.addEventListener('click', () => {
      cabTabProfileBtn.classList.add('active');
      cabTabOrdersBtn.classList.remove('active');
      if (cabProfileSection) cabProfileSection.style.display = 'block';
      if (cabOrdersSection) cabOrdersSection.style.display = 'none';
    });
  }

  // Profil tahrirlash formasi
  const cabProfileForm = document.getElementById('cabProfileForm');
  if (cabProfileForm) {
    cabProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('cabEditName').value.trim();
      const phone = document.getElementById('cabEditPhone').value.trim();
      const city = document.getElementById('cabEditCity').value.trim();
      const address = document.getElementById('cabEditAddress').value.trim();
      const newPass = document.getElementById('cabEditPass').value;

      try {
        const payload = { name, phone, city, address };
        if (newPass && newPass.length >= 6) payload.newPassword = newPass;

        const res = await api.updateProfile(payload);
        state.currentUser = res.user;
        safeSetStorage('bozorix_user', res.user);
        updateAuthUI();
        showToast("Ma'lumotlaringiz saqlandi!", "success");
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // Chiqish (Logout)
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    state.currentUser = null;
    state.token = null;
    localStorage.removeItem('bozorix_user');
    localStorage.removeItem('bozorix_token');
    updateAuthUI();
    closeAllModals();
    showToast("Tizimdan muvaffaqiyatli chiqdingiz", "info");
  });

  // ==========================================
  // 20. Admin Panel (Dashboard & Boshqaruv)
  // ==========================================
  function openAdminPanel() {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
      showToast("Faqat admin ruxsatiga ega foydalanuvchilar kira oladi!", "warning");
      openAuth();
      return;
    }
    renderAdminStats();
    openModal(adminModal);
  }

  if (adminPanelBtn) adminPanelBtn.addEventListener('click', openAdminPanel);

  const admTabStatsBtn = document.getElementById('admTabStatsBtn');
  const admTabProductsBtn = document.getElementById('admTabProductsBtn');
  const admTabOrdersBtn = document.getElementById('admTabOrdersBtn');
  const admTabCouponsBtn = document.getElementById('admTabCouponsBtn');
  const admTabUsersBtn = document.getElementById('admTabUsersBtn');
  const adminContentArea = document.getElementById('adminContentArea');

  function setAdminTab(activeBtn) {
    [admTabStatsBtn, admTabProductsBtn, admTabOrdersBtn, admTabCouponsBtn, admTabUsersBtn].forEach(b => {
      if (b) b.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
  }

  if (admTabStatsBtn) admTabStatsBtn.addEventListener('click', () => { setAdminTab(admTabStatsBtn); renderAdminStats(); });
  if (admTabProductsBtn) admTabProductsBtn.addEventListener('click', () => { setAdminTab(admTabProductsBtn); renderAdminProducts(); });
  if (admTabOrdersBtn) admTabOrdersBtn.addEventListener('click', () => { setAdminTab(admTabOrdersBtn); renderAdminOrders(); });
  if (admTabCouponsBtn) admTabCouponsBtn.addEventListener('click', () => { setAdminTab(admTabCouponsBtn); renderAdminCoupons(); });
  if (admTabUsersBtn) admTabUsersBtn.addEventListener('click', () => { setAdminTab(admTabUsersBtn); renderAdminUsers(); });

  // 1-Tab: Statistika
  async function renderAdminStats() {
    if (!adminContentArea) return;
    adminContentArea.innerHTML = `<div style="text-align: center; padding: 2rem;"><i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--primary);"></i></div>`;

    try {
      const stats = await api.getAdminStats();

      adminContentArea.innerHTML = `
        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div class="admin-stat-icon" style="background: rgba(16,185,129,0.15); color: #10b981;">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <div>
              <div class="admin-stat-val">${formatPrice(stats.totalRevenue)}</div>
              <div class="admin-stat-lbl">Jami Tushum</div>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="admin-stat-icon" style="background: rgba(37,99,235,0.15); color: var(--primary);">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <div class="admin-stat-val">${stats.totalOrders} ta</div>
              <div class="admin-stat-lbl">Jami Buyurtmalar</div>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="admin-stat-icon" style="background: rgba(139,92,246,0.15); color: #8b5cf6;">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <div class="admin-stat-val">${stats.totalCustomers} nafar</div>
              <div class="admin-stat-lbl">Mijozlar Soni</div>
            </div>
          </div>

          <div class="admin-stat-card">
            <div class="admin-stat-icon" style="background: rgba(245,158,11,0.15); color: #f59e0b;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <div class="admin-stat-val">${stats.lowStockCount} ta</div>
              <div class="admin-stat-lbl">Kam qolgan tovarlar</div>
            </div>
          </div>
        </div>

        <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--border-light);">
          <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 0.85rem; color: var(--text-main);">
            <i class="fa-solid fa-clock-rotate-left"></i> Oxirgi kelib tushgan buyurtmalar
          </h4>
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mijoz</th>
                  <th>Telefon</th>
                  <th>Summa</th>
                  <th>To'lov</th>
                  <th>Holati</th>
                </tr>
              </thead>
              <tbody>
                ${(stats.recentOrders || []).map(o => `
                  <tr>
                    <td style="font-weight: 800; color: var(--primary);">#${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>${o.customerPhone}</td>
                    <td style="font-weight: 700;">${formatPrice(o.totalAmount)}</td>
                    <td>${o.paymentMethod.toUpperCase()}</td>
                    <td><span class="order-status-badge status-${o.status}">${o.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (e) {
      adminContentArea.innerHTML = `<p style="color: red;">Xatolik: ${e.message}</p>`;
    }
  }

  // 2-Tab: Mahsulotlar (CRUD)
  async function renderAdminProducts() {
    if (!adminContentArea) return;
    const prods = await api.getProducts();

    adminContentArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-main);">Do'kondagi mahsulotlar (${prods.length} ta)</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0;">Yangi tovar qo'shish, tahrirlash va o'chirish</p>
        </div>
        <button class="hero-btn" id="admAddNewProdBtn" style="background: var(--primary); color: #fff;">
          <i class="fa-solid fa-plus"></i> Yangi mahsulot qo'shish
        </button>
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rasm</th>
              <th>Nomi</th>
              <th>Toifasi</th>
              <th>Narxi</th>
              <th>Qoldiq</th>
              <th>Nishon</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${prods.map(p => `
              <tr>
                <td>#${p.id}</td>
                <td><img src="${p.image}" style="width: 36px; height: 36px; object-fit: contain; background: #fff; border-radius: 4px; padding: 2px;" alt="${p.name}"></td>
                <td style="font-weight: 700; max-width: 220px;">${p.name}</td>
                <td>${p.categoryName || p.category}</td>
                <td style="font-weight: 800; color: var(--primary);">${formatPrice(p.price)}</td>
                <td><span style="font-weight: 800; color: ${(p.stockCount || 0) <= 5 ? '#ef4444' : '#10b981'};">${p.stockCount || 0} ta</span></td>
                <td><span class="product-badge badge-hit" style="font-size: 0.65rem;">${p.badge || 'HIT'}</span></td>
                <td>
                  <div style="display: flex; gap: 0.35rem;">
                    <button class="hero-btn adm-edit-prod-btn" data-id="${p.id}" style="background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border-light); padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="hero-btn adm-del-prod-btn" data-id="${p.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Mahsulot qo'shish / tahrirlash shakli konteyneri -->
      <div id="admProductFormModalWrap"></div>
    `;

    document.getElementById('admAddNewProdBtn')?.addEventListener('click', () => openProductEditor());

    adminContentArea.querySelectorAll('.adm-edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = prods.find(p => p.id === Number(btn.dataset.id));
        if (prod) openProductEditor(prod);
      });
    });

    adminContentArea.querySelectorAll('.adm-del-prod-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.id);
        if (confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
          try {
            await api.deleteProduct(id);
            showToast("Mahsulot o'chirildi", "info");
            await loadProducts();
            renderAdminProducts();
          } catch (e) {
            showToast(e.message, "error");
          }
        }
      });
    });
  }

  function openProductEditor(prod = null) {
    const wrap = document.getElementById('admProductFormModalWrap');
    if (!wrap) return;

    wrap.innerHTML = `
      <div style="background: var(--bg-card); border: 2px solid var(--primary); border-radius: var(--radius-xl); padding: 1.5rem; margin-top: 1.5rem; box-shadow: var(--shadow-card);">
        <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-main);">
          ${prod ? `Mahsulotni tahrirlash (#${prod.id})` : "Yangi mahsulot qo'shish"}
        </h4>
        <form id="admSaveProdForm">
          <input type="hidden" id="prodEditId" value="${prod ? prod.id : ''}">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label>Mahsulot nomi *</label>
              <input type="text" id="prodEditName" class="form-input" value="${prod ? prod.name : ''}" required>
            </div>
            <div class="form-group">
              <label>Kategoriya *</label>
              <select id="prodEditCategory" class="form-select">
                <option value="smartphones" ${prod && prod.category === 'smartphones' ? 'selected' : ''}>Smartfonlar</option>
                <option value="laptops" ${prod && prod.category === 'laptops' ? 'selected' : ''}>Noutbuklar & PC</option>
                <option value="audio" ${prod && prod.category === 'audio' ? 'selected' : ''}>Audio & Quloqchinlar</option>
                <option value="wearables" ${prod && prod.category === 'wearables' ? 'selected' : ''}>Aqlli soatlar</option>
                <option value="home-appliances" ${prod && prod.category === 'home-appliances' ? 'selected' : ''}>Maishiy texnika</option>
                <option value="gaming" ${prod && prod.category === 'gaming' ? 'selected' : ''}>Geyming & Konsol</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label>Narxi (so'mda) *</label>
              <input type="number" id="prodEditPrice" class="form-input" value="${prod ? prod.price : ''}" required>
            </div>
            <div class="form-group">
              <label>Eski narxi (ixtiyoriy)</label>
              <input type="number" id="prodEditOldPrice" class="form-input" value="${prod && prod.oldPrice ? prod.oldPrice : ''}">
            </div>
            <div class="form-group">
              <label>Ombordagi soni</label>
              <input type="number" id="prodEditStock" class="form-input" value="${prod ? prod.stockCount : 10}">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div class="form-group">
              <label>Rasm URL (yoki assets/products/...)</label>
              <input type="text" id="prodEditImg" class="form-input" value="${prod ? prod.image : 'assets/products/iphone-15-pro.svg'}">
            </div>
            <div class="form-group">
              <label>Nishon (Badge)</label>
              <select id="prodEditBadge" class="form-select">
                <option value="HIT" ${prod && prod.badge === 'HIT' ? 'selected' : ''}>HIT</option>
                <option value="YANGI" ${prod && prod.badge === 'YANGI' ? 'selected' : ''}>YANGI</option>
                <option value="CHEGIRMA" ${prod && prod.badge === 'CHEGIRMA' ? 'selected' : ''}>CHEGIRMA</option>
                <option value="TAVSIYA" ${prod && prod.badge === 'TAVSIYA' ? 'selected' : ''}>TAVSIYA</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label>Mahsulot tavsifi</label>
            <textarea id="prodEditDesc" class="form-textarea" style="height: 65px;">${prod ? prod.description : ''}</textarea>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button type="submit" class="hero-btn" style="background: var(--primary); color: #fff;">
              <i class="fa-solid fa-floppy-disk"></i> Saqlash
            </button>
            <button type="button" id="cancelProdEditBtn" class="hero-btn" style="background: #f1f5f9; color: var(--text-main);">
              Bekor qilish
            </button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('cancelProdEditBtn')?.addEventListener('click', () => { wrap.innerHTML = ''; });

    document.getElementById('admSaveProdForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('prodEditId').value;
      const catSelect = document.getElementById('prodEditCategory');
      const catName = catSelect.options[catSelect.selectedIndex].text;

      const payload = {
        name: document.getElementById('prodEditName').value.trim(),
        category: catSelect.value,
        categoryName: catName,
        price: Number(document.getElementById('prodEditPrice').value),
        oldPrice: Number(document.getElementById('prodEditOldPrice').value) || null,
        stockCount: Number(document.getElementById('prodEditStock').value) || 10,
        image: document.getElementById('prodEditImg').value.trim() || 'assets/products/iphone-15-pro.svg',
        badge: document.getElementById('prodEditBadge').value,
        description: document.getElementById('prodEditDesc').value.trim()
      };
      if (id) payload.id = Number(id);

      try {
        await api.saveProduct(payload);
        showToast("Mahsulot muvaffaqiyatli saqlandi!", "success");
        await loadProducts();
        renderAdminProducts();
      } catch (err) {
        showToast(err.message, "error");
      }
    });
  }

  // 3-Tab: Buyurtmalar Nazorati
  async function renderAdminOrders() {
    if (!adminContentArea) return;
    const orders = await api.getOrders();

    adminContentArea.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-main);">Buyurtmalar ro'yxati (${orders.length} ta)</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0;">Holatni o'zgartirish mijoz kabinetida va kuzatuvda darhol aks etadi</p>
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mijoz</th>
              <th>Telefon & Manzil</th>
              <th>Tovarlar</th>
              <th>Summa</th>
              <th>To'lov</th>
              <th>Holatni o'zgartirish</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td style="font-weight: 800; color: var(--primary);">#${o.id}</td>
                <td style="font-weight: 700;">${o.customerName}</td>
                <td style="font-size: 0.8rem;">
                  <div>${o.customerPhone}</div>
                  <div style="color: var(--text-muted);">${o.customerCity}, ${o.customerAddress}</div>
                </td>
                <td style="font-size: 0.8rem;">
                  ${(o.items || []).map(i => `${i.name} (x${i.quantity})`).join(', ')}
                </td>
                <td style="font-weight: 800;">${formatPrice(o.totalAmount)}</td>
                <td><span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">${o.paymentMethod}</span></td>
                <td>
                  <select class="form-select adm-status-select" data-id="${o.id}" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; font-weight: 700;">
                    <option value="yangi" ${o.status === 'yangi' ? 'selected' : ''}>🟡 Yangi qabul qilindi</option>
                    <option value="yigilmoqda" ${o.status === 'yigilmoqda' ? 'selected' : ''}>🔵 Omborda yig'ilmoqda</option>
                    <option value="yetkazilmoqda" ${o.status === 'yetkazilmoqda' ? 'selected' : ''}>🟣 Kuryer yo'lda</option>
                    <option value="yetkazildi" ${o.status === 'yetkazildi' ? 'selected' : ''}>🟢 Yetkazib berildi</option>
                    <option value="bekor" ${o.status === 'bekor' ? 'selected' : ''}>🔴 Bekor qilindi</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    adminContentArea.querySelectorAll('.adm-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const orderId = sel.dataset.id;
        const newStatus = sel.value;
        try {
          await api.updateOrderStatus(orderId, newStatus);
          showToast(`Buyurtma #${orderId} holati "${newStatus}" ga o'zgartirildi!`, "success");
        } catch (e) {
          showToast(e.message, "error");
        }
      });
    });
  }

  // 4-Tab: Promokodlar
  async function renderAdminCoupons() {
    if (!adminContentArea) return;
    const coupons = await api.getCoupons();

    adminContentArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-main);">Chegirma Promokodlari</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0;">Yangi kupon yaratish va boshqarish</p>
        </div>
      </div>

      <!-- Yangi kupon formasi -->
      <form id="admAddCouponForm" style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-xl); border: 1px solid var(--border-light); flex-wrap: wrap;">
        <input type="text" id="admNewCoupCode" class="form-input" placeholder="Promokod (masalan: BAHOR25)" required style="flex: 1; min-width: 160px; font-weight: 800;">
        <input type="number" id="admNewCoupDiscount" class="form-input" placeholder="Chegirma % (masalan: 25)" required min="1" max="90" style="width: 140px;">
        <input type="text" id="admNewCoupDesc" class="form-input" placeholder="Tavsif (ixtiyoriy)" style="flex: 1.5; min-width: 180px;">
        <button type="submit" class="hero-btn" style="background: var(--primary); color: #fff; white-space: nowrap;">
          <i class="fa-solid fa-plus"></i> Kupon qo'shish
        </button>
      </form>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Chegirma foizi</th>
              <th>Tavsif</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            ${coupons.map(c => `
              <tr>
                <td style="font-weight: 900; color: var(--primary); font-size: 1rem;"><i class="fa-solid fa-tag"></i> ${c.code}</td>
                <td style="font-weight: 800; color: #10b981;">-${c.discount}%</td>
                <td>${c.description || '-'}</td>
                <td><span class="order-status-badge status-yetkazildi">Faol</span></td>
                <td>
                  <button class="hero-btn adm-del-coupon-btn" data-code="${c.code}" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                    <i class="fa-solid fa-trash-can"></i> O'chirish
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('admAddCouponForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('admNewCoupCode').value.trim();
      const discount = document.getElementById('admNewCoupDiscount').value;
      const desc = document.getElementById('admNewCoupDesc').value.trim();

      try {
        await api.saveCoupon({ code, discount, description: desc });
        showToast(`"${code}" promokodi muvaffaqiyatli saqlandi!`, "success");
        renderAdminCoupons();
      } catch (err) {
        showToast(err.message, "error");
      }
    });

    adminContentArea.querySelectorAll('.adm-del-coupon-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const code = btn.dataset.code;
        if (confirm(`"${code}" promokodini o'chirmoqchimisiz?`)) {
          try {
            await api.deleteCoupon(code);
            showToast("Promokod o'chirildi", "info");
            renderAdminCoupons();
          } catch (e) {
            showToast(e.message, "error");
          }
        }
      });
    });
  }

  // 5-Tab: Ro'yxatdan o'tgan mijozlar
  async function renderAdminUsers() {
    if (!adminContentArea) return;
    const users = await api.getAdminUsers();

    adminContentArea.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: var(--text-main);">Foydalanuvchilar va Mijozlar (${users.length} nafar)</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0;">Ro'yxatdan o'tgan barcha mijozlar statistikasi</p>
      </div>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mijoz</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Roli</th>
              <th>Buyurtmalar</th>
              <th>Jami xarid</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>#${u.id}</td>
                <td style="font-weight: 800;">${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td>
                  <span class="order-status-badge ${u.role === 'admin' ? 'status-yangi' : 'status-yetkazilmoqda'}">
                    ${u.role === 'admin' ? '👑 Admin' : '👤 Mijoz'}
                  </span>
                </td>
                <td style="font-weight: 700;">${u.ordersCount || 0} ta</td>
                <td style="font-weight: 800; color: var(--primary);">${formatPrice(u.totalSpent || 0)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // 21. Yetkazib Berish va Kafolat Modali
  // ==========================================
  if (openDeliveryInfoBtn) {
    openDeliveryInfoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(deliveryModal);
    });
  }

  // ==========================================
  // 22. Qidiruv, Filtrlar va Boshqa Hodisalar
  // ==========================================
  // Qidiruv
  let searchDebounce = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) {
        if (val.length > 0) searchClearBtn.classList.add('active');
        else searchClearBtn.classList.remove('active');
      }
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = val;
        renderCatalog();
      }, 250);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const catalogEl = document.getElementById('catalogSection');
        if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchClearBtn.classList.remove('active');
      state.searchQuery = '';
      renderCatalog();
    });
  }

  // Narx slayderi
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      if (priceInputMax) priceInputMax.value = new Intl.NumberFormat('uz-UZ').format(state.maxPrice);
      renderCatalog();
    });
  }

  // Saralash
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCatalog();
    });
  }

  // Toifa tanlash (Gorizontal pills & Sidebar)
  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.cat-pill');
    if (pill && pill.dataset.cat) {
      state.activeCategory = pill.dataset.cat;
      renderCategories();
      renderCatalog();
      const catalogEl = document.getElementById('catalogSection');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const catItem = e.target.closest('.category-filter-item');
    if (catItem && catItem.dataset.cat) {
      state.activeCategory = catItem.dataset.cat;
      renderCategories();
      renderCatalog();
      return;
    }

    const catCard = e.target.closest('.category-card');
    if (catCard && catCard.dataset.category) {
      state.activeCategory = catCard.dataset.category;
      renderCategories();
      renderCatalog();
      const catalogEl = document.getElementById('catalogSection');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
  });

  // Nishonlar filtri
  document.querySelectorAll('.checkbox-filter-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      state.selectedBadges = Array.from(document.querySelectorAll('.checkbox-filter-list input[type="checkbox"]:checked')).map(c => c.value);
      renderCatalog();
    });
  });

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Ko'rinish rejimi (Grid / List)
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      renderCatalog();
    });
    viewListBtn.addEventListener('click', () => {
      state.viewMode = 'list';
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      renderCatalog();
    });
  }

  // Mahsulot kartochkasi amallari (Delegatsiya)
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      // 1. Savatga qo'shish
      const addBtn = e.target.closest('.btn-add-cart');
      if (addBtn) {
        e.stopPropagation();
        addToCart(Number(addBtn.dataset.id));
        return;
      }

      // 2. Kartadagi hisoblagichlar (+ / -)
      const incBtn = e.target.closest('.btn-inc');
      if (incBtn) {
        e.stopPropagation();
        updateCartQuantity(Number(incBtn.dataset.id), 1);
        return;
      }
      const decBtn = e.target.closest('.btn-dec');
      if (decBtn) {
        e.stopPropagation();
        updateCartQuantity(Number(decBtn.dataset.id), -1);
        return;
      }

      // 3. Sevimlilar
      const wishBtn = e.target.closest('.btn-wishlist');
      if (wishBtn) {
        e.stopPropagation();
        toggleWishlist(Number(wishBtn.dataset.id));
        return;
      }

      // 4. Tezkor xarid
      const buyFastBtn = e.target.closest('.btn-buy-fast');
      if (buyFastBtn) {
        e.stopPropagation();
        openFastBuy(Number(buyFastBtn.dataset.id));
        return;
      }

      // 5. Batafsil ko'rish (Quick View)
      const qvBtn = e.target.closest('.btn-quickview');
      if (qvBtn) {
        e.stopPropagation();
        openQuickView(Number(qvBtn.dataset.id));
        return;
      }

      // 6. Ovozli eshitish
      const speakBtn = e.target.closest('.btn-speak-product');
      if (speakBtn) {
        e.stopPropagation();
        const prodId = Number(speakBtn.dataset.id);
        const prod = state.products.find(p => p.id === prodId);
        if (prod) {
          const loc = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(prod, state.lang) : prod;
          const speech = `${loc.name}. ${formatPrice(prod.price, state.lang)}. ${prod.inStock ? t('in_stock', state.lang) : t('out_of_stock', state.lang)}. ${loc.description}`;
          const utterance = new SpeechSynthesisUtterance(speech);
          utterance.lang = state.lang === 'ru' ? 'ru-RU' : state.lang === 'en' ? 'en-US' : 'uz-UZ';
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
          showToast(loc.name, 'info');
        }
        return;
      }

      const qvImg = e.target.closest('[data-action="quickview"]');
      if (qvImg) {
        openQuickView(Number(qvImg.dataset.id));
        return;
      }
    });
  }

  // Header tugmalari
  const openCartBtn = document.getElementById('openCartBtn');
  const openCartMobile = document.getElementById('openCartMobile');
  const openWishBtn = document.getElementById('openWishBtn');
  const openWishMobile = document.getElementById('openWishMobile');

  if (openCartBtn) openCartBtn.addEventListener('click', () => { renderCartDrawer(); openModal(cartDrawer); });
  if (openCartMobile) openCartMobile.addEventListener('click', () => { renderCartDrawer(); openModal(cartDrawer); });
  if (openWishBtn) openWishBtn.addEventListener('click', () => { renderWishlistDrawer(); openModal(wishlistDrawer); });
  if (openWishMobile) openWishMobile.addEventListener('click', () => { renderWishlistDrawer(); openModal(wishlistDrawer); });
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

  // Accessibility & Ovoz tugmalari
  if (openA11yBtn) openA11yBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(a11yModal); });
  if (floatingA11yBtn) floatingA11yBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(a11yModal); });
  if (quickVoiceBtn) quickVoiceBtn.addEventListener('click', (e) => { e.preventDefault(); toggleVoiceReader(); });
  if (a11yVoiceToggle) a11yVoiceToggle.addEventListener('click', () => toggleVoiceReader());
  if (a11yReadPageBtn) a11yReadPageBtn.addEventListener('click', readPageSummary);
  if (a11yStopVoiceBtn) a11yStopVoiceBtn.addEventListener('click', stopSpeaking);
  if (a11yResetBtn) a11yResetBtn.addEventListener('click', resetA11ySettings);

  // Shrift o'lchami tugmalari
  document.querySelectorAll('.a11y-opt-btn[data-font]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.a11y.fontSize = btn.getAttribute('data-font');
      applyA11ySettings();
      announceA11y(`Shrift o'lchami ${btn.innerText} ga o'zgartirildi`);
    });
  });

  // Kontrast tugmalari
  document.querySelectorAll('.a11y-opt-btn[data-contrast]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.a11y.contrast = btn.getAttribute('data-contrast');
      applyA11ySettings();
      announceA11y(`Kontrast rejimi: ${btn.innerText}`);
    });
  });

  // Qo'shimcha A11y toggle tugmalari
  if (a11yReadableFontToggle) a11yReadableFontToggle.addEventListener('click', () => {
    state.a11y.readableFont = !state.a11y.readableFont;
    applyA11ySettings();
  });
  if (a11yHighlightLinksToggle) a11yHighlightLinksToggle.addEventListener('click', () => {
    state.a11y.highlightLinks = !state.a11y.highlightLinks;
    applyA11ySettings();
  });
  if (a11yBigCursorToggle) a11yBigCursorToggle.addEventListener('click', () => {
    state.a11y.bigCursor = !state.a11y.bigCursor;
    applyA11ySettings();
  });
  if (a11yReduceMotionToggle) a11yReduceMotionToggle.addEventListener('click', () => {
    state.a11y.reduceMotion = !state.a11y.reduceMotion;
    applyA11ySettings();
  });

  // Til tanlash
  if (langSelect) {
    langSelect.value = state.lang || 'uz';
    langSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Ko'zi zaiflar uchun sichqoncha yoki Tab bilan borganda ovoz chiqarish
  document.addEventListener('mouseover', (e) => {
    if (!state.a11y || !state.a11y.speechEnabled) return;
    handleA11ySpeakEvent(e.target);
  });

  document.addEventListener('focusin', (e) => {
    if (!state.a11y || !state.a11y.speechEnabled) return;
    handleA11ySpeakEvent(e.target);
  });

  function handleA11ySpeakEvent(target) {
    if (!target) return;
    clearTimeout(voiceHoverTimer);
    voiceHoverTimer = setTimeout(() => {
      const card = target.closest('.product-card');
      if (card && (target === card || target.closest('.product-card-body') || target.closest('.product-card-title'))) {
        const prodId = parseInt(card.getAttribute('data-id'));
        const prod = state.products.find(p => p.id === prodId);
        if (prod) {
          const loc = typeof getLocalizedProduct === 'function' ? getLocalizedProduct(prod, state.lang) : prod;
          const inCart = state.cart.some(i => i.product.id === prod.id);
          card.classList.add('a11y-speaking');
          const speech = `${loc.name}. ${formatPrice(prod.price, state.lang)}. ${inCart ? t('in_cart', state.lang) : t('add_to_cart', state.lang)}.`;
          speak(speech, true);
          return;
        }
      }

      const btn = target.closest('button, a, input, select');
      if (btn) {
        btn.classList.add('a11y-speaking');
        const ariaLabel = btn.getAttribute('aria-label');
        const title = btn.getAttribute('title');
        const text = btn.innerText || btn.placeholder || btn.value;
        const msg = ariaLabel || text || title || '';
        if (msg) speak(msg, true);
      }
    }, 200);
  }

  // Klaviatura Tezkor Tugmalari (A11y Shortcuts)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      stopSpeaking();
      return;
    }

    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      openModal(a11yModal);
      announceA11y(state.lang === 'uz' ? "Maxsus imkoniyatlar paneli ochildi" : state.lang === 'ru' ? "Меню доступности открыто" : "Accessibility panel opened");
      return;
    }

    if (e.altKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault();
      toggleVoiceReader();
      return;
    }

    if (e.altKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      const current = state.lang || 'uz';
      const next = current === 'uz' ? 'ru' : current === 'ru' ? 'en' : 'uz';
      setLanguage(next);
      return;
    }

    if (e.altKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        announceA11y(state.lang === 'uz' ? "Qidiruv maydoni faollashtirildi" : state.lang === 'ru' ? "Поле поиска активно" : "Search input focused");
      }
      return;
    }

    if (e.altKey && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
      renderCartDrawer();
      openModal(cartDrawer);
      announceA11y(state.lang === 'uz' ? "Savatcha oynasi ochildi" : state.lang === 'ru' ? "Корзина открыта" : "Cart drawer opened");
      return;
    }

    if (e.altKey && (e.key === 'w' || e.key === 'W')) {
      e.preventDefault();
      renderWishlistDrawer();
      openModal(wishlistDrawer);
      announceA11y(state.lang === 'uz' ? "Sevimlilar ro'yxati ochildi" : state.lang === 'ru' ? "Список избранного открыт" : "Wishlist drawer opened");
      return;
    }
  });

  // Tungi / Kunduzgi rejim (Dark Mode)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      safeSetStorage('bozorix_theme', isDark ? 'dark' : 'light');
      themeToggleBtn.innerHTML = isDark 
        ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
        : '<i class="fa-regular fa-moon"></i>';
    });

    if (safeGetStorage('bozorix_theme', 'light') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
    }
  }

  // Mobil filtr ochish/yopish
  const mobileFilterToggle = document.getElementById('mobileFilterToggle');
  const closeFilterSidebar = document.getElementById('closeFilterSidebar');
  const filterSidebar = document.querySelector('.filter-sidebar');

  if (mobileFilterToggle && filterSidebar) {
    mobileFilterToggle.addEventListener('click', () => filterSidebar.classList.add('mobile-open'));
  }
  if (closeFilterSidebar && filterSidebar) {
    closeFilterSidebar.addEventListener('click', () => filterSidebar.classList.remove('mobile-open'));
  }

  // ==========================================
  // 23. Hero Slayder & Flash Sale Taymeri
  // ==========================================
  // Hero Slider
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  function showSlide(index) {
    if (!slides.length) return;
    state.activeSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === state.activeSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === state.activeSlide));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(state.activeSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(state.activeSlide + 1));
  dots.forEach(d => {
    d.addEventListener('click', () => showSlide(Number(d.dataset.slide)));
  });

  // Autoplay
  setInterval(() => {
    showSlide(state.activeSlide + 1);
  }, 6000);

  // Flash Sale Countdown
  function updateCountdown() {
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMinutes');
    const secsEl = document.getElementById('timerSeconds');
    if (!hoursEl || !minsEl || !secsEl) return;

    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, endOfDay - now);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // FAQ Akkordeon
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // ==========================================
  // 24. Dastlabki Yuklash
  // ==========================================
  applyA11ySettings();
  if (state.lang && state.lang !== 'uz') {
    setLanguage(state.lang);
  } else {
    updateVoiceButtonUI();
  }
  updateAuthUI();
  updateCartBadges();
  updateWishlistBadges();
  loadProducts();

});
