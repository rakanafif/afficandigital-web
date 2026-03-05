// Loads content from /content/*.json and exposes helpers
window.AFF = window.AFF || {};

AFF.loadJSON = async function(path){
  const res = await fetch(path, {cache:"no-store"});
  if (!res.ok) throw new Error("Failed to load: " + path);
  return await res.json();
};

AFF.getText = function(item, field){
  const lang = AFF.getLang ? AFF.getLang() : "fr";
  if (item && item[field] && item[field][lang]) return item[field][lang];
  if (item && item[field] && item[field]["fr"]) return item[field]["fr"];
  return "";
};

AFF.money = function(n){
  const lang = AFF.getLang ? AFF.getLang() : "fr";
  const v = Number(n || 0);
  if (lang === "ar") return v.toFixed(0) + "€";
  return v.toFixed(0) + "€";
};