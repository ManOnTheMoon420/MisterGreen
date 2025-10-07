// simple in-page cart mock
const cart = [];

function addToCart(productId) {
  cart.push(productId);
  alert('เพิ่มสินค้าลงตะกร้า: ' + productId + '\\nจำนวนในตะกร้า: ' + cart.length);
  // ที่จริงแล้วควรอัปเดต UI ตะกร้าและส่งต่อไปยัง checkout
}

document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('ขอบคุณสำหรับข้อความ เราจะติดต่อกลับเร็วๆ นี้');
  // ส่งข้อมูลไป backend จริง
});
// ---------- CONFIG: รายการสินค้า ----------
const products = [
  {
    name: "Black Cherry Runtz",
    type: "Sativa",
    thc: 28,
    img: "assets/images/menu/black-cherry-runtz.jpg"
  },
  {
    name: "Strawberry Bule",
    type: "Sativa",
    thc: 30,
    img: "assets/images/menu/strawberry-bule.jpg"
  },
  {
    name: "Super Boof",
    type: "Sativa",
    thc: 29,
    img: "assets/images/menu/super-boof.jpg"
  },
  {
    name: "The Zoap",
    type: "Sativa",
    thc: 29,
    img: "assets/images/menu/the-zoap.jpg"
  },
  {
    name: "Cookies N Cream",
    type: "Sativa",
    thc: 28,
    img: "assets/images/menu/cookies-n-cream.jpg"
  },
  {
    name: "Lemon Diesel",
    type: "Sativa",
    thc: 30,
    img: "assets/images/menu/lemon-diesel.jpg"
  },
  {
    name: "Special Queen",
    type: "Sativa",
    thc: 29,
    img: "assets/images/menu/special-queen.jpg"
  },
  {
    name: "Sour Apple",
    type: "Indica",
    thc: 29,
    img: "assets/images/menu/sour-apple.jpg"
  },
  {
    name: "Sub Zero",
    type: "Hybrid",
    thc: 30,
    img: "assets/images/menu/sub-zero.jpg"
  }
];

// ช่องทางติดต่อ (แก้เป็นลิงก์ของร้านคุณเอง)
const LINKS = {
  line: "https://line.me/ti/p/kcBcS1-8Dp",
  whatsapp: "https://wa.me/+66875658825", // ใส่เบอร์แบบสากล ไม่ต้องมี 0 นำหน้า
  maps: "https://maps.app.goo.gl/nkHDDbdEHwwE2CdW9"
};

// ---------- RENDER ----------
function typeBadge(t) {
  const cls = t.toLowerCase()==="indica" ? "badge indica"
           : t.toLowerCase()==="hybrid" ? "badge hybrid"
           : "badge"; // sativa
  return `<span class="${cls}">${t}</span>`;
}

function createCard(p){
  return `
  <article class="card">
    <img class="product-photo" src="${p.img}" alt="${p.name}">
    <div class="card-body">
      ${typeBadge(p.type)} <span class="badge">THC ${p.thc}%</span>
      <h3>${p.name}</h3>
      <p class="meta">Hand-trimmed • Clean burn • Terp-rich aroma</p>
      <div class="actions">
        <a class="btn" href="${LINKS.line}" target="_blank" rel="noopener">LINE</a>
        <a class="btn secondary" href="${LINKS.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
      <a class="btn secondary" style="margin-top:8px" href="${LINKS.maps}" target="_blank" rel="noopener">Find us on Maps</a>
      <img class="logo-mark" src="assets/images/mrgreen-logo.png" alt="Mr.Green">
    </div>
  </article>`;
}

function renderProducts(){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = products.map(createCard).join('');
}
document.addEventListener('DOMContentLoaded', renderProducts);
