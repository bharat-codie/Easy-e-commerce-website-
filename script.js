const PRODUCTS = [
  {id: 'p1', title: 'Classic White T‑Shirt', price: 399, img: 'https://picsum.photos/seed/p1/400/300'},
  {id: 'p2', title: 'Blue Denim Jeans', price: 1299, img: 'https://picsum.photos/seed/p2/400/300'},
  {id: 'p3', title: 'Sneakers (Unisex)', price: 1999, img: 'https://picsum.photos/seed/p3/400/300'},
  {id: 'p4', title: 'Sport Watch', price: 2499, img: 'https://picsum.photos/seed/p4/400/300'},
  {id: 'p5', title: 'Leather Wallet', price: 599, img: 'https://picsum.photos/seed/p5/400/300'},
  {id: 'p6', title: 'Cotton Hoodie', price: 899, img: 'https://picsum.photos/seed/p6/400/300'}
];

let cart = {};

const productsEl = document.getElementById('products');
const cartBtn = document.getElementById('cart-btn');
const cartCountEl = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

renderProducts(PRODUCTS);
loadCartFromStorage();
updateCartUI();

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', () => alert('Checkout simulated. This is frontend-only.'));
searchInput.addEventListener('input', handleFilter);
sortSelect.addEventListener('change', handleFilter);

function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="price">₹${p.price.toFixed(2)}</div>
      <div class="actions">
        <button class="btn" data-id="${p.id}">View</button>
        <button class="btn primary" data-add="${p.id}">Add to cart</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
  document.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.getAttribute('data-add'))));
}

function addToCart(id){
  if(!cart[id]) cart[id] = { ...PRODUCTS.find(p=>p.id===id), qty: 0 };
  cart[id].qty += 1;
  saveCartToStorage();
  updateCartUI();
  const btn = document.querySelector(`[data-add="${id}"]`);
  if(btn){ btn.textContent = 'Added ✓'; setTimeout(()=>btn.textContent='Add to cart',700); }
}

function updateCartUI(){
  const items = Object.values(cart);
  const count = items.reduce((s,i)=>s + i.qty, 0);
  cartCountEl.textContent = count;

  cartItemsEl.innerHTML = items.length ? items.map(it => `
    <div class="cart-item" data-id="${it.id}">
      <img src="${it.img}" alt="${it.title}">
      <div style="flex:1">
        <div style="font-weight:600">${it.title}</div>
        <div>₹${it.price.toFixed(2)} x ${it.qty} = ₹${(it.price*it.qty).toFixed(2)}</div>
        <div class="qty">
          <button class="btn" data-decrease="${it.id}">-</button>
          <span>${it.qty}</span>
          <button class="btn" data-increase="${it.id}">+</button>
          <button class="btn" data-remove="${it.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('') : '<div>Your cart is empty.</div>';

  const total = items.reduce((s,i)=>s + i.price * i.qty, 0);
  cartTotalEl.textContent = total.toFixed(2);

  document.querySelectorAll('[data-increase]').forEach(b => b.addEventListener('click', () => changeQty(b.getAttribute('data-increase'), 1)));
  document.querySelectorAll('[data-decrease]').forEach(b => b.addEventListener('click', () => changeQty(b.getAttribute('data-decrease'), -1)));
  document.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeFromCart(b.getAttribute('data-remove'))));
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(id){
  delete cart[id];
  saveCartToStorage();
  updateCartUI();
}

function openCart(){
  cartDrawer.classList.add('open');
  overlay.classList.remove('hidden');
  cartDrawer.setAttribute('aria-hidden','false');
}
function closeCart(){
  cartDrawer.classList.remove('open');
  overlay.classList.add('hidden');
  cartDrawer.setAttribute('aria-hidden','true');
}

function saveCartToStorage(){
  try{ localStorage.setItem('simple_shop_cart', JSON.stringify(cart)); }catch(e){console.warn('Storage error', e)}
}
function loadCartFromStorage(){
  try{
    const raw = localStorage.getItem('simple_shop_cart');
    if(raw) cart = JSON.parse(raw);
  }catch(e){cart = {}}
}

function handleFilter(){
  const q = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;
  let list = PRODUCTS.filter(p => p.title.toLowerCase().includes(q));
  if(sort === 'price-asc') list.sort((a,b)=>a.price - b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price - a.price);
  renderProducts(list);
}

window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeCart(); });
  
