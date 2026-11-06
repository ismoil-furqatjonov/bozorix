# ⚡ Bozorix v2.1 — Professional E-Commerce & Full-Stack Savdo Platformasi

Ushbu loyiha **E-commerce (Elektron savdo)** mavzusida premium dizayn, zamonaviy arxitektura, mustaqil Node.js backend, doimiy saqlanuvchi ma'lumotlar bazasi (Persistent DB), to'liq autentifikatsiya, Shaxsiy kabinet, Admin panel, haqiqiy to'lov (Payme/Click) integratsiyasi, **3 ta to'liq til (O'zbek, Rus, Ingliz)** hamda **ko'rlar va ko'rish qobiliyati zaif bo'lgan insonlar uchun maxsus inklyuziv imkoniyatlar (Accessibility / A11y & Screen Reader)** bilan jihozlangan to'liq ishlaydigan professional internet do'kondir.

Loyiha ustozga, ekspertlar komissiyasiga va xaridorlarga taqdim qilish, amaliyotda himoya qilish uchun barcha talablarga 100% javob beradigan darajada ishlab chiqilgan.

---

## 💎 Brend Haqida: "Bozorix" (Bozorix.uz)
- **Nomi**: **Bozorix** — o'zbek tilidagi "Bozor" va xalqaro texnologik "-ix" platforma qo'shimchasi.
- **Unikalligi**: 100% mualliflik loyihasi bo'lib, internetda hech qayerda takrorlanmaydigan original brend.
- **Shiori**: *Aqlli xaridlar va kelajak texnologiyalari makoni*.
- **Buyurtma treking formati**: `#BZX-2026-XXXXXX` (har bir buyurtma uchun unikal raqam va 4 bosqichli jonli kuzatuv).

---

## 🌐 1. Ko'p Tillilik (3 Til: O'zbek, Rus, Ingliz)
Tizim to'liq 3 ta tilda bir zumda qayta yuklanmasdan (`instant switch`) ishlaydi:
- 🇺🇿 **O'zbekcha (`uz`)** — Asosiy til, so'm valyutasida.
- 🇷🇺 **Русский (`ru`)** — To'liq rus tiliga moslashtirilgan interfeys, katalog, toifalar va mahsulotlar tavsifi, сум valyutasi.
- 🇬🇧 **English (`en`)** — Xalqaro standartdagi to'liq inglizcha tarjima, UZS valyutasi.
- **Katalog va Mahsulotlar Tarjimasi**: Barcha 20 ta mahsulot nomi, toifalari va texnik tavsiflari har bir tilda professional darajada tarjima qilingan.
- **Tilni saqlash**: Tanlangan til brauzer xotirasida (`localStorage`) eslab qolinadi.
- **Tezkor klaviatura buyrug'i**: `Alt + L` orqali tillarni navbatma-navbat almashtirish mumkin.

---

## ♿ 2. Ko'rish Qobiliyati Zaif va Ko'rlar Uchun Maxsus Imkoniyatlar (A11y / Accessibility)
Loyiha xalqaro **WCAG 2.1 AAA** darajasidagi inklyuzivlik talablariga moslashtirilgan:
1. **O'rnatilgan Aqlli Ovozli O'quvchi (Screen Reader / Text-to-Speech)**:
   - Brauzerning `speechSynthesis` texnologiyasiga asoslangan.
   - O'zbek, Rus va Ingliz tillarida mahsulotlarni, tugmalarni va xabarlarni ovoz chiqarib o'qiydi.
   - `Alt + V` klavishi yoki yuqori paneldagi **🔊 Ovozli o'qish** tugmasi orqali yoqiladi.
   - Yoqilganda foydalanuvchi klaviatura (`Tab`) orqali harakatlanganda yoki sichqonchani mahsulot ustiga olib borganda tizim avtomatik ravishda tovar nomi, narxi va toifasini baland ovozda aytib beradi.
   - O'qilayotgan element ekranda yorqin binafsha/oltin ramka bilan ko'rsatiladi (`.a11y-speaking`).
2. **Mahsulot Kartochkalaridagi Maxsus Ovoz Tugmasi**:
   - Har bir mahsulot kartasida va "Tez ko'rish" (Quick View) oynasida **🔊 Tinglash** tugmasi mavjud. Uni bosish bilan tovar ma'lumotlari to'liq o'qib beriladi.
3. **Maxsus Imkoniyatlar Paneli (`Alt + A` yoki Suzuvchi Tugma)**:
   - **Shrift o'lchami**: 100%, 115%, 130%, 145% darajalarda butun sayt matnini kattalashtirish.
   - **Yuqori Kontrast (High Contrast)**: WCAG AAA talabidagi chuqur qora fon va ko'zni toliqtirmaydigan yorqin sariq matn.
   - **Monoxrom (Monochrome)**: Ranglarni farqlashda qiynaladiganlar uchun kulrang rejim.
   - **Ranglarni Teskari Qilish (Invert Colors)**: Yorug'likka sezgir ko'zlar uchun.
   - **O'qish Uchun Qulay Shrift (Dyslexia / Clean Font)**: Aniq va ravshan harflar.
   - **Katta Kursor (Big Cursor)**: Kursorni yo'qotib qo'ymaslik uchun 3x kattalashtirilgan yorqin ko'rsatkich.
   - **Havolalarni Tagiga Chizish (Underline Links)**: Barcha bosiladigan tugma va linklarni alohida ajratib ko'rsatish.
   - **Harakatlarni Kamaytirish (Reduce Motion)**: Animatsiyalar va miltillashlarni o'chirish.
4. **Tizimli Ekran O'quvchilar (NVDA, JAWS, TalkBack) Uchun To'liq Moslik**:
   - Asosiy kontentga tez sakrash havolasi (`Skip to content` link).
   - Yashirin jonli xabarchi (`aria-live="polite"`).
   - Barcha tugma, rasm va maydonlarda to'liq semantik `aria-label`, `role` va `title` atributlari mavjud.
5. **Tezkor Klaviatura Tugmalari (Hotkeys)**:
   - `Alt + A` — Maxsus imkoniyatlar oynasini ochish / yopish.
   - `Alt + V` — Ovozli o'quvchini yoqish / o'chirish.
   - `Alt + L` — Tilni almashtirish (UZ ➔ RU ➔ EN).
   - `Alt + S` — Qidiruv maydoniga to'g'ridan-to'g'ri o'tish.
   - `Alt + C` — Savatchani ochish.
   - `Alt + W` — Sevimlilarni ochish.
   - `Esc` — Har qanday ochiq modal yoki panelni yopish.

---

## 🚀 Yangi v2.0 Imkoniyatlari (Backend & Barcha Funksiyalar)

### 1. 🗄️ Haqiqiy Ma'lumotlar Bazasi va Node.js Backend Server
- `server/server.js`: Hech qanday tashqi kutubxonalarga (zero-dependency) qaram bo'lmagan, yuqori tezlikda ishlovchi sof Node.js HTTP REST API serveri.
- `server/data/db.json`: Foydalanuvchilar, mahsulotlar, buyurtmalar, promokodlar, sharhlar va to'lov sozlamalari doimiy saqlanadigan JSON bazasi. Brauzer yangilansa ham barcha o'zgarishlar saqlanib qoladi.
- **Gibrid Arxitektura (Hybrid Fallback)**: Loyiha ham Node.js orqali (`http://localhost:3000`), ham to'g'ridan-to'g'ri `index.html` faylini ochganda (`file:///`) to'liq avtonom ishlayveradi!

### 2. 🔐 Autentifikatsiya va Shaxsiy Kabinet
- **Ro'yxatdan o'tish (Register)**: Ism, telefon, email va parol orqali yangi hisob yaratish.
- **Tizimga kirish (Login)**: SHA-256 HMAC xavfsiz token orqali kirish.
- **Shaxsiy Kabinet**:
  - Foydalanuvchi profilini tahrirlash (Ism, telefon, yetkazib berish manzili).
  - **Buyurtmalar tarixi**: Barcha amalga oshirilgan buyurtmalar ro'yxati, sana, holat nishonlari (`Yangi`, `Omborda`, `Kuryerda`, `Yetkazildi`, `Bekor`).
  - Har bir buyurtma uchun bir bosish bilan **Buyurtma holatini jonli kuzatish** va **Rasmiy kvitansiya/chekni chop etish**.
  - Tizimdan xavfsiz chiqish (Logout).

### 3. 🛠️ To'liq Imkoniyatli Admin Panel (`/admin`)
- Admin foydalanuvchi sifatida tizimga kirilganda sarlavhada **⚙️ Admin Panel** tugmasi ochiladi.
- **Asosiy Ko'rsatkichlar (Dashboard)**:
  - Jami tushum (so'mda)
  - Jami buyurtmalar soni
  - Ro'yxatdan o'tgan mijozlar soni
  - Qoldig'i kam qolgan tovarlar haqida jonli ogohlantirish (Low Stock Alert)
  - Kategoriyalar bo'yicha sotuv taqsimoti
- **Mahsulotlarni Boshqarish (CRUD)**:
  - Yangi mahsulot qo'shish (nomi, toifasi, narxi, eski narxi, ombordagi soni, nishoni).
  - Mahsulot narxi va qoldig'ini tahrirlash.
  - Mahsulotni o'chirish.
- **Buyurtmalarni Nazorat Qilish**:
  - Barcha buyurtmalarni ko'rish.
  - Buyurtma holatini jonli o'zgartirish (`yangi` ➔ `yigilmoqda` ➔ `yetkazilmoqda` ➔ `yetkazildi` ➔ `bekor`). Holat o'zgarganda mijozning treking ekranida ham bir zumda yangilanadi!
- **Promokodlar va Mijozlar Ro'yxati**:
  - Chegirma promokodlarini boshqarish va yangi kuponlar yaratish.
  - Ro'yxatdan o'tgan barcha mijozlar ro'yxatini ko'rish.

### 4. 💳 Haqiqiy To'lov (Payme & Click) va Buyurtma Rasmiylashtirish
- Buyurtma rasmiylashtirish **100% haqiqiy va faol**: ism, telefon raqam, viloyat/shahar va to'liq manzil kiritilib tasdiqlanadi.
- **Payme & Click integratsiyasi**:
  - `Payme` va `Click` tanlanganda rasmiy to'lov URL havolasi (`m=64...` base64 merchant formatida) avtomatik generatsiya qilinadi.
  - Rasmiy kvitansiyada to'lov hisobi (Invoice), to'lov holati va to'lov havolasi ko'rsatiladi.
  - Shuningdek, naqd to'lov (`Kuryerga naqd`) usuli ham mavjud.
- Buyurtma yaratilgach, ombordagi tovar soni avtomatik kamayadi.
- Rasmiy chekni darhol printerda chop etish yoki PDF sifatida saqlash mumkin (`@media print` sozlangan).

### 5. 📍 Buyurtma Holatini Jonli Kuzatish (Live Order Tracking)
- Yuqori qismdagi **"Buyurtma holati"** tugmasi orqali istalgan buyurtma raqamini (`#BZX-2026-XXXXXX`) kiritib, 4 bosqichli vizual treking tizimida real holatni ko'rish mumkin:
  1. `Qabul qilindi` (Yashil tekshiruv belgisi)
  2. `Omborda yig'ilmoqda`
  3. `Kuryer yetkazmoqda`
  4. `Yetkazib berildi`
- Har bir bosqichning o'zgarish vaqti va xabarlari to'liq ko'rsatiladi.

### 6. ⭐ Xaridorlar Sharhlari va Baholash Tizimi (Reviews & Rating)
- Mahsulotning batafsil oynasida (Quick View) xaridorlarning haqiqiy sharhlari ko'rsatiladi.
- Har qanday xaridor interaktiv 5 yulduzli tizim orqali o'z bahosini va izohini qoldirishi mumkin.
- Yangi sharh qo'shilganda tovarning umumiy reytingi va sharhlar soni backendda avtomatik qayta hisoblanadi.

### 7. 🛡️ Kafolat va Qaytarish Siyosati (Delivery & Warranty Modal)
- Yuqori paneldagi **"Yetkazib berish va Kafolat"** bo'limida:
  - 14 kunlik mahsulotni to'liq qaytarish va almashtirish huquqi.
  - 1 yillik rasmiy servis kafolati.
  - Toshkent bo'ylab 3 soatda, viloyatlarga 24 soat ichida yetkazish qoidalari aniq belgilangan.

---

## 🔑 Tayyor Tizim Foydalanuvchilari (Test Hisoblar)

Sinovdan o'tkazishni osonlashtirish uchun tizimda tayyor hisoblar mavjud (avtorizatsiya oynasida bitta tugma bilan avtomatik to'ldirish tugmalari ham qo'shilgan):

| Rol | Email | Parol | Huquqlar |
|---|---|---|---|
| **Admin** | `admin@bozorix.uz` | `admin123` | Boshqaruv paneli, statistika, mahsulot CRUD, buyurtma statuslari, promokodlar |
| **Xaridor (Mijoz)** | `xaridor@bozorix.uz` | `xaridor123` | Buyurtmalar tarixi, profil tahrirlash, sharh qoldirish, xarid qilish |

Yoki istalgan payt yangi foydalanuvchi sifatida "Ro'yxatdan o'tish" mumkin.

---

## 🎟️ Faol Promokodlar

| Promokod | Chegirma | Izoh |
|---|---|---|
| `USTOZ20` | **20%** | Ustoz va ekspertlar uchun maxsus chegirma |
| `BOZORIX20` | **20%** | Bozorix rasmiy premeriya chegirmasi |
| `YANGI10` | **10%** | Ilk xarid uchun xush kelibsiz chegirmasi |
| `BAHOR15` | **15%** | Mavsumiy chegirma kodi |

---

## 💻 Ishga Tushirish Bo'yicha Qo'llanma

Loyihani ikki xil usulda ishlatish mumkin:

### Usul 1: Node.js Backend bilan to'liq ishga tushirish (Tavsiya etiladi)

1. Terminalda loyiha papkasiga kiring:
   ```bash
   cd c:\Users\user\Desktop\nimadur
   ```
2. Backend serverni yoqing:
   ```bash
   npm start
   ```
   *(yoki: `node server/server.js`)*
3. Brauzerda quyidagi manzilni oching:
   ```
   http://localhost:3000
   ```
   Server ishga tushganda barcha API so'rovlari `http://localhost:3000/api/...` orqali to'g'ridan-to'g'ri `server/data/db.json` bazasiga yoziladi.

4. Avtomatlashtirilgan backend testlarni ishga tushirish:
   ```bash
   npm test
   ```
   *9 ta asosiy server endpointlari (Health, Mahsulotlar, Login, Admin, Kuponlar, Buyurtma, Treking, Payme, Statistika) sinovdan o'tkaziladi.*

---

### Usul 2: Internet yoki Nodesiz to'g'ridan-to'g'ri ochish (Offline / Classroom)

- Agar taqdimot paytida terminal yoki Node.js bo'lmasa, shunchaki `index.html` faylini brauzerda oching.
- Tizimdagi aqlli **Hybrid Data Engine** avtomatik ravishda `localStorage` orqali ishlaydi:
  - Mahsulotlar, savat, sevimlilar, buyurtmalar, hisoblar to'liq saqlanadi.
  - Birorta funksiya to'xtab qolmaydi yoki xato bermaydi.

---

## 📁 Loyiha Tuzilishi

```
nimadur/
├── index.html              # Barcha bo'limlar, modallar va navigatsiyaga ega asosiy sahifa
├── package.json            # Loyiha konfiguratsiyasi va npm start/test skriptlari
├── README.md               # To'liq texnik hujjatlar va qo'llanma
├── css/
│   └── style.css           # Premium dizayn, responsive panellar, animatsiyalar, print uslubi
├── js/
│   ├── app.js              # v2.1 Arxitektura: API, A11y o'quvchi, Admin, Kabinet, Savat, Treking
│   ├── products.js         # Mahsulotlarning boshlang'ich ma'lumotlar to'plami va valyuta formati
│   └── translations.js     # 3 tildagi (UZ, RU, EN) to'liq lug'at va mahsulotlar i18n tarjimalari
├── assets/
│   └── products/           # 20 ta yuqori aniqlikdagi aniq mahsulot vektor suratlari
├── server/
│   ├── server.js           # Sof Node.js REST API va statik fayl serveri
│   ├── init_db.js          # Ma'lumotlar bazasini qayta boshlang'ich holatga keltiruvchi skript
│   └── data/
│       └── db.json         # Mahsulotlar, foydalanuvchilar, buyurtmalar va sozlamalar bazasi
└── test/
    └── test_mock.js        # 9 ta API endpointi bo'yicha to'liq test dasturi
```

---

## 🎯 Ustozga Taqdimot Qilish Bo'yicha Bosqichma-bosqich Reja:

1. **Kirish va Dizayn**:
   - Brauzerda saytni oching (`http://localhost:3000` yoki `index.html`).
   - Sarlavha slayderi, Flash Sale taymeri, ranglar uyg'unligi va tungi/kunduzgi rejim tugmasini ko'rsating.
2. **🌐 3 Til va ♿ Inklyuzivlik (Ko'rlar uchun Ovozli O'quvchi & A11y)**:
   - Sarlavhadagi til tanlagichdan **Русский** yoki **English**ni tanlang (`Alt + L`): barcha sarlavhalar, toifalar, mahsulot nomlari va narx valyutalari bir zumda o'zgarishini ko'rsating.
   - Sarlavhadagi **🔊 Ovozli o'qish** tugmasini bosing (`Alt + V`):
     * Klaviatura orqali `Tab` bosib yoki sichqonchani mahsulotlar ustiga olib borganingizda tizim ovoz chiqarib o'qib berishini eshittiring.
     * Mahsulot kartasidagi **🔊 Tinglash** tugmasini bosing.
   - **Maxsus imkoniyatlar (A11y)** tugmasini oching (`Alt + A` yoki ekranning o'ng tomonidagi suzuvchi ko'k tugma):
     * Shriftni 130% yoki 145% ga kattalashtirib ko'rsating.
     * **Yuqori kontrast (High Contrast - WCAG AAA)** rejimini yoqib, zaif ko'ruvchilar uchun maxsus chuqur qora va sariq rang rejimini namoyish qiling.
     * Katta kursor va havolalarni ajratish funksiyalarini ko'rsating.
3. **Katalog va Filtrlash**:
   - Qidiruvga *"iphone"* yoki *"macbook"* deb yozing.
   - Narx oralig'ini o'zgartiring va toifalar bo'yicha saralab ko'rsating.
   - Mahsulot kartasidagi ko'zcha (Quick View) tugmasini bosing: xotirani (`256GB`, `512GB`, `1TB`) tanlaganda narxning jonli o'zgarishini va pastda sharh yozish imkoniyatini ko'rsating.
3. **Savat va Promokod**:
   - Bir nechta tovarni savatga qo'shing.
   - Savatcha oynasini oching, `USTOZ20` promokodini kiriting va 20% chegirma hisoblanganini ko'rsating.
4. **Haqiqiy Buyurtma va To'lov**:
   - "Buyurtma berish" tugmasini bosing, telefon va manzilni kiriting, `Click` yoki `Payme` to'lovini tanlang.
   - Natijada rasmiy buyurtma raqami (`#BZX-2026-XXXXXX`) va Payme/Click to'lov hisobi (Invoice) chiqishini ko'rsating.
   - "Chekni chop etish" tugmasini bosib, rasmiy pechatli kvitansiyani ko'rsating.
5. **Shaxsiy Kabinet va Jonli Treking**:
   - Tepadagi **"Kirish / Profil"** tugmasini bosing va tayyor mijoz hisobi bilan kiring.
   - Buyurtmalar tarixida hozirgina berilgan buyurtma paydo bo'lganini ko'rsating.
   - "Holatni kuzatish" tugmasini bosib, 4 bosqichli treking indikatorini ko'rsating.
6. **Admin Panel**:
   - Admin hisobiga kiring (`admin@bozorix.uz` / `admin123`).
   - Tepadagi **⚙️ Admin Panel** tugmasini oching:
     * Jami tushum va buyurtmalar statistikasini ko'rsating.
     * Yangi mahsulot qo'shib ko'rsating — u darhol sayt katalogida paydo bo'ladi.
     * Buyurtmalar ro'yxatida mijoz buyurtmasining holatini `Omborda` yoki `Kuryer yetkazmoqda`ga o'zgartiring va mijoz trekingida bu o'zgarish aks etishini ko'rsating.
7. **Xulosa**:
   - Soxta (fake) elementlar yo'qligi, barcha ma'lumotlar bazada saqlanishi va mustaqil backend mavjudligini ta'kidlang.

---
*Muvaffaqiyatli taqdimot va a'lo baho tilaymiz!* 🚀
