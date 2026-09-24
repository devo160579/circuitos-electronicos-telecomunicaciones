
(() => {
const NUM=document.body.dataset.num,q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const fmt=(x,d=6)=>Number(x).toFixed(d).replace(/0+$/,'').replace(/\.$/,'');
qa("aside [data-go]").forEach(b=>b.onclick=()=>q("#"+b.dataset.go)?.scrollIntoView({behavior:"smooth",block:"start"}));
const svg=q("#labSvg");
function ax(xmin,xmax,ymin,ymax){const W=820,H=320,p=48,pw=W-2*p,ph=H-2*p,X=x=>p+(x-xmin)/(xmax-xmin)*pw,Y=y=>H-p-(y-ymin)/(ymax-ymin)*ph;let s='';for(let i=0;i<=5;i++){let x=xmin+(xmax-xmin)*i/5;s+=`<line class="gridline" x1="${X(x)}" y1="${p}" x2="${X(x)}" y2="${H-p}"/><text x="${X(x)}" y="${H-15}" text-anchor="middle" font-size="11">${fmt(x,2)}</text>`}for(let i=0;i<=5;i++){let y=ymin+(ymax-ymin)*i/5;s+=`<line class="gridline" x1="${p}" y1="${Y(y)}" x2="${W-p}" y2="${Y(y)}"/><text x="${p-8}" y="${Y(y)+4}" text-anchor="end" font-size="11">${fmt(y,2)}</text>`}s+=`<line class="axis" x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}"/><line class="axis" x1="${p}" y1="${p}" x2="${p}" y2="${H-p}"/>`;return{W,H,p,pw,ph,X,Y,s,xmin,xmax}}
function path(f,A){let d='';for(let i=0;i<=220;i++){let x=A.xmin+(A.xmax-A.xmin)*i/220;d+=(i?'L':'M')+A.X(x)+' '+A.Y(f(x))+' '}return d}
function draw(){
 if(NUM==="2.1"){let type=q("#fn").value,x=+q("#x").value,f=type==="q"?t=>t*t+1:type==="l"?t=>3*t-2:t=>Math.cos(t),A=ax(0,3,-2,10);svg.innerHTML=A.s+`<path d="${path(f,A)}" class="curve"/><circle class="point" cx="${A.X(x)}" cy="${A.Y(f(x))}" r="7"/>`;q("#labOut").innerHTML=`A′(${fmt(x,2)})=f(${fmt(x,2)})=<strong>${fmt(f(x))}</strong>.`}
 if(NUM==="2.2"||NUM==="2.5"){let type=q("#fn").value,a=+q("#a").value,b=+q("#b").value;if(b<=a)b=a+.1;let f=type==="q"?x=>x*x+1:type==="l"?x=>2*x+1:x=>Math.sin(x)+1,F=type==="q"?x=>x**3/3+x:type==="l"?x=>x*x+x:x=>-Math.cos(x)+x,A=ax(Math.min(0,a),Math.max(2,b),0,Math.max(3,f(b))*1.2),area=`M ${A.X(a)} ${A.Y(0)} `;for(let i=0;i<=140;i++){let x=a+(b-a)*i/140;area+=`L ${A.X(x)} ${A.Y(f(x))} `}area+=`L ${A.X(b)} ${A.Y(0)} Z`;svg.innerHTML=A.s+`<path d="${area}" class="area"/><path d="${path(f,A)}" class="curve"/>`;q("#labOut").innerHTML=`Resultado exacto: <strong>${fmt(F(b)-F(a))}</strong>.`}
 if(NUM==="2.3"){let type=q("#fn").value,b=+q("#b").value,f=type==="x"?x=>x:type==="q"?x=>x*x:x=>2*x+1,F=type==="x"?x=>x*x/2:type==="q"?x=>x**3/3:x=>x*x+x,avg=(F(b)-F(0))/b,c=type==="x"?avg:type==="q"?Math.sqrt(avg):(avg-1)/2,A=ax(0,b,0,Math.max(f(b),avg)*1.15);svg.innerHTML=A.s+`<path d="${path(f,A)}" class="curve"/><line class="avg" x1="${A.X(0)}" y1="${A.Y(avg)}" x2="${A.X(b)}" y2="${A.Y(avg)}"/><circle class="point" cx="${A.X(c)}" cy="${A.Y(avg)}" r="7"/>`;q("#labOut").innerHTML=`Valor medio=<strong>${fmt(avg)}</strong>; c≈<strong>${fmt(c)}</strong>.`}
 if(NUM==="2.4"){let type=q("#fn").value,b=+q("#b").value,f=type==="x"?x=>x:type==="q"?x=>x*x:x=>1+.6*Math.sin(2*Math.PI*x),F=type==="x"?x=>x*x/2:type==="q"?x=>x**3/3:x=>x-.6*Math.cos(2*Math.PI*x)/(2*Math.PI),avg=(F(b)-F(0))/b,A=ax(0,b,0,Math.max(2,f(b),avg)*1.15);svg.innerHTML=A.s+`<path d="${path(f,A)}" class="curve"/><line class="avg" x1="${A.X(0)}" y1="${A.Y(avg)}" x2="${A.X(b)}" y2="${A.Y(avg)}"/>`;q("#labOut").innerHTML=`Valor medio=<strong>${fmt(avg)}</strong>.`}
 if(NUM==="2.6"){let type=q("#tech").value,b=+q("#b").value,f=type==="s"?x=>2*x*Math.cos(x*x):x=>x*Math.exp(x),val=type==="s"?Math.sin(b*b):Math.exp(b)*(b-1)+1,A=ax(0,b,Math.min(0,f(b))-.5,Math.max(2,f(b))*1.2);svg.innerHTML=A.s+`<path d="${path(f,A)}" class="curve"/>`;q("#labOut").innerHTML=type==="s"?`Sustitución u=x² ⇒ valor definido=<strong>${fmt(val)}</strong>.`:`Por partes ⇒ valor definido=<strong>${fmt(val)}</strong>.`}
}
qa("#laboratorio input,#laboratorio select").forEach(e=>e.addEventListener("input",draw));draw();

function make(level){let s=level==="easy"?1:level==="medium"?2:3,r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
 if(NUM==="2.1"){let A=r(1,3*s),B=r(-2*s,2*s),x=r(0,3);return{p:`A(x)=∫₀ˣ(${A}t${B>=0?'+':''}${B})dt. Calcula A′(${x}).`,a:A*x+B,h:"Aplica A′(x)=f(x)."}}
 if(NUM==="2.2"||NUM==="2.5"){let b=r(1,2+s),a=b**3/3+b;return{p:`Calcula ∫₀^${b}(x²+1)dx.`,a:a,h:"Usa F=x³/3+x."}}
 if(NUM==="2.3"){let b=r(2,3+s);return{p:`Para f(x)=x en [0,${b}], halla c.`,a:b/2,h:"El valor medio es b/2."}}
 if(NUM==="2.4"){let b=r(1,3+s);return{p:`Valor medio de x² en [0,${b}].`,a:b*b/3,h:"(1/b)∫₀ᵇx²dx."}}
 if(NUM==="2.6"){if(Math.random()<.5){let b=r(1,1+s);return{p:`Por sustitución, calcula ∫₀^${b}2x cos(x²)dx.`,a:Math.sin(b*b),h:"u=x²."}}let b=r(1,1+s);return{p:`Por partes, calcula ∫₀^${b}x eˣdx.`,a:Math.exp(b)*(b-1)+1,h:"∫xeˣdx=eˣ(x−1)."}}
}
let ex=null,h=0,a=0,st=0;
function newEx(){ex=make(q("#difficulty").value);q("#exPrompt").innerHTML="<strong>Ejercicio:</strong> "+ex.p;q("#exAns").value="";q("#exFeed").textContent=""}
q("#newEx").onclick=newEx;q("#difficulty").onchange=newEx;q("#checkEx").onclick=()=>{let v=Number(q("#exAns").value.replace(",","."));if(!Number.isFinite(v))return;a++;let ok=Math.abs(v-ex.a)<=1e-5*Math.max(1,Math.abs(ex.a));if(ok){h++;st++;q("#exFeed").innerHTML='<span class="ok">Correcto.</span> '+ex.h}else{st=0;q("#exFeed").innerHTML='<span class="bad">Revisa.</span> '+ex.h+' Respuesta: '+fmt(ex.a)}q("#hits").textContent=h;q("#attempts").textContent=a;q("#streak").textContent=st};newEx();

const BANK={basic:Array.from({length:6},()=>make("easy")),medium:Array.from({length:6},()=>make("medium")),hard:Array.from({length:6},()=>make("hard"))};let bi=0;
function renderBank(){let S=BANK[q("#bankLevel").value];q("#bankList").innerHTML=S.map((x,i)=>`<button class="bankitem ${i===bi?'active':''}" data-i="${i}">${i+1}. ${x.p}</button>`).join("");qa(".bankitem").forEach(b=>b.onclick=()=>{bi=+b.dataset.i;showBank();renderBank()})}
function showBank(){let x=BANK[q("#bankLevel").value][bi];q("#bankPrompt").textContent=x.p;q("#bankAns").value="";q("#bankFeed").textContent=""}
q("#bankLevel").onchange=()=>{bi=0;renderBank();showBank()};q("#bankRandom").onclick=()=>{bi=Math.floor(Math.random()*6);renderBank();showBank()};q("#bankHint").onclick=()=>q("#bankFeed").textContent="Pista: "+BANK[q("#bankLevel").value][bi].h;q("#bankCheck").onclick=()=>{let x=BANK[q("#bankLevel").value][bi],v=Number(q("#bankAns").value.replace(",","."));if(!Number.isFinite(v))return;q("#bankFeed").innerHTML=Math.abs(v-x.a)<=1e-5*Math.max(1,Math.abs(x.a))?'<span class="ok">Correcto.</span>':'<span class="bad">Aún no.</span> '+x.h};renderBank();showBank();

const ANS=JSON.parse(q("#ansData").textContent);
q("#quiz").onsubmit=e=>{e.preventDefault();let s=0,d=0;Object.entries(ANS).forEach(([k,v])=>{let el=q(`input[name="${k}"]:checked`);if(el){d++;if(+el.value===v)s++}});q("#quizOut").innerHTML=d===4?`Resultado: <strong>${s}/4</strong>. `+(s>=3?'<span class="ok">Buen dominio.</span>':'<span class="bad">Repasa y vuelve a intentar.</span>'):'<span class="bad">Responde las cuatro preguntas.</span>'};q("#quizReset").onclick=()=>{q("#quiz").reset();q("#quizOut").textContent=""};

let gs=0,gex=null,pts=[[65,85],[210,50],[360,110],[520,60],[665,105],[785,85]];
function mv(){let p=pts[gs];q("#packet").setAttribute("cx",p[0]);q("#packet").setAttribute("cy",p[1]);q("#gameStage").textContent=gs+"/5"}function ng(){if(gs>=5){q("#gamePrompt").innerHTML="<strong>Misión completada.</strong>";return}gex=make("medium");q("#gamePrompt").textContent=gex.p;q("#gameAns").value=""}
q("#toggleGame").onclick=()=>{q("#gamePanel").hidden=!q("#gamePanel").hidden;if(!q("#gamePanel").hidden&&!gex){gs=0;mv();ng()}};q("#gameCheck").onclick=()=>{let v=Number(q("#gameAns").value.replace(",","."));if(!Number.isFinite(v))return;if(Math.abs(v-gex.a)<=1e-5*Math.max(1,Math.abs(gex.a))){gs++;mv();q("#gameFeed").innerHTML='<span class="ok">Correcto.</span>';gex=null;setTimeout(ng,250)}else q("#gameFeed").innerHTML='<span class="bad">Revisa.</span> '+gex.h};q("#gameReset").onclick=()=>{gs=0;gex=null;mv();ng();q("#gameFeed").textContent=""};
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
