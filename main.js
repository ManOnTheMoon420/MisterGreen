/* ---------------------------
   Minimal “looks-like-shop” without payment
----------------------------*/

const products = [
  {
    id: 'King-Shadow',
    name: 'King Shadow',
    notes: ['Relax', 'Creamy', 'Earthy'],
    tag: 'relax',
    thc: '30%', // เพิ่ม: ระดับ THC
    flavor: 'Creamy Earthy Sweet' // เพิ่ม: กลิ่น/รสชาติ
  },
  {
    id: 'Ice-Cream-Cake',
    name: 'Ice Cream Cake',
    notes: ['Relax', 'Dessert', 'Smooth'],
    tag: 'relax',
    thc: '29%',
    flavor: 'Vanilla Dessert Sweet'
  },
  {
    id: 'Dark-Knight',
    name: 'Dark Knight',
    notes: ['Sleep', 'Heavy', 'Piney'],
    tag: 'sleep',
    thc: '28%',
    flavor: 'Pine Earthy Gassy'
  },
  {
    id: 'Night-Move',
    name: 'Night Move',
    notes: ['Sleep', 'Body Relief'],
    tag: 'sleep',
    thc: '29%',
    flavor: 'Woody Earthy Herbal'
  },
  {
    id: 'Sour-Apple',
    name: 'Sour Apple',
    notes: ['Uplift', 'Crisp', 'Citrus'],
    tag: 'uplift',
    thc: '28%',
    flavor: 'Citrus Apple Tangy'
  },
  {
    id: 'Strawberry-Bule',
    name: 'Strawberry Bule',
    notes: ['Focus', 'Herbal', 'Minty'],
    tag: 'focus',
    thc: '21%',
    flavor: 'Berry Fruity Fresh'
  },
     {
    id: 'Lemon-Diesel',
    name: 'Lemon Diesel',
    notes: ['Focus', 'Herbal', 'Minty'],
    tag: 'focus',
    thc: '21%',
    flavor: 'Minty Herbal Fresh'
  },
  {
    id: 'Special-Queen',
    name: 'Special Queen',
    notes: ['Focus', 'Herbal', 'Minty'],
    tag: 'fo',
    thc: '21%',
    flavor: 'Minty Herbal Fresh'
  },
];

const $grid = document.getElementById('productGrid');
const $cartCount = document.getElementById('cartCount');
const $cartDrawer = document.getElementById('cartDrawer');
const $drawerBackdrop = document.getElementById('drawerBackdrop');
const $openCartBtn = document.getElementById('openCartBtn');
const $closeCartBtn = document.getElementById('closeCartBtn');
const $cartItems = document.getElementById('cartItems');
const $totalItems = document.getElementById('totalItems');
const $waBtn = document.getElementById('waBtn');
const $lineBtn = document.getElementById('lineBtn');
const $year = document.getElementById('year');

document.addEventListener('DOMContentLoaded', () => {
  $year.textContent = new Date().getFullYear();
  renderProducts(products);
  loadCart();
  bindFilters();
});

function renderProducts(list){
  $grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media">✦</div>
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <div class="badges">
          ${p.notes.map(n => `<span class="badge-soft">${n}</span>`).join('')}
        </div>
        <button class="btn-add" data-id="${p.id}">เพิ่มรายการ</button>
      </div>
    `;
    $grid.appendChild(card);
  });

  // attach add handlers
  $grid.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

/* ---------------------------
   Filters (UI only)
----------------------------*/
function bindFilters(){
  const chips = document.querySelectorAll('.chip');
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('is-active'));
    c.classList.add('is-active');
    const tag = c.dataset.filter;
    if(tag === 'all') renderProducts(products);
    else renderProducts(products.filter(p => p.tag === tag));
  }));
}

/* ---------------------------
   Cart (no payment)
----------------------------*/
let cart = []; // [{id, name, qty}]

function loadCart(){
  try{
    const raw = localStorage.getItem('mrgreen_cart');
    cart = raw ? JSON.parse(raw) : [];
  }catch(_e){ cart = []; }
  updateCartUI();
}

function saveCart(){
  localStorage.setItem('mrgreen_cart', JSON.stringify(cart));
}

function addToCart(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  const existing = cart.find(x => x.id === id);
  if(existing) existing.qty += 1;
  else cart.push({ id, name: p.name, qty: 1 });
  saveCart();
  updateCartUI();
  openDrawer();
}

function removeFromCart(id){
  cart = cart.filter(x => x.id !== id);
  saveCart(); updateCartUI();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(); updateCartUI();
}

function updateCartUI(){
  $cartCount.textContent = cart.reduce((s,x) => s + x.qty, 0);
  $totalItems.textContent = $cartCount.textContent;

  if(cart.length === 0){
    $cartItems.innerHTML = `<p class="muted" style="padding:8px 4px">ยังไม่มีรายการ กด “เพิ่มรายการ” จากหน้าสินค้าได้เลย</p>`;
    return;
  }

  $cartItems.innerHTML = cart.map(x => `
    <div class="cart-item">
      <div>
        <div class="item-title">${x.name}</div>
        <button class="remove-btn" data-id="${x.id}">ลบ</button>
      </div>
      <div class="qty">
        <button class="qty-btn" data-action="minus" data-id="${x.id}">−</button>
        <div>${x.qty}</div>
        <button class="qty-btn" data-action="plus" data-id="${x.id}">+</button>
      </div>
    </div>
  `).join('');

  // bind qty & remove
  $cartItems.querySelectorAll('.qty-btn').forEach(b=>{
    const id = b.dataset.id;
    const action = b.dataset.action;
    b.addEventListener('click', () => changeQty(id, action === 'plus' ? +1 : -1));
  });
  $cartItems.querySelectorAll('.remove-btn').forEach(b=>{
    b.addEventListener('click', () => removeFromCart(b.dataset.id));
  });
}

/* ---------------------------
   Drawer controls
----------------------------*/
$openCartBtn.addEventListener('click', openDrawer);
$closeCartBtn.addEventListener('click', closeDrawer);
$drawerBackdrop.addEventListener('click', closeDrawer);

function openDrawer(){ $cartDrawer.classList.add('open'); }
function closeDrawer(){ $cartDrawer.classList.remove('open'); }

/* ---------------------------
   Chat-to-Order message
----------------------------*/
function buildOrderMessage(){
  const ts = new Date().toLocaleString('th-TH');
  const head = `สวัสดีครับ ผมต้องการสั่งซื้อจาก Mr.Green\nเวลาที่สั่ง: ${ts}\n\nรายการ:\n`;
  const body = cart.length
    ? cart.map((x,i)=>`${i+1}. ${x.name} × ${x.qty}`).join('\n')
    : '(ยังไม่มีรายการในตะกร้า)';
  const tail = `\n\nติดต่อกลับได้เลยครับ ขอบคุณครับ 🙏`;
  return head + body + tail;
}

function encodeWhatsAppText(t){
  return encodeURIComponent(t);
}

$waBtn.addEventListener('click', ()=>{
  const msg = buildOrderMessage();
  const link = `${window.APP_CONTACT.waLink}?text=${encodeWhatsAppText(msg)}`;
  window.open(link, '_blank', 'noopener');
});

$lineBtn.addEventListener('click', async ()=>{
  const msg = buildOrderMessage();

  // 1) คัดลอกข้อความให้ (เพื่อให้แปะใน LINE ได้ทันที)
  try{
    await navigator.clipboard.writeText(msg);
    document.getElementById('copyHint').textContent = 'คัดลอกรายการแล้ว ✔ วางข้อความในแชท LINE ได้เลย';
  }catch(_e){
    document.getElementById('copyHint').textContent = 'คัดลอกไม่สำเร็จ โปรดคัดลอกด้วยตนเองในหน้าถัดไป';
  }

  // 2) เปิดลิงก์ LINE ที่ให้มา
  window.open(window.APP_CONTACT.lineLink, '_blank', 'noopener');
});

/* Accessibility: Enter to open cart from header */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'c' && (e.ctrlKey || e.metaKey)){ openDrawer(); }
});
