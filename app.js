// Renders homepage blocks + services/threads modals
window.AFF = window.AFF || {};

function qs(id){ return document.getElementById(id); }
function el(tag, cls){ const x=document.createElement(tag); if(cls) x.className=cls; return x; }

function openModal(title, desc, bullets, waText){
  const modal = document.getElementById("modal");
  if (!modal) return;

  qs("modalTitle").textContent = title;
  qs("modalDesc").textContent = desc;

  const ul = qs("modalList");
  ul.innerHTML = "";
  (bullets || []).forEach(b=>{
    const li = document.createElement("li");
    li.textContent = b;
    ul.appendChild(li);
  });

  const lang = AFF.getLang();
  const msg = encodeURIComponent((AFF.dict[lang]?.waMsg || AFF.dict.fr.waMsg) + " — " + waText);
  const wa = `https://wa.me/${AFF.config.whatsapp}?text=${msg}`;

  const modalWA = qs("modalWA");
  if (modalWA) modalWA.href = wa;

  modal.classList.add("show");
}

window.closeModal = function(){
  const modal = document.getElementById("modal");
  if (modal) modal.classList.remove("show");
};

document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape") window.closeModal();
});

document.addEventListener("click", (e)=>{
  const modal = document.getElementById("modal");
  if (modal && e.target === modal) window.closeModal();
});

async function renderHome(){
  const homeServices = qs("homeServices");
  const homeProducts = qs("homeProducts");
  const homeThreads  = qs("homeThreads");

  // Home services preview
  if (homeServices){
    const data = await AFF.loadJSON("./content/services.json");
    const list = (data.services || []).slice(0,6);
    homeServices.innerHTML = "";
    list.forEach(s=>{
      const card = el("article","card pad svc");
      card.tabIndex = 0;
      card.innerHTML = `
        <div class="top">
          <div class="icon"><span>${(s.icon || "A").slice(0,1).toUpperCase()}</span></div>
          <div class="pill"><i></i><span>${AFF.getText(s,"pill")}</span></div>
        </div>
        <div>
          <h3>${AFF.getText(s,"title")}</h3>
          <p>${AFF.getText(s,"desc")}</p>
        </div>
      `;
      const open = ()=>{
        openModal(
          AFF.getText(s,"title"),
          AFF.getText(s,"full"),
          (s.bullets && s.bullets[AFF.getLang()]) || (s.bullets && s.bullets.fr) || [],
          AFF.getText(s,"title")
        );
      };
      card.addEventListener("click", open);
      card.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); open(); }});
      homeServices.appendChild(card);
    });
  }

  // Home products preview
  if (homeProducts){
    const data = await AFF.loadJSON("./content/products.json");
    const list = (data.products || []).slice(0,4);
    homeProducts.innerHTML = "";
    list.forEach(p=>{
      const card = el("article","card product");
      card.innerHTML = `
        <div class="thumb"><img src="${p.image}" alt=""></div>
        <div class="body">
          <div class="tag"><i></i><span>${p.category}</span></div>
          <b>${AFF.getText(p,"title")}</b>
          <div class="price"><span>${AFF.getText(p,"instant")}</span><b>${AFF.money(p.price)}</b></div>
          <div class="buy"><button type="button" onclick="AFF.addToCart('${p.id}')">${(AFF.dict[AFF.getLang()]?.buyBtn)||'Acheter'}</button></div>
        </div>
      `;
      homeProducts.appendChild(card);
    });
  }

  // Home threads preview
  if (homeThreads){
    const data = await AFF.loadJSON("./content/threads.json");
    const list = (data.threads || []).slice(0,3);
    homeThreads.innerHTML = "";
    list.forEach(t=>{
      const card = el("article","card pad thread");
      card.innerHTML = `
        <h3>${AFF.getText(t,"title")}</h3>
        <p>${AFF.getText(t,"excerpt")}</p>
        <div class="meta"><span>Affican</span><a class="read" href="./threads.html">${(AFF.dict[AFF.getLang()]?.visitThreads)||'Lire'}</a></div>
      `;
      homeThreads.appendChild(card);
    });
  }
}

async function renderServicesPage(){
  const grid = qs("servicesGrid");
  if (!grid) return;
  const data = await AFF.loadJSON("./content/services.json");
  const list = (data.services || []);
  grid.innerHTML = "";
  list.forEach(s=>{
    const card = el("article","card pad svc");
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="top">
        <div class="icon"><span>${(s.icon || "A").slice(0,1).toUpperCase()}</span></div>
        <div class="pill"><i></i><span>${AFF.getText(s,"pill")}</span></div>
      </div>
      <div>
        <h3>${AFF.getText(s,"title")}</h3>
        <p>${AFF.getText(s,"desc")}</p>
      </div>
    `;
    const open = ()=>{
      const modal = qs("modal");
      if (!modal) return;
      qs("modalTitle").textContent = AFF.getText(s,"title");
      qs("modalDesc").textContent = AFF.getText(s,"full");

      const ul = qs("modalList");
      ul.innerHTML = "";
      const bullets = (s.bullets && s.bullets[AFF.getLang()]) || (s.bullets && s.bullets.fr) || [];
      bullets.forEach(b=>{
        const li=document.createElement("li"); li.textContent=b; ul.appendChild(li);
      });

      const lang = AFF.getLang();
      const msg = encodeURIComponent((AFF.dict[lang]?.waMsg || AFF.dict.fr.waMsg) + " — " + AFF.getText(s,"title"));
      qs("modalWA").href = `https://wa.me/${AFF.config.whatsapp}?text=${msg}`;

      modal.classList.add("show");
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); open(); }});
    grid.appendChild(card);
  });
}

async function renderThreadsPage(){
  const grid = qs("threadsGrid");
  if (!grid) return;

  const data = await AFF.loadJSON("./content/threads.json");
  const list = data.threads || [];
  grid.innerHTML = "";

  list.forEach(t=>{
    const card = el("article","card pad thread");
    card.tabIndex = 0;
    card.innerHTML = `
      <h3>${AFF.getText(t,"title")}</h3>
      <p>${AFF.getText(t,"excerpt")}</p>
      <div class="meta">
        <span>${t.category || "Affican"}</span>
        <a class="read" href="#" data-i18n="readMore">${(AFF.dict[AFF.getLang()]?.readMore) || "Lire"}</a>
      </div>
    `;

    const open = ()=>{
      const modal = qs("modal");
      if (!modal) return;

      qs("modalTitle").textContent = AFF.getText(t,"title");
      qs("modalDesc").textContent = AFF.getText(t,"body");

      const ul = qs("modalList");
      ul.innerHTML = "";
      const bullets = (t.points && t.points[AFF.getLang()]) || (t.points && t.points.fr) || [];
      bullets.forEach(b=>{
        const li=document.createElement("li"); li.textContent=b; ul.appendChild(li);
      });

      const lang = AFF.getLang();
      const msg = encodeURIComponent((AFF.dict[lang]?.waMsg || AFF.dict.fr.waMsg) + " — " + AFF.getText(t,"title"));
      qs("modalWA").href = `https://wa.me/${AFF.config.whatsapp}?text=${msg}`;

      modal.classList.add("show");
    };

    card.addEventListener("click", (e)=>{ if(e.target.closest("a")) { e.preventDefault(); open(); }});
    card.addEventListener("keydown",(e)=>{ if(e.key==="Enter"||e.key===" ") { e.preventDefault(); open(); }});
    grid.appendChild(card);
  });
}

window.sendMail = function(e){
  e.preventDefault();
  const name = (qs("name")?.value || "").trim();
  const subject = (qs("subject")?.value || "").trim();
  const message = (qs("message")?.value || "").trim();
  const sub = encodeURIComponent("[Affican Digital] " + subject);
  const body = encodeURIComponent(`${message}\n\n---\nNom: ${name}\nWhatsApp: +${AFF.config.whatsapp}`);
  window.location.href = `mailto:${AFF.config.email}?subject=${sub}&body=${body}`;
};

document.addEventListener("DOMContentLoaded", async ()=>{
  // rerender on language switch
  const rerender = async ()=>{
    await renderHome().catch(()=>{});
    await renderServicesPage().catch(()=>{});
    await renderThreadsPage().catch(()=>{});
    if (window.renderStore) window.renderStore();
    if (window.updateCartUI) window.updateCartUI();
  };

  // initial render
  await rerender();

  // when language changed by buttons -> we re-render
  ["btnFR","btnEN","btnAR"].forEach(id=>{
    const b = qs(id);
    if (b) b.addEventListener("click", ()=>setTimeout(rerender, 0));
  });
});