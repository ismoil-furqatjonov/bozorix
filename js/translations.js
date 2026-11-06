/**
 * Bozorix — Ko'p Tillilik (i18n) va Tarjimalar Tizimi
 * Tillari: O'zbekcha (uz), Русский (ru), English (en)
 * Ko'zi ojizlar va zaif ko'ruvchilar uchun maxsus ovozli xabarlar bilan.
 */

const TRANSLATIONS = {
  uz: {
    // Top bar
    top_address: "Toshkent sh., Shayxontohur t., Navoiy ko'chasi 14",
    top_hours: "Har kuni: 09:00 - 21:00",
    top_promo: "Maxsus promokod: <strong>USTOZ20</strong> (-20% chegirma)",
    track_order: "Buyurtmani kuzatish",
    warranty_delivery: "Kafolat & Yetkazish",
    faq_link: "Savol-javoblar",
    a11y_btn: "Maxsus imkoniyatlar",
    voice_reader: "Ovozli o'qish",
    voice_on: "Ovoz: YOQILGAN",
    voice_off: "Ovoz: O'CHIQLI",
    skip_to_content: "Asosiy kontentga o'tish (Enter bosing)",

    // Header
    search_placeholder: "Mahsulot nomi, modeli yoki xususiyati bo'yicha qidirish...",
    search_clear: "Tozalash",
    search_btn: "Qidirish",
    theme_toggle: "Tungi/Kunduzgi rejim",
    wishlist: "Sevimlilar",
    cart: "Savatcha",
    login: "Kirish",
    profile: "Profil",
    admin: "Admin",
    som: "so'm",

    // Hero Section
    hero_tag_1: "Bozorix tavsiyasi",
    hero_title_1: "Apple iPhone 15 Pro Max<br>Titanium Korpus",
    hero_desc_1: "Kuchli Apple A17 Pro chipi, 5x optik zumli kamera va eng yengil titan dizayn. Rasmiy 1 yil kafolat bilan.",
    hero_tag_2: "Kuch va Tezlik",
    hero_title_2: "MacBook Air 15 M3<br>Cheksiz Avtonomiya",
    hero_desc_2: "M3 avlod protsessori, 18 soatlik batareya quvvati, Liquid Retina displey va jim ishlovchi fanatsiz korpus.",
    hero_tag_3: "Yangi Avlod Geyming",
    hero_title_3: "Sony PlayStation 5 Slim<br>DualSense Pulti Bilan",
    hero_desc_3: "1TB SSD tezkor xotira, 4K 120Hz geyming, Ray Tracing va yangilangan ixcham korpus. 2 ta o'yin sovg'a!",
    hero_shop_now: "Xarid qilish",
    flash_sale_title: "Bugungi Super Chegirmalar",
    flash_sale_badge: "Tugashiga qoldi:",
    hours_short: "soat",
    minutes_short: "daq",
    seconds_short: "son",

    // Trust Badges / Afzalliklar
    feat_1_title: "3 Soatda Yetkazish",
    feat_1_desc: "Toshkent shahrida tezkor va ehtiyotkor kuryer",
    feat_2_title: "100% Rasmiy Kafolat",
    feat_2_desc: "Faqat original tovarlar va servis markazi",
    feat_3_title: "Qulay To'lov Turlari",
    feat_3_desc: "Payme, Click yoki qabul qilganda naqd",
    feat_4_title: "24/7 Mijozlarni Qo'llash",
    feat_4_desc: "Har qanday savol va muammolar yechimi",

    // Katalog va Filtrlar
    catalog_title: "Mahsulotlar Katalogi",
    catalog_desc: "Eng so'nggi gadjetlar va maishiy texnikalar rasmiy kafolat bilan",
    filter_title: "Filtrlar",
    filter_reset: "Tozalash",
    filter_categories: "Toifalar",
    filter_price: "Narx oralig'i (so'm)",
    filter_price_max: "Maksimal narx:",
    filter_badge_title: "Xususiy nishonlar",
    badge_hit: "Hit sotuv",
    badge_discount: "Chegirmali",
    badge_new: "Yangi tovarlar",
    badge_featured: "Tavsiya etilgan",
    sort_popular: "Ommabopligi bo'yicha",
    sort_price_asc: "Narxi: Arzondan qimmatga",
    sort_price_desc: "Narxi: Qimmatdan arzonga",
    sort_rating: "Reyting bo'yicha",
    sort_discount: "Katta chegirmalar",
    sort_newest: "Yangi tovarlar",
    products_count: "ta mahsulot",
    no_products_found: "Hech qanday mahsulot topilmadi",
    no_products_desc: "Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.",

    // Mahsulot Kartasi
    in_stock: "Mavjud",
    out_of_stock: "Omborda qolmagan",
    delivery_1_day: "1 kunda yetkazish",
    monthly_prefix: "Oyiga",
    monthly_suffix: "dan",
    add_to_cart: "Savatga qo'shish",
    in_cart: "Savatda:",
    pieces: "dona",
    buy_fast: "1 bosishda tezkor xarid",
    quick_view: "Batafsil ko'rish",
    listen_product: "Mahsulotni ovozli eshitish",
    reviews_count_label: "sharh",

    // Savatcha Drawer
    cart_title: "Savatcha",
    cart_empty_title: "Savatchangiz bo'sh",
    cart_empty_desc: "Katalogdan o'zingizga ma'qul tovarlarni tanlang va savatchaga qo'shing.",
    free_shipping_hint: "5 000 000 so'mdan yuqori xaridlarga yetkazib berish BEPUL!",
    free_shipping_unlocked: "Sizga bepul yetkazib berish taqdim etiladi! 🎉",
    free_shipping_remaining: "bepul yetkazib berishgacha qoldi",
    promo_code_placeholder: "Promokod (masalan: USTOZ20)",
    promo_apply: "Qo'llash",
    subtotal: "Mahsulotlar narxi:",
    discount: "Chegirma:",
    shipping: "Yetkazib berish:",
    shipping_free: "Bepul",
    total: "Jami to'lov:",
    checkout_btn: "Buyurtma berish",
    clear_cart: "Savatni tozalash",

    // Sevimlilar Drawer
    wish_title: "Sevimlilar Ro'yxati",
    wish_empty_title: "Sevimlilar ro'yxati bo'sh",
    wish_empty_desc: "Yoqtirgan tovarlaringizni yurakcha belgisini bosib saqlab qo'ying.",
    move_to_cart: "Savatga o'tkazish",

    // Mahsulot Batafsil Modali (Quick View)
    storage_size: "Xotira hajmi:",
    color: "Rangi:",
    features_title: "Texnik xususiyatlar",
    reviews_title: "Mijozlar Sharhlari",
    leave_review: "Sharh qoldirish",
    your_name: "Ismingiz:",
    your_rating: "Bahoyingiz:",
    your_comment: "Fikringizni yozing...",
    submit_review: "Sharhni yuborish",
    listen_details: "Ovozli o'qish",

    // Buyurtma Rasmiylashtirish Modali
    checkout_modal_title: "Buyurtmani Rasmiylashtirish",
    checkout_modal_sub: "Ma'lumotlaringizni kiriting va to'lov usulini tanlang",
    full_name: "To'liq ism familiyangiz",
    phone_number: "Telefon raqamingiz",
    city_region: "Shahar / Viloyat",
    city_tashkent: "Toshkent shahri",
    city_samarkand: "Samarqand viloyati",
    city_bukhara: "Buxoro viloyati",
    city_andijan: "Andijon viloyati",
    city_fergana: "Farg'ona viloyati",
    city_namangan: "Namangan viloyati",
    city_kashkadarya: "Qashqadaryo viloyati",
    city_surkhandarya: "Surxondaryo viloyati",
    city_khorezm: "Xorazm viloyati",
    city_navoi: "Navoiy viloyati",
    city_jizzakh: "Jizzax viloyati",
    city_sirdarya: "Sirdaryo viloyati",
    city_karakalpakstan: "Qoraqalpog'iston Resp.",
    delivery_address: "Yetkazib berish manzili",
    payment_method: "To'lov usuli",
    payment_click: "Click orqali to'lov (Onlayn)",
    payment_payme: "Payme orqali to'lov (Onlayn)",
    payment_cash: "Kuryerga naqd to'lash (Yetkazilganda)",
    order_notes: "Kuryer uchun qo'shimcha izoh (ixtiyoriy)",
    confirm_order: "Buyurtmani Tasdiqlash",

    // Kvitansiya Modali
    receipt_title: "Buyurtmangiz Qabul Qilindi!",
    receipt_sub: "Bozorix ni tanlaganingiz uchun tashakkur",
    receipt_order_id: "Buyurtma raqami:",
    receipt_date: "Sana va vaqt:",
    receipt_customer: "Xaridor:",
    receipt_phone: "Telefon:",
    receipt_city: "Hudud:",
    receipt_address: "Manzil:",
    receipt_payment: "To'lov turi:",
    receipt_items: "Buyurtma qilingan tovarlar:",
    receipt_total: "Jami to'lov:",
    print_receipt: "Chekni chop etish",
    track_status_btn: "Buyurtma holatini kuzatish",
    close_btn: "Yopish",

    // Buyurtma Kuzatish Modali
    track_modal_title: "Buyurtmani Real Vaqtda Kuzatish",
    track_modal_sub: "Buyurtma raqamini kiriting va uning qayerda ekanligini real vaqtda ko'ring",
    track_input_placeholder: "Masalan: BZX-2026-104921",
    track_search_btn: "Qidirish",
    step_yangi: "Qabul qilindi",
    step_yigilmoqda: "Omborda yig'ilmoqda",
    step_yetkazilmoqda: "Kuryer yetkazmoqda",
    step_yetkazildi: "Yetkazib berildi",

    // Kafolat va Yetkazish Modali
    delivery_modal_title: "Kafolat va Yetkazib Berish Siyosati",
    delivery_modal_sub: "Bozorix rasmiy xizmat ko'rsatish va xaridorlarni himoyalash standartlari",

    // Maxsus Imkoniyatlar (A11y) Modali
    a11y_modal_title: "Maxsus Imkoniyatlar (A11y)",
    a11y_modal_sub: "Ko'zi ojizlar, zaif ko'ruvchilar va barcha foydalanuvchilar uchun moslashtirish tizimi",
    a11y_voice_title: "Ovozli O'quvchi (Screen Reader / TTS)",
    a11y_voice_desc: "Har bir element ustiga sichqoncha borganda yoki Tab bosilganda avtomatik ovoz chiqarib o'qib beradi.",
    a11y_voice_toggle: "Ovozli o'qish rejimini yoqish",
    a11y_read_page: "Sahifani to'liq ovozli o'qish",
    a11y_stop_voice: "Ovozni to'xtatish",
    a11y_voice_speed: "Ovoz tezligi:",
    speed_slow: "Sekin",
    speed_normal: "Normal",
    speed_fast: "Tez",
    a11y_font_title: "Matn O'lchami (Font Zoom)",
    font_standard: "100% Standart",
    font_large: "115% Katta",
    font_xlarge: "130% Juda katta",
    font_huge: "145% Gigant",
    a11y_contrast_title: "Rang va Kontrast Rejimi",
    contrast_default: "Standart ranglar",
    contrast_high: "Yuqori Kontrast (Qora-sariq WCAG AAA)",
    contrast_mono: "Monoxrom (Oq-qora daltoniklar uchun)",
    contrast_invert: "Invert (Teskari ranglar)",
    a11y_visual_title: "Ko'rishni Osonlashtiruvchi Qo'shimchalar",
    a11y_readable_font: "O'qishga oson shrift (Harflar oraliqlari kengaytirilgan)",
    a11y_big_cursor: "Katta qora-oq kursor",
    a11y_highlight_links: "Barcha havola va tugmalarni yorqin ajratib ko'rsatish",
    a11y_reduce_motion: "Harakatlanuvchi animatsiyalarni to'xtatish",
    a11y_shortcuts_title: "Klaviatura Tezkor Tugmalari",
    shortcut_a11y: "Maxsus imkoniyatlar paneli",
    shortcut_voice: "Ovozli o'qishni yoqish / o'chirish",
    shortcut_lang: "Tilni almashtirish (UZ / RU / EN)",
    shortcut_search: "Qidiruv maydoniga o'tish",
    shortcut_cart: "Savatchani ochish",
    shortcut_wish: "Sevimlilarni ochish",
    shortcut_esc: "Barcha modallarni yopish",
    a11y_reset_btn: "Barcha sozlamalarni tiklash (Standart)",

    // Xabarnomalar (Toasts)
    toast_cart_added: "Mahsulot savatchaga qo'shildi",
    toast_wish_added: "Sevimlilarga qo'shildi",
    toast_wish_removed: "Sevimlilardan o'chirildi",
    toast_order_success: "Buyurtmangiz muvaffaqiyatli qabul qilindi!",
    toast_coupon_success: "Promokod muvaffaqiyatli qo'llandi!",
    toast_coupon_invalid: "Noto'g'ri yoki yaroqsiz promokod",
    toast_review_success: "Sharhingiz qabul qilindi! Rahmat.",
    toast_profile_updated: "Profil ma'lumotlari muvaffaqiyatli yangilandi",
    toast_voice_enabled: "Ovozli o'qish yoqildi. Elementlar ustiga kelganda ovozli o'qiladi.",
    toast_voice_disabled: "Ovozli o'qish o'chirildi.",
    toast_a11y_reset: "Maxsus imkoniyatlar dastlabki holatga qaytarildi."
  },

  ru: {
    // Top bar
    top_address: "г. Ташкент, Шайхантахурский р-н, ул. Навои 14",
    top_hours: "Ежедневно: 09:00 - 21:00",
    top_promo: "Спец. промокод: <strong>USTOZ20</strong> (скидка -20%)",
    track_order: "Отследить заказ",
    warranty_delivery: "Гарантия & Доставка",
    faq_link: "Частые вопросы",
    a11y_btn: "Спец. возможности",
    voice_reader: "Озвучка текста",
    voice_on: "Озвучка: ВКЛ",
    voice_off: "Озвучка: ВЫКЛ",
    skip_to_content: "Перейти к основному контенту (Нажмите Enter)",

    // Header
    search_placeholder: "Поиск по названию, модели или характеристикам...",
    search_clear: "Очистить",
    search_btn: "Поиск",
    theme_toggle: "Темная/Светлая тема",
    wishlist: "Избранное",
    cart: "Корзина",
    login: "Войти",
    profile: "Профиль",
    admin: "Админ",
    som: "сум",

    // Hero Section
    hero_tag_1: "Выбор Bozorix",
    hero_title_1: "Apple iPhone 15 Pro Max<br>Титановый Корпус",
    hero_desc_1: "Мощный чип Apple A17 Pro, камера с 5-кратным оптическим зумом и легкий титановый корпус. Официальная гарантия 1 год.",
    hero_tag_2: "Мощь и Скорость",
    hero_title_2: "MacBook Air 15 M3<br>Безупречная Автономность",
    hero_desc_2: "Процессор M3, до 18 часов автономной работы, дисплей Liquid Retina и бесшумный корпус без вентиляторов.",
    hero_tag_3: "Гейминг Нового Поколения",
    hero_title_3: "Sony PlayStation 5 Slim<br>С геймпадом DualSense",
    hero_desc_3: "Сверхскоростной 1TB SSD, гейминг 4K 120Hz, трассировка лучей и компактный корпус. 2 топовые игры в подарок!",
    hero_shop_now: "Купить сейчас",
    flash_sale_title: "Супер Скидки Дня",
    flash_sale_badge: "До окончания осталось:",
    hours_short: "час",
    minutes_short: "мин",
    seconds_short: "сек",

    // Trust Badges / Afzalliklar
    feat_1_title: "Доставка за 3 часа",
    feat_1_desc: "Быстрая и бережная доставка курьером по Ташкенту",
    feat_2_title: "100% Официальная Гарантия",
    feat_2_desc: "Только оригинальная техника и сервисные центры",
    feat_3_title: "Удобная Оплата",
    feat_3_desc: "Payme, Click или наличными при получении",
    feat_4_title: "Поддержка 24/7",
    feat_4_desc: "Помощь в решении любых вопросов в любое время",

    // Katalog va Filtrlar
    catalog_title: "Каталог товаров",
    catalog_desc: "Новейшие гаджеты и бытовая электроника с официальной гарантией",
    filter_title: "Фильтры",
    filter_reset: "Сбросить",
    filter_categories: "Категории",
    filter_price: "Диапазон цен (сум)",
    filter_price_max: "Максимальная цена:",
    filter_badge_title: "Особые метки",
    badge_hit: "Хит продаж",
    badge_discount: "Со скидкой",
    badge_new: "Новинки",
    badge_featured: "Рекомендуем",
    sort_popular: "По популярности",
    sort_price_asc: "Цена: Сначала дешевле",
    sort_price_desc: "Цена: Сначала дороже",
    sort_rating: "По рейтингу",
    sort_discount: "По величине скидки",
    sort_newest: "Сначала новинки",
    products_count: "товаров",
    no_products_found: "Товары не найдены",
    no_products_desc: "Измените параметры поиска или сбросьте фильтры.",

    // Mahsulot Kartasi
    in_stock: "В наличии",
    out_of_stock: "Нет на складе",
    delivery_1_day: "Доставка за 1 день",
    monthly_prefix: "В месяц от",
    monthly_suffix: "",
    add_to_cart: "В корзину",
    in_cart: "В корзине:",
    pieces: "шт",
    buy_fast: "Купить в 1 клик",
    quick_view: "Быстрый просмотр",
    listen_product: "Прослушать описание",
    reviews_count_label: "отзывов",

    // Savatcha Drawer
    cart_title: "Корзина покупок",
    cart_empty_title: "Ваша корзина пуста",
    cart_empty_desc: "Выберите понравившиеся товары из каталога и добавьте их в корзину.",
    free_shipping_hint: "Бесплатная доставка при заказе от 5 000 000 сум!",
    free_shipping_unlocked: "Вам доступна бесплатная доставка! 🎉",
    free_shipping_remaining: "до бесплатной доставки",
    promo_code_placeholder: "Промокод (напр.: USTOZ20)",
    promo_apply: "Применить",
    subtotal: "Стоимость товаров:",
    discount: "Скидка:",
    shipping: "Доставка:",
    shipping_free: "Бесплатно",
    total: "Итого к оплате:",
    checkout_btn: "Оформить заказ",
    clear_cart: "Очистить корзину",

    // Sevimlilar Drawer
    wish_title: "Список избранного",
    wish_empty_title: "Список избранного пуст",
    wish_empty_desc: "Сохраняйте понравившиеся товары, нажимая на иконку сердечка.",
    move_to_cart: "Переместить в корзину",

    // Mahsulot Batafsil Modali (Quick View)
    storage_size: "Объем памяти:",
    color: "Цвет:",
    features_title: "Технические характеристики",
    reviews_title: "Отзывы покупателей",
    leave_review: "Оставить отзыв",
    your_name: "Ваше имя:",
    your_rating: "Ваша оценка:",
    your_comment: "Напишите ваш отзыв...",
    submit_review: "Отправить отзыв",
    listen_details: "Озвучить описание",

    // Buyurtma Rasmiylashtirish Modali
    checkout_modal_title: "Оформление Заказа",
    checkout_modal_sub: "Введите данные доставки и выберите удобный способ оплаты",
    full_name: "Полное имя и фамилия",
    phone_number: "Номер телефона",
    city_region: "Город / Область",
    city_tashkent: "город Ташкент",
    city_samarkand: "Самаркандская область",
    city_bukhara: "Бухарская область",
    city_andijan: "Андижанская область",
    city_fergana: "Ферганская область",
    city_namangan: "Наманганская область",
    city_kashkadarya: "Кашкадарьинская область",
    city_surkhandarya: "Сурхандарьинская область",
    city_khorezm: "Хорезмская область",
    city_navoi: "Навоийская область",
    city_jizzakh: "Джизакская область",
    city_sirdarya: "Сырдарьинская область",
    city_karakalpakstan: "Республика Каракалпакстан",
    delivery_address: "Точный адрес доставки",
    payment_method: "Способ оплаты",
    payment_click: "Оплата через Click (Онлайн)",
    payment_payme: "Оплата через Payme (Онлайн)",
    payment_cash: "Наличными курьеру при получении",
    order_notes: "Примечание для курьера (необязательно)",
    confirm_order: "Подтвердить Заказ",

    // Kvitansiya Modali
    receipt_title: "Ваш Заказ Успешно Принят!",
    receipt_sub: "Спасибо за покупку в магазине Bozorix",
    receipt_order_id: "Номер заказа:",
    receipt_date: "Дата и время:",
    receipt_customer: "Покупатель:",
    receipt_phone: "Телефон:",
    receipt_city: "Регион:",
    receipt_address: "Адрес:",
    receipt_payment: "Способ оплаты:",
    receipt_items: "Заказанные товары:",
    receipt_total: "Итого к оплате:",
    print_receipt: "Распечатать чек",
    track_status_btn: "Отследить статус заказа",
    close_btn: "Закрыть",

    // Buyurtma Kuzatish Modali
    track_modal_title: "Отслеживание Заказа в Реальном Времени",
    track_modal_sub: "Введите номер заказа и узнайте точный статус посылки",
    track_input_placeholder: "Например: BZX-2026-104921",
    track_search_btn: "Найти заказ",
    step_yangi: "Принят",
    step_yigilmoqda: "Комплектуется на складе",
    step_yetkazilmoqda: "Курьер доставляет",
    step_yetkazildi: "Успешно доставлен",

    // Kafolat va Yetkazish Modali
    delivery_modal_title: "Политика Гарантии и Доставки",
    delivery_modal_sub: "Официальные стандарты обслуживания и защиты прав покупателей Bozorix",

    // Maxsus Imkoniyatlar (A11y) Modali
    a11y_modal_title: "Специальные Возможности (A11y)",
    a11y_modal_sub: "Настройки доступности для незрячих, слабовидящих и всех покупателей",
    a11y_voice_title: "Голосовое Чтение (Screen Reader / Озвучка)",
    a11y_voice_desc: "Озвучивает голосом элементы при наведении курсора мыши или переходе клавишей Tab.",
    a11y_voice_toggle: "Включить голосовое чтение элементов",
    a11y_read_page: "Прослушать страницу целиком",
    a11y_stop_voice: "Остановить звук",
    a11y_voice_speed: "Скорость чтения:",
    speed_slow: "Медленно",
    speed_normal: "Обычно",
    speed_fast: "Быстро",
    a11y_font_title: "Размер Текста (Масштабирование)",
    font_standard: "100% Стандартный",
    font_large: "115% Крупный",
    font_xlarge: "130% Очень крупный",
    font_huge: "145% Гигантский",
    a11y_contrast_title: "Цвет и Контрастность",
    contrast_default: "Стандартные цвета",
    contrast_high: "Высокий контраст (Черно-желтый WCAG AAA)",
    contrast_mono: "Монохром (Черно-белый для дальтоников)",
    contrast_invert: "Инверсия цветов",
    a11y_visual_title: "Визуальные Улучшения для Чтения",
    a11y_readable_font: "Легкочитаемый шрифт (Увеличенные межбуквенные интервалы)",
    a11y_big_cursor: "Большой черно-белый курсор",
    a11y_highlight_links: "Выделение и подчеркивание всех ссылок и кнопок",
    a11y_reduce_motion: "Отключение мерцания и анимаций",
    a11y_shortcuts_title: "Горячие Клавиши Навигации",
    shortcut_a11y: "Меню доступности",
    shortcut_voice: "Включить / отключить озвучку",
    shortcut_lang: "Сменить язык (UZ / RU / EN)",
    shortcut_search: "Перейти к поиску",
    shortcut_cart: "Открыть корзину",
    shortcut_wish: "Открыть избранное",
    shortcut_esc: "Закрыть любые окна",
    a11y_reset_btn: "Сбросить настройки (По умолчанию)",

    // Xabarnomalar (Toasts)
    toast_cart_added: "Товар успешно добавлен в корзину",
    toast_wish_added: "Товар добавлен в список избранного",
    toast_wish_removed: "Товар удален из избранного",
    toast_order_success: "Ваш заказ успешно оформлен!",
    toast_coupon_success: "Промокод успешно применен!",
    toast_coupon_invalid: "Неверный или просроченный промокод",
    toast_review_success: "Ваш отзыв успешно сохранен! Спасибо.",
    toast_profile_updated: "Данные профиля успешно обновлены",
    toast_voice_enabled: "Голосовое чтение включено. Элементы будут озвучиваться.",
    toast_voice_disabled: "Голосовое чтение выключено.",
    toast_a11y_reset: "Настройки доступности сброшены к стандартным."
  },

  en: {
    // Top bar
    top_address: "Tashkent city, Shaykhantakhur dist., 14 Navoi st.",
    top_hours: "Daily: 09:00 - 21:00",
    top_promo: "Special promo: <strong>USTOZ20</strong> (-20% discount)",
    track_order: "Track Order",
    warranty_delivery: "Warranty & Delivery",
    faq_link: "FAQ",
    a11y_btn: "Accessibility",
    voice_reader: "Screen Reader",
    voice_on: "Voice: ON",
    voice_off: "Voice: OFF",
    skip_to_content: "Skip to main content (Press Enter)",

    // Header
    search_placeholder: "Search by product name, model or specifications...",
    search_clear: "Clear",
    search_btn: "Search",
    theme_toggle: "Dark/Light mode",
    wishlist: "Wishlist",
    cart: "Cart",
    login: "Sign In",
    profile: "Profile",
    admin: "Admin",
    som: "UZS",

    // Hero Section
    hero_tag_1: "Bozorix Choice",
    hero_title_1: "Apple iPhone 15 Pro Max<br>Titanium Design",
    hero_desc_1: "Supercharged Apple A17 Pro chip, 5x optical periscope zoom and lightweight titanium body. 1-year official warranty.",
    hero_tag_2: "Power and Speed",
    hero_title_2: "MacBook Air 15 M3<br>Infinite Autonomy",
    hero_desc_2: "Next-gen M3 chip, up to 18 hours of battery life, Liquid Retina display and completely silent fanless design.",
    hero_tag_3: "Next-Gen Gaming",
    hero_title_3: "Sony PlayStation 5 Slim<br>With DualSense Controller",
    hero_desc_3: "Ultra-fast 1TB SSD, 4K 120Hz gaming, Ray Tracing and compact chassis. Includes 2 hit bonus games!",
    hero_shop_now: "Shop Now",
    flash_sale_title: "Today's Super Deals",
    flash_sale_badge: "Ends in:",
    hours_short: "hrs",
    minutes_short: "mins",
    seconds_short: "secs",

    // Trust Badges / Afzalliklar
    feat_1_title: "Delivery in 3 Hours",
    feat_1_desc: "Express & careful courier across Tashkent",
    feat_2_title: "100% Official Warranty",
    feat_2_desc: "Certified original products & service centers",
    feat_3_title: "Convenient Payment",
    feat_3_desc: "Payme, Click or cash upon arrival",
    feat_4_title: "24/7 Customer Support",
    feat_4_desc: "Friendly assistance anytime you need",

    // Katalog va Filtrlar
    catalog_title: "Product Catalog",
    catalog_desc: "Latest technology, gadgets and home appliances with certified warranty",
    filter_title: "Filters",
    filter_reset: "Reset",
    filter_categories: "Categories",
    filter_price: "Price Range (UZS)",
    filter_price_max: "Maximum price:",
    filter_badge_title: "Special Badges",
    badge_hit: "Best seller",
    badge_discount: "Discounted",
    badge_new: "New arrivals",
    badge_featured: "Featured",
    sort_popular: "By popularity",
    sort_price_asc: "Price: Low to High",
    sort_price_desc: "Price: High to Low",
    sort_rating: "By rating",
    sort_discount: "Biggest discounts",
    sort_newest: "Newest first",
    products_count: "products",
    no_products_found: "No products found",
    no_products_desc: "Try adjusting your search query or reset the filters.",

    // Mahsulot Kartasi
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    delivery_1_day: "1-day delivery",
    monthly_prefix: "From",
    monthly_suffix: "/mo",
    add_to_cart: "Add to Cart",
    in_cart: "In Cart:",
    pieces: "pcs",
    buy_fast: "1-Click Fast Buy",
    quick_view: "Quick View",
    listen_product: "Listen to product description",
    reviews_count_label: "reviews",

    // Savatcha Drawer
    cart_title: "Shopping Cart",
    cart_empty_title: "Your cart is empty",
    cart_empty_desc: "Browse our catalog, choose the items you love and add them to your cart.",
    free_shipping_hint: "Free delivery on orders over 5,000,000 UZS!",
    free_shipping_unlocked: "You have unlocked free shipping! 🎉",
    free_shipping_remaining: "left for free delivery",
    promo_code_placeholder: "Promo code (e.g.: USTOZ20)",
    promo_apply: "Apply",
    subtotal: "Subtotal:",
    discount: "Discount:",
    shipping: "Shipping:",
    shipping_free: "Free",
    total: "Total amount:",
    checkout_btn: "Proceed to Checkout",
    clear_cart: "Clear Cart",

    // Sevimlilar Drawer
    wish_title: "Your Wishlist",
    wish_empty_title: "Your wishlist is empty",
    wish_empty_desc: "Save items you love by tapping the heart icon.",
    move_to_cart: "Move to Cart",

    // Mahsulot Batafsil Modali (Quick View)
    storage_size: "Storage capacity:",
    color: "Color:",
    features_title: "Technical Specifications",
    reviews_title: "Customer Reviews",
    leave_review: "Leave a Review",
    your_name: "Your Name:",
    your_rating: "Your Rating:",
    your_comment: "Write your review...",
    submit_review: "Submit Review",
    listen_details: "Listen to details",

    // Buyurtma Rasmiylashtirish Modali
    checkout_modal_title: "Checkout Order",
    checkout_modal_sub: "Enter shipping information and select a payment method",
    full_name: "Full Name",
    phone_number: "Phone Number",
    city_region: "City / Region",
    city_tashkent: "Tashkent city",
    city_samarkand: "Samarkand region",
    city_bukhara: "Bukhara region",
    city_andijan: "Andijan region",
    city_fergana: "Fergana region",
    city_namangan: "Namangan region",
    city_kashkadarya: "Kashkadarya region",
    city_surkhandarya: "Surkhandarya region",
    city_khorezm: "Khorezm region",
    city_navoi: "Navoi region",
    city_jizzakh: "Jizzakh region",
    city_sirdarya: "Sirdaryo region",
    city_karakalpakstan: "Republic of Karakalpakstan",
    delivery_address: "Full Delivery Address",
    payment_method: "Payment Method",
    payment_click: "Pay with Click (Online)",
    payment_payme: "Pay with Payme (Online)",
    payment_cash: "Cash on delivery (Upon arrival)",
    order_notes: "Courier instructions (Optional)",
    confirm_order: "Confirm & Place Order",

    // Kvitansiya Modali
    receipt_title: "Order Placed Successfully!",
    receipt_sub: "Thank you for shopping at Bozorix",
    receipt_order_id: "Order ID:",
    receipt_date: "Date & Time:",
    receipt_customer: "Customer:",
    receipt_phone: "Phone:",
    receipt_city: "Region:",
    receipt_address: "Address:",
    receipt_payment: "Payment Method:",
    receipt_items: "Ordered Items:",
    receipt_total: "Total Paid:",
    print_receipt: "Print Official Receipt",
    track_status_btn: "Track Order Status",
    close_btn: "Close",

    // Buyurtma Kuzatish Modali
    track_modal_title: "Real-Time Order Tracking",
    track_modal_sub: "Enter your order ID to see current status and location",
    track_input_placeholder: "E.g.: BZX-2026-104921",
    track_search_btn: "Track Status",
    step_yangi: "Order Placed",
    step_yigilmoqda: "Warehouse Packing",
    step_yetkazilmoqda: "Out for Delivery",
    step_yetkazildi: "Successfully Delivered",

    // Kafolat va Yetkazish Modali
    delivery_modal_title: "Warranty & Delivery Policy",
    delivery_modal_sub: "Official customer protection and service standards of Bozorix",

    // Maxsus Imkoniyatlar (A11y) Modali
    a11y_modal_title: "Accessibility Tools (A11y)",
    a11y_modal_sub: "Accessibility settings for blind, visually impaired and all users",
    a11y_voice_title: "Screen Reader / Text-to-Speech (TTS)",
    a11y_voice_desc: "Reads elements aloud automatically when hovering with mouse or navigating with Tab key.",
    a11y_voice_toggle: "Enable voice screen reader",
    a11y_read_page: "Read whole page aloud",
    a11y_stop_voice: "Stop voice",
    a11y_voice_speed: "Speech Speed:",
    speed_slow: "Slow",
    speed_normal: "Normal",
    speed_fast: "Fast",
    a11y_font_title: "Font Size Zoom",
    font_standard: "100% Standard",
    font_large: "115% Large",
    font_xlarge: "130% Extra Large",
    font_huge: "145% Giant",
    a11y_contrast_title: "Color & Contrast Mode",
    contrast_default: "Standard colors",
    contrast_high: "High Contrast (Black & Yellow WCAG AAA)",
    contrast_mono: "Monochrome (Black & White for color blindness)",
    contrast_invert: "Inverted Colors",
    a11y_visual_title: "Visual Readability Enhancements",
    a11y_readable_font: "Readable font (Widened letter spacing)",
    a11y_big_cursor: "Large high-contrast cursor",
    a11y_highlight_links: "Underline and highlight all interactive links & buttons",
    a11y_reduce_motion: "Reduce motion & animations",
    a11y_shortcuts_title: "Keyboard Navigation Shortcuts",
    shortcut_a11y: "Open accessibility panel",
    shortcut_voice: "Toggle screen reader voice",
    shortcut_lang: "Switch language (UZ / RU / EN)",
    shortcut_search: "Focus search bar",
    shortcut_cart: "Open cart drawer",
    shortcut_wish: "Open wishlist drawer",
    shortcut_esc: "Close any open modal",
    a11y_reset_btn: "Reset All Accessibility Settings",

    // Xabarnomalar (Toasts)
    toast_cart_added: "Product added to cart",
    toast_wish_added: "Product added to wishlist",
    toast_wish_removed: "Product removed from wishlist",
    toast_order_success: "Your order has been placed successfully!",
    toast_coupon_success: "Promo code applied successfully!",
    toast_coupon_invalid: "Invalid or expired promo code",
    toast_review_success: "Your review has been saved! Thank you.",
    toast_profile_updated: "Profile updated successfully",
    toast_voice_enabled: "Screen reader voice enabled. Elements will be read aloud.",
    toast_voice_disabled: "Screen reader voice disabled.",
    toast_a11y_reset: "Accessibility settings restored to defaults."
  }
};

// Kategoriya tarjimalari
const CATEGORY_TRANSLATIONS = {
  all: { uz: "Barcha mahsulotlar", ru: "Все товары", en: "All Products" },
  smartphones: { uz: "Smartfonlar", ru: "Смартфоны", en: "Smartphones" },
  laptops: { uz: "Noutbuklar & PC", ru: "Ноутбуки & ПК", en: "Laptops & PC" },
  audio: { uz: "Audio & Quloqchinlar", ru: "Аудио & Наушники", en: "Audio & Headphones" },
  wearables: { uz: "Aqlli soatlar", ru: "Умные часы", en: "Smartwatches" },
  'home-appliances': { uz: "Maishiy texnika", ru: "Бытовая техника", en: "Home Appliances" },
  gaming: { uz: "Geyming & Konsol", ru: "Гейминг & Консоли", en: "Gaming & Consoles" }
};

// Mahsulot nomlari va tavsiflari tarjimalari
const PRODUCT_I18N = {
  1: {
    ru: {
      name: "Apple iPhone 15 Pro Max Натуральный Титан",
      categoryName: "Смартфоны",
      desc: "Корпус из авиационного титана, мощнейший процессор Apple A17 Pro (3 нм), 5x оптический перископный зум и кнопка Action."
    },
    en: {
      name: "Apple iPhone 15 Pro Max Natural Titanium",
      categoryName: "Smartphones",
      desc: "Aerospace-grade titanium design, powerful Apple A17 Pro (3nm) chip, 5x optical periscope zoom and Action button."
    }
  },
  2: {
    ru: {
      name: "Samsung Galaxy S24 Ultra Серый Титан",
      categoryName: "Смартфоны",
      desc: "Встроенный стилус S Pen, искусственный интеллект Galaxy AI, 200 МП камера, процессор Snapdragon 8 Gen 3 и титановый корпус."
    },
    en: {
      name: "Samsung Galaxy S24 Ultra Titanium Gray",
      categoryName: "Smartphones",
      desc: "Built-in S Pen, Galaxy AI features, 200MP camera system, Snapdragon 8 Gen 3 processor and titanium frame."
    }
  },
  3: {
    ru: {
      name: "MacBook Air 15 M3 Полуночный (Midnight)",
      categoryName: "Ноутбуки & ПК",
      desc: "Тонкий алюминиевый корпус, чип Apple M3, Liquid Retina дисплей, до 18 часов автономной работы и бесшумная система."
    },
    en: {
      name: "MacBook Air 15 M3 Midnight",
      categoryName: "Laptops & PC",
      desc: "Ultrathin aluminum design, Apple M3 chip, Liquid Retina display, up to 18 hours battery life and silent fanless cooling."
    }
  },
  4: {
    ru: {
      name: "Sony WH-1000XM5 Беспроводные Наушники",
      categoryName: "Аудио & Наушники",
      desc: "Лидер в области активного шумоподавления (ANC), процессор V1 + QN1, до 30 часов работы и Hi-Res Audio."
    },
    en: {
      name: "Sony WH-1000XM5 Wireless Headphones",
      categoryName: "Audio & Headphones",
      desc: "Industry-leading active noise cancellation, V1 + QN1 processors, 30-hour battery life and Hi-Res Audio support."
    }
  },
  5: {
    ru: {
      name: "Apple Watch Ultra 2 Титан 49мм",
      categoryName: "Умные часы",
      desc: "Титановый корпус 49 мм, экран 3000 нит, двухчастотный GPS, глубиномер и до 72 часов в режиме энергосбережения."
    },
    en: {
      name: "Apple Watch Ultra 2 Titanium 49mm",
      categoryName: "Smartwatches",
      desc: "49mm titanium case, 3000-nit display, precision dual-frequency GPS, depth gauge and up to 72 hours in low-power mode."
    }
  },
  6: {
    ru: {
      name: "Sony PlayStation 5 Slim 1TB + DualSense",
      categoryName: "Гейминг & Консоли",
      desc: "Компактная консоль нового поколения, сверхбыстрый 1TB SSD, поддержка 4K 120Hz, Ray Tracing и геймпад DualSense."
    },
    en: {
      name: "Sony PlayStation 5 Slim 1TB Console",
      categoryName: "Gaming & Consoles",
      desc: "Compact next-gen console, ultra-fast 1TB SSD, 4K 120Hz support, Ray Tracing and DualSense wireless controller."
    }
  },
  7: {
    ru: {
      name: "Dyson V15 Detect Absolute Беспроводной Пылесос",
      categoryName: "Бытовая техника",
      desc: "Лазерная подсветка микропыли, пьезодатчик загрязнения, мотор Hyperdymium 240 AW и до 60 минут работы."
    },
    en: {
      name: "Dyson V15 Detect Absolute Vacuum",
      categoryName: "Home Appliances",
      desc: "Laser reveals microscopic dust, acoustic piezo sensor, 240 AW Hyperdymium motor and up to 60 minutes run time."
    }
  },
  8: {
    ru: {
      name: "DeLonghi Magnifica S Smart Кофемашина",
      categoryName: "Бытовая техника",
      desc: "Автоматическая кофемашина с давлением 15 бар, встроенная стальная кофемолка и ручной капучинатор."
    },
    en: {
      name: "DeLonghi Magnifica S Smart Espresso Machine",
      categoryName: "Home Appliances",
      desc: "Automatic espresso machine with 15-bar pump, integrated conical burr grinder and manual cappuccino frother."
    }
  },
  9: {
    ru: {
      name: "Asus ROG Zephyrus G16 (2024) Игровой Ноутбук",
      categoryName: "Ноутбуки & ПК",
      desc: "OLED дисплей 2.5K 240Hz, Intel Core Ultra 9, видеокарта NVIDIA RTX 4070 8GB и алюминиевый корпус."
    },
    en: {
      name: "Asus ROG Zephyrus G16 (2024) Gaming Laptop",
      categoryName: "Laptops & PC",
      desc: "2.5K 240Hz ROG Nebula OLED display, Intel Core Ultra 9, NVIDIA RTX 4070 8GB GPU in ultra-slim CNC aluminum."
    }
  },
  10: {
    ru: {
      name: "Apple AirPods Pro 2 с кейсом MagSafe (USB-C)",
      categoryName: "Аудио & Наушники",
      desc: "Чип H2, активное шумоподавление в 2 раза мощнее, адаптивное аудио, защита IP54 и зарядка через USB-C."
    },
    en: {
      name: "Apple AirPods Pro 2 MagSafe (USB-C)",
      categoryName: "Audio & Headphones",
      desc: "Apple H2 chip, 2x stronger Active Noise Cancellation, Adaptive Audio, IP54 dust/water resistance and USB-C case."
    }
  },
  11: {
    ru: {
      name: "Samsung Galaxy Watch 6 Classic 47mm",
      categoryName: "Умные часы",
      desc: "Вращающийся механический безель, сапфировое стекло, мониторинг ЭКГ, давления и сна, защита 5ATM/IP68."
    },
    en: {
      name: "Samsung Galaxy Watch 6 Classic 47mm",
      categoryName: "Smartwatches",
      desc: "Rotating mechanical bezel, sapphire crystal glass, advanced ECG, blood pressure & sleep tracking, 5ATM/IP68."
    }
  },
  12: {
    ru: {
      name: "Xiaomi 14 Ultra + Профессиональный Фотонабор",
      categoryName: "Смартфоны",
      desc: "Четыре 50 МП камеры Leica, 1-дюймовый сенсор Sony LYT-900, бесступенчатая диафрагма и процессор Snapdragon 8 Gen 3."
    },
    en: {
      name: "Xiaomi 14 Ultra with Photography Kit",
      categoryName: "Smartphones",
      desc: "Quad 50MP Leica cameras, 1-inch Sony LYT-900 sensor, stepless variable aperture and Snapdragon 8 Gen 3."
    }
  },
  13: {
    ru: {
      name: "Apple iPad Pro 13 M4 (2024) Tandem OLED",
      categoryName: "Ноутбуки & ПК",
      desc: "Новейший процессор M4, революционный дисплей Ultra Retina XDR Tandem OLED и рекордно тонкий корпус 5.1 мм."
    },
    en: {
      name: "Apple iPad Pro 13 M4 (2024) Tandem OLED",
      categoryName: "Laptops & PC",
      desc: "Groundbreaking Apple M4 chip, Ultra Retina XDR Tandem OLED display and impossibly thin 5.1mm design."
    }
  },
  14: {
    ru: {
      name: "Marshall Stanmore III Bluetooth Акустика",
      categoryName: "Аудио & Наушники",
      desc: "Легендарный винтажный рок-дизайн, объемный стереозвук 80 Вт, Bluetooth 5.2 и аналоговые латунные регуляторы."
    },
    en: {
      name: "Marshall Stanmore III Bluetooth Speaker",
      categoryName: "Audio & Headphones",
      desc: "Iconic rock 'n' roll vintage design, wide 80W stereo soundstage, Bluetooth 5.2 and brass control knobs."
    }
  },
  15: {
    ru: {
      name: "Garmin Fenix 7X Pro Solar Спортивные Часы",
      categoryName: "Умные часы",
      desc: "Зарядка от солнечной энергии, титановый безель, встроенный LED фонарик, карты TopoActive и до 37 дней работы."
    },
    en: {
      name: "Garmin Fenix 7X Pro Solar Sapphire",
      categoryName: "Smartwatches",
      desc: "Solar charging lens, titanium bezel, built-in LED flashlight, preloaded TopoActive maps and 37 days battery life."
    }
  },
  16: {
    ru: {
      name: "Microsoft Xbox Series X 1TB Игровая Консоль",
      categoryName: "Гейминг & Консоли",
      desc: "Самая мощная консоль Xbox с мощностью 12 терафлопс, True 4K гейминг, Quick Resume и подписка Game Pass."
    },
    en: {
      name: "Microsoft Xbox Series X 1TB Console",
      categoryName: "Gaming & Consoles",
      desc: "Most powerful Xbox console with 12 teraflops GPU, True 4K gaming, Quick Resume and Xbox Game Pass readiness."
    }
  },
  17: {
    ru: {
      name: "Apple MacBook Pro 16 M3 Max Космический Черный",
      categoryName: "Ноутбуки & ПК",
      desc: "16-ядерный CPU, 40-ядерный GPU, Liquid Retina XDR экран 120Hz, 36GB объединенной памяти и автономность до 22 часов."
    },
    en: {
      name: "Apple MacBook Pro 16 M3 Max Space Black",
      categoryName: "Laptops & PC",
      desc: "16-core CPU, 40-core GPU, Liquid Retina XDR 120Hz display, 36GB unified memory and up to 22 hours battery."
    }
  },
  18: {
    ru: {
      name: "JBL Boombox 3 Wi-Fi & Bluetooth Акустика",
      categoryName: "Аудио & Наушники",
      desc: "Мощнейший звук JBL Original Pro Sound с глубоким басом, поддержка Dolby Atmos, Wi-Fi стриминг и 24 часа работы."
    },
    en: {
      name: "JBL Boombox 3 Wi-Fi Portable Speaker",
      categoryName: "Audio & Headphones",
      desc: "Massive JBL Original Pro Sound with deep bass, Dolby Atmos over Wi-Fi, IP67 waterproofing and 24 hours playback."
    }
  },
  19: {
    ru: {
      name: "Google Pixel 8 Pro Bay Blue (Небесно-голубой)",
      categoryName: "Смартфоны",
      desc: "Процессор Google Tensor G3, камера профессионального уровня с искусственным интеллектом, датчик температуры и 7 лет обновлений."
    },
    en: {
      name: "Google Pixel 8 Pro Bay Blue",
      categoryName: "Smartphones",
      desc: "Google Tensor G3 processor, pro-level AI camera system, temperature sensor and 7 years of Android updates."
    }
  },
  20: {
    ru: {
      name: "Roborock S8 Pro Ultra Робот-пылесос",
      categoryName: "Бытовая техника",
      desc: "Станция автоматической очистки, мытья и сушки салфеток, мощность всасывания 6000 Па, двойная турбощетка DuoRoller и 3D-сканирование."
    },
    en: {
      name: "Roborock S8 Pro Ultra Robot Vacuum",
      categoryName: "Home Appliances",
      desc: "All-in-one docking station with auto-emptying, washing and hot air drying, 6000Pa suction, DuoRoller brushes and 3D avoidance."
    }
  }
};

// Tarjima yordamchi funksiyalari
function t(key, lang = 'uz') {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.uz;
  return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.uz[key] || key);
}

function getLocalizedProduct(product, lang = 'uz') {
  if (!product) return product;
  if (lang === 'uz') return product;
  const i18n = PRODUCT_I18N[product.id] && PRODUCT_I18N[product.id][lang];
  if (!i18n) return product;
  return {
    ...product,
    name: i18n.name || product.name,
    categoryName: i18n.categoryName || product.categoryName,
    description: i18n.desc || product.description
  };
}

function getLocalizedCategoryName(catId, lang = 'uz') {
  if (CATEGORY_TRANSLATIONS[catId] && CATEGORY_TRANSLATIONS[catId][lang]) {
    return CATEGORY_TRANSLATIONS[catId][lang];
  }
  return catId;
}

