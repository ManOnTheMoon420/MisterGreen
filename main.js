/* =========
   CONFIG
========== */
// ใส่หมายเลข/ID ที่จะคุยจริงตอนกด Checkout
const LINE_ID = "https://line.me/ti/p/kcBcS1-8Dp"; // ตัวอย่าง: "@mrgreen"
const WHATSAPP_NUMBER = "+66875658825"; // ต้องเป็นรูปแบบสากล ไม่มี 0 นำหน้า (66... สำหรับไทย)

let sendChannel = "line"; // line | whatsapp

/* =========
   DATA
========== */
const products = [
  { id:"p1", name:"Black Cherry Runtz", strain:"Indica", thc:28, price:300, stock:18, img:"assets/products/black-cherry-runtz.jpg" },
  { id:"p2", name:"Strawberry Bule", strain:"Sativa", thc:30, price:400, stock:16, img:"assets/products/strawberry-bule.jpg" },
  { id:"p3", name:"Super Boof", strain:"Sativa", thc:29, price:400, stock:20, img:"assets/products/super-boof.jpg" },
  { id:"p4", name:"The Zoap", strain:"Sativa", thc:29, price:300, stock:14, img:"assets/products/the-zoap.jpg" },
  { id:"p5", name:"Cookies N Cream", strain:"Sativa", thc:28, price:300, stock:11, img:"assets/products/cookies-n-cream.jpg" },
  { id:"p6", name:"Lemon Diesel", strain:"Sativa", thc:30, price:400, stock:9, img:"assets/products/lemon-diesel.jpg" },
  { id:"p7", name:"Special Queen", strain:"Sativa", thc:29, price:400, stock:13, img:"assets/products/special-queen.jpg" },
  { id:"p8", name:"Sour Apple", strain:"Indica", thc:29, price:300, stock:13, img:"assets/products/special-queen.jpg" },
  { id:"p9", name:"Night Move", strain:"Indica", thc:29, price:400, stock:13, img:"assets/products/special-queen.jpg" },
  { id:"p10", name:"Big Ripper", strain:"Indica", thc:28, price:300, stock:13, img:"assets/products/special-queen.jpg" },
];

/* =========
   STATE
========== */
const cart = new Map(); // id -> { product, qty }

/* =========
   DOM READY
========== */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  bindChannelButtons();
});

/* =========
   RENDERING
========== */
function renderProducts(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map(p => {
    const stockBadge = p.stock <= 0
      ? `<span class="badge-out">หมด</span>`
      : (p.stock <= 5 ? `<span class="badge-low">เหลือน้อย</span>` : `<span class="badge-ok">พร้อมส่ง</span>`);

    return `
    <article class="card">
      <img src="${p.img}" alt="${p.name}" class="card-img" onclick="zoom('${p.img}')" />
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-meta">${p.strain} • THC ${p.thc}%</p>

        <div class="info">
          <span>${stockBadge}</span>
          <span>สต็อก: ${p.stock}</span>
        </div>

        <div class="card-buy">
          <span class="price">฿${formatBaht(p.price)}</span>
          <div class="qty">
            <button class="icon-btn" onclick="chgQty('${p.id}',-1)">–</button>
            <input id="qty-${p.id}" type="number" min="1" step="1" value="1" />
            <button class="icon-btn" onclick="chgQty('${p.id}',1)">+</button>
          </div>
          <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    </article>`;
  }).join("");
}

/* =========
   CART
========== */
function chgQty(id,delta){
  const el = document.getElementById(`qty-${id}`);
  const v = Math.max(1, parseInt(el.value||"1",10) + delta);
  el.value = v;
}

function addToCart(id){
  const product = products.find(p=>p.id===id);
  if(!product) return;

  const wanted = parseInt(document.getElementById(`qty-${id}`).value||"1",10);
  if (product.stock <= 0) { toast("สินค้าหมด"); return; }
  if (wanted > product.stock) { toast("เกินจำนวนสต็อก"); return; }

  const current = cart.get(id)?.qty || 0;
  const newQty = Math.min(product.stock, current + wanted);
  cart.set(id, { product, qty:newQty });

  updateCartUI();
  toast(`เพิ่ม ${product.name} x${wanted} แล้ว`);
}

function removeFromCart(id){
  cart.delete(id);
  updateCartUI();
}

function clearCart(){
  cart.clear();
  updateCartUI();
}

function updateCartUI(){
  // count
  const count = Array.from(cart.values()).reduce((n, it)=>n+it.qty, 0);
  document.getElementById("cartCount").textContent = count;

  // list
  const items = document.getElementById("cartItems");
  if (cart.size===0){
    items.innerHTML = `<p style="color:var(--muted);">ยังไม่มีสินค้าในตะกร้า</p>`;
  } else {
    items.innerHTML = Array.from(cart.values()).map(({product, qty}) => `
      <div class="cart-row">
        <img src="${product.img}" alt="${product.name}" />
        <div class="grow">
          <h4>${product.name}</h4>
          <div class="meta">${product.strain} • THC ${product.thc}%</div>
          <div class="meta">฿${formatBaht(product.price)} × ${qty}</div>
        </div>
        <div class="split">
          <button class="icon-btn" onclick="decItem('${product.id}')">–</button>
          <button class="icon-btn" onclick="incItem('${product.id}')">+</button>
          <button class="icon-btn" onclick="removeFromCart('${product.id}')" aria-label="remove">🗑</button>
        </div>
      </div>
    `).join("");
  }

  // total
  const total = Array.from(cart.values()).reduce((s, it)=>s + it.product.price*it.qty, 0);
  document.getElementById("cartTotal").textContent = `฿${formatBaht(total)}`;
  document.getElementById("checkoutBtn").disabled = cart.size===0;
}

function incItem(id){
  const entry = cart.get(id); if(!entry) return;
  if (entry.qty < entry.product.stock) entry.qty++;
  cart.set(id, entry);
  updateCartUI();
}
function decItem(id){
  const entry = cart.get(id); if(!entry) return;
  entry.qty--;
  if (entry.qty <= 0) cart.delete(id); else cart.set(id, entry);
  updateCartUI();
}

/* =========
   CHECKOUT → LINE / WA
========== */
function checkout(){
  if (cart.size === 0) return;

  const lines = [];
  lines.push("🛒 สรุปรายการสั่งซื้อจากเว็บไซต์ MR. GREEN");
  lines.push("— — —");
  let total = 0;

  cart.forEach(({product, qty})=>{
    const line = `• ${product.name} x${qty} @฿${formatBaht(product.price)} = ฿${formatBaht(product.price*qty)}`;
    lines.push(line);
    total += product.price*qty;
  });

  lines.push("— — —");
  lines.push(`ยอดรวม: ฿${formatBaht(total)}`);
  lines.push("");
  lines.push("ขอชื่อ/เบอร์ติดต่อ และที่อยู่จัดส่งด้วยครับ");

  const msg = encodeURIComponent(lines.join("\n"));

  if (sendChannel === "line"){
    // เปิดแชท LINE (ถ้ามี LINE app จะพาเข้าแอป)
    const url = `https://line.me/R/msg/text/?${msg}`;
    window.open(url, "_blank");
  } else {
    // WhatsApp
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    window.open(url, "_blank");
  }
}

/* =========
   UI helpers
========== */
function toggleCart(open){
  const el = document.getElementById("cartDrawer");
  el.setAttribute("aria-hidden", open ? "false" : "true");
}
function zoom(src){
  const box = document.getElementById("lightbox");
  document.getElementById("lightboxImg").src = src;
  box.setAttribute("aria-hidden","false");
}
function closeLightbox(){
  document.getElementById("lightbox").setAttribute("aria-hidden","true");
}
function toast(text){
  const t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 1800);
}
function formatBaht(n){ return n.toLocaleString("th-TH"); }

function bindChannelButtons(){
  const lb = document.getElementById("channelLabel");
  document.getElementById("chooseLineBtn").addEventListener("click", ()=>{
    sendChannel = "line";
    lb.textContent = "LINE";
    toast("จะส่งคำสั่งซื้อผ่าน LINE");
  });
  document.getElementById("chooseWhatsAppBtn").addEventListener("click", ()=>{
    sendChannel = "whatsapp";
    lb.textContent = "WhatsApp";
    toast("จะส่งคำสั่งซื้อผ่าน WhatsApp");
  });
}
