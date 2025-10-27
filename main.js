/* ---------------------------
   Minimal “looks-like-shop” without payment
----------------------------*/
const products = [
  // --- EXISTING PRODUCTS (with updated ID for consistency) ---
  {
    id: 'king-shadow',
    name: 'King Shadow',
    notes: ['Relax', 'Creamy', 'Earthy'],
    tag: 'relax',
    thc: '30%',
    flavor: 'Creamy Earthy Sweet'
  },
  {
    id: 'ice-cream-cake-old', // เปลี่ยน ID เพื่อหลีกเลี่ยงการซ้ำกับรายการใหม่
    name: 'Ice Cream Cake',
    notes: ['Relax', 'Dessert', 'Smooth'],
    tag: 'relax',
    thc: '29%',
    flavor: 'Vanilla Dessert Sweet'
  },
  // --- NEW PRODUCTS BASED ON YOUR LIST ---
  {
    id: 'special-queen',
    name: 'Special Queen',
    notes: ['Balanced', 'Clear-headed', 'Uplifting'],
    tag: 'uplift',
    thc: '22%', 
    flavor: 'Herbal, earthy, floral'
  },
  {
    id: 'big-ripper',
    name: 'Big Ripper',
    notes: ['Energizing', 'Refreshing', 'Focused'],
    tag: 'uplift',
    thc: '25%',
    flavor: 'Citrus, gassy, herbal'
  },
  {
    id: 'kaysu-bubba-kush',
    name: 'Kaysu Bubba Kush',
    notes: ['Heavy', 'Deeply Relaxing', 'Sleepy'],
    tag: 'sleep',
    thc: '29%',
    flavor: 'Earthy, coffee, dried floral'
  },
  {
    id: 'blazed-muay-thai',
    name: 'Blazed Muay Thai',
    notes: ['Active', 'Fun', 'Full of Energy'],
    tag: 'uplift',
    thc: '24%',
    flavor: 'Herbal, spicy, citrus fruit'
  },
  {
    id: 'alien-mint',
    name: 'Alien Mint',
    notes: ['Clear Mind', 'Refreshing', 'Stress Relief'],
    tag: 'focus',
    thc: '26%',
    flavor: 'Cool mint, sweet herbal'
  },
  {
    id: 'black-out-cherry',
    name: 'Black Out Cherry',
    notes: ['Heavy', 'Deep Calm', 'Good for Sleep'],
    tag: 'sleep',
    thc: '30%',
    flavor: 'Dark cherry, earthy, floral'
  },
  {
    id: 'cookies-n-cream',
    name: 'Cookies n Cream',
    notes: ['Light High', 'Happy', 'Clear Mind'],
    tag: 'focus',
    thc: '23%',
    flavor: 'Cookie, cream, vanilla'
  },
  {
    id: 'lemon-diesel',
    name: 'Lemon Diesel',
    notes: ['Energetic', 'Focused', 'Cheerful'],
    tag: 'focus',
    thc: '25%',
    flavor: 'Lemon, gas, herbal'
  },
  {
    id: 'dark-knight',
    name: 'Dark Knight',
    notes: ['Heavy Body', 'Calm Mind', 'Sleepy'],
    tag: 'sleep',
    thc: '28%',
    flavor: 'Berry, chocolate, earthy'
  },
  {
    id: 'blank-check',
    name: 'Blank Check',
    notes: ['Balanced', 'Mellow', 'Relaxed'],
    tag: 'relax',
    thc: '27%',
    flavor: 'Creamy, fruity, gassy'
  },
  {
    id: 'night-move',
    name: 'Night Move',
    notes: ['Calm', 'Heavy Body', 'Good Sleep'],
    tag: 'sleep',
    thc: '29%',
    flavor: 'Deep berry, chocolate, pine'
  },
  {
    id: 'oreo-stomper',
    name: 'Oreo Stomper',
    notes: ['Relaxed', 'Smooth', 'Mellow'],
    tag: 'relax',
    thc: '26%',
    flavor: 'Cookie, cream, grape'
  },
  {
    id: 'mochi-gelato',
    name: 'Mochi Gelato',
    notes: ['Smooth High', 'Happy', 'Light Mind'],
    tag: 'uplift',
    thc: '24%',
    flavor: 'Creamy, fruity, floral'
  },
  {
    id: 'sub-zero',
    name: 'Sub Zero',
    notes: ['Cooling', 'Clear-headed', 'Fresh'],
    tag: 'focus',
    thc: '23%',
    flavor: 'Mint, menthol, floral'
  },
  {
    id: 'super-boof',
    name: 'Super Boof',
    notes: ['Euphoric', 'Bright', 'Relaxing'],
    tag: 'relax',
    thc: '27%',
    flavor: 'Sweet fruit, cream, gas'
  },
  {
    id: 'bolo-runtz',
    name: 'Bolo Runtz',
    notes: ['Happy', 'Playful', 'Light High'],
    tag: 'uplift',
    thc: '24%',
    flavor: 'Candy, fruity, creamy'
  },
  {
    id: 'watermelon-zkittlez',
    name: 'Watermelon Zkittlez',
    notes: ['Relaxed', 'Fresh', 'Uplifting'],
    tag: 'relax',
    thc: '26%',
    flavor: 'Watermelon, candy, mixed fruit'
  },
  {
    id: 'zoap',
    name: 'Zoap',
    notes: ['Balanced', 'Clear-headed', 'Relaxed'],
    tag: 'relax',
    thc: '25%',
    flavor: 'Floral, fruity, soapy sweet'
  },
  {
    id: 'colombian-gold',
    name: 'Colombian Gold',
    notes: ['Energetic', 'Happy', 'Focused'],
    tag: 'uplift',
    thc: '22%',
    flavor: 'Earthy wood, herbal, dried floral'
  },
  {
    id: 'ice-cream-cake', // รายการ Ice Cream Cake ใหม่
    name: 'Ice Cream Cake',
    notes: ['Relaxed', 'Calm', 'Sleepy'],
    tag: 'sleep',
    thc: '28%',
    flavor: 'Sweet cream, vanilla'
  },
  {
    id: 'sour-apple',
    name: 'Sour Apple',
    notes: ['Refreshing', 'Energetic', 'Cheerful'],
    tag: 'uplift',
    thc: '24%',
    flavor: 'Sour apple, gas, sweet'
  },
  {
    id: 'bangkok-og',
    name: 'Bangkok OG',
    notes: ['Heavy Head', 'Deep Relaxation', 'Sleepy'],
    tag: 'sleep',
    thc: '31%',
    flavor: 'Earthy, pine, light citrus'
  }
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
