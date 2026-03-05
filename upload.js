function addPreviewNode(node){
  const preview = document.getElementById("preview");
  if (!preview) return;
  const wrap = document.createElement("div");
  wrap.className = "prev";
  wrap.appendChild(node);
  preview.appendChild(wrap);
}

window.clearPreview = function(){
  const preview = document.getElementById("preview");
  if (preview) preview.innerHTML = "";
};

document.addEventListener("DOMContentLoaded", ()=>{
  const media = document.getElementById("mediaInput");
  const files = document.getElementById("fileInput");
  if (!media || !files) return;

  media.addEventListener("change",(e)=>{
    const list = Array.from(e.target.files || []);
    list.forEach(f=>{
      const url = URL.createObjectURL(f);
      if (f.type.startsWith("image/")){
        const img = document.createElement("img");
        img.src = url; img.alt = f.name;
        addPreviewNode(img);
      } else if (f.type.startsWith("video/")){
        const v = document.createElement("video");
        v.src = url;
        v.controls = true;
        v.playsInline = true;
        addPreviewNode(v);
      }
    });
    e.target.value = "";
  });

  files.addEventListener("change",(e)=>{
    const list = Array.from(e.target.files || []);
    list.forEach(f=>{
      const s = document.createElement("small");
      s.textContent = "📄 " + f.name;
      addPreviewNode(s);
    });
    e.target.value = "";
  });
});

/*
✅ رفع حقيقي (اختياري) عبر Cloudinary:
- تحتاج حساب Cloudinary + Upload Preset (unsigned)
- عندها نبدل هذا الملف بكود يرفع مباشرة ويرجع رابط
*/