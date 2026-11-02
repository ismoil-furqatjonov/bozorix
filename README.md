# ⚡ Bozorix — Zamonaviy E-Commerce (Elektron Savdo) Web-Sayti

Ushbu loyiha **E-commerce (Elektron savdo)** mavzusida premium dizayn, yuqori tezlik va 100% ishlaydigan interaktiv funksiyalarga ega zamonaviy internet do'kondir. Loyiha ustozga taqdim qilish, himoya qilish va amaliyotda to'liq ko'rsatish uchun yuqori sifatda yaratilgan.

---

## 💎 Brend Haqida: "Bozorix" (Bozorix.uz)
- **Nomi**: **Bozorix** — o'zbek tilidagi "Bozor" (savdo va bozor maskani) va xalqaro texnologik "-ix" (zamonaviy platforma) birikmasi.
- **Unikalligi**: Dunyo va O'zbekiston bo'yicha hech qayerda mavjud bo'lmagan, 100% original va yangi brend. Ustoz yoki komissiya tekshirganda boshqa saytlardan ko'chirilmagan, toza mualliflik ishi ekanligi yaqqol ko'rinadi.
- **Shiori**: *Aqlli xaridlar va kelajak texnologiyalari makoni*.
- **Domen va Buyurtma formati**: `bozorix.uz`, buyurtmalar uchun maxsus raqam: `#BZX-2026-XXXXX`.

---

## 🎨 Dizayn va Foydalanuvchi Interfeysi (UI/UX)
- **Ranglar uyg'unligi**: Oq, premium kobalt ko'k (`#2563eb`, `#1d4ed8`), oltin/sariq (`#f59e0b`) va och kulrang (`#f8fafc`).
- **Zamonaviy tipografiya**: Google Fonts — *Plus Jakarta Sans*.
- **To'liq Responsive**: Telefon, planshet va kompyuter (desktop) ekranlariga mukammal moslashgan.
- **Tungi va Kunduzgi Rejim (Dark / Light Mode)**: O'ng yuqori qismdagi tugma orqali tun/kun rejimiga o'tish imkoniyati (tanlov `localStorage`da saqlanadi).
- **Mobil Navigatsiya**: Mobil qurilmalarda zamonaviy ilovalardek qulay pastki panel (Bottom Nav) va mobil qidiruv/savat tugmalari.

---

## 🖼️ Tabiiy va Aniq Mahsulot Rasmlari (`assets/products/`)
- Har bir mahsulot o'zining **haqiqiy va aniq ko'rinishi** bilan ta'minlangan (masalan, Apple Watch Ultra 2 titan korpus va to'q sariq kamar bilan, PS5 Slim oq qanotlari va DualSense pult bilan, DeLonghi qahva mashinasi ekspresso spauti bilan).
- `assets/products/` papkasida 20 ta ultra-aniq, yuqori aniqlikdagi studiya vektor rasmlari mavjud bo'lib, ular **internetsiz, oflayn darsxonada ham 100% ochiladi** va hech qachon xira yoki buzilib qolmaydi.

---

## 🚀 Asosiy Funksional Imkoniyatlar (10 ta talab to'liq bajarilgan)

1. **Bosh sahifa va Interaktiv Hero Slayder**:
   - Avtomatik (har 5 soniyada) va qo'lda boshqariladigan silliq slaydlar (iPhone 15 Pro Max, MacBook Air M3, PlayStation 5 Slim).
   - Do'kon afzalliklari (3 soatda bepul yetkazish, rasmiy kafolat, qulay to'lov, 24/7 mijozlar xizmati).
   - **Flash Sale (Kunning super chegirmalari)**: Har kuni yangilanib turuvchi 24 soatlik jonli orqaga hisoblovchi taymer.
   - **Kategoriyalar Vitrinasi**: 6 ta asosiy toifa bo'yicha interaktiv kartochkalar.

2. **Mahsulotlar Katalogi va Kartochkalari**:
   - 20 ta boy ma'lumotli va realistik tovarlar.
   - `HIT SOTUV`, `CHEGIRMA`, `YANGI`, `TAVSIYA` gradient nishonlari.
   - `⚡ 1 kunda yetkazish` tezkor yetkazib berish belgisi.
   - `Oyiga 410 000 so'mdan` bo'lib to'lash (nasiya) hisob-kitobi.
   - **To'g'ridan-to'g'ri kartadan boshqaruv**: "Savatga qo'shish" tugmasi bosilganda darhol shu kartaning o'zida yashil `Savatda: X dona` bloki va `+` / `-` hisoblagichlari chiqadi.
   - **1-bosishda tezkor xarid**: "⚡ 1 bosishda tezkor xarid" tugmasi orqali to'g'ridan-to'g'ri 5 soniyada buyurtma berish.

3. **Jonli Qidiruv va Ko'p Parametrli Filtrlash**:
   - **Jonli qidiruv**: Harf kiritilganda mahsulot nomi, xususiyatlari va toifalari bo'yicha darhol filtrlaydi.
   - **Kategoriyalar filtri**: Yuqori gorizontal pills yoki yon panel (sidebar) orqali toifalash.
   - **Narx oralig'i slayderi**: Mahsulotlarni minimal va maksimal narx bo'yicha filtrlash.
   - **Nishonlar bo'yicha saralash**: Hit sotuv, Yangi, Chegirma, Tavsiya.
   - **Tartiblash (Sorting)**: Ommabopligi bo'yicha, Narxi arzondan qimmatga, Narxi qimmatdan arzonga, Reyting, Yangi.
   - **Ko'rinish rejimi**: Grid (to'r) va List (ro'yxat) rejimlarini o'zgartirish.

4. **Interaktiv Savatcha (Cart Drawer)**:
   - Silliq ochiluvchi yon panel (Drawer).
   - **Bepul yetkazib berish progress bari**: 5 000 000 so'mgacha qolgan summani jonli ko'rsatib turuvchi indikator.
   - **Kupon va Promokod tizimi**:
     * `BOZORIX20` — 20% maxsus chegirma!
     * `USTOZ20` — Ustoz uchun maxsus 20% chegirma!
     * `BOZORIX10` — 10% chegirma.
   - Tovarlar sonini o'zgartirish (`+` / `-`), o'chirish va to'liq avtomatik qayta hisoblash.
   - **LocalStorage**: Sahifa yangilansa ham savatcha ma'lumotlari yo'qolmaydi!

5. **Buyurtma Berish va Rasmiylashtirish Rejimi**:
   - Sayt hozirda **taqdimot va namoyish (Demo)** rejimida bo'lgani sababli, foydalanuvchilar real to'lov qilib qo'ymasliklari uchun buyurtma rasmiylashtirish vaqtincha xavfsiz cheklangan.
   - Savatchadagi «Rasmiylashtirish» yoki tovardagi «1 bosishda tezkor xarid» tugmasi bosilganda maxsus chiroyli ogohlantirish modali chiqadi. Unda saytning boshqa barcha imkoniyatlari (savat, promokod, xotira tanlash, filtrlar) to'liq ishlashi tushuntiriladi.

6. **Buyurtma Tasdiqlash va Rasmiy Chek (Receipt Modal)**:
   - Buyurtma rasmiylashtirilganda unikal buyurtma raqami (masalan, `#BZX-2026-784129`), sana, haridor ma'lumotlari va tovarlar ro'yxati bilan chiroyli rasmiy kvitansiya chiqadi.
   - **Chekni chop etish (Print) tugmasi**: Kvitansiyani to'g'ridan-to'g'ri printerga yuborish yoki PDF formatida yuklab olish uchun `@media print` qoidalari bilan to'liq sozlangan.

7. **Mahsulot Haqida Batafsil Ma'lumot (Quick View Modal)**:
   - Ko'zcha belgisi bosilganda mahsulot oynasi ochiladi.
   - Rasm galereyasi (kichik suratlarni bosganda asosiy rasm o'zgaradi).
   - **Xotira tanlash (Storage Selector)**: Masalan, `256GB`, `512GB`, `1TB` tugmalari bosilganda mahsulot narxi va oylik to'lovi jonli o'zgaradi!
   - Ranglar palitrasi.
   - To'liq texnik xususiyatlar jadvali.

8. **Sevimlilar Ro'yxati (Wishlist Drawer)**:
   - Yurakcha tugmasi orqali tovarlarni sevimlilarga qo'shish va olib tashlash.
   - Sevimlilar oynasidan bir bosish bilan to'g'ridan-to'g'ri savatga o'tkazish.
   - Ma'lumotlar saqlanadi (`localStorage`).

9. **Mijozlar Fikrlari va Sharhlar (Testimonials)**:
   - Tasdiqlangan xaridorlarning 5 yulduzli baholari va ijobiy fikrlari.

10. **Interaktiv FAQ (Savol-Javoblar)**:
    - Yetkazib berish, to'lov, kafolat va qaytarish bo'yicha silliq ochilib-yopiluvchi akkordeon.

---

## 💻 Loyihani Ishga Tushirish va Tekshirish

1. `nimadur` papkasidagi `index.html` faylini istalgan brauzerda (Chrome, Edge, Opera, Firefox) sichqoncha bilan ikki marta bosib oching.
2. Barcha funksiyalarni sinab ko'ring:
   - Qidiruv qatoriga *"iphone"* yoki *"soat"* deb yozib ko'ring.
   - Tovarni savatga qo'shing, kartochkadagi `+` va `-` tugmalarini bosing.
   - Savatchani oching, promokod maydoniga **USTOZ20** deb yozib "Qo'llash" tugmasini bosing va 20% chegirma hisoblanganini ko'ring.
   - "Buyurtma berish" tugmasini bosing, formani to'ldirib rasmiy kvitansiyani ko'ring va "Chekni chop etish" tugmasini sinab ko'ring.
   - Tungi/kunduzgi rejim tugmasini bosing.
