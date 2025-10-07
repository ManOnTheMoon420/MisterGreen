/* MR.GREEN — Smart Catalog + Cart + LINE/WhatsApp + i18n + Lightbox + Success */

// ===== CONFIG: ใส่ช่องทางจริงของร้านที่นี่ =====
const LINE_URL = "https://line.me/ti/p/kcBcS1-8Dp"; // ← ใส่ Line ID จริง
const WHATSAPP_URL = "https://wa.me/+66875658825"; // ← ใส่เบอร์จริง (รูปแบบ 66xxxxxxxxx)
let currentLang = "EN";

// ===== DATA: สินค้าตัวอย่าง (แก้ชื่อ/ราคา/สต็อก/รูปได้) =====
const PRODUCTS = [
  {id:'bcr', name:'Black Cherry Runtz', type:'Sativa', thc:28, price:300, stock:12, img:'assets/products/black-cherry-runtz.jpg'},
  {id:'stb', name:'Strawberry Bule', type:'Sativa', thc:30, price:300, stock:10, img:'assets/products/strawberry-bule.jpg'},
  {id:'sbf', name:'Super Boof', type:'Sativa', thc:29, price:300, stock:11, img:'assets/products/super-boof.jpg'},
  {id:'zoap', name:'The Zoap', type:'Sativa', thc:29, price:300, stock:9, img:'assets/products/the-zoap.jpg'},
  {id:'cnc', name:'Cookies N Cream', type:'Sativa', thc:28, price:300, stock:14, img:'assets/products/cookies-n-cream.jpg'},
  {id:'lmd', name:'Lemon Diesel', type:'Sativa', thc:30, price:400, stock:7, img:'assets/products/lemon-diesel.jpg'},
  {id:'spq', name:'Special Queen', type:'Sativa', thc:29, price:400, stock:15, img:'assets/products/special-queen.jpg'},
  {id:'sap', name:'Sour Apple', type:'Indica', thc:29, price:300, stock:8, img:'assets/products/sour-apple.jpg'},
  {id:'sub0', name:'Sub Zero', type:'Hybrid', thc:30, price:400, stock:6, img:'assets/products/sub-zero.jpg'},
];

// ===== STATE & HELPERS =====
const cart = [];
const el = (s, c=document) => c.querySelector(s);
const baht = n => '฿' + n.toLocaleString('th-TH');

// i18n dictionary
function t(key){
  const D = {
    "Add to Cart": {"TH":"เพิ่มลงตะกร้า","EN":"Add to Cart"},
    "Stock": {"TH":"คงเหลือ","EN":"Stock"},
    "Qty": {"TH":"จำนวน","EN":"Qty"},
    "Remove": {"TH":"ลบ","EN":"Remove"},
    "Cart empty": {"TH":"ตะกร้าว่างเปล่า","EN":"Your cart is empty"},
    "Added": {"TH":"เพิ่มแล้ว","EN":"Added"},
    "Total": {"TH":"รวมทั้งหมด","EN":"Total"},
    "Hello! I'd like to order:": {"TH":"สวัสดีครับ/ค่ะ! ฉันต้องการสั่งซื้อ:","EN":"Hello! I'd like to order:"},
    "Order sent!": {"TH":"ส่งคำสั่งซื้อแล้ว!","EN":"Order sent!"},
    "Thanks. We’ve received your message.": {"TH":"ขอบคุณ เราได้รับข้อความของคุณแล้ว","EN":"Thank you. We’ve received your message."},
    "Sending via LINE": {"TH":"จะส่งผ่าน LINE","EN":"Sending via LINE"},
    "Sending via WhatsApp": {"TH":"จะส่งผ่าน WhatsApp","EN":"Sending via WhatsApp"},
  };
  return D[key]?.[currentLang] ?? key;
}

// Detect platform (mobile → LINE, desktop → WhatsApp)
function getChannel(){
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return isMobile ? "LINE" : "WHATSAPP";
}
function getChannelURL(){ return getChannel()==="LINE" ? LINE_URL : WHATSAPP_URL; }
function updateChannelHint(){
  const hint = el('#channelHint');
  const ch = getChannel();
  hint.textContent = ch==="LINE" ? t("Sending via LINE") : t("Sending via WhatsApp");
  const cta = el('#checkoutBtn');
  const label = (currentLang==="TH" ? "สรุปคำสั่งซื้อผ่าน " : "Checkout via ");
  cta.textContent = `${label}${ch==="LINE"?"LINE":"WhatsApp"} (Demo)`;
}

// ===== RENDER: Products =====
function renderProducts(){
  const grid = el('#productGrid');
  grid.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" data-zoom="${p.img}">
      <div class="card-body">
        <div class="title"><h3>${p.name}</h3><span class="pill">${p.type}</span></div>
        <div class="meta">THC ${p.thc}%</div>
        <div class="price-stock">
          <span class="price">${baht(p.price)} / g</span>
          <span class="stock" id="stock-${p.id}">${t('Stock')}: ${p.stock}</span>
        </div>
        <div class="controls">
          <input type="number" min="1" max="${p.stock}" value="1" id="qty-${p.id}" class="qty">
          <button class="btn primary" id="btn-${p.id}" ${p.stock===0?'disabled':''}>${t('Add to Cart')}</button>
        </div>
      </div>`;
    grid.appendChild(card);

    // Add to Cart
    el(`#btn-${p.id}`, card).addEventListener('click', ()=>{
      const qty = Math.max(1, Math.min(parseInt(el(`#qty-${p.id}`, card).value || 1), p.stock));
      addToCart(p, qty);
    });

    // Zoom image
    const img = card.querySelector('img[data-zoom]');
    img.addEventListener('click', ()=> openLightbox(img.getAttribute('data-zoom')));
  });
}

// ===== CART =====
function addToCart(p, qty){
  if(p.stock<=0) return;
  p.stock -= qty;
  el(`#stock-${p.id}`).textContent = `${t('Stock')}: ${p.stock}`;
  if(p.stock===0) el(`#btn-${p.id}`).disabled = true;

  const row = cart.find(i=>i.id===p.id);
  if(row) row.qty += qty; else cart.push({id:p.id, qty});
  updateCart();
  toast(`${t('Added')} ${qty}× ${p.name}`);
}

function removeItem(id){
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>-1){
    const item = cart[idx];
    const prod = PRODUCTS.find(p=>p.id===id);
    prod.stock += item.qty;
    cart.splice(idx,1);
    renderProducts();
    updateCart();
  }
}

function cartTotal(){
  return cart.reduce((sum, i)=> {
    const p = PRODUCTS.find(x=>x.id===i.id);
    return sum + (p.price * i.qty);
  }, 0);
}

function updateCart(){
  const box = el('#cartItems');
  if(cart.length===0){
    box.innerHTML = `<p class="muted">${t('Cart empty')}</p>`;
  }else{
    box.innerHTML = '';
    cart.forEach(item=>{
      const p = PRODUCTS.find(x=>x.id===item.id);
      box.innerHTML += `
        <div class="cart-row">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <strong>${p.name}</strong>
            <div class="meta">${p.type} · THC ${p.thc}%</div>
            <div class="meta">${t('Qty')}: ${item.qty} · ${baht(p.price)}</div>
          </div>
          <button class="btn" onclick="removeItem('${p.id}')">${t('Remove')}</button>
        </div>`;
    });
  }
  el('#cartCount').textContent = cart.reduce((n,i)=>n+i.qty,0);
  el('#cartTotal').textContent = baht(cartTotal());
  updateChannelHint();
}

// ===== SEND ORDER (Demo) =====
function sendOrder(){
  if(cart.length===0) return toast(t('Cart empty'));

  const lines = cart.map(i=>{
    const p=PRODUCTS.find(x=>x.id===i.id);
    return `${p.name} (${p.type}, THC ${p.thc}%) ×${i.qty}g = ${baht(p.price*i.qty)}`;
  }).join('%0A');

  const total = baht(cartTotal());
  const text = encodeURI(`${t("Hello! I'd like to order:")}%0A${lines}%0A%0A${t('Total')}: ${total}`);
  window.open(getChannelURL() + "?text=" + text, "_blank");

  // แสดง Success modal (เดโม่) และล้างตะกร้าในหน้า
  showSuccess();
  cart.splice(0, cart.length);
  renderProducts();
  updateCart();
}

// ===== Drawer + Toast =====
const drawer = el('#cartDrawer');
el('#cartBtn').onclick = ()=> drawer.classList.add('open');
el('#closeDrawer').onclick = ()=> drawer.classList.remove('open');
el('#checkoutBtn').onclick = sendOrder;

function toast(msg){
  const tEl = el('#toast');
  tEl.textContent = msg;
  tEl.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=> tEl.classList.remove('show'), 1800);
}

// ===== Lightbox =====
function openLightbox(src){
  el('#lightboxImg').src = src;
  el('#lightbox').classList.add('show');
}
function closeLightbox(){
  el('#lightbox').classList.remove('show');
  el('#lightboxImg').src = '';
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLightbox(); });

// ===== Success Modal =====
function showSuccess(){
  el('#successTitle').textContent = t('Order sent!');
  el('#successBody').textContent = t("Thanks. We’ve received your message.");
  el('#successModal').classList.add('show');
}
function closeSuccess(){ el('#successModal').classList.remove('show'); }

// ===== Language toggle =====
function toggleLang(){
  currentLang = currentLang==="EN" ? "TH" : "EN";
  renderProducts(); updateCart();
  el('#langBtn').textContent = currentLang==="EN" ? "🌏 Language" : "🌏 ภาษา";
  toast(currentLang==="EN" ? "Language: English" : "เปลี่ยนเป็นภาษาไทยแล้ว");
}

// ===== INIT =====
renderProducts();
updateCart();
updateChannelHint();
el('#langBtn') && (el('#langBtn').textContent = currentLang==="EN" ? "🌏 Language" : "🌏 ภาษา");
// โหลดสินค้าแบบไดนามิกจาก data/products.json
async function loadProducts() {
  try {
    const res = await fetch('data/products.json', { cache: 'no-store' });
    const items = await res.json();
    renderProducts(items);
  } catch (err) {
    console.error('Load products failed:', err);
    document.getElementById('catalog').innerHTML =
      `<p class="error">Cannot load products. Please refresh.</p>`;
  }
}

// วาดการ์ดสินค้า
function renderProducts(items) {
  const wrap = document.getElementById('catalog');
  wrap.innerHTML = items.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="card-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="chip">${p.type}</span>
        <span class="chip thc">THC ${p.thc}%</span>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="muted">Price</p>
        <div class="price-row">
          <strong class="price">${p.price.toLocaleString()} THB</strong>
          <span class="stock ${p.stock>0?'in':'out'}">
            ${p.stock>0?`Stock: ${p.stock}`:'Out of stock'}
          </span>
        </div>
        <button class="btn add" ${p.stock>0?'':'disabled'}>Add to Cart</button>
      </div>
    </article>
  `).join('');

  wrap.querySelectorAll('.btn.add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.closest('.card').dataset.id;
      addToCart(id);
    });
  });
}

// ตะกร้าแบบง่าย
const cart = {};
function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  toast('Added to cart');
  updateCartBadge();
}
function updateCartBadge(){
  const total = Object.values(cart).reduce((a,b)=>a+b,0);
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  badge.textContent = total;
  badge.style.display = total ? 'inline-flex' : 'none';
}
function toast(msg){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=> el.classList.add('show'), 10);
  setTimeout(()=> { el.classList.remove('show'); el.remove(); }, 2200);
}

// เริ่มทำงาน
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartBadge();
});
/* =============================
   CONFIG – ปรับให้เป็นของร้านคุณ
================================*/
const WHATSAPP_NUMBER = "+66875658825'; // เบอร์แบบรหัสประเทศ
const LINE_OPEN_URL ='https://line.me/ti/p/kcBcS1-8Dp'; // ลิงก์แอด/แชทร้าน
const STORE_NAME = 'MR.GREEN Cannabis Shop';
const STORE_URL = 'https://www.mistergreencannbisshop.com'; // หรือโดเมนจริงของคุณ

/* =============================
   ตัวอย่างโครงตะกร้า (ถ้ายังไม่มี)
   cart = [{ id, name, price, qty }]
================================*/
let cart = cart || []; // ถ้ามี cart อยู่แล้วจะไม่ทับ

// formatter เงิน THB
const fmtTHB = new Intl.NumberFormat('th-TH', { style:'currency', currency:'THB', maximumFractionDigits:0 });

// อัพเดต UI ตะกร้าอย่างง่าย
function renderCart() {
  const wrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!wrap || !totalEl) return;

  if (cart.length === 0) {
    wrap.innerHTML = '<p>ตะกร้ายังว่างอยู่</p>';
    totalEl.textContent = fmtTHB.format(0);
    return;
  }

  let html = '';
  let total = 0;
  cart.forEach((it, idx) => {
    const line = it.price * it.qty;
    total += line;
    html += `
      <div class="cart-row">
        <div class="cart-name">${it.name}</div>
        <div class="cart-qty">x${it.qty}</div>
        <div class="cart-price">${fmtTHB.format(line)}</div>
        <button class="cart-remove" data-idx="${idx}">ลบ</button>
      </div>
    `;
  });
  wrap.innerHTML = html;
  totalEl.textContent = fmtTHB.format(total);

  // bind ลบ
  wrap.querySelectorAll('.cart-remove').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const idx = +e.currentTarget.dataset.idx;
      cart.splice(idx,1);
      renderCart();
    });
  });
}

// ฟังก์ชันเพิ่มสินค้าเข้าตะกร้า (เรียกจากปุ่ม Add to Cart ของแต่ละสินค้า)
function addToCart(product) {
  // product: {id, name, price}
  const found = cart.find(it => it.id === product.id);
  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
}

// สร้างข้อความสรุปรายการออเดอร์สำหรับส่งแชท
function buildCartMessage() {
  if (cart.length === 0) return '';

  const ts = new Date().toLocaleString('th-TH');
  let totalQty = 0;
  let total = 0;
  const lines = cart.map((it, idx) => {
    const line = it.price * it.qty;
    totalQty += it.qty;
    total += line;
    return `${idx+1}. ${it.name} x${it.qty} = ${fmtTHB.format(line)}`;
  });

  const msg =
`🛒 ${STORE_NAME} – Order Draft
วันที่: ${ts}

รายการ:
${lines.join('\n')}

รวมจำนวน: ${totalQty} ชิ้น
ยอดรวมทั้งสิ้น: ${fmtTHB.format(total)}

โปรดพิมพ์:
• ชื่อ-นามสกุล
• เบอร์โทร
• ช่องทางรับสินค้า/ที่อยู่จัดส่ง

ดูสินค้าเพิ่มเติม: ${STORE_URL}
(ข้อความนี้ถูกสร้างอัตโนมัติจากหน้าตะกร้า)`;

  return msg;
}

// เปิด WhatsApp พร้อมข้อความ
function checkoutWhatsApp() {
  if (cart.length === 0) { alert('ตะกร้ายังว่างอยู่'); return; }
  const text = encodeURIComponent(buildCartMessage());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  window.open(url, '_blank');
}

// เปิด LINE พร้อมข้อความ (ผ่าน Share URL)
function checkoutLINE() {
  if (cart.length === 0) { alert('ตะกร้ายังว่างอยู่'); return; }
  const text = encodeURIComponent(buildCartMessage() + `\n\nติดต่อร้าน: ${LINE_OPEN_URL}`);
  // โหมดแชร์ข้อความ
  const shareUrl = `https://line.me/R/msg/text/?${text}`;
  // ถ้าต้องการเปิดห้องแชท OA โดยตรง (แนะนำบนมือถือ): ใช้ LINE_OPEN_URL
  window.open(shareUrl, '_blank');
}

// bind ปุ่มเช็คเอาต์
document.getElementById('checkout-wa')?.addEventListener('click', checkoutWhatsApp);
document.getElementById('checkout-line')?.addEventListener('click', checkoutLINE);

// เรียกครั้งแรกให้วาด UI ตะกร้า
renderCart();

/* ===== ตัวอย่าง: วิธีเรียก addToCart จากปุ่มสินค้า =====
<button onclick="addToCart({id:'black-cherry-runtz', name:'Black Cherry Runtz (Sativa)', price:650})">
  Add to Cart
</button>
=========================================================*/
