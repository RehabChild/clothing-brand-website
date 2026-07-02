// RehabChild — Shopping Cart System
const Cart = {
  items: JSON.parse(localStorage.getItem('rc_cart') || '[]'),

  save() {
    localStorage.setItem('rc_cart', JSON.stringify(this.items));
    this.updateBadge();
    this.renderDrawer();
  },

  add(product) {
    const existing = this.items.find(i => i.id === product.id && i.color === product.color);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
    this.openDrawer();
    this.showToast(`${product.name} added to cart`);
  },

  remove(id, color) {
    this.items = this.items.filter(i => !(i.id === id && i.color === color));
    this.save();
  },

  updateQty(id, color, qty) {
    const item = this.items.find(i => i.id === id && i.color === color);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save();
    }
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  clear() {
    this.items = [];
    this.save();
  },

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = this.count();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  },

  openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
  },

  closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  },

  renderDrawer() {
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    if (!body) return;

    if (this.items.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#C9BFB0" stroke-width="0.5"/>
            <path d="M14 18 h20 l-3 14 H17 Z" stroke="#C9BFB0" stroke-width="0.5" fill="none"/>
            <path d="M19 18 Q19 12 24 12 Q29 12 29 18" stroke="#C9BFB0" stroke-width="0.5" fill="none"/>
          </svg>
          <p class="cart-empty-text">Your cart is empty</p>
          <p class="cart-empty-sub">Add pieces from the collection</p>
        </div>`;
      if (footer) footer.style.display = 'none';
      return;
    }

    body.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <rect x="4" y="4" width="24" height="32" rx="1" stroke="#8C7F72" stroke-width="0.5"/>
          </svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-detail">${item.color} · GH₵ ${item.price.toLocaleString()}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.color}', ${item.qty - 1})">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', '${item.color}', ${item.qty + 1})">+</button>
            <button class="remove-btn" onclick="Cart.remove('${item.id}', '${item.color}')">Remove</button>
          </div>
        </div>
        <div class="cart-item-price">GH₵ ${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('');

    if (footer) {
      footer.style.display = 'block';
      document.getElementById('cartTotal').textContent = `GH₵ ${this.total().toLocaleString()}`;
    }
  },

  showToast(msg) {
    let toast = document.getElementById('cartToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  },

  init() {
    this.updateBadge();
    this.renderDrawer();
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => Cart.init());