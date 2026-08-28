
const grid=document.getElementById('grid');
const signal=document.getElementById('signal');
const minus=document.getElementById('minus');
const plus=document.getElementById('plus');
const count=document.getElementById('count');
const loader=document.getElementById('loader');
let loading=false;
count.textContent='1';
let mines=1;
const cells=[];

for(let i=0;i<25;i++){
  const c=document.createElement('button');
  c.className='cell';
  grid.appendChild(c);
  cells.push(c);
}

function clear(){
  cells.forEach(c=>{c.className='cell';c.innerHTML='';});
}
function setCount(n){
  mines=Math.max(1,Math.min(24,n));
  count.textContent=mines;
  clear();
}
minus.onclick=()=>setCount(mines-1);
plus.onclick=()=>setCount(mines+1);

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function gem(c){c.classList.add('open');c.innerHTML='<div class="diamond"></div>'}
function bomb(c){c.classList.add('open');c.innerHTML='<div class="mine"></div>'}
function safeShown(m){
  if(m===1)return 24;
  if(m===2)return 23;
  if(m===3)return 16;
  if(m<=5)return 13;
  if(m<=8)return 10;
  if(m<=12)return 8;
  if(m<=16)return 6;
  if(m<=20)return 5;
  return 3;
}
function generate(){
  clear();
  const ids=shuffle([...Array(25).keys()]);
  const mineIds=new Set(ids.slice(0,mines));
  const safe=ids.filter(i=>!mineIds.has(i));

  if(mines===1 || mines===2){
    cells.forEach((c,i)=>mineIds.has(i)?bomb(c):gem(c));
    return;
  }
  mineIds.forEach(i=>bomb(cells[i]));
  safe.slice(0,Math.min(safeShown(mines),safe.length)).forEach(i=>gem(cells[i]));
}
signal.onclick=()=>{
  if(loading) return;
  loading=true;
  clear();
  loader.classList.add('show');
  signal.classList.add('loading');

  setTimeout(()=>{
    loader.classList.remove('show');
    signal.classList.remove('loading');
    generate();
    loading=false;
    navigator.vibrate?.(45);
  },1000);
};
try{Telegram.WebApp.ready();Telegram.WebApp.expand();}catch(e){}
