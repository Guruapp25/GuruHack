
const grid = document.getElementById('grid');
const btn = document.getElementById('getSignalBtn');
const minesInput = document.getElementById('minesInput');
const minusBtn = document.getElementById('minusBtn');
const plusBtn = document.getElementById('plusBtn');
const mineLabel = document.getElementById('mineLabel');
const statusPill = document.getElementById('statusPill');
const detailMines = document.getElementById('detailMines');
const detailDiamonds = document.getElementById('detailDiamonds');
const detailBombs = document.getElementById('detailBombs');

const tg = window.Telegram?.WebApp;
try {
  tg?.ready();
  tg?.expand();
  tg?.setHeaderColor('#15151f');
  tg?.setBackgroundColor('#15151f');
} catch(e) {}

let mines = 2;
let running = false;

function clampMines(v){
  v = parseInt(v || 2, 10);
  if (Number.isNaN(v)) v = 2;
  return Math.min(24, Math.max(2, v));
}

function updateLabels(){
  mines = clampMines(minesInput.value);
  minesInput.value = mines;
  mineLabel.textContent = `${mines} MINES`;
  detailMines.textContent = mines;
  detailBombs.textContent = mines;
  const safe = 25 - mines;
  detailDiamonds.textContent = mines === 2 ? safe : Math.max(1, Math.round(safe * revealRatio(mines)));
}

function revealRatio(m){
  if (m <= 4) return .70;
  if (m <= 8) return .58;
  if (m <= 12) return .48;
  if (m <= 16) return .38;
  if (m <= 20) return .30;
  return .20;
}

function makeGrid(){
  grid.innerHTML = '';
  for(let i=0;i<25;i++){
    const c = document.createElement('button');
    c.className = 'cell';
    c.type = 'button';
    c.dataset.i = i;
    grid.appendChild(c);
  }
}
makeGrid();
updateLabels();

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

function clearCells(){
  [...grid.children].forEach(c=>{
    c.className='cell';
    c.innerHTML='';
  });
}

function showSignal(){
  if (running) return;
  running = true;
  updateLabels();
  clearCells();
  btn.disabled = true;
  btn.innerHTML = '<span class="pulse-dot"></span> SCANNING...';
  statusPill.textContent = 'ANALYZING';

  const all = [...Array(25)].map((_,i)=>i);
  const bombs = shuffle([...all]).slice(0,mines);
  const bombSet = new Set(bombs);
  const safe = all.filter(i=>!bombSet.has(i));
  const diamondsToShow = mines === 2 ? safe.length : Math.max(1, Math.round(safe.length * revealRatio(mines)));
  const shownDiamonds = shuffle([...safe]).slice(0, diamondsToShow);

  const order = shuffle([...shownDiamonds.map(i=>({i,type:'diamond'})), ...bombs.map(i=>({i,type:'bomb'}))]);

  order.forEach((item, idx)=>{
    setTimeout(()=>{
      const cell = grid.children[item.i];
      cell.classList.add('revealed', item.type);
      const img = document.createElement('img');
      img.src = item.type === 'bomb' ? window.GURU_ASSETS.bomb : window.GURU_ASSETS.diamond;
      img.alt = item.type;
      cell.appendChild(img);
      if(idx === order.length - 1){
        setTimeout(()=>{
          running = false;
          btn.disabled = false;
          btn.innerHTML = '<span class="pulse-dot"></span> GET SIGNAL';
          statusPill.textContent = 'SIGNAL READY';
          detailDiamonds.textContent = shownDiamonds.length;
        }, 350);
      }
    }, idx * 42);
  });
}

btn.addEventListener('click', showSignal);
minusBtn.addEventListener('click',()=>{ minesInput.value = clampMines(+minesInput.value - 1); updateLabels(); clearCells(); });
plusBtn.addEventListener('click',()=>{ minesInput.value = clampMines(+minesInput.value + 1); updateLabels(); clearCells(); });
minesInput.addEventListener('input',()=>{ updateLabels(); clearCells(); });
minesInput.addEventListener('change',updateLabels);
