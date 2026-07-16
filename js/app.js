const menuButton=document.getElementById('menuButton');
const mobileMenu=document.getElementById('mobileMenu');
menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const justiceButton=document.getElementById('justiceButton');
const legacyOverlay=document.getElementById('legacyOverlay');
const closeLegacy=document.getElementById('closeLegacy');
let clicks=0,timer;
justiceButton.addEventListener('click',()=>{
  clicks++; clearTimeout(timer);
  justiceButton.animate([{transform:'scale(1)'},{transform:'scale(1.06) rotate(-2deg)'},{transform:'scale(1)'}],{duration:340,easing:'ease-out'});
  if(clicks>=5){clicks=0;legacyOverlay.classList.add('active');legacyOverlay.setAttribute('aria-hidden','false');crownRain(45);}
  else timer=setTimeout(()=>clicks=0,1800);
});
function closeLegacyMode(){legacyOverlay.classList.remove('active');legacyOverlay.setAttribute('aria-hidden','true');}
closeLegacy.addEventListener('click',closeLegacyMode);
legacyOverlay.addEventListener('click',e=>{if(e.target===legacyOverlay)closeLegacyMode();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLegacyMode();});
function crownRain(amount){for(let i=0;i<amount;i++){const c=document.createElement('span');c.className='crown';c.textContent=Math.random()>.5?'♛':'♔';c.style.left=Math.random()*100+'vw';c.style.fontSize=18+Math.random()*30+'px';c.style.animationDuration=3.8+Math.random()*3.4+'s';c.style.animationDelay=Math.random()*1.8+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),9000);}}

const canvas=document.getElementById('particleCanvas');const ctx=canvas.getContext('2d');let particles=[];
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(85,Math.floor(innerWidth/18))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,s:Math.random()*.22+.04,a:Math.random()*.45+.06}));}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.y-=p.s;if(p.y<-5){p.y=innerHeight+5;p.x=Math.random()*innerWidth;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(240,210,139,${p.a})`;ctx.fill();}requestAnimationFrame(draw);}
addEventListener('resize',resize);resize();draw();


// ===== Enhanced ACFA system effects =====

const matrixCanvas = document.getElementById("matrixCanvas");
const matrixContext = matrixCanvas.getContext("2d");
const bootScreen = document.getElementById("bootScreen");
const bootLog = document.getElementById("bootLog");
const bootProgress = document.getElementById("bootProgress");
const skipBoot = document.getElementById("skipBoot");
const developerOverlay = document.getElementById("developerOverlay");
const closeDeveloper = document.getElementById("closeDeveloper");

let matrixWidth = 0;
let matrixHeight = 0;
let matrixColumns = [];
let matrixFontSize = 16;
let matrixFrame = 0;

const matrixTokens = [
  "♔","♕","♖","♗","♘","♙",
  "ACFA","e4","Nf3","O-O","c5","d4","ELO",
  "0101","1010","BOARD","MOVE","JOIN","LIVE"
];

function resizeMatrix() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  matrixCanvas.width = Math.floor(window.innerWidth * ratio);
  matrixCanvas.height = Math.floor(window.innerHeight * ratio);
  matrixCanvas.style.width = `${window.innerWidth}px`;
  matrixCanvas.style.height = `${window.innerHeight}px`;
  matrixContext.setTransform(ratio, 0, 0, ratio, 0, 0);

  matrixWidth = window.innerWidth;
  matrixHeight = window.innerHeight;
  matrixFontSize = window.innerWidth < 650 ? 18 : 16;

  const count = Math.ceil(matrixWidth / matrixFontSize);
  matrixColumns = Array.from({ length: count }, () => Math.random() * -80);
}

function drawMatrix() {
  matrixFrame += 1;

  matrixContext.fillStyle = "rgba(5,3,2,0.09)";
  matrixContext.fillRect(0, 0, matrixWidth, matrixHeight);

  matrixContext.font = `700 ${matrixFontSize}px ui-monospace, monospace`;

  for (let index = 0; index < matrixColumns.length; index += 1) {
    const token = matrixTokens[Math.floor(Math.random() * matrixTokens.length)];
    const x = index * matrixFontSize;
    const y = matrixColumns[index] * matrixFontSize;

    const bright = Math.random() > .965;
    matrixContext.fillStyle = bright
      ? "rgba(255,239,184,.9)"
      : `rgba(215,170,77,${0.18 + Math.random() * 0.34})`;

    matrixContext.fillText(token, x, y);

    if (y > matrixHeight && Math.random() > 0.973) {
      matrixColumns[index] = Math.random() * -20;
    }

    matrixColumns[index] += window.innerWidth < 650 ? .34 : .48;
  }

  requestAnimationFrame(drawMatrix);
}

window.addEventListener("resize", resizeMatrix);
resizeMatrix();
drawMatrix();

const bootSteps = [
  "Initializing ACFA core...",
  "Loading community database...",
  "Synchronizing activity modules...",
  "Connecting ACFA Network...",
  "Starting gold matrix renderer...",
  "Calibrating scanner systems...",
  "Verifying Lady Justice core...",
  "Rendering public interface...",
  "WELCOME TO ACFA"
];

let bootIndex = 0;
let bootTimer;
let bootComplete = false;

function finishBoot() {
  if (bootComplete) return;
  bootComplete = true;
  clearTimeout(bootTimer);
  document.body.classList.remove("booting");
  bootScreen.classList.add("hidden");
  sessionStorage.setItem("acfaBootSeen", "true");

  setTimeout(() => {
    runCardScans();
    runVerification();
  }, 450);
}

function runBootStep() {
  if (bootIndex >= bootSteps.length) {
    finishBoot();
    return;
  }

  const line = document.createElement("div");
  line.textContent = bootSteps[bootIndex];

  if (bootIndex === bootSteps.length - 1) {
    line.classList.add("complete");
  }

  bootLog.appendChild(line);
  bootProgress.style.width = `${((bootIndex + 1) / bootSteps.length) * 100}%`;
  bootIndex += 1;

  bootTimer = setTimeout(runBootStep, bootIndex === bootSteps.length ? 650 : 360);
}

skipBoot?.addEventListener("click", finishBoot);

if (sessionStorage.getItem("acfaBootSeen") === "true") {
  bootScreen.classList.add("hidden");
  document.body.classList.remove("booting");
  setTimeout(() => {
    runCardScans();
    runVerification();
  }, 400);
} else {
  setTimeout(runBootStep, 350);
}

function runCardScans() {
  const cards = [
    ...document.querySelectorAll(".stat-card"),
    ...document.querySelectorAll(".module-card"),
    ...document.querySelectorAll(".command-panel"),
    ...document.querySelectorAll(".activity-feed")
  ];

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("scanning");
      setTimeout(() => card.classList.remove("scanning"), 1300);
    }, index * 190);
  });
}

function runVerification() {
  const rows = [...document.querySelectorAll("[data-verify]")];

  rows.forEach((row, index) => {
    setTimeout(() => {
      row.classList.add("active");
      row.querySelector("em").textContent = "SCANNING";

      setTimeout(() => {
        row.classList.remove("active");
        row.classList.add("verified");
        row.querySelector("em").textContent = "VERIFIED";
      }, 650);
    }, index * 720);
  });
}

// Konami code opens Developer Mode.
const konami = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"
];
let konamiIndex = 0;

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key === konami[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      developerOverlay.classList.add("active");
      developerOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("matrix-flash");
      setTimeout(() => document.body.classList.remove("matrix-flash"), 700);
    }
  } else {
    konamiIndex = 0;
  }
});

function closeDeveloperMode() {
  developerOverlay.classList.remove("active");
  developerOverlay.setAttribute("aria-hidden", "true");
}

closeDeveloper?.addEventListener("click", closeDeveloperMode);

developerOverlay?.addEventListener("click", (event) => {
  if (event.target === developerOverlay) closeDeveloperMode();
});

// Typing ACFA triggers a gold flash and chess-piece rain.
let typedBuffer = "";

document.addEventListener("keydown", (event) => {
  if (event.key.length !== 1) return;
  typedBuffer = (typedBuffer + event.key.toLowerCase()).slice(-4);

  if (typedBuffer === "acfa") {
    typedBuffer = "";
    document.body.classList.add("matrix-flash");
    createRain(28);
    setTimeout(() => document.body.classList.remove("matrix-flash"), 700);
  }
});

// Double-click the emblem for a compact particle burst.
justiceLogo?.addEventListener("dblclick", (event) => {
  event.preventDefault();
  createRain(22);
});
