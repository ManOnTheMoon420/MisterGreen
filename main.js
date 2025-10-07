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
