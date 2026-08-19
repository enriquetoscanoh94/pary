// ===== Bilingual dictionary (default HTML = Spanish) =====
const EN = {
  nav_services:"Services", nav_gallery:"Gallery", nav_why:"Why us", nav_contact:"Contact", nav_call:"Call",
  hero_eyebrow:"Stockton, CA & surrounding areas",
  hero_title:"Flawless stucco finishes for your home",
  hero_sub:"Installation, re-stucco and repair with clean, durable finishes. Quality work, free estimates.",
  hero_cta1:"Free estimate", hero_cta2:"209-612-3567",
  strip_1:"✔ Free estimates", strip_2:"✔ Residential & commercial", strip_3:"✔ Guaranteed work", strip_4:"✔ Se habla español",
  services_eyebrow:"What we do", services_title:"Our stucco services",
  svc1_t:"New stucco", svc1_d:"Complete stucco installation for new builds and additions, from start to finish.",
  svc2_t:"Re-stucco", svc2_d:"Refresh your home's exterior by covering old stucco with a fresh, modern finish.",
  svc3_t:"Stucco repair", svc3_d:"We fix cracks, holes and damage, blending the wall so repairs are invisible.",
  svc4_t:"Textures & finishes", svc4_d:"Smooth, sand, lace and dash finishes. The style that matches your property.",
  svc5_t:"Color coat", svc5_d:"Long-lasting color coat for an even tone with no need to paint.",
  svc6_t:"Foam trim", svc6_d:"Decorative foam trim around windows and doors to add character.",
  gallery_eyebrow:"Our work", gallery_title:"Project gallery",
  gallery_note:"Real projects in Stockton, CA & surrounding areas — tap a photo to enlarge.",
  why_eyebrow:"Why choose us", why_title:"Done right, the first time",
  why_1:"Clean, even finishes that look professional.",
  why_2:"Work directly with the owners: Jaciel & Filogonio Arroyo.",
  why_3:"Quality materials built to last for years.",
  why_4:"Clear estimates, no surprises.",
  why_5:"Serving Stockton and nearby cities.",
  why_cta:"Get your estimate",
  contact_eyebrow:"Get in touch", contact_title:"Request your free estimate",
  contact_sub:"Call or email us. We'll gladly give you a no-obligation estimate.",
  contact_area_label:"Service area", contact_area:"Stockton, CA & surrounding areas"
};

// Save original Spanish text on first load
const nodes = document.querySelectorAll('[data-i18n]');
const ES = {};
nodes.forEach(n => ES[n.dataset.i18n] = n.innerHTML);

let lang = 'es';
function setLang(l){
  lang = l;
  const dict = l === 'en' ? EN : ES;
  nodes.forEach(n => { if(dict[n.dataset.i18n]) n.innerHTML = dict[n.dataset.i18n]; });
  document.documentElement.lang = l;
  document.getElementById('langToggle').textContent = l === 'en' ? 'ES' : 'EN';
}

document.getElementById('langToggle').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));

// Mobile menu
const nav = document.getElementById('nav');
document.getElementById('burger').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Carrusel (visor en pagina) =====
const track = document.getElementById('carTrack');
const slides = Array.from(track.children);
const dotsWrap = document.getElementById('carDots');
let cur = 0;

slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 'car__dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Foto ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
});
const dots = Array.from(dotsWrap.children);

function goTo(i){
  cur = (i + slides.length) % slides.length;
  track.style.transform = 'translateX(' + (-cur * 100) + '%)';
  dots.forEach((d, k) => d.classList.toggle('active', k === cur));
}
document.getElementById('carNext').addEventListener('click', () => goTo(cur + 1));
document.getElementById('carPrev').addEventListener('click', () => goTo(cur - 1));

// swipe en el carrusel
const carousel = document.getElementById('carousel');
let cX = null;
carousel.addEventListener('touchstart', e => { cX = e.changedTouches[0].clientX; }, {passive:true});
carousel.addEventListener('touchend', e => {
  if(cX === null) return;
  const dx = e.changedTouches[0].clientX - cX;
  if(Math.abs(dx) > 45) goTo(cur + (dx < 0 ? 1 : -1));
  cX = null;
});

// ===== Lightbox (tocar foto -> pantalla completa) =====
const gImgs = Array.from(document.querySelectorAll('.car__slide img'));
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');
let idx = 0;

function showLb(i){
  idx = (i + gImgs.length) % gImgs.length;
  lbImg.src = gImgs[idx].src;
  lbImg.alt = gImgs[idx].alt;
  lbCounter.textContent = (idx + 1) + ' / ' + gImgs.length;
}
function openLb(i){ showLb(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

gImgs.forEach((img,i) => img.addEventListener('click', () => openLb(i)));
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); showLb(idx-1); });
document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); showLb(idx+1); });
// cerrar al tocar el fondo (fuera de la imagen y flechas)
lb.addEventListener('click', e => { if(e.target === lb) closeLb(); });
// teclado
document.addEventListener('keydown', e => {
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape') closeLb();
  else if(e.key === 'ArrowLeft') showLb(idx-1);
  else if(e.key === 'ArrowRight') showLb(idx+1);
});
// swipe en celular
let touchX = null;
lbImg.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
lbImg.addEventListener('touchend', e => {
  if(touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if(Math.abs(dx) > 45) showLb(idx + (dx < 0 ? 1 : -1));
  touchX = null;
});
