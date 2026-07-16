document.addEventListener("DOMContentLoaded",()=>{
  const menuButton=document.getElementById("menuButton");
  const sidebar=document.getElementById("sidebar");
  const justiceLogo=document.getElementById("justiceLogo");
  const legacyOverlay=document.getElementById("legacyOverlay");
  const closeLegacy=document.getElementById("closeLegacy");
  const clock=document.getElementById("clock");

  menuButton?.addEventListener("click",()=>{
    const open=sidebar.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
  });

  document.querySelectorAll(".side-nav a").forEach(link=>link.addEventListener("click",()=>sidebar.classList.remove("open")));

  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
      });
    },{threshold:.12});
    document.querySelectorAll(".reveal").forEach(item=>observer.observe(item));
  }else{
    document.querySelectorAll(".reveal").forEach(item=>item.classList.add("visible"));
  }

  function updateClock(){
    const now=new Date();
    clock.textContent=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  }
  updateClock();
  setInterval(updateClock,30000);

  let clicks=0;
  let clickTimer;

  justiceLogo?.addEventListener("click",()=>{
    clicks+=1;
    clearTimeout(clickTimer);
    if(typeof justiceLogo.animate==="function"){
      justiceLogo.animate([{transform:"scale(1)"},{transform:"scale(1.055)"},{transform:"scale(1)"}],{duration:300,easing:"ease-out"});
    }
    if(clicks>=5){
      clicks=0;
      legacyOverlay?.classList.add("active");
      legacyOverlay?.setAttribute("aria-hidden","false");
      createRain(45);
    }else{
      clickTimer=setTimeout(()=>clicks=0,1900);
    }
  });

  function closeLegacyMode(){
    legacyOverlay?.classList.remove("active");
    legacyOverlay?.setAttribute("aria-hidden","true");
  }

  closeLegacy?.addEventListener("click",closeLegacyMode);
  legacyOverlay?.addEventListener("click",event=>{if(event.target===legacyOverlay)closeLegacyMode();});

  function createRain(amount){
    const symbols=["♛","♔","♜","♞","♝","♟"];
    for(let i=0;i<amount;i+=1){
      const item=document.createElement("span");
      item.className="rain-piece";
      item.textContent=symbols[Math.floor(Math.random()*symbols.length)];
      item.style.left=`${Math.random()*100}vw`;
      item.style.fontSize=`${18+Math.random()*28}px`;
      item.style.animationDuration=`${4+Math.random()*3}s`;
      item.style.animationDelay=`${Math.random()*1.5}s`;
      document.body.appendChild(item);
      setTimeout(()=>item.remove(),9000);
    }
  }

  const canvas=document.getElementById("matrixCanvas");
  const ctx=canvas?.getContext("2d");
  let drops=[];
  let fontSize=16;
  const tokens=["♔","♕","♖","♗","♘","♙","ACFA","e4","Nf3","O-O","0101","MOVE","JOIN"];

  function resizeMatrix(){
    if(!canvas||!ctx)return;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(innerWidth*ratio);
    canvas.height=Math.floor(innerHeight*ratio);
    canvas.style.width=`${innerWidth}px`;
    canvas.style.height=`${innerHeight}px`;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    fontSize=innerWidth<650?18:16;
    drops=Array.from({length:Math.ceil(innerWidth/fontSize)},()=>Math.random()*-80);
  }

  function drawMatrix(){
    if(!canvas||!ctx)return;
    ctx.fillStyle="rgba(5,3,2,.09)";
    ctx.fillRect(0,0,innerWidth,innerHeight);
    ctx.font=`700 ${fontSize}px ui-monospace,monospace`;
    drops.forEach((drop,index)=>{
      const token=tokens[Math.floor(Math.random()*tokens.length)];
      const x=index*fontSize;
      const y=drop*fontSize;
      ctx.fillStyle=Math.random()>.965?"rgba(255,239,184,.9)":`rgba(215,170,77,${.18+Math.random()*.3})`;
      ctx.fillText(token,x,y);
      if(y>innerHeight&&Math.random()>.973)drops[index]=Math.random()*-20;
      drops[index]+=innerWidth<650?.34:.48;
    });
    requestAnimationFrame(drawMatrix);
  }

  if(canvas&&ctx){resizeMatrix();drawMatrix();addEventListener("resize",resizeMatrix);}
});
