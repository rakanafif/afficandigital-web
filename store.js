window.AFF = window.AFF || {};

AFF.cart = JSON.parse(localStorage.getItem("aff_cart") || "[]");

AFF.saveCart = function(){
  localStorage.setItem("aff_cart", JSON.stringify(AFF.cart));
};

AFF.addToCart = async function(productId){
  const data = await AFF.loadJSON("./content/products.json");
  const p = (data.products || []).find(x=>x.id === productId);
  if (!p) return;

  const found = AFF.cart.find(x=>x.id === productId);
  if (found) found.qty += 1;
  else AFF.cart.push({id:p.id, qty:1});

  AFF.saveCart();
  if (window.updateCartUI) window.updateCartUI();
};

window.toggleCart = function(){
  const d = document.getElementById("cartDrawer");
  if (!d) return;
  d.classList.toggle("open");
};

window.clearCart = function(){
  AFF.cart = [];
  AFF.saveCart();
  if (window.updateCartUI) window.updateCartUI();
};

window.removeItem = function(id){
  AFF.cart = AFF.cart.filter(x=>x.id !== id);
  AFF.saveCart();
  if (window.updateCartUI) window.updateCartUI();
};

window.checkoutWhatsApp = async function(){
  const lang = AFF.getLang();
  const dict = AFF.dict[lang] || AFF.dict.fr;

  const data = await AFF.loadJSON("./content/products.json");
  const map = new Map((data.products || []).map(p=>[p.id,p]));

  let lines = [];
  let total = 0;

  AFF.cart.forEach(ci=>{
    const p = map.get(ci.id);
    if (!p) return;
    const title = AFF.getText(p,"title");
    const price = Number(p.price || 0);
    total += price * ci.qty;
    lines.push(`- ${title} x${ci.qty} = ${AFF.money(price * ci.qty)}`);
  });

  const msg = encodeURIComponent(
    `${dict.waMsg}\n\nCommande:\n${lines.join("\n")}\n\nTotal: ${AFF.money(total)}`
  );
  window.open(`https://wa.me/${AFF.config.whatsapp}?text=${msg}`,"_blank");
};

window.updateCartUI = async function(){
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!countEl || !itemsEl || !totalEl) return;

  countEl.textContent = AFF.cart.reduce((s,x)=>s+x.qty,0);

  const data = await AFF.loadJSON("./content/products.json");
  const map = new Map((data.products || []).map(p=>[p.id,p]));

  itemsEl.innerHTML = "";
  let total = 0;

  AFF.cart.forEach(ci=>{
    const p = map.get(ci.id);
    if (!p) return;
    const title = AFF.getText(p,"title");
    const price = Number(p.price || 0);
    total += price * ci.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <b>${title}</b><br/>
        <small>${AFF.money(price)} × ${ci.qty}</small>
      </div>
      <button type="button" onclick="removeItem('${ci.id}')">×</button>
    `;
    itemsEl.appendChild(div);
  });

  totalEl.textContent = AFF.money(total);
};

window.renderStore = async function(){
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const data = await AFF.loadJSON("./content/products.json");
  const list = data.products || [];

  const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
  const cat = (document.getElementById("cat")?.value || "all").toLowerCase();

  const filtered = list.filter(p=>{
    const t = (AFF.getText(p,"title") || "").toLowerCase();
    const okQ = !q || t.includes(q);
    const okC = (cat === "all") || (String(p.category||"").toLowerCase() === cat);
    return okQ && okC;
  });

  grid.innerHTML = "";
  filtered.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card product";
    card.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt=""></div>
      <div class="body">
        <div class="tag"><i></i><span>${p.category}</span></div>
        <b>${AFF.getText(p,"title")}</b>
        <div class="price"><span>${AFF.getText(p,"instant")}</span><b>${AFF.money(p.price)}</b></div>
        <div class="buy"><button type="button" onclick="AFF.addToCart('${p.id}')">${(AFF.dict[AFF.getLang()]?.buyBtn) || "Acheter"}</button></div>
      </div>
    `;
    grid.appendChild(card);
  });

  await window.updateCartUI();
};

document.addEventListener("DOMContentLoaded", ()=>{
  if (window.renderStore) window.renderStore();
});