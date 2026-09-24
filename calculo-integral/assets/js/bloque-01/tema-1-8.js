
(() => {
  const NUM = "1.8";
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const svg = $('#advancedSvg');
  const controls = $('#labControls');
  const NS = 'http://www.w3.org/2000/svg';
  const fmt = (x,d=6) => Number(x).toFixed(d).replace(/0+$/,'').replace(/\.$/,'');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const near=(a,b,t=1e-6)=>Math.abs(a-b)<=t;
  function setMetrics(a,al,b,bl,c,cl){ $('#m1').textContent=a;$('#m1l').textContent=al;$('#m2').textContent=b;$('#m2l').textContent=bl;$('#m3').textContent=c;$('#m3l').textContent=cl; }
  function baseAxes(xmin=0,xmax=1,ymin=0,ymax=1){
    const W=860,H=390,pL=58,pR=24,pT=24,pB=46,pw=W-pL-pR,ph=H-pT-pB;
    const X=x=>pL+(x-xmin)/(xmax-xmin)*pw, Y=y=>H-pB-(y-ymin)/(ymax-ymin)*ph;
    let out='';
    for(let i=0;i<=5;i++){let x=xmin+(xmax-xmin)*i/5;out+=`<line class="gridline" x1="${X(x)}" y1="${pT}" x2="${X(x)}" y2="${H-pB}"/><text x="${X(x)}" y="${H-18}" text-anchor="middle" font-size="12">${fmt(x,2)}</text>`}
    for(let i=0;i<=5;i++){let y=ymin+(ymax-ymin)*i/5;out+=`<line class="gridline" x1="${pL}" y1="${Y(y)}" x2="${W-pR}" y2="${Y(y)}"/><text x="${pL-9}" y="${Y(y)+4}" text-anchor="end" font-size="12">${fmt(y,2)}</text>`}
    out+=`<line class="axis" x1="${pL}" y1="${H-pB}" x2="${W-pR}" y2="${H-pB}"/><line class="axis" x1="${pL}" y1="${pT}" x2="${pL}" y2="${H-pB}"/>`;
    return {W,H,pL,pR,pT,pB,pw,ph,X,Y,out};
  }
  function pathFor(f,ax,n=240){
    let d='';
    for(let i=0;i<=n;i++){let x=ax.xmin+(ax.xmax-ax.xmin)*i/n,y=f(x);d+=(i?'L':'M')+ax.X(x)+' '+ax.Y(y)+' ';}
    return d;
  }
  function configure(html){ controls.innerHTML=html; }

  function drawLab(){
    if(NUM==='1.1'){
      configure(`<label>a<input id="la" type="number" value="2" min="-5" max="8"></label><label>b<input id="lb" type="number" value="1" min="-10" max="10"></label><label>n<input id="ln" type="range" min="2" max="15" value="6"></label>`);
      const run=()=>{let a=+$('#la').value,b=+$('#lb').value,n=+$('#ln').value,vals=[];for(let i=1;i<=n;i++)vals.push(a*i+b);let max=Math.max(...vals,1),min=Math.min(...vals,0),ax=baseAxes(0,n+1,Math.min(0,min),max*1.12);let out=ax.out,w=ax.pw/(n+2)*.72;vals.forEach((v,i)=>{let x=i+1;let y0=ax.Y(0),yv=ax.Y(v);out+=`<rect class="rect-main" x="${ax.X(x)-w/2}" y="${Math.min(y0,yv)}" width="${w}" height="${Math.abs(y0-yv)}"/><text x="${ax.X(x)}" y="${yv-7}" text-anchor="middle" font-size="11">${v}</text>`});svg.innerHTML=out;let s=vals.reduce((u,v)=>u+v,0);setMetrics(s,'Suma total',n,'Número de términos',vals.at(-1),'Último término');$('#labFeedback').innerHTML=`Σ(${a}i${b>=0?'+':''}${b}), i=1…${n} = <strong>${s}</strong>`;};
      $$('#labControls input').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.2'){
      configure(`<label>Secuencia<select id="seq"><option value="i">i</option><option value="i2">i²</option><option value="lin">3i+2</option></select></label><label>n<input id="ln" type="range" min="2" max="20" value="8"></label>`);
      const run=()=>{let n=+$('#ln').value,t=$('#seq').value,f=t==='i'?x=>x:t==='i2'?x=>x*x:x=>3*x+2,vals=Array.from({length:n},(_,k)=>f(k+1)),max=Math.max(...vals),ax=baseAxes(0,n+1,0,max*1.12),out=ax.out,w=ax.pw/(n+2)*.72;vals.forEach((v,i)=>out+=`<rect class="rect-main" x="${ax.X(i+1)-w/2}" y="${ax.Y(v)}" width="${w}" height="${ax.Y(0)-ax.Y(v)}"/>`);svg.innerHTML=out;let s=vals.reduce((u,v)=>u+v,0);setMetrics(s,'Σ términos',n,'n',vals.at(-1),'Último término');$('#labFeedback').textContent='Observa cómo el crecimiento del término modifica la suma acumulada.';};
      $$('#labControls input,#labControls select').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.3'){
      configure(`<label>Función<select id="fn"><option value="x">f(x)=x</option><option value="x2">f(x)=x²</option><option value="sin">f(x)=sin(x)+1</option></select></label>`);
      const run=()=>{let t=$('#fn').value, xmax=t==='sin'?Math.PI:2, f=t==='x'?x=>x:t==='x2'?x=>x*x:x=>Math.sin(x)+1, ymax=t==='x2'?4.4:2.3,ax=baseAxes(0,xmax,0,ymax);ax.xmin=0;ax.xmax=xmax;let d=pathFor(f,ax),area=`M ${ax.X(0)} ${ax.Y(0)} L `;for(let i=0;i<=200;i++){let x=xmax*i/200;area+=`${ax.X(x)} ${ax.Y(f(x))} `}area+=`L ${ax.X(xmax)} ${ax.Y(0)} Z`;svg.innerHTML=ax.out+`<path d="${area}" class="area-fill"/><path d="${d}" class="curve"/>`;let exact=t==='x'?2:t==='x2'?8/3:Math.PI+2;setMetrics(fmt(exact),'Área exacta',fmt(xmax,3),'Intervalo [0,b]',t==='sin'?'sin(x)+1':t==='x2'?'x²':'x','Función');$('#labFeedback').textContent='La región sombreada representa la acumulación geométrica bajo la curva.';};
      $('#fn').addEventListener('change',run);run(); return;
    }
    if(NUM==='1.4' || NUM==='1.7'){
      configure(`<label>Función<select id="fn"><option value="x2">x² en [0,1]</option><option value="x">x en [0,1]</option>${NUM==='1.7'?'<option value="sig">Señal 1+0.6·sin(2πt)</option>':''}</select></label><label>Método<select id="method"><option value="left">Izquierda</option><option value="right">Derecha</option><option value="mid" selected>Punto medio</option><option value="trap">Trapecio</option></select></label><label>n<input id="ln" type="range" min="2" max="80" value="8"></label>`);
      const run=()=>{let type=$('#fn').value,method=$('#method').value,n=+$('#ln').value,f=type==='x2'?x=>x*x:type==='x'?x=>x:x=>1+.6*Math.sin(2*Math.PI*x),exact=type==='x2'?1/3:type==='x'?.5:1,ymax=type==='sig'?1.8:1.15,ax=baseAxes(0,1,0,ymax);ax.xmin=0;ax.xmax=1;let out=ax.out,dx=1/n,sum=0;
        if(method==='trap'){for(let i=0;i<n;i++){let x0=i*dx,x1=(i+1)*dx,y0=f(x0),y1=f(x1);sum+=(y0+y1)*dx/2;out+=`<polygon points="${ax.X(x0)},${ax.Y(0)} ${ax.X(x0)},${ax.Y(y0)} ${ax.X(x1)},${ax.Y(y1)} ${ax.X(x1)},${ax.Y(0)}" fill="rgba(226,6,19,.18)" stroke="#E20613"/>`;}}
        else{for(let i=0;i<n;i++){let xs=method==='left'?i*dx:method==='right'?(i+1)*dx:(i+.5)*dx,h=f(xs);sum+=h*dx;out+=`<rect class="rect-main" x="${ax.X(i*dx)}" y="${ax.Y(h)}" width="${ax.pw*dx}" height="${ax.Y(0)-ax.Y(h)}"/>`;}}
        out+=`<path d="${pathFor(f,ax)}" class="curve"/>`;svg.innerHTML=out;let err=Math.abs(sum-exact);setMetrics(fmt(sum),'Aproximación',fmt(exact),'Valor exacto',fmt(err),'Error absoluto');$('#labFeedback').innerHTML=`n=${n}, Δx=${fmt(dx)}. ${err<.002?'<span class="ok">Aproximación muy precisa.</span>':'Aumenta n y observa cómo cambia el error.'}`; };
      $$('#labControls input,#labControls select').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.5'){
      configure(`<label>n<input id="ln" type="range" min="2" max="60" value="6"></label>`);
      const run=()=>{let n=+$('#ln').value,dx=1/n,f=x=>x*x,ax=baseAxes(0,1,0,1.15);ax.xmin=0;ax.xmax=1;let out=ax.out,L=0,U=0;for(let i=0;i<n;i++){let lo=f(i*dx),up=f((i+1)*dx);L+=lo*dx;U+=up*dx;out+=`<rect class="rect-main" x="${ax.X(i*dx)}" y="${ax.Y(lo)}" width="${ax.pw*dx}" height="${ax.Y(0)-ax.Y(lo)}"/><rect class="rect-alt" x="${ax.X(i*dx)}" y="${ax.Y(up)}" width="${ax.pw*dx}" height="${ax.Y(0)-ax.Y(up)}"/>`;}out+=`<path d="${pathFor(f,ax)}" class="curve"/>`;svg.innerHTML=out;setMetrics(fmt(L),'Suma inferior',fmt(U),'Suma superior',fmt(U-L),'Brecha U−L');$('#labFeedback').innerHTML=`<strong>${fmt(L)}</strong> ≤ 1/3 ≤ <strong>${fmt(U)}</strong>. La brecha disminuye al refinar la partición.`;};
      $('#ln').addEventListener('input',run);run(); return;
    }
    if(NUM==='1.6'){
      configure(`<label>Máximo n<input id="ln" type="range" min="10" max="200" value="60"></label>`);
      const run=()=>{let N=+$('#ln').value,exact=1/3,ax=baseAxes(1,N,.3,.75);ax.xmin=1;ax.xmax=N;let out=ax.out,pts=[];for(let n=1;n<=N;n++){let r=(n*(n+1)*(2*n+1))/(6*n**3);pts.push([n,r]);}let d=pts.map((p,i)=>(i?'L':'M')+ax.X(p[0])+' '+ax.Y(p[1])).join(' ');out+=`<line class="exact-line" x1="${ax.X(1)}" y1="${ax.Y(exact)}" x2="${ax.X(N)}" y2="${ax.Y(exact)}"/><path d="${d}" class="curve"/>`;[1,Math.round(N/4),Math.round(N/2),N].forEach(n=>{let r=(n*(n+1)*(2*n+1))/(6*n**3);out+=`<circle class="point-mark" cx="${ax.X(n)}" cy="${ax.Y(r)}" r="5"/>`;});svg.innerHTML=out;let last=pts.at(-1)[1];setMetrics(fmt(last),'Rₙ final',fmt(exact),'Límite 1/3',fmt(Math.abs(last-exact)),'Error');$('#labFeedback').textContent='La línea verde discontinua representa el valor límite 1/3.';};
      $('#ln').addEventListener('input',run);run(); return;
    }
    if(NUM==='1.8'){
      configure(`<label>∫ₐᶜ f<input id="A" type="number" value="2"></label><label>∫𝑐ᵇ f<input id="B" type="number" value="7"></label><label>Factor α<input id="alpha" type="number" value="3"></label>`);
      const run=()=>{let A=+$('#A').value,B=+$('#B').value,a=+$('#alpha').value;svg.innerHTML=`<line x1="90" y1="210" x2="770" y2="210" class="axis"/><line x1="90" y1="185" x2="420" y2="185" stroke="#E20613" stroke-width="18" stroke-linecap="round"/><line x1="420" y1="185" x2="770" y2="185" stroke="#9a6700" stroke-width="18" stroke-linecap="round"/><text x="90" y="240">a</text><text x="420" y="240">c</text><text x="770" y="240">b</text><text x="250" y="155" text-anchor="middle">∫ₐᶜf = ${A}</text><text x="595" y="155" text-anchor="middle">∫𝑐ᵇf = ${B}</text>`;setMetrics(A+B,'∫ₐᵇ f',a*(A+B),'∫ₐᵇ αf',-(A+B),'∫ᵦᵃ f');$('#labFeedback').textContent='Aditividad, linealidad y orientación operan simultáneamente.';};
      $$('#labControls input').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.9' || NUM==='1.11'){
      configure(NUM==='1.9'?`<label>Constante C<input id="C" type="range" min="-4" max="4" step=".25" value="1"></label>`:`<label>x₀<input id="x0" type="range" min="-2" max="2" step=".25" value="1"></label><label>y₀<input id="y0" type="range" min="-1" max="6" step=".25" value="5"></label>`);
      const run=()=>{let ax=baseAxes(-2.2,2.2,-4.5,8);ax.xmin=-2.2;ax.xmax=2.2;let out=ax.out,selected=NUM==='1.9'?+$('#C').value:(+$('#y0').value-(+$('#x0').value)**2);[-3,-1,1,3].forEach(c=>{out+=`<path d="${pathFor(x=>x*x+c,ax)}" class="family"/>`;});out+=`<path d="${pathFor(x=>x*x+selected,ax)}" class="family-selected"/>`;if(NUM==='1.11'){let x0=+$('#x0').value,y0=+$('#y0').value;out+=`<circle class="point-mark" cx="${ax.X(x0)}" cy="${ax.Y(y0)}" r="7"/><text x="${ax.X(x0)+10}" y="${ax.Y(y0)-10}">(${x0},${y0})</text>`;}svg.innerHTML=out;setMetrics(fmt(selected),'Constante C','2x','Derivada de x²+C',NUM==='1.11'?'1 condición':'∞','Selección');$('#labFeedback').innerHTML=`Curva destacada: <strong>F(x)=x²${selected>=0?'+':''}${fmt(selected)}</strong>. Todas tienen derivada 2x.`;};
      $$('#labControls input').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.10'){
      configure(`<label>Coeficiente a<input id="a" type="range" min="1" max="8" value="3"></label><label>Exponente n<input id="n" type="range" min="0" max="5" value="2"></label>`);
      const run=()=>{let a=+$('#a').value,n=+$('#n').value,c=a/(n+1),ax=baseAxes(0,1.3,0,10);ax.xmin=0;ax.xmax=1.3;let f=x=>a*x**n,F=x=>c*x**(n+1),out=ax.out+`<path d="${pathFor(f,ax)}" stroke="#E20613" stroke-width="3" fill="none"/><path d="${pathFor(F,ax)}" stroke="#9a6700" stroke-width="3" fill="none"/><text x="625" y="55" fill="#E20613">f(x)=a·xⁿ</text><text x="625" y="80" fill="#9a6700">F(x)=a/(n+1)·xⁿ⁺¹</text>`;svg.innerHTML=out;setMetrics(`${a}x^${n}`,'Integrando',`${fmt(c)}x^${n+1} + C`,'Antiderivada',`${fmt(c*(n+1))}x^${n}`,'Derivación de F');$('#labFeedback').textContent='La derivada de la curva F recupera exactamente el integrando f.';};
      $$('#labControls input').forEach(e=>e.addEventListener('input',run));run(); return;
    }
    if(NUM==='1.12'){
      configure(`<label>Extremo b<input id="b" type="range" min=".5" max="3" step=".1" value="2"></label><label>Constante C<input id="C" type="range" min="-2" max="2" step=".25" value=".5"></label>`);
      const run=()=>{let b=+$('#b').value,C=+$('#C').value,ax=baseAxes(0,3.2,-1,5.5);ax.xmin=0;ax.xmax=3.2,f=x=>x,F=x=>x*x/2+C;let area=`M ${ax.X(0)} ${ax.Y(0)} `;for(let i=0;i<=100;i++){let x=b*i/100;area+=`L ${ax.X(x)} ${ax.Y(f(x))} `}area+=`L ${ax.X(b)} ${ax.Y(0)} Z`;let out=ax.out+`<path d="${area}" class="area-fill"/><path d="${pathFor(f,ax)}" class="curve"/>`;[-1,0,1].forEach(k=>out+=`<path d="${pathFor(x=>x*x/2+k,ax)}" class="${Math.abs(k-C)<.01?'family-selected':'family'}"/>`);out+=`<path d="${pathFor(F,ax)}" class="family-selected"/>`;svg.innerHTML=out;setMetrics(fmt(b*b/2),'∫₀ᵇx dx',`x²/2 + ${fmt(C)}`,'Una antiderivada',fmt(C),'C');$('#labFeedback').textContent='La región sombreada produce un número; la familia de curvas representa antiderivadas.';};
      $$('#labControls input').forEach(e=>e.addEventListener('input',run));run(); return;
    }
  }

  function makeExercise(level){
    const scale = level==='easy'?1:level==='medium'?2:3;
    if(NUM==='1.1'){let a=rnd(1,2+scale),b=rnd(0,3*scale),n=rnd(3,4+2*scale),ans=a*n*(n+1)/2+b*n;return {prompt:`Calcula Σ(${a}i${b?'+ '+b:''}), i=1…${n}.`,answer:ans,explain:`Usa ${a}Σi + ${b}Σ1 = ${a}·${n}(${n}+1)/2 + ${b}·${n}.`};}
    if(NUM==='1.2'){let n=rnd(4,5+3*scale); if(scale===1) return {prompt:`Calcula Σi, i=1…${n}.`,answer:n*(n+1)/2,explain:`n(n+1)/2.`}; let ans=n*(n+1)*(2*n+1)/6;return {prompt:`Calcula Σi², i=1…${n}.`,answer:ans,explain:`n(n+1)(2n+1)/6.`};}
    if(NUM==='1.3'){let k=rnd(1,2+scale),b=rnd(1,2+scale),ans=k*b*b/2;return {prompt:`Área exacta bajo f(x)=${k}x en [0,${b}].`,answer:ans,explain:`Es un triángulo: base=${b}, altura=${k*b}, A=bh/2.`};}
    if(NUM==='1.4'){let n=[2,4,5,8,10][rnd(0,4)],dx=1/n,s=0;for(let i=1;i<=n;i++)s+=(i*dx)**2*dx;return {prompt:`Aproxima ∫₀¹x²dx con suma derecha y n=${n}.`,answer:s,tol:1e-5,explain:`Δx=1/${n} y Rₙ=Σ(i/${n})²·Δx.`};}
    if(NUM==='1.5'){let n=[2,4,5,10][rnd(0,3)],dx=1/n,L=0,U=0;for(let i=0;i<n;i++){L+=(i*dx)**2*dx;U+=((i+1)*dx)**2*dx}return {prompt:`Para f(x)=x² en [0,1] y n=${n}, calcula la brecha Uₙ−Lₙ.`,answer:U-L,tol:1e-5,explain:`Calcula ambas sumas y resta: Uₙ−Lₙ.`};}
    if(NUM==='1.6'){let n=[5,10,20,50][rnd(0,3)],ans=(n*(n+1)*(2*n+1))/(6*n**3);return {prompt:`Para f(x)=x² en [0,1], calcula Rₙ con n=${n} usando Rₙ=[n(n+1)(2n+1)]/(6n³).`,answer:ans,tol:1e-6,explain:`Sustituye n en la fórmula y compara con 1/3.`};}
    if(NUM==='1.7'){let n=[2,4,5,8][rnd(0,3)],method=['left','right','mid'][rnd(0,2)],dx=1/n,s=0;for(let i=0;i<n;i++){let x=method==='left'?i*dx:method==='right'?(i+1)*dx:(i+.5)*dx;s+=x*x*dx}let lab=method==='left'?'izquierda':method==='right'?'derecha':'punto medio';return {prompt:`Calcula la suma de Riemann por ${lab} para f(x)=x² en [0,1], n=${n}.`,answer:s,tol:1e-6,explain:`Δx=1/${n}. Evalúa x² en el punto de muestreo indicado y multiplica por Δx.`};}
    if(NUM==='1.8'){let A=rnd(1,5*scale),B=rnd(1,5*scale),a=rnd(2,4),ans=a*(A+B);return {prompt:`Si ∫ₐᶜf=${A}, ∫𝑐ᵇf=${B}, calcula ∫ₐᵇ ${a}f(x)dx.`,answer:ans,explain:`Primero aditividad: ${A+B}. Luego linealidad: ${a}·${A+B}.`};}
    if(NUM==='1.9' || NUM==='1.10'){let a=rnd(1,4*scale),n=rnd(1,2+scale),ans=a/(n+1);return {prompt:`En ∫${a}x^${n} dx, ¿cuál es el coeficiente de x^${n+1} en la antiderivada?`,answer:ans,tol:1e-6,explain:`Coeficiente = a/(n+1) = ${a}/${n+1}.`};}
    if(NUM==='1.11'){let a=rnd(1,3*scale),x0=rnd(0,2+scale),y0=rnd(1,6*scale),ans=y0-a*x0*x0/2;return {prompt:`Si y'=${a}x y y(${x0})=${y0}, determina C.`,answer:ans,tol:1e-6,explain:`y=${a/2}x²+C; sustituye la condición inicial.`};}
    if(NUM==='1.12'){let b=rnd(1,2+scale),ans=b*b/2;return {prompt:`Calcula la integral definida ∫₀^${b} x dx.`,answer:ans,tol:1e-6,explain:`[x²/2]₀^${b} = ${b*b}/2.`};}
  }

  let ex=null,hits=0,attempts=0,streak=0;
  function updateScore(){$('#hits').textContent=hits;$('#attempts').textContent=attempts;$('#streak').textContent=streak;}
  function newEx(){ex=makeExercise($('#difficulty').value);$('#exercisePrompt').innerHTML='<strong>Ejercicio:</strong> '+ex.prompt;$('#exerciseAnswer').value='';$('#exerciseFeedback').textContent='';}
  $('#newExercise').addEventListener('click',newEx);
  $('#checkExercise').addEventListener('click',()=>{if(!ex){newEx();return}let raw=$('#exerciseAnswer').value.trim().replace(',','.');let v=Number(raw);if(!Number.isFinite(v)){$('#exerciseFeedback').innerHTML='<span class="bad">Ingresa un valor numérico.</span>';return}attempts++;let ok=Math.abs(v-ex.answer)<= (ex.tol||1e-6)*Math.max(1,Math.abs(ex.answer));if(ok){hits++;streak++;$('#exerciseFeedback').innerHTML=`<span class="ok">Correcto.</span> ${ex.explain}`;}else{streak=0;$('#exerciseFeedback').innerHTML=`<span class="bad">Revisa.</span> ${ex.explain} Respuesta esperada: <strong>${fmt(ex.answer)}</strong>.`;}updateScore();});
  $('#difficulty').addEventListener('change',newEx);
  newEx();

  function telecomProblem(){
    const map={
      '1.1':'Un receptor obtiene 6 muestras simplificadas x[k]=2k+1. Expresa la suma con Σ y calcula el total. <strong>Resultado:</strong> Σₖ₌₁⁶(2k+1)=48.',
      '1.2':'Un bloque contiene 10 muestras modeladas como x[k]=3k+2. Usa propiedades de sumación, no expansión término a término. <strong>Resultado:</strong> 185.',
      '1.3':'Una magnitud positiva sigue m(t)=2t entre 0 y 2 s. El área bajo la curva es un triángulo. <strong>Resultado:</strong> 4 unidades acumuladas.',
      '1.4':'Para x(t)=t² en [0,1], estima la acumulación con 8 muestras por extremos derechos y compárala con 1/3. El error permite cuantificar la calidad de la discretización.',
      '1.5':'Para x(t)=t² en [0,1], calcula Lₙ y Uₙ. Interpreta ambos valores como límites inferior y superior de la acumulación continua.',
      '1.6':'Compara R₁₀, R₁₀₀ y R₁₀₀₀ para x(t)=t². Describe cómo cambia Δt y el error respecto de 1/3.',
      '1.7':'Selecciona la señal 1+0.6·sin(2πt) en el laboratorio. Compara izquierda, derecha y punto medio con el mismo n. Explica cuál se aproxima mejor en tu prueba.',
      '1.8':'Si dos componentes de señal tienen integrales A=2 y B=5, entonces la integral de 3x₁−2x₂ es 3A−2B=−4. La linealidad permite separar contribuciones.',
      '1.9':'Si la tasa de cambio de una variable es 2t, su familia reconstruida es t²+C. Diferentes C representan diferentes niveles iniciales.',
      '1.10':'Un modelo aproximado usa p(t)=3t²+4. Su antiderivada es t³+4t+C. Verifica derivando.',
      '1.11':'Si y′=2t y y(1)=5, la información inicial fija C=4. La trayectoria queda determinada: y=t²+4.',
      '1.12':'∫₀²t dt=2 cuantifica acumulación en un intervalo. En cambio, ∫t dt=t²/2+C describe toda la familia de antiderivadas.'
    };
    $('#telecomProblem').innerHTML=map[NUM];
  }
  telecomProblem();

  let gameOn=false,stage=0,gameEx=null;
  const pathPts=[[70,90],[215,58],[360,112],[510,72],[655,65],[790,90]];
  function movePacket(){let p=pathPts[stage];$('#packet').setAttribute('cx',p[0]);$('#packet').setAttribute('cy',p[1]);$('#gameStage').textContent=`${stage}/5`;}
  function nextGame(){if(stage>=5){$('#gamePrompt').innerHTML='<strong>Misión completada:</strong> el paquete llegó al receptor.';$('#gameFeedback').innerHTML='<span class="ok">¡Excelente! Has superado cinco desafíos.</span>';return}gameEx=makeExercise($('#difficulty').value);$('#gamePrompt').innerHTML=`<strong>Desafío ${stage+1}:</strong> ${gameEx.prompt}`;$('#gameAnswer').value='';}
  $('#toggleGame').addEventListener('click',()=>{gameOn=!gameOn;$('#gamePanel').hidden=!gameOn;$('#toggleGame').textContent=gameOn?'Ocultar juego':'Iniciar juego';if(gameOn && !gameEx){stage=0;movePacket();nextGame();}});
  $('#gameCheck').addEventListener('click',()=>{if(!gameEx)return;let v=Number($('#gameAnswer').value.trim().replace(',','.'));if(!Number.isFinite(v)){$('#gameFeedback').innerHTML='<span class="bad">Ingresa una respuesta numérica.</span>';return}let ok=Math.abs(v-gameEx.answer)<= (gameEx.tol||1e-6)*Math.max(1,Math.abs(gameEx.answer));if(ok){stage++;movePacket();$('#gameFeedback').innerHTML='<span class="ok">Correcto. El paquete avanzó.</span>';gameEx=null;setTimeout(nextGame,350);}else{$('#gameFeedback').innerHTML=`<span class="bad">El paquete espera.</span> Pista: ${gameEx.explain}`;}});
  $('#gameReset').addEventListener('click',()=>{stage=0;gameEx=null;movePacket();$('#gameFeedback').textContent='';nextGame();});

  drawLab();
})();
