/* ============================================================
   Мехико — Cart Page Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Load cart from localStorage --- */
  let cart = JSON.parse(localStorage.getItem('mexico_cart') || '[]');

  const cartPageItems = document.getElementById('cartPageItems');
  const cartPageEmpty = document.getElementById('cartPageEmpty');
  const cartPageSidebar = document.getElementById('cartPageSidebar');
  const cartPageSubtotal = document.getElementById('cartPageSubtotal');
  const cartPageDeliveryFee = document.getElementById('cartPageDeliveryFee');
  const cartPageTotal = document.getElementById('cartPageTotal');
  const cartPageForm = document.getElementById('cartPageForm');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  function saveCart() {
    localStorage.setItem('mexico_cart', JSON.stringify(cart));
  }

  function renderCartPage() {
    if (cart.length === 0) {
      cartPageEmpty.style.display = 'block';
      cartPageItems.innerHTML = '';
      cartPageSidebar.style.display = 'none';
      return;
    }

    cartPageEmpty.style.display = 'none';
    cartPageSidebar.style.display = 'block';

    let total = 0;
    cartPageItems.innerHTML = cart.map((item, i) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-page-item">
          <div class="cart-page-item__info">
            <div class="cart-page-item__name">${item.name}</div>
            <div class="cart-page-item__price">${item.price} \u20BD за шт.</div>
          </div>
          <div class="cart-page-item__controls">
            <button class="cart-page-item__btn" data-action="minus" data-index="${i}">&minus;</button>
            <span class="cart-page-item__qty">${item.qty}</span>
            <button class="cart-page-item__btn" data-action="plus" data-index="${i}">+</button>
          </div>
          <div class="cart-page-item__subtotal">${subtotal} \u20BD</div>
          <button class="cart-page-item__remove" data-action="remove" data-index="${i}">&times;</button>
        </div>
      `;
    }).join('');

    const deliveryFee = total >= 2000 ? 0 : 300;
    const grandTotal = total + deliveryFee;

    cartPageSubtotal.innerHTML = total + ' \u20BD';
    cartPageDeliveryFee.textContent = deliveryFee === 0 ? 'Бесплатно' : deliveryFee + ' \u20BD';
    cartPageTotal.innerHTML = grandTotal + ' \u20BD';
  }

  /* --- Cart item actions --- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index) || index < 0 || index >= cart.length) return;

    if (action === 'plus') {
      cart[index].qty++;
    } else if (action === 'minus') {
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    } else if (action === 'remove') {
      cart.splice(index, 1);
    }

    saveCart();
    renderCartPage();
  });

  /* --- Order form --- */
  if (cartPageForm) {
    cartPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (cart.length === 0) return;

      const total = cart.reduce((s, item) => s + item.price * item.qty, 0);
      const deliveryFee = total >= 2000 ? 0 : 300;
      const grandTotal = total + deliveryFee;

      modalTitle.textContent = 'Заказ оформлен!';
      modalText.textContent = `Ваш заказ на ${grandTotal} \u20BD принят. Курьер свяжется с вами для подтверждения доставки.`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      cartPageForm.reset();
      cart.length = 0;
      saveCart();
      renderCartPage();
    });
  }

  /* --- Modal close --- */
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* --- Initial render --- */
  renderCartPage();

});
