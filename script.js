/* ============================================================
   Мехико — Restaurant Website Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Header scroll effect --- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .btn--mobile');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* --- Menu filter --- */
  const filterBtns = document.querySelectorAll('.menu__filter');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerH = header.offsetHeight;
        const y = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ========== DELIVERY CART ========== */
  const cart = [];
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');
  const deliverySubmit = document.getElementById('deliverySubmit');

  function renderCart() {
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      cartFooterEl.style.display = 'none';
      cartItemsEl.innerHTML = '';
      deliverySubmit.disabled = true;
      return;
    }
    cartEmptyEl.style.display = 'none';
    cartFooterEl.style.display = 'block';
    deliverySubmit.disabled = false;

    let total = 0;
    cartItemsEl.innerHTML = cart.map((item, i) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      return `
        <div class="cart-item">
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">${item.price} \u20BD × ${item.qty} = ${subtotal} \u20BD</div>
          </div>
          <div class="cart-item__controls">
            <button class="cart-item__btn" data-action="minus" data-index="${i}">&minus;</button>
            <span class="cart-item__qty">${item.qty}</span>
            <button class="cart-item__btn" data-action="plus" data-index="${i}">+</button>
            <button class="cart-item__remove" data-action="remove" data-index="${i}">&times;</button>
          </div>
        </div>
      `;
    }).join('');

    cartTotalEl.innerHTML = total + ' \u20BD';
  }

  function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price: parseInt(price, 10), qty: 1 });
    }
    renderCart();
  }

  document.querySelectorAll('.btn--add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(name, price);

      btn.textContent = 'Добавлено!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = '+ В корзину';
        btn.classList.remove('added');
      }, 1200);
    });
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index, 10);
    if (isNaN(index)) return;

    if (action === 'plus') {
      cart[index].qty++;
    } else if (action === 'minus') {
      cart[index].qty--;
      if (cart[index].qty <= 0) cart.splice(index, 1);
    } else if (action === 'remove') {
      cart.splice(index, 1);
    }
    renderCart();
  });

  /* --- Delivery form --- */
  const deliveryForm = document.getElementById('deliveryForm');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  if (deliveryForm) {
    deliveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (cart.length === 0) return;

      const total = cart.reduce((s, item) => s + item.price * item.qty, 0);
      modalTitle.textContent = 'Заказ оформлен!';
      modalText.textContent = `Ваш заказ на ${total} \u20BD принят. Курьер свяжется с вами для подтверждения доставки.`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      deliveryForm.reset();
      cart.length = 0;
      renderCart();
    });
  }

  /* --- Reservation form --- */
  const orderForm = document.getElementById('orderForm');

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      modalTitle.textContent = 'Заявка отправлена!';
      modalText.textContent = 'Мы перезвоним вам в течение 15 минут для подтверждения бронирования.';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      orderForm.reset();
    });
  }

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* --- Fade-in on scroll (Intersection Observer) --- */
  const fadeEls = document.querySelectorAll(
    '.menu-card, .about__img-wrap, .about__text, .gallery__item, .order__info, .order__form, .delivery__info, .delivery__form, .stat'
  );

  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach(el => observer.observe(el));

  /* --- Set min date for reservation to today --- */
  const dateInput = orderForm ? orderForm.querySelector('input[type="date"]') : null;
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('value', today);
  }

});
