(()=>{
  const frame=document.getElementById('classFrame');
  if(!frame)return;

  const topicMeta={
    'Tema_2_1_Fundamentos_Osciladores_MIAI.html':{
      why:'Los osciladores son esenciales en telecomunicaciones porque permiten generar señales periódicas sin una excitación externa continua. Se emplean como portadoras, relojes, referencias de frecuencia y fuentes de señal en transmisores, receptores y sistemas electrónicos.',
      result:'Al finalizar este tema, el estudiante será capaz de explicar el principio de funcionamiento de un oscilador, interpretar las condiciones de oscilación y reconocer los parámetros principales que determinan su amplitud, frecuencia y estabilidad.'
    },
    'Tema_2_2_Osciladores_RC_LC_MIAI.html':{
      why:'Comprender los osciladores RC y LC permite seleccionar y diseñar circuitos generadores de señal según el rango de frecuencia requerido. Estas topologías aparecen en generadores, sintetizadores y etapas de radiofrecuencia de numerosos sistemas de telecomunicaciones.',
      result:'Al finalizar este tema, el estudiante será capaz de analizar osciladores RC y LC, identificar sus componentes de realimentación y determinar de forma básica la frecuencia de oscilación y los criterios de selección de sus elementos.'
    },
    'Tema_2_3_Modulacion_AM_MIAI.html':{
      why:'La modulación AM permite comprender cómo una señal de información puede trasladarse a una frecuencia adecuada para su transmisión. Es una base conceptual para estudiar espectro, ancho de banda, portadoras, bandas laterales y procesos de demodulación.',
      result:'Al finalizar este tema, el estudiante será capaz de explicar el proceso de modulación AM, interpretar su espectro, calcular el índice de modulación y el ancho de banda, y relacionar estos parámetros con aplicaciones de telecomunicaciones.'
    },
    'Tema_2_4_Modulacion_FM_MIAI.html':{
      why:'La modulación FM es ampliamente utilizada por su mejor comportamiento frente al ruido y su capacidad para transportar información mediante variaciones de frecuencia. Su estudio permite entender sistemas de radiodifusión y enlaces analógicos modernos.',
      result:'Al finalizar este tema, el estudiante será capaz de explicar la modulación FM, interpretar la desviación de frecuencia y el índice de modulación, estimar el ancho de banda y reconocer sus principales métodos de generación y demodulación.'
    },
    'Tema_3_1_Fundamentos_RF_MIAI.html':{
      why:'En radiofrecuencia, los circuitos dejan de comportarse como en baja frecuencia debido a efectos de longitud de onda, parasitismos, impedancias y propagación. Comprender estos fenómenos es indispensable para diseñar y analizar sistemas de comunicaciones inalámbricas.',
      result:'Al finalizar este tema, el estudiante será capaz de reconocer los parámetros fundamentales de radiofrecuencia y relacionar frecuencia, longitud de onda, impedancia, potencia y efectos parásitos con el comportamiento de circuitos de telecomunicaciones.'
    },
    'Tema_3_2_Resonancia_Adaptacion_RF_MIAI.html':{
      why:'La resonancia y la adaptación de impedancias permiten transferir potencia de manera eficiente y reducir reflexiones en sistemas de RF. Estos conceptos son fundamentales en antenas, líneas de transmisión, amplificadores y filtros.',
      result:'Al finalizar este tema, el estudiante será capaz de analizar condiciones de resonancia, interpretar el factor de calidad y aplicar conceptos básicos de adaptación de impedancias, coeficiente de reflexión y ROE en circuitos de RF.'
    },
    'Tema_3_3_Amplificadores_Filtros_RF_MIAI.html':{
      why:'Los amplificadores y filtros de RF permiten acondicionar, seleccionar y amplificar señales sin degradar excesivamente su calidad. Son bloques esenciales en transmisores y receptores de cualquier sistema de telecomunicaciones.',
      result:'Al finalizar este tema, el estudiante será capaz de identificar los parámetros principales de amplificadores y filtros de RF, analizar ganancia, ancho de banda y selectividad, y relacionarlos con el desempeño de un enlace de telecomunicaciones.'
    },
    'Tema_3_4_Integracion_Validacion_MIAI.html':{
      why:'Un sistema de telecomunicaciones no funciona como etapas aisladas: requiere que amplificadores, filtros, osciladores y bloques de RF operen de forma compatible. La integración y validación permiten verificar que el sistema completo cumple los requisitos de diseño.',
      result:'Al finalizar este tema, el estudiante será capaz de integrar funcionalmente los principales bloques de un sistema electrónico de telecomunicaciones y proponer una estrategia básica de validación mediante mediciones, criterios de desempeño y análisis de resultados.'
    }
  };

  const slugify=(text)=>text
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'') || 'seccion';

  function uniqueId(d,base){
    let id=base,n=2;
    while(d.getElementById(id)) id=`${base}-${n++}`;
    return id;
  }

  function getCurrentMeta(){
    const src=(frame.getAttribute('src')||'').split('?')[0].split('/').pop();
    return topicMeta[src]||null;
  }

  function injectIntroSections(d){
    const meta=getCurrentMeta();
    if(!meta)return;

    const existingWhy=d.getElementById('por-que-aprender');
    const existingResult=d.getElementById('resultado-esperado');
    if(existingWhy&&existingResult)return;

    const firstSection=d.querySelector('.section');
    const container=firstSection?.parentElement || d.querySelector('.page') || d.body;
    const before=firstSection || null;

    if(!existingWhy){
      const s=d.createElement('section');
      s.className='section nav-intro-section';
      s.id='por-que-aprender';
      s.innerHTML='<h2>¿Por qué necesito aprender esto?</h2><p></p>';
      s.querySelector('p').textContent=meta.why;
      container.insertBefore(s,before);
    }

    if(!existingResult){
      const s=d.createElement('section');
      s.className='section nav-intro-section';
      s.id='resultado-esperado';
      s.innerHTML='<h2>Resultado esperado del tema</h2><p></p>';
      s.querySelector('p').textContent=meta.result;
      const why=d.getElementById('por-que-aprender');
      if(why?.nextSibling)container.insertBefore(s,why.nextSibling);else container.appendChild(s);
    }
  }

  function discoverTargets(d){
    const valid=(el)=>el && !el.closest('#TOC') && !el.closest('footer') && !el.closest('.ucacue-footer');
    let sections=[...d.querySelectorAll('.section')].filter(valid);
    if(sections.length>=2){
      return sections.map((el,i)=>{
        const titleEl=el.querySelector('h1,h2,h3,h4,.head,.section-title,.title,.formula-label');
        let label=(titleEl?.textContent||'').replace(/\s+/g,' ').trim();
        if(!label){
          const strong=el.querySelector('strong,b');
          label=(strong?.textContent||'').replace(/\s+/g,' ').trim();
        }
        if(!label)label=`Sección ${i+1}`;
        if(label.length>88)label=label.slice(0,85)+'…';
        return {el,label,level:2};
      });
    }

    sections=[...d.querySelectorAll('main section,article')].filter(valid);
    if(sections.length>=2){
      return sections.map((el,i)=>{
        const titleEl=el.querySelector('h1,h2,h3,h4,.head,.section-title,.title');
        let label=(titleEl?.textContent||'').replace(/\s+/g,' ').trim()||`Sección ${i+1}`;
        if(label.length>88)label=label.slice(0,85)+'…';
        return {el,label,level:2};
      });
    }

    const headings=[...d.querySelectorAll('h2,h3,h4')]
      .filter(h=>valid(h) && h.textContent.trim().length>2);
    return headings.map(h=>({
      el:h,
      label:h.textContent.replace(/\s+/g,' ').trim(),
      level:h.tagName==='H4'?4:(h.tagName==='H3'?3:2)
    }));
  }

  function buildToc(d,toc){
    const targets=discoverTargets(d);
    let ul=toc.querySelector('ul');
    if(!ul){ul=d.createElement('ul');toc.appendChild(ul)}
    ul.innerHTML='';

    targets.forEach((item,i)=>{
      const el=item.el;
      if(!el.id)el.id=uniqueId(d,slugify(item.label||`seccion-${i+1}`));
      const li=d.createElement('li');
      li.className=`toc-level-${item.level||2}`;
      const a=d.createElement('a');
      a.href='#'+el.id;
      a.textContent=item.label;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function enhance(){
    try{
      const d=frame.contentDocument,w=frame.contentWindow;
      if(!d||!w||!d.body)return;

      injectIntroSections(d);

      let toc=d.getElementById('TOC');
      if(!toc){
        toc=d.createElement('nav');
        toc.id='TOC';
        d.body.prepend(toc);
      }

      buildToc(d,toc);

      let lab=toc.querySelector('.class-nav-title');
      if(!lab){
        lab=d.createElement('div');
        lab.className='class-nav-title';
        toc.prepend(lab);
      }
      lab.textContent='Navegación de la clase';

      const old=d.getElementById('student-nav-enhancement');
      if(old)old.remove();
      const style=d.createElement('style');
      style.id='student-nav-enhancement';
      style.textContent=`
        .nav-intro-section{background:#fff!important;border:1px solid #E6E6E6!important;border-left:6px solid #E20613!important;box-shadow:0 4px 14px rgba(35,35,35,.05)!important}
        .nav-intro-section h2{color:#AF1C32!important;margin-top:0!important}
        #TOC:before{display:none!important}
        #TOC .class-nav-title{display:block!important;padding:8px 10px 11px;color:#585858;font-size:.75rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #e6e6e6;margin-bottom:6px}
        #TOC ul{display:block!important;visibility:visible!important;opacity:1!important;list-style:none!important;padding:0!important;margin:0!important}
        #TOC li{display:block!important;visibility:visible!important;opacity:1!important;margin:2px 0!important;padding:0!important}
        #TOC a{display:block!important;visibility:visible!important;opacity:1!important;padding:8px 10px!important;border-radius:7px!important;text-decoration:none!important;color:#444!important;font-size:.88rem!important;line-height:1.25!important;transition:.15s!important}
        #TOC li.toc-level-3 a{padding-left:18px!important;font-size:.85rem!important}
        #TOC li.toc-level-4 a{padding-left:27px!important;font-size:.82rem!important;color:#5a5a5a!important}
        #TOC a:hover{background:#FFF0F1!important;color:#9E0A16!important}
        #TOC a.active{background:#FDE8EA!important;color:#A60E1C!important;font-weight:900!important;box-shadow:inset 4px 0 0 #E20613!important;padding-left:15px!important}
        #TOC::-webkit-scrollbar{width:10px}
        #TOC::-webkit-scrollbar-track{background:#f2f2f2;border-radius:10px}
        #TOC::-webkit-scrollbar-thumb{background:#888;border-radius:10px;border:2px solid #f2f2f2}
        @media(min-width:1180px){
          body{max-width:1180px!important;padding-left:330px!important;padding-right:34px!important}
          #TOC{display:block!important;position:fixed!important;left:max(20px,calc((100vw - 1180px)/2 + 6px))!important;top:24px!important;width:270px!important;max-height:calc(100vh - 48px)!important;overflow-y:auto!important;overflow-x:hidden!important;z-index:1000!important;background:#fff!important;border:1px solid #E6E6E6!important;border-top:5px solid #E20613!important;border-left:1px solid #E6E6E6!important;border-radius:12px!important;padding:10px!important;box-shadow:0 7px 22px rgba(38,26,26,.08)!important;scrollbar-color:#888 #f2f2f2!important;scrollbar-width:auto!important}
        }
        @media(max-width:1179px){
          #TOC{display:block!important;position:relative!important;left:auto!important;top:auto!important;width:auto!important;max-height:none!important;margin:0 0 18px!important;border-top:5px solid #E20613!important;border-left:1px solid #E6E6E6!important;background:#fff!important}
        }`;
      d.head.appendChild(style);

      const links=[...toc.querySelectorAll('a[href^="#"]')];
      const pairs=links.map(a=>{
        const id=decodeURIComponent(a.getAttribute('href').slice(1));
        return {a,el:d.getElementById(id)};
      }).filter(x=>x.el);

      const sync=()=>{
        let current=pairs[0]?.a||null;
        for(const x of pairs){if(x.el.getBoundingClientRect().top<=155)current=x.a;}
        links.forEach(a=>a.classList.toggle('active',a===current));
      };

      w.addEventListener('scroll',sync,{passive:true});
      links.forEach(a=>a.addEventListener('click',()=>{
        links.forEach(x=>x.classList.remove('active'));
        a.classList.add('active');
      }));
      sync();
    }catch(e){
      console.warn('No se pudo mejorar la navegación interna',e);
    }
  }

  frame.addEventListener('load',()=>setTimeout(enhance,0));
  if(frame.contentDocument?.readyState==='complete')setTimeout(enhance,0);
})();