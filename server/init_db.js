const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = 'bozorix_secure_salt_2026';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Load products.js to get existing productsData and categoriesData
const productsJsPath = path.join(__dirname, '..', 'js', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

// Safely evaluate productsData and categoriesData in isolated scope
const sandbox = {};
const fn = new Function('sandbox', productsJsContent + '; sandbox.productsData = productsData; sandbox.categoriesData = categoriesData;');
fn(sandbox);

const productsData = sandbox.productsData || [];
const categoriesData = sandbox.categoriesData || [];

// Enrich products with sample customer reviews
const sampleReviewsByProduct = {
  1: [
    { id: 1, userName: "Otabek Mahmudov", rating: 5, date: "2026-10-28", comment: "Titan korpus haqiqatdan juda yengil va mustahkam. Kamera sifati esa aqlbovar qilmas darajada zo'r!" },
    { id: 2, userName: "Ziyoda Karimova", rating: 5, date: "2026-10-31", comment: "Tezkor yetkazib berishdi. 2 soat ichida uyimga olib kelishdi. 1 yil rasmiy kafolati bor ekan." }
  ],
  2: [
    { id: 1, userName: "Jahongir Rustamov", rating: 5, date: "2026-10-25", comment: "Galaxy AI funksiyalari juda foydali, ayniqsa live translate va circle to search. S-Pen bilan ishlash zavqli." }
  ],
  3: [
    { id: 1, userName: "Sardorbek Tursunov", rating: 5, date: "2026-10-20", comment: "Batareyasi butun kun yetadi, 18 soat bemalol ishlayapman. Dasturlash va dizayn uchun ajoyib noutbuk." }
  ],
  4: [
    { id: 1, userName: "Madina Aliyeva", rating: 5, date: "2026-10-29", comment: "Shovqinni so'ndirish (ANC) tizimi tengsiz. Samolyotda va shovqinli ofisda juda asqotdi." }
  ],
  5: [
    { id: 1, userName: "Bobur Mirzayev", rating: 5, date: "2026-10-27", comment: "Tog'da va velosipedda sinab ko'rdim. Titan korpus, batareya 3 kun yetdi, ekran yorqinligi daho darajada." }
  ],
  6: [
    { id: 1, userName: "Temur Xalilov", rating: 5, date: "2026-11-01", comment: "PS5 Slim juda ixcham va sokin ishlaydi. 4K 120Hz televizorga ulab Spider-Man 2 o'ynadim, grafika super!" }
  ]
};

const enrichedProducts = productsData.map(p => ({
  ...p,
  reviews: sampleReviewsByProduct[p.id] || [
    { id: 1, userName: "Xaridor", rating: 5, date: "2026-10-30", comment: "Mahsulot original holatda yetib keldi. Sifatiga gap yo'q, tavsiya qilaman!" }
  ]
}));

const db = {
  products: enrichedProducts,
  categories: categoriesData,
  users: [
    {
      id: "usr_admin_1",
      name: "Bozorix Boshqaruvchi",
      email: "admin@bozorix.uz",
      phone: "+998901234567",
      role: "admin",
      passwordHash: hashPassword("admin123"),
      city: "Toshkent shahri",
      address: "Navoiy ko'chasi 14-uy",
      registeredAt: "2026-01-01T09:00:00Z"
    },
    {
      id: "usr_client_1",
      name: "Alisher Navoiy",
      email: "xaridor@bozorix.uz",
      phone: "+998977654321",
      role: "user",
      passwordHash: hashPassword("xaridor123"),
      city: "Toshkent shahri",
      address: "Yunusobod 4-mavze, 18-uy, 42-xonadon",
      registeredAt: "2026-10-15T14:30:00Z"
    }
  ],
  orders: [
    {
      id: "BZX-2026-104921",
      userId: "usr_client_1",
      customerName: "Alisher Navoiy",
      customerPhone: "+998 97 765 43 21",
      customerCity: "Toshkent shahri",
      customerAddress: "Yunusobod 4-mavze, 18-uy, 42-xonadon",
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
        {
          productId: 8,
          name: "Apple AirPods Pro 2 (USB-C)",
          price: 3100000,
          quantity: 1,
          image: "assets/products/airpods-pro-2.svg"
        }
      ],
      subtotal: 3100000,
      discountAmount: 620000,
      appliedCoupon: "BOZORIX20",
      shippingFee: 0,
      totalAmount: 2480000,
      notes: "Eshik qo'ng'irog'i ishlamaydi, yetib kelganda telefon qiling",
      createdAt: "2026-10-25T10:15:00Z"
    },
    {
      id: "BZX-2026-302189",
      userId: "usr_client_1",
      customerName: "Alisher Navoiy",
      customerPhone: "+998 97 765 43 21",
      customerCity: "Toshkent shahri",
      customerAddress: "Yunusobod 4-mavze, 18-uy, 42-xonadon",
      paymentMethod: "click",
      paymentStatus: "paid",
      status: "yetkazilmoqda",
      statusHistory: [
        { status: "yangi", title: "Buyurtma qabul qilindi", timestamp: "2026-11-03T15:20:00Z" },
        { status: "yigilmoqda", title: "Omborda qadoqlandi", timestamp: "2026-11-03T16:00:00Z" },
        { status: "yetkazilmoqda", title: "Kuryer yo'lga chiqdi", timestamp: "2026-11-04T09:00:00Z" }
      ],
      items: [
        {
          productId: 4,
          name: "Sony WH-1000XM5 Simsiz Quloqchin",
          price: 4350000,
          quantity: 1,
          image: "assets/products/sony-wh1000xm5.svg"
        }
      ],
      subtotal: 4350000,
      discountAmount: 870000,
      appliedCoupon: "USTOZ20",
      shippingFee: 0,
      totalAmount: 3480000,
      notes: "Bugun 18:00 gacha yetkazilsa ma'qul",
      createdAt: "2026-11-03T15:20:00Z"
    }
  ],
  coupons: [
    { code: "BOZORIX20", discount: 20, description: "Bozorix maxsus chegirmasi (-20%)", active: true },
    { code: "USTOZ20", discount: 20, description: "Ustoz uchun maxsus chegirma (-20%)", active: true },
    { code: "YANGI10", discount: 10, description: "Yangi mijozlar uchun chegirma (-10%)", active: true },
    { code: "BAHOR15", discount: 15, description: "Mavsumiy chegirma (-15%)", active: true }
  ],
  settings: {
    storeName: "Bozorix",
    domain: "bozorix.uz",
    supportPhone: "+998 (71) 200-88-00",
    supportEmail: "info@bozorix.uz",
    address: "Toshkent sh., Shayxontohur t., Navoiy ko'chasi 14",
    freeShippingThreshold: 1000000,
    standardShippingFee: 35000,
    payme: {
      merchantId: "654321abcdef0987654321",
      testMode: true,
      checkoutUrl: "https://checkout.paycom.uz"
    },
    click: {
      serviceId: "24810",
      merchantId: "19320",
      testMode: true,
      checkoutUrl: "https://my.click.uz/services/pay"
    }
  }
};

const outPath = path.join(__dirname, 'data', 'db.json');
fs.writeFileSync(outPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Database initialized successfully at:', outPath);
console.log('Products:', db.products.length);
console.log('Categories:', db.categories.length);
console.log('Users:', db.users.length);
console.log('Orders:', db.orders.length);
console.log('Coupons:', db.coupons.length);

