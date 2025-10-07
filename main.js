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
