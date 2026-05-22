// MOBILE_SAFE_VIEWPORT_FIX
function setVH(){
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);
try {
  window.Telegram?.WebApp?.ready?.();
  window.Telegram?.WebApp?.expand?.();
} catch(e) {}

const targets = [
  {el: document.querySelector('.t12'), name: 'x12'},
  {el: document.querySelector('.t6'), name: 'x6'},
  {el: document.querySelector('.t15'), name: 'x15'},
  {el: document.querySelector('.t3l'), name: 'x3 left'},
  {el: document.querySelector('.t3r'), name: 'x3 right'},
  {el: document.querySelector('.t2l'), name: 'x2 left'},
  {el: document.querySelector('.t4'), name: 'x4'},
  {el: document.querySelector('.t2r'), name: 'x2 right'},
  {el: document.querySelector('.t8'), name: 'x8'},
  {el: document.querySelector('.t9'), name: 'x9'}
].filter(x => x.el);

const signalBtn = document.getElementById('signalBtn');
const arrow = document.getElementById('signalArrow');

let bag = [];
let clickCount = 0;

function refillBag(){
  // Every coefficient appears once per cycle, so x12 is guaranteed.
  bag = targets.map((_, i) => i);
  // Shuffle but keep x12 first on the very first cycle so you can verify it works immediately.
  for (let i = bag.length - 1; i > 1; i--) {
    const j = 1 + Math.floor(Math.random() * i);
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

function clearSignal(){
  targets.forEach(x => x.el.classList.remove('active'));
  if (arrow) arrow.classList.remove('show');
}

function showSignal(item){
  clearSignal();
  const target = item.el;
  target.classList.add('active');

  const app = document.querySelector('.app');
  const a = app.getBoundingClientRect();
  const r = target.getBoundingClientRect();

  const centerX = r.left - a.left + r.width / 2;
  const topY = r.top - a.top - 8;

  arrow.style.left = `${centerX}px`;
  arrow.style.top = `${topY}px`;
  arrow.classList.add('show');

  navigator.vibrate?.(60);
}

function getSignal(){
  if (!targets.length) return;
  if (!bag.length) refillBag();
  clickCount++;

  const index = bag.shift();
  showSignal(targets[index]);
}

refillBag();

signalBtn.addEventListener('click', getSignal);

window.addEventListener('resize', () => {
  const active = targets.find(x => x.el.classList.contains('active'));
  if (active) showSignal(active);
});
