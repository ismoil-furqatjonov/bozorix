/**
 * Bozorix - Asosiy Ilova Skripti (app.js)
 * Savatcha, Sevimlilar, Promokodlar, Qidiruv, Xotira/Rang variantlari, Buyurtma va Barcha Funksiyalar
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Xavfsiz LocalStorage O'qish
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

  // ==========================================
  // Dastur Holati (State)
  // ==========================================
  const state = {
    products: [...productsData],
    categories: [...categoriesData],
    cart: safeGetStorage('bozorix_cart', []),
    wishlist: safeGetStorage('bozorix_wishlist', []),
    activeCategory: 'all',
    searchQuery: '',
    maxPrice: 30000000,
    selectedBadges: [],
    sortBy: 'popular',
    viewMode: 'grid',
    activeSlide: 0,
    slideInterval: null,
    appliedCoupon: safeGetStorage('bozorix_coupon', null),
    fastBuyProduct: null
  };

  // Promokodlar bazasi
  const coupons = {
    'BOZORIX20': { discount: 20, name: 'Bozorix maxsus chegirmasi (-20%)' },
    'USTOZ20': { discount: 20, name: 'Ustoz uchun maxsus chegirma (-20%)' },
    'USTOZ': { discount: 20, name: 'Ustoz uchun maxsus chegirma (-20%)' },
    'BOZORIX10': { discount: 10, name: 'Xush kelibsiz chegirmasi (-10%)' }
  };

  // DOM Elementlari
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
  const orderNoticeModal = document.getElementById('orderNoticeModal');

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

  // Sevimlilar elementlari
  const wishItemsList = document.getElementById('wishItemsList');
  const wishItemsCountEl = document.getElementById('wishItemsCount');

  // ==========================================
  // LocalStorage Saqlash
  // ==========================================
  function saveCart() {
    try {
      localStorage.setItem('bozorix_cart', JSON.stringify(state.cart));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
    updateCartBadges();
  }

  function saveWishlist() {
    try {
      localStorage.setItem('bozorix_wishlist', JSON.stringify(state.wishlist));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
    updateWishBadges();
  }

  function saveCoupon() {
    try {
      localStorage.setItem('bozorix_coupon', JSON.stringify(state.appliedCoupon));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }

  // ==========================================
  // Suzuvchi Bildirishnomalar (Toast)
  // ==========================================
  function showToast(message, type = 'success', actionText = null, actionCallback = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-circle-check';
    if (type === 'info') iconClass = 'fa-circle-info';
    if (type === 'error') iconClass = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <span class="toast-message">${message}</span>
      ${actionText ? `<button class="toast-action-btn" style="background: none; border: none; color: var(--primary); font-weight: 800; cursor: pointer; text-decoration: underline; margin-left: auto;">${actionText}</button>` : ''}
    `;

    if (actionText && actionCallback) {
      toast.querySelector('.toast-action-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        actionCallback();
        toast.remove();
      });
    }

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // Badjlarni Yangilash
  // ==========================================
  function updateCartBadges() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.classList.add('badge-pop');
      setTimeout(() => cartBadge.classList.remove('badge-pop'), 300);
    }
    if (cartBadgeMobile) cartBadgeMobile.textContent = totalCount;
    if (cartHeaderTotal) cartHeaderTotal.textContent = formatPrice(totalPrice);
    if (cartItemsCountEl) cartItemsCountEl.textContent = `(${totalCount})`;
  }

  function updateWishBadges() {
    const count = state.wishlist.length;
    if (wishBadge) {
      wishBadge.textContent = count;
      wishBadge.classList.add('badge-pop');
      setTimeout(() => wishBadge.classList.remove('badge-pop'), 300);
    }
    if (wishBadgeMobile) wishBadgeMobile.textContent = count;
    if (wishItemsCountEl) wishItemsCountEl.textContent = `(${count})`;
  }

  // ==========================================
  // Kategoriyalarni Render qilish
  // ==========================================
  function renderCategories() {
    if (categoryPillsContainer) {
      categoryPillsContainer.innerHTML = state.categories.map(cat => `
        <button class="cat-pill ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
          <i class="${cat.icon}"></i>
          <span>${cat.name}</span>
        </button>
      `).join('');
    }

    if (categoryFilterList) {
      categoryFilterList.innerHTML = state.categories.map(cat => {
        const count = cat.id === 'all' 
          ? state.products.length 
          : state.products.filter(p => p.category === cat.id).length;

        return `
          <div class="category-filter-item ${cat.id === state.activeCategory ? 'active' : ''}" data-category="${cat.id}">
            <span><i class="${cat.icon}" style="width: 20px;"></i> ${cat.name}</span>
            <span class="category-filter-count">${count}</span>
          </div>
        `;
      }).join('');
    }
  }

  // ==========================================
  // Mahsulotlarni Filtrlash va Saralash
  // ==========================================
  function getFilteredProducts() {
    return state.products.filter(product => {
      // Kategoriya
      if (state.activeCategory !== 'all' && product.category !== state.activeCategory) {
        return false;
      }

      // Qidiruv
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Narx
      if (product.price > state.maxPrice) {
        return false;
      }

      // Nishonlar
      if (state.selectedBadges.length > 0) {
        if (!state.selectedBadges.includes(product.badge)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'price-low') {
        return a.price - b.price;
      } else if (state.sortBy === 'price-high') {
        return b.price - a.price;
      } else if (state.sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (state.sortBy === 'newest') {
        return b.id - a.id;
      }
      return b.reviewsCount - a.reviewsCount;
    });
  }

  // ==========================================
  // Mahsulotlar Kartochkalarini Render Qilish
  // ==========================================
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = getFilteredProducts();
    if (productsCountEl) {
      productsCountEl.textContent = `${filtered.length} ta mahsulot topildi`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border: 1.5px dashed var(--border-light); border-radius: var(--radius-2xl);">
          <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem;">Hech qanday mahsulot topilmadi</h3>
          <p style="color: var(--text-muted); font-size: 0.925rem; margin-bottom: 1.5rem;">Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.</p>
          <button class="hero-btn" id="emptyResetBtn" style="background: var(--primary); color: #fff;">
            Filtrlarni tozalash
          </button>
        </div>
      `;
      document.getElementById('emptyResetBtn')?.addEventListener('click', resetAllFilters);
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const isWish = state.wishlist.includes(product.id);
      const cartItem = state.cart.find(item => item.product.id === product.id);
      const inCart = !!cartItem;
      const cartQty = inCart ? cartItem.quantity : 0;

      // Badge
      let badgeClass = 'badge-hit';
      if (product.badge === 'YANGI') badgeClass = 'badge-yangi';
      if (product.badge === 'CHEGIRMA') badgeClass = 'badge-chegirma';
      if (product.badge === 'TAVSIYA') badgeClass = 'badge-tavsiya';

      // Yulduzlar
      const fullStars = Math.floor(product.rating);
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += (i < fullStars) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
      }

      // Oylik to'lov
      const monthlyStr = product.monthlyPrice ? formatPrice(product.monthlyPrice) : formatPrice(Math.round(product.price / 12));

      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-card-img-wrap" data-action="open-detail" data-id="${product.id}">
            <div class="product-badge-group">
              <span class="product-badge ${badgeClass}">${product.badge}</span>
              <span class="delivery-badge"><i class="fa-solid fa-bolt"></i> 1 kunda yetkazish</span>
            </div>
            
            <div class="product-quick-actions">
              <button class="quick-action-btn wishlist-btn ${isWish ? 'active' : ''}" data-id="${product.id}" title="${isWish ? 'Sevimlilardan o\'chirish' : 'Sevimlilarga qo\'shish'}">
                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
              <button class="quick-action-btn quick-view-btn" data-id="${product.id}" title="Batafsil ko'rish">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>

            <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
          </div>

          <div class="product-card-body">
            <span class="product-card-category">${product.categoryName}</span>
            <h4 class="product-card-title" data-action="open-detail" data-id="${product.id}" title="${product.name}">${product.name}</h4>

            <div class="product-rating">
              <div class="stars">${starsHtml}</div>
              <span class="rating-num">${product.rating}</span>
              <span class="reviews-count">(${product.reviewsCount} sharh)</span>
            </div>

            <!-- Bo'lib to'lash nishoni -->
            <div class="monthly-installment-badge">
              <i class="fa-regular fa-calendar-check"></i>
              <span>Oyiga <strong>${monthlyStr}</strong> dan</span>
            </div>

            <div class="product-prices">
              <span class="product-price">${formatPrice(product.price)}</span>
              ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
            </div>

            <!-- Tugmalar Bloki -->
            <div class="card-buttons-group">
              ${inCart ? `
                <div class="cart-counter-box">
                  <button class="counter-btn-mini btn-qty-minus" data-id="${product.id}" title="Kamaytirish">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="counter-text-mini">
                    <i class="fa-solid fa-check"></i> Savatda: <strong>${cartQty} dona</strong>
                  </span>
                  <button class="counter-btn-mini btn-qty-plus" data-id="${product.id}" title="Oshirish">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              ` : `
                <button class="btn-add-cart-main" data-id="${product.id}">
                  <i class="fa-solid fa-cart-shopping"></i> Savatga qo'shish
                </button>
              `}

              <button class="btn-buy-fast" data-id="${product.id}">
                <i class="fa-solid fa-bolt-lightning" style="color: #f59e0b;"></i> 1 bosishda tezkor xarid
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================
  // Tezkor ko'rish (Quick View Modal)
  // ==========================================
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('quickViewModalBody');
    if (!modalBody) return;

    const isWish = state.wishlist.includes(product.id);
    const cartItem = state.cart.find(i => i.product.id === product.id);
    const inCart = !!cartItem;

    let currentPrice = product.price;

    const fullStars = Math.floor(product.rating);
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += (i < fullStars) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }

    const specsRows = Object.entries(product.features || {}).map(([key, val]) => `
      <tr>
        <td class="specs-key">${key}</td>
        <td class="specs-val">${val}</td>
      </tr>
    `).join('');

    const galleryThumbs = (product.gallery || [product.image]).map((img, idx) => `
      <img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}" data-src="${img}" alt="thumbnail" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
    `).join('');

    // Xotira variantlari
    let storageHtml = '';
    if (product.storageOptions && product.storageOptions.length > 0) {
      storageHtml = `
        <div style="margin-bottom: 1.15rem;">
          <div style="font-size: 0.825rem; font-weight: 800; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-muted);">
            Doimiy xotira hajmi:
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${product.storageOptions.map((opt, idx) => `
              <button class="cat-pill storage-opt-btn ${idx === 0 ? 'active' : ''}" data-price="${opt.price}" data-size="${opt.size}">
                ${opt.size}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Rang variantlari
    let colorsHtml = '';
    if (product.colors && product.colors.length > 0) {
      colorsHtml = `
        <div style="margin-bottom: 1.15rem;">
          <div style="font-size: 0.825rem; font-weight: 800; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-muted);">
            Rang tanlovi:
          </div>
          <div style="display: flex; gap: 0.65rem;">
            ${product.colors.map((color, idx) => `
              <div class="color-circle-opt ${idx === 0 ? 'active' : ''}" data-color="${color}" style="width: 28px; height: 28px; border-radius: 50%; background: ${color}; cursor: pointer; border: 3px solid ${idx === 0 ? 'var(--primary)' : '#e2e8f0'}; box-shadow: 0 2px 5px rgba(0,0,0,0.15);"></div>
            `).join('')}
          </div>
        </div>
      `;
    }

    const monthlyStr = product.monthlyPrice ? formatPrice(product.monthlyPrice) : formatPrice(Math.round(product.price / 12));

    modalBody.innerHTML = `
      <div class="quick-view-grid">
        <div class="modal-gallery">
          <div class="modal-main-img-box">
            <img src="${product.image}" id="modalMainImg" class="modal-main-img" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
          </div>
          <div class="modal-thumbs">
            ${galleryThumbs}
          </div>
        </div>

        <div class="modal-details">
          <span class="modal-product-cat">${product.categoryName}</span>
          <h2 class="modal-product-title">${product.name}</h2>

          <div class="product-rating" style="margin-bottom: 1rem;">
            <div class="stars">${starsHtml}</div>
            <span class="rating-num">${product.rating}</span>
            <span class="reviews-count">(${product.reviewsCount} ta xaridor sharhi)</span>
            <span style="margin-left: 1rem; color: #10b981; font-weight: 800; font-size: 0.825rem;">
              <i class="fa-solid fa-circle-check"></i> Omborda mavjud (${product.stockCount} dona)
            </span>
          </div>

          <div class="modal-product-price-box">
            <span class="modal-price" id="modalPriceEl">${formatPrice(currentPrice)}</span>
            ${product.oldPrice ? `<span class="modal-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
            ${product.discount ? `<span class="modal-discount-tag">-${product.discount}% CHEGIRMA</span>` : ''}
          </div>

          <div class="monthly-installment-badge" style="margin-bottom: 1.25rem;">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Nasiya: Oyiga <strong>${monthlyStr}</strong> dan (12 oyga bo'lib to'lash)</span>
          </div>

          <!-- Variantlar -->
          ${storageHtml}
          ${colorsHtml}

          <p class="modal-desc">${product.description}</p>

          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.5rem;">Asosiy xususiyatlar:</h4>
          <table class="specs-table">
            <tbody>
              ${specsRows}
            </tbody>
          </table>

          <div class="modal-action-bar">
            <button class="modal-cart-btn" id="modalAddToCartBtn" data-id="${product.id}">
              <i class="fa-solid ${inCart ? 'fa-check' : 'fa-cart-shopping'}"></i> 
              ${inCart ? 'Savatchaga yana qo\'shish' : 'Savatchaga qo\'shish'}
            </button>
            <button class="modal-wish-btn ${isWish ? 'active' : ''}" data-id="${product.id}">
              <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isWish ? '#ef4444' : 'inherit'};"></i>
              ${isWish ? 'Sevimlilarda' : 'Sevimlilarga'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Gallereya rasmini almashtirish
    const thumbs = modalBody.querySelectorAll('.modal-thumb');
    const mainImg = modalBody.querySelector('#modalMainImg');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.getAttribute('data-src');
      });
    });

    // Xotira varianti
    const storageBtns = modalBody.querySelectorAll('.storage-opt-btn');
    const modalPriceEl = modalBody.querySelector('#modalPriceEl');
    storageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        storageBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPrice = Number(btn.dataset.price);
        if (modalPriceEl) modalPriceEl.textContent = formatPrice(currentPrice);
      });
    });

    // Rang tanlovi
    const colorCircles = modalBody.querySelectorAll('.color-circle-opt');
    colorCircles.forEach(circle => {
      circle.addEventListener('click', () => {
        colorCircles.forEach(c => c.style.borderColor = '#e2e8f0');
        circle.style.borderColor = 'var(--primary)';
      });
    });

    // Savatga qo'shish
    modalBody.querySelector('#modalAddToCartBtn')?.addEventListener('click', () => {
      addToCart(product.id, 1, currentPrice);
      closeAllModals();
      renderCartDrawer();
      openModal(cartDrawer);
    });

    // Sevimlilarga qo'shish
    modalBody.querySelector('.modal-wish-btn')?.addEventListener('click', () => {
      toggleWishlist(product.id);
      openQuickView(product.id);
    });

    openModal(quickViewModal);
  }

  // ==========================================
  // Savatcha Boshqaruvi
  // ==========================================
  function addToCart(productId, quantity = 1, customPrice = null) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const productToAdd = customPrice ? { ...product, price: customPrice } : { ...product };
    const existingIndex = state.cart.findIndex(item => item.product.id === productId);

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
      showToast(`"${product.name.substring(0, 28)}..." miqdori oshirildi (+${quantity})`, 'info', 'Savatni ko\'rish ➔', () => {
        renderCartDrawer();
        openModal(cartDrawer);
      });
    } else {
      state.cart.push({ product: productToAdd, quantity });
      showToast(`"${product.name.substring(0, 28)}..." savatchaga qo'shildi! 🛍️`, 'success', 'Savatni ko\'rish ➔', () => {
        renderCartDrawer();
        openModal(cartDrawer);
      });
    }

    saveCart();
    renderProducts();
    renderCartDrawer();
  }

  function updateCartQuantity(productId, delta) {
    const itemIndex = state.cart.findIndex(item => item.product.id === productId);
    if (itemIndex === -1) return;

    state.cart[itemIndex].quantity += delta;

    if (state.cart[itemIndex].quantity <= 0) {
      const removedName = state.cart[itemIndex].product.name;
      state.cart.splice(itemIndex, 1);
      showToast(`"${removedName.substring(0, 28)}..." savatdan olib tashlandi`, 'info');
    }

    saveCart();
    renderProducts();
    renderCartDrawer();
  }

  function removeFromCart(productId) {
    const item = state.cart.find(i => i.product.id === productId);
    state.cart = state.cart.filter(item => item.product.id !== productId);
    if (item) {
      showToast(`"${item.product.name.substring(0, 28)}..." savatdan o'chirildi`, 'info');
    }
    saveCart();
    renderProducts();
    renderCartDrawer();
  }

  function clearCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    state.appliedCoupon = null;
    saveCart();
    saveCoupon();
    renderProducts();
    renderCartDrawer();
    showToast("Savatcha tozalandi", "info");
  }

  function renderCartDrawer() {
    if (!cartItemsList) return;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="empty-state" style="padding: 3.5rem 1rem; text-align: center;">
          <i class="fa-solid fa-cart-arrow-down" style="font-size: 3.5rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">Savatchangiz bo'sh</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">Katalogdan o'zingizga yoqqan tovarlarni qo'shing.</p>
          <button class="hero-btn close-drawer-btn" style="background: var(--primary); color: #fff;">
            Xaridni boshlash
          </button>
        </div>
      `;
      cartItemsList.querySelector('.close-drawer-btn')?.addEventListener('click', closeAllModals);

      if (cartSubtotalEl) cartSubtotalEl.textContent = "0 so'm";
      if (cartDiscountRow) cartDiscountRow.style.display = "none";
      if (cartShippingEl) cartShippingEl.textContent = "0 so'm";
      if (cartTotalEl) cartTotalEl.textContent = "0 so'm";
      if (shippingProgressFill) shippingProgressFill.style.width = "0%";
      if (freeShippingText) freeShippingText.innerHTML = '<i class="fa-solid fa-truck-fast"></i> 1 000 000 so\'mdan oshsa yetkazish BEPUL!';
      return;
    }

    let subtotal = 0;

    cartItemsList.innerHTML = `
      <div style="display: flex; justify-content: flex-end; margin-bottom: 0.5rem;">
        <button id="clearAllCartBtn" style="background: none; border: none; color: #ef4444; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.3rem;">
          <i class="fa-regular fa-trash-can"></i> Savatni tozalash
        </button>
      </div>
      ${state.cart.map(item => {
        const itemTotal = item.product.price * item.quantity;
        subtotal += itemTotal;

        return `
          <div class="cart-item" data-id="${item.product.id}">
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
            <div class="cart-item-info">
              <h5 class="cart-item-title">${item.product.name}</h5>
              <span class="cart-item-price">${formatPrice(item.product.price)}</span>
              <div class="cart-qty-ctrl">
                <button class="qty-btn qty-minus" data-id="${item.product.id}">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn qty-plus" data-id="${item.product.id}">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <button class="cart-item-delete" data-id="${item.product.id}" title="O'chirish">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('')}
    `;

    document.getElementById('clearAllCartBtn')?.addEventListener('click', clearCart);

    // Bepul yetkazish progress bari
    const freeShippingTarget = 1000000;
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100));
    if (shippingProgressFill) {
      shippingProgressFill.style.width = `${progressPercent}%`;
    }
    if (freeShippingText) {
      if (subtotal >= freeShippingTarget) {
        freeShippingText.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Tabriklaymiz! Bepul yetkazib berish qo\'lga kiritildi! 🎉';
      } else {
        const remaining = freeShippingTarget - subtotal;
        freeShippingText.innerHTML = `<i class="fa-solid fa-truck-fast"></i> Bepul yetkazish uchun yana <strong>${formatPrice(remaining)}</strong> lik xarid qiling!`;
      }
    }

    // Promokod chegirmasi
    let discountAmount = 0;
    if (state.appliedCoupon) {
      discountAmount = Math.round((subtotal * state.appliedCoupon.discount) / 100);
      if (cartDiscountRow) {
        cartDiscountRow.style.display = "flex";
        cartDiscountEl.textContent = `-${formatPrice(discountAmount)} (${state.appliedCoupon.discount}%)`;
      }
      if (couponAppliedBox) {
        couponAppliedBox.innerHTML = `
          <div class="coupon-applied-tag">
            <span><i class="fa-solid fa-tag"></i> <strong>${state.appliedCoupon.code}</strong> (${state.appliedCoupon.name})</span>
            <button id="removeCouponBtn" style="background: none; border: none; cursor: pointer; color: #065f46; font-size: 0.9rem;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
        document.getElementById('removeCouponBtn')?.addEventListener('click', () => {
          state.appliedCoupon = null;
          saveCoupon();
          showToast("Promokod bekor qilindi", "info");
          renderCartDrawer();
        });
      }
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = "none";
      if (couponAppliedBox) couponAppliedBox.innerHTML = "";
    }

    const shipping = subtotal >= freeShippingTarget ? 0 : 35000;
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
    if (cartShippingEl) {
      cartShippingEl.textContent = shipping === 0 ? "Bepul yetkazish 🎉" : formatPrice(shipping);
      cartShippingEl.style.color = shipping === 0 ? "#10b981" : "inherit";
    }
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(grandTotal);

    // Hodisalar
    cartItemsList.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.id), -1));
    });
    cartItemsList.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(Number(btn.dataset.id), 1));
    });
    cartItemsList.querySelectorAll('.cart-item-delete').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });
  }

  // ==========================================
  // Promokodni Qo'llash
  // ==========================================
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      if (!code) {
        showToast("Iltimos, promokodni kiriting!", "error");
        return;
      }

      if (coupons[code]) {
        state.appliedCoupon = { code, ...coupons[code] };
        saveCoupon();
        couponInput.value = "";
        showToast(`🎉 "${code}" promokodi qo'llandi! -${coupons[code].discount}% chegirma!`, "success");
        renderCartDrawer();
      } else {
        showToast(`"${code}" promokodi noto'g'ri! (Mavjud kuponlar: BOZORIX20, USTOZ20)`, "error");
      }
    });
  }

  // ==========================================
  // Sevimlilar (Wishlist) Boshqaruvi
  // ==========================================
  function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`"${product.name.substring(0, 28)}..." sevimlilardan olib tashlandi`, 'info');
    } else {
      state.wishlist.push(productId);
      showToast(`"${product.name.substring(0, 28)}..." sevimlilarga saqlandi ❤️`, 'success');
    }

    saveWishlist();
    renderProducts();
    renderWishlistDrawer();
  }

  function renderWishlistDrawer() {
    if (!wishItemsList) return;

    const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
      wishItemsList.innerHTML = `
        <div class="empty-state" style="padding: 3.5rem 1rem; text-align: center;">
          <i class="fa-regular fa-heart" style="font-size: 3.5rem; color: #ef4444; margin-bottom: 1rem;"></i>
          <h4 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem;">Sevimlilar ro'yxati bo'sh</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">O'zingizga yoqqan mahsulotlarga yurak belgisini bosing.</p>
          <button class="hero-btn close-drawer-btn" style="background: var(--primary); color: #fff;">
            Katalogga o'tish
          </button>
        </div>
      `;
      wishItemsList.querySelector('.close-drawer-btn')?.addEventListener('click', closeAllModals);
      return;
    }

    wishItemsList.innerHTML = wishlistProducts.map(product => `
      <div class="cart-item" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
        <div class="cart-item-info">
          <h5 class="cart-item-title">${product.name}</h5>
          <span class="cart-item-price">${formatPrice(product.price)}</span>
          <button class="cat-pill move-to-cart-btn" data-id="${product.id}" style="margin-top: 6px; padding: 5px 12px; font-size: 0.775rem;">
            <i class="fa-solid fa-cart-plus"></i> Savatga olish
          </button>
        </div>
        <button class="cart-item-delete remove-wish-item" data-id="${product.id}" title="Sevimlilardan o'chirish">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');

    wishItemsList.querySelectorAll('.move-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        addToCart(id, 1);
        toggleWishlist(id);
      });
    });

    wishItemsList.querySelectorAll('.remove-wish-item').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWishlist(Number(btn.dataset.id));
      });
    });
  }

  // ==========================================
  // Modallarni Ochish va Yopish
  // ==========================================
  function openModal(modalEl) {
    if (modalBackdrop) modalBackdrop.classList.add('active');
    if (modalEl) modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    [cartDrawer, wishlistDrawer, quickViewModal, checkoutModal, fastBuyModal, successModal, orderNoticeModal].forEach(m => {
      if (m) m.classList.remove('active');
    });
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (filterSidebar) filterSidebar.classList.remove('mobile-open');
    document.body.style.overflow = '';
  }

  function openOrderNoticeModal() {
    closeAllModals();
    if (orderNoticeModal) openModal(orderNoticeModal);
    showToast("Hozircha buyurtma rasmiylashtirib bo'lmaydi (Namoyish rejimi)", "warning");
  }

  // ESC tugmasi bilan yopish
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // ==========================================
  // 1-Bosishda Tezkor Xarid (Fast Buy)
  // ==========================================
  function openFastBuy(productId) {
    openOrderNoticeModal();
    return;
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.fastBuyProduct = product;
    const fastBuyProductBox = document.getElementById('fastBuyProductBox');
    if (fastBuyProductBox) {
      fastBuyProductBox.innerHTML = `
        <img src="${product.image}" style="width: 60px; height: 60px; object-fit: contain; background: #fff; border-radius: var(--radius-md); padding: 4px;" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';">
        <div>
          <div style="font-weight: 800; font-size: 0.9rem; line-height: 1.3;">${product.name}</div>
          <div style="color: var(--primary); font-weight: 800; font-size: 1rem; margin-top: 2px;">${formatPrice(product.price)}</div>
        </div>
      `;
    }

    openModal(fastBuyModal);
  }

  const fastBuyForm = document.getElementById('fastBuyForm');
  if (fastBuyForm) {
    fastBuyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fastName').value.trim();
      const phone = document.getElementById('fastPhone').value.trim();

      if (!name || phone.length < 9) {
        showToast("Iltimos, ism va to'g'ri telefon raqamingizni kiriting!", "error");
        return;
      }

      const orderId = 'BZX-FAST-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const receiptBox = document.getElementById('receiptBox');
      if (receiptBox && state.fastBuyProduct) {
        receiptBox.innerHTML = `
          <div class="receipt-success-icon">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <h2 class="receipt-title">Tezkor buyurtmangiz qabul qilindi! 🎉</h2>
          <div class="receipt-order-id">Buyurtma kodi: #${orderId}</div>
          <p style="color: var(--text-secondary); font-size: 0.925rem; margin-bottom: 1.5rem;">
            Rahmat, <strong>${name}</strong>! Bozorix operatori 5 daqiqada <strong>${phone}</strong> raqamingizga qo'ng'iroq qilib, buyurtmani tasdiqlaydi.
          </p>

          <div class="receipt-details-card">
            <div class="receipt-row">
              <span>Do'kon:</span>
              <span style="font-weight: 800; color: var(--primary);">Bozorix.uz</span>
            </div>
            <div class="receipt-row">
              <span>Mahsulot:</span>
              <span style="font-weight: 800;">${state.fastBuyProduct.name}</span>
            </div>
            <div class="receipt-row">
              <span>Sana va vaqt:</span>
              <span>${orderDate}</span>
            </div>
            <div class="receipt-row">
              <span>Xaridor:</span>
              <span>${name} (${phone})</span>
            </div>
            <div class="receipt-row">
              <span>Jami to'lov:</span>
              <span>${formatPrice(state.fastBuyProduct.price)}</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="hero-btn" id="printReceiptBtn" style="background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-light);">
              <i class="fa-solid fa-print"></i> Kvitansiyani chop etish
            </button>
            <button class="hero-btn" id="continueShoppingBtn" style="background: var(--primary); color: #ffffff;">
              Xaridni davom ettirish
            </button>
          </div>
        `;

        document.getElementById('printReceiptBtn')?.addEventListener('click', () => window.print());
        document.getElementById('continueShoppingBtn')?.addEventListener('click', closeAllModals);
      }

      fastBuyForm.reset();
      closeAllModals();
      openModal(successModal);
      showToast("Tezkor buyurtmangiz qabul qilindi!", "success");
    });
  }

  // ==========================================
  // To'liq Buyurtma Rasmiylashtirish (Checkout)
  // ==========================================
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast("Savatchangiz bo'sh. Avval mahsulot tanlang!", "error");
      return;
    }
    openOrderNoticeModal();
    return;

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

          <div style="border-top: 1.5px dashed var(--border-light); margin-top: 0.65rem; padding-top: 0.65rem; display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: var(--primary);">
            <span>Jami to'lov:</span>
            <span>${formatPrice(grandTotal)}</span>
          </div>
        </div>
      `;
    }

    openModal(checkoutModal);
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    openOrderNoticeModal();
    return;

    const form = e.target;
    const name = form.customerName.value.trim();
    const phone = form.customerPhone.value.trim();
    const city = form.customerCity.value;
    const address = form.customerAddress.value.trim();
    const payment = form.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';

    if (!name || !phone || !address) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    if (phone.length < 9) {
      showToast("Telefon raqami noto'g'ri kiritildi!", "error");
      return;
    }

    const orderId = 'BZX-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const discountAmount = state.appliedCoupon ? Math.round((subtotal * state.appliedCoupon.discount) / 100) : 0;
    const shipping = subtotal >= 1000000 ? 0 : 35000;
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    let paymentName = "Qabul qilganda naqd pul";
    if (payment === 'payme') paymentName = "Payme ilovasi orqali";
    if (payment === 'click') paymentName = "Click Up orqali";

    const receiptBox = document.getElementById('receiptBox');
    if (receiptBox) {
      receiptBox.innerHTML = `
        <div class="receipt-success-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2 class="receipt-title">Buyurtmangiz qabul qilindi! 🎉</h2>
        <div class="receipt-order-id">Bozorix buyurtma raqami: #${orderId}</div>
        <p style="color: var(--text-secondary); font-size: 0.925rem; margin-bottom: 1.5rem;">
          Hurmatli <strong>${name}</strong>, buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada Bozorix kuryeri siz bilan <strong>${phone}</strong> raqami orqali bog'lanadi.
        </p>

        <div class="receipt-details-card">
          <div class="receipt-row">
            <span>Sana va vaqt:</span>
            <span>${orderDate}</span>
          </div>
          <div class="receipt-row">
            <span>Qabul qiluvchi:</span>
            <span>${name}</span>
          </div>
          <div class="receipt-row">
            <span>Yetkazib berish manzili:</span>
            <span>${city}, ${address}</span>
          </div>
          <div class="receipt-row">
            <span>To'lov usuli:</span>
            <span>${paymentName}</span>
          </div>
          ${discountAmount > 0 ? `
            <div class="receipt-row" style="color: #10b981;">
              <span>Chegirma (${state.appliedCoupon.code}):</span>
              <span>-${formatPrice(discountAmount)}</span>
            </div>
          ` : ''}
          <div class="receipt-row">
            <span>Yetkazib berish:</span>
            <span>${shipping === 0 ? 'BEPUL 🎉' : formatPrice(shipping)}</span>
          </div>
          <div class="receipt-row">
            <span>Jami to'lov summasi:</span>
            <span>${formatPrice(grandTotal)}</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <button class="hero-btn" id="printReceiptBtn" style="background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-light);">
            <i class="fa-solid fa-print"></i> Kvitansiyani chop etish
          </button>
          <button class="hero-btn" id="continueShoppingBtn" style="background: var(--primary); color: #ffffff;">
            Xaridni davom ettirish
          </button>
        </div>
      `;

      document.getElementById('printReceiptBtn')?.addEventListener('click', () => window.print());
      document.getElementById('continueShoppingBtn')?.addEventListener('click', closeAllModals);
    }

    // Savatni tozalash
    state.cart = [];
    state.appliedCoupon = null;
    saveCart();
    saveCoupon();
    renderProducts();
    renderCartDrawer();
    form.reset();

    closeAllModals();
    openModal(successModal);
    showToast("Buyurtmangiz muvaffaqiyatli qabul qilindi!", "success");
  }

  // ==========================================
  // Flash Sale Taymeri
  // ==========================================
  function initCountdownTimer() {
    const hoursEl = document.getElementById('cdHours');
    const minutesEl = document.getElementById('cdMinutes');
    const secondsEl = document.getElementById('cdSeconds');
    if (!hoursEl || !minutesEl || !secondsEl) return;

    function update() {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay - now;
      if (diff <= 0) return;

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      hoursEl.textContent = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // ==========================================
  // Hero Slayder
  // ==========================================
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    if (slides.length === 0) return;

    function goToSlide(index) {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === index));
      state.activeSlide = index;
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(state.slideInterval);
        goToSlide(idx);
        startAutoSlide();
      });
    });

    function startAutoSlide() {
      state.slideInterval = setInterval(() => {
        const next = (state.activeSlide + 1) % slides.length;
        goToSlide(next);
      }, 5000);
    }

    startAutoSlide();
  }

  // ==========================================
  // FAQ Akkordeon
  // ==========================================
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // ==========================================
  // Filtrlarni Tozalash
  // ==========================================
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

    document.querySelectorAll('.badge-checkbox').forEach(cb => cb.checked = false);

    renderCategories();
    renderProducts();
    showToast("Barcha filtrlar tozalandi", "info");
  }

  // ==========================================
  // Hodisalar (Event Listeners)
  // ==========================================

  // Qidiruv
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('active', e.target.value.length > 0);
      }
      renderProducts();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      searchClearBtn.classList.remove('active');
      renderProducts();
      searchInput.focus();
    });
  }

  // Saralash
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Narx slayderi
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      if (priceInputMax) {
        priceInputMax.value = new Intl.NumberFormat('uz-UZ').format(state.maxPrice);
      }
      renderProducts();
    });
  }

  // Nishonlar
  document.querySelectorAll('.badge-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      state.selectedBadges = Array.from(document.querySelectorAll('.badge-checkbox:checked'))
        .map(el => el.value);
      renderProducts();
    });
  });

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  // Grid / List
  if (viewGridBtn && viewListBtn) {
    viewGridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      productsGrid.classList.remove('list-view');
    });

    viewListBtn.addEventListener('click', () => {
      state.viewMode = 'list';
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      productsGrid.classList.add('list-view');
    });
  }

  // Kategoriya tugmalari delegatsiyasi
  document.addEventListener('click', (e) => {
    const catPill = e.target.closest('.cat-pill');
    const catItem = e.target.closest('.category-filter-item');
    const catCard = e.target.closest('.category-card-item');

    const targetEl = catPill || catItem || catCard;
    if (targetEl) {
      const catId = targetEl.dataset.category;
      if (catId) {
        state.activeCategory = catId;
        renderCategories();
        renderProducts();

        const catalogSec = document.getElementById('catalogSection');
        if (catalogSec && !e.target.closest('#categoryPills')) {
          catalogSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });

  // Mahsulot kartochkasi hodisalari
  if (productsGrid) {
    productsGrid.addEventListener('click', (e) => {
      // 1. Sevimlilar
      const wishBtn = e.target.closest('.wishlist-btn');
      if (wishBtn) {
        e.stopPropagation();
        toggleWishlist(Number(wishBtn.dataset.id));
        return;
      }

      // 2. Katta "Savatga qo'shish" tugmasi
      const addCartBtn = e.target.closest('.btn-add-cart-main');
      if (addCartBtn) {
        e.stopPropagation();
        addToCart(Number(addCartBtn.dataset.id), 1);
        return;
      }

      // 3. Savatdagi tovar sonini oshirish/kamaytirish (+ / -)
      const qtyPlus = e.target.closest('.btn-qty-plus');
      if (qtyPlus) {
        e.stopPropagation();
        updateCartQuantity(Number(qtyPlus.dataset.id), 1);
        return;
      }

      const qtyMinus = e.target.closest('.btn-qty-minus');
      if (qtyMinus) {
        e.stopPropagation();
        updateCartQuantity(Number(qtyMinus.dataset.id), -1);
        return;
      }

      // 4. 1-bosishda tezkor xarid
      const buyFastBtn = e.target.closest('.btn-buy-fast');
      if (buyFastBtn) {
        e.stopPropagation();
        openFastBuy(Number(buyFastBtn.dataset.id));
        return;
      }

      // 5. Tezkor ko'rish (Quick View)
      const qvBtn = e.target.closest('.quick-view-btn');
      const openDetail = e.target.closest('[data-action="open-detail"]');
      if (qvBtn || openDetail) {
        e.stopPropagation();
        const id = Number((qvBtn || openDetail).dataset.id);
        openQuickView(id);
        return;
      }
    });
  }

  // Mobil Filtr Tugmasi
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const filterSidebar = document.querySelector('.filter-sidebar');
  if (mobileFilterBtn && filterSidebar) {
    mobileFilterBtn.addEventListener('click', () => {
      filterSidebar.classList.toggle('mobile-open');
      if (modalBackdrop) modalBackdrop.classList.toggle('active');
    });
  }

  // Promo bannerlar
  document.querySelectorAll('.open-product-qv').forEach(banner => {
    banner.addEventListener('click', () => {
      const pId = Number(banner.dataset.productId);
      if (pId) openQuickView(pId);
    });
  });

  // Telefon inputi
  const customerPhone = document.getElementById('customerPhone');
  if (customerPhone) {
    customerPhone.addEventListener('focus', () => {
      if (!customerPhone.value) customerPhone.value = '+998 ';
    });
  }

  // Drawer va Modallarni ochish
  const openCartBtn = document.getElementById('openCartBtn');
  const openCartMobile = document.getElementById('openCartMobile');
  const openWishBtn = document.getElementById('openWishBtn');
  const openWishMobile = document.getElementById('openWishMobile');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');

  if (openCartBtn) openCartBtn.addEventListener('click', () => { renderCartDrawer(); openModal(cartDrawer); });
  if (openCartMobile) openCartMobile.addEventListener('click', () => { renderCartDrawer(); openModal(cartDrawer); });
  if (openWishBtn) openWishBtn.addEventListener('click', () => { renderWishlistDrawer(); openModal(wishlistDrawer); });
  if (openWishMobile) openWishMobile.addEventListener('click', () => { renderWishlistDrawer(); openModal(wishlistDrawer); });

  // Yopish tugmalari
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeAllModals);
  }
  document.getElementById('closeOrderNoticeBtn')?.addEventListener('click', closeAllModals);

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);

  // Tungi rejim (Dark Mode)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      try {
        localStorage.setItem('bozorix_theme', isDark ? 'dark' : 'light');
      } catch (e) {}
      themeToggleBtn.innerHTML = isDark 
        ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
        : '<i class="fa-regular fa-moon"></i>';
    });

    if (safeGetStorage('bozorix_theme', 'light') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
    }
  }

  // ==========================================
  // Dastlabki Ishga Tushirish (Init)
  // ==========================================
  renderCategories();
  renderProducts();
  updateCartBadges();
  updateWishBadges();
  initCountdownTimer();
  initHeroSlider();
  initFaq();
});
