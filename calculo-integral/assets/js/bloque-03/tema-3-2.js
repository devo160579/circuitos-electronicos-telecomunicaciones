
(() => {
const NUM="3.2",BANK={"basic": [{"p": "Energía para p(t)=5+t W en [0,2].", "a": 12.0, "h": "Integra potencia respecto del tiempo."}, {"p": "Energía para p(t)=5+t W en [0,3].", "a": 19.5, "h": "Integra potencia respecto del tiempo."}, {"p": "Energía para p(t)=5+t W en [0,4].", "a": 28.0, "h": "Integra potencia respecto del tiempo."}, {"p": "Energía para p(t)=5+t W en [0,5].", "a": 37.5, "h": "Integra potencia respecto del tiempo."}, {"p": "Energía para p(t)=5+t W en [0,6].", "a": 48.0, "h": "Integra potencia respecto del tiempo."}, {"p": "Energía para p(t)=5+t W en [0,7].", "a": 59.5, "h": "Integra potencia respecto del tiempo."}], "medium": [{"p": "Carga para i(t)=1+2t A en [0,2].", "a": 6, "h": "Q=∫i(t)dt."}, {"p": "Carga para i(t)=1+2t A en [0,3].", "a": 12, "h": "Q=∫i(t)dt."}, {"p": "Carga para i(t)=1+2t A en [0,4].", "a": 20, "h": "Q=∫i(t)dt."}, {"p": "Carga para i(t)=1+2t A en [0,5].", "a": 30, "h": "Q=∫i(t)dt."}, {"p": "Carga para i(t)=1+2t A en [0,6].", "a": 42, "h": "Q=∫i(t)dt."}, {"p": "Carga para i(t)=1+2t A en [0,7].", "a": 56, "h": "Q=∫i(t)dt."}], "hard": [{"p": "RMS de x(t)=3sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 2.1213203435596424, "h": "Para una sinusoidal pura, RMS=A/√2."}, {"p": "RMS de x(t)=4sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 2.82842712474619, "h": "Para una sinusoidal pura, RMS=A/√2."}, {"p": "RMS de x(t)=5sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 3.5355339059327373, "h": "Para una sinusoidal pura, RMS=A/√2."}, {"p": "RMS de x(t)=6sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 4.242640687119285, "h": "Para una sinusoidal pura, RMS=A/√2."}, {"p": "RMS de x(t)=7sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 4.949747468305833, "h": "Para una sinusoidal pura, RMS=A/√2."}, {"p": "RMS de x(t)=8sin(2πt/T) sobre un periodo. Responde el valor numérico.", "a": 5.65685424949238, "h": "Para una sinusoidal pura, RMS=A/√2."}]},ANS={"q1": 0, "q2": 0, "q3": 0, "q4": 0},q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],fmt=(x,d=6)=>Number(x).toFixed(d).replace(/0+$/,'').replace(/\.$/,'');
qa("aside [data-go]").forEach(b=>b.onclick=()=>q("#"+b.dataset.go)?.scrollIntoView({behavior:"smooth",block:"start"}));
const svg=q("#labSvg");
function axes(xmin,xmax,ymin,ymax){const W=820,H=320,p=48,pw=W-2*p,ph=H-2*p,X=x=>p+(x-xmin)/(xmax-xmin)*pw,Y=y=>H-p-(y-ymin)/(ymax-ymin)*ph;let s='';for(let i=0;i<=5;i++){let x=xmin+(xmax-xmin)*i/5;s+=`<line class="gridline" x1="${X(x)}" y1="${p}" x2="${X(x)}" y2="${H-p}"/>`}for(let i=0;i<=5;i++){let y=ymin+(ymax-ymin)*i/5;s+=`<line class="gridline" x1="${p}" y1="${Y(y)}" x2="${W-p}" y2="${Y(y)}"/>`}s+=`<line class="axis" x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}"/><line class="axis" x1="${p}" y1="${p}" x2="${p}" y2="${H-p}"/>`;return{W,H,p,pw,ph,X,Y,s,xmin,xmax}}
function path(f,A,n=180){let d='';for(let i=0;i<=n;i++){let x=A.xmin+(A.xmax-A.xmin)*i/n;d+=(i?'L':'M')+A.X(x)+' '+A.Y(f(x))+' '}return d}
function draw(){
 if(NUM==="3.1"){let type=q("#labType").value,b=+q("#labB").value;if(type==="area"){let f=x=>2*x,g=x=>x*x,A=axes(0,2,0,4.5),poly=`M ${A.X(0)} ${A.Y(0)} `;for(let i=0;i<=100;i++){let x=2*i/100;poly+=`L ${A.X(x)} ${A.Y(f(x))} `}for(let i=100;i>=0;i--){let x=2*i/100;poly+=`L ${A.X(x)} ${A.Y(g(x))} `}poly+="Z";svg.innerHTML=A.s+`<path d="${poly}" class="area"/><path d="${path(f,A)}" class="curve"/><path d="${path(g,A)}" class="curve2"/>`;q("#labOut").innerHTML=`Área exacta entre curvas en [0,2] = <strong>${fmt(4/3)}</strong>.`;}else{let f=x=>x,A=axes(0,b,0,Math.max(2,b)*1.2);svg.innerHTML=A.s+`<path d="${path(f,A)}" class="curve"/>`;q("#labOut").innerHTML=`Al girar y=x alrededor del eje x: V=πb³/3 = <strong>${fmt(Math.PI*b**3/3)}</strong>.`;}}
 if(NUM==="3.2"){let type=q("#labType").value,b=+q("#labB").value,f=type==="energy"?t=>5+t*t:type==="charge"?t=>1+2*t:t=>4*Math.sin(2*Math.PI*t),A=axes(0,b,type==="rms"?-4.5:0,type==="energy"?16:8),area=`M ${A.X(0)} ${A.Y(0)} `;for(let i=0;i<=160;i++){let x=b*i/160;area+=`L ${A.X(x)} ${A.Y(f(x))} `}area+=`L ${A.X(b)} ${A.Y(0)} Z`;svg.innerHTML=A.s+`<path d="${area}" class="area"/><path d="${path(f,A)}" class="curve"/>`;let val=type==="energy"?5*b+b**3/3:type==="charge"?b+b*b:4/Math.sqrt(2);q("#labOut").innerHTML=type==="energy"?`E=<strong>${fmt(val)}</strong> J`:type==="charge"?`Q=<strong>${fmt(val)}</strong> C`:`Para la sinusoidal de amplitud 4, RMS=<strong>${fmt(val)}</strong>.`;}
 if(NUM==="3.3"){let n=+q("#labN").value,type=q("#labType").value,W=820,H=320,p=46,size=220,x0=120,y0=45,cell=size/n,out='';for(let i=0;i<n;i++)for(let j=0;j<n;j++){let x=(i+.5)/n,y=(j+.5)/n,v=type==="const"?1:1+x+y,op=.08+.22*(v/(type==="const"?1:3));out+=`<rect x="${x0+i*cell}" y="${y0+(n-1-j)*cell}" width="${cell}" height="${cell}" fill="rgba(226,6,19,${op})" stroke="#fff" stroke-width=".7"/>`}out+=`<text x="${x0+size/2}" y="${y0+size+28}" text-anchor="middle">Región R=[0,1]×[0,1]</text>`;svg.innerHTML=out;let exact=type==="const"?1:2;q("#labOut").innerHTML=`∬_R ${type==="const"?"1":"(1+x+y)"} dA = <strong>${exact}</strong>. Las celdas representan elementos ΔA.`;}
}
qa("#laboratorio input,#laboratorio select").forEach(e=>e.addEventListener("input",draw));draw();

function make(level){let s=level==="easy"?1:level==="medium"?2:3,r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
 if(NUM==="3.1"){if(level==="hard"){let b=r(1,2+s);return{p:`Volumen al girar y=x en [0,${b}] alrededor del eje x.`,a:Math.PI*b**3/3,h:"V=π∫x²dx."}}let b=r(1,2+s);return{p:`Área bajo y=x en [0,${b}].`,a:b*b/2,h:"A=∫x dx."}}
 if(NUM==="3.2"){if(level==="hard"){let A=r(2,6);return{p:`RMS de una sinusoidal pura de amplitud ${A}.`,a:A/Math.sqrt(2),h:"RMS=A/√2."}}let T=r(1,3+s);return{p:`Energía para p(t)=5+t W entre 0 y ${T} s.`,a:5*T+T*T/2,h:"E=∫p(t)dt."}}
 if(NUM==="3.3"){let a=r(1,2+s),b=r(1,2+s);if(level==="easy")return{p:`Calcula ∬_R 1 dA sobre R=[0,${a}]×[0,${b}].`,a:a*b,h:"Con f=1, la integral es el área."};let val=a*b+b*a*a/2+a*b*b/2;return{p:`S=1+x+y sobre [0,${a}]×[0,${b}]. Calcula ∬S dA.`,a:val,h:"Integra primero en y y luego en x."}}
}
let ex=null,hits=0,attempts=0,streak=0;function newEx(){ex=make(q("#difficulty").value);q("#exPrompt").innerHTML="<strong>Ejercicio:</strong> "+ex.p;q("#exAns").value="";q("#exFeed").textContent=""}q("#newEx").onclick=newEx;q("#difficulty").onchange=newEx;q("#checkEx").onclick=()=>{let v=Number(q("#exAns").value.replace(",","."));if(!Number.isFinite(v))return;attempts++;let ok=Math.abs(v-ex.a)<=1e-5*Math.max(1,Math.abs(ex.a));if(ok){hits++;streak++;q("#exFeed").innerHTML='<span class="ok">Correcto.</span> '+ex.h}else{streak=0;q("#exFeed").innerHTML='<span class="bad">Revisa.</span> '+ex.h+' Respuesta: '+fmt(ex.a)}q("#hits").textContent=hits;q("#attempts").textContent=attempts;q("#streak").textContent=streak};newEx();

let bi=0;function setB(){return BANK[q("#bankLevel").value]}function renderB(){let S=setB();q("#bankList").innerHTML=S.map((x,i)=>`<button class="bankitem ${i===bi?'active':''}" data-i="${i}">${i+1}. ${x.p}</button>`).join("");qa(".bankitem").forEach(b=>b.onclick=()=>{bi=+b.dataset.i;showB();renderB()})}function showB(){let x=setB()[bi];q("#bankPrompt").textContent=x.p;q("#bankAns").value="";q("#bankFeed").textContent=""}q("#bankLevel").onchange=()=>{bi=0;renderB();showB()};q("#bankRandom").onclick=()=>{bi=Math.floor(Math.random()*setB().length);renderB();showB()};q("#bankHint").onclick=()=>q("#bankFeed").textContent="Pista: "+setB()[bi].h;q("#bankCheck").onclick=()=>{let x=setB()[bi],v=Number(q("#bankAns").value.replace(",","."));if(!Number.isFinite(v))return;q("#bankFeed").innerHTML=Math.abs(v-x.a)<=1e-5*Math.max(1,Math.abs(x.a))?'<span class="ok">Correcto.</span>':'<span class="bad">Aún no.</span> '+x.h};renderB();showB();

q("#quiz").onsubmit=e=>{e.preventDefault();let sc=0,done=0;Object.entries(ANS).forEach(([k,a])=>{let el=q(`input[name="${k}"]:checked`);if(el){done++;if(+el.value===a)sc++}});q("#quizOut").innerHTML=done===4?`Resultado: <strong>${sc}/4</strong>. `+(sc>=3?'<span class="ok">Buen dominio.</span>':'<span class="bad">Repasa y vuelve a intentar.</span>'):'<span class="bad">Responde las cuatro preguntas.</span>'};q("#quizReset").onclick=()=>{q("#quiz").reset();q("#quizOut").textContent=""};

let gs=0,gex=null,pts=[[65,85],[210,50],[360,110],[520,60],[665,105],[785,85]];function mv(){let p=pts[gs];q("#packet").setAttribute("cx",p[0]);q("#packet").setAttribute("cy",p[1]);q("#gameStage").textContent=gs+"/5"}function ng(){if(gs>=5){q("#gamePrompt").innerHTML="<strong>Misión completada.</strong>";return}gex=make("medium");q("#gamePrompt").textContent=gex.p;q("#gameAns").value=""}q("#toggleGame").onclick=()=>{q("#gamePanel").hidden=!q("#gamePanel").hidden;if(!q("#gamePanel").hidden&&!gex){gs=0;mv();ng()}};q("#gameCheck").onclick=()=>{let v=Number(q("#gameAns").value.replace(",","."));if(!Number.isFinite(v))return;if(Math.abs(v-gex.a)<=1e-5*Math.max(1,Math.abs(gex.a))){gs++;mv();q("#gameFeed").innerHTML='<span class="ok">Correcto.</span>';gex=null;setTimeout(ng,250)}else q("#gameFeed").innerHTML='<span class="bad">Revisa.</span> '+gex.h};q("#gameReset").onclick=()=>{gs=0;gex=null;mv();ng();q("#gameFeed").textContent=""};
})();


(() => {
  function initUcacueNav(){
    const aside=document.querySelector('aside.class-nav');
    if(!aside) return;
    const buttons=[...aside.querySelectorAll('button[data-go]')];
    const sections=buttons.map(btn=>document.getElementById(btn.dataset.go)).filter(Boolean);

    const activate=id=>{
      buttons.forEach(btn=>btn.classList.toggle('active',btn.dataset.go===id));
    };

    aside.addEventListener('click',event=>{
      const btn=event.target.closest('button[data-go]');
      if(!btn || !aside.contains(btn)) return;
      const target=document.getElementById(btn.dataset.go);
      if(!target) return;
      event.preventDefault();
      activate(btn.dataset.go);
      target.scrollIntoView({behavior:'smooth',block:'start'});
      try{history.replaceState(null,'','#'+btn.dataset.go);}catch(e){}
    });

    let scheduled=false;
    function syncActive(){
      scheduled=false;
      let current=sections[0]||null;
      for(const section of sections){
        if(section.getBoundingClientRect().top<=150) current=section;
        else break;
      }
      if(current) activate(current.id);
    }
    window.addEventListener('scroll',()=>{
      if(!scheduled){scheduled=true;requestAnimationFrame(syncActive);}
    },{passive:true});

    const hash=location.hash?location.hash.slice(1):'';
    if(hash && document.getElementById(hash)){
      requestAnimationFrame(()=>{
        activate(hash);
        document.getElementById(hash).scrollIntoView({block:'start'});
      });
    }else{
      syncActive();
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initUcacueNav,{once:true});
  }else{
    initUcacueNav();
  }
})();
