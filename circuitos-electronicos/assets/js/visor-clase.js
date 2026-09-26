(()=>{
  const frame=document.getElementById('classFrame');
  if(!frame)return;

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

  function discoverTargets(d){
    const valid=(el)=>el && !el.closest('#TOC') && !el.closest('footer') && !el.closest('.ucacue-footer');

    // Prioridad 1: las tarjetas/secciones reales usadas por los módulos MIAI de B2 y B3.
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

    // Prioridad 2: secciones semánticas.
    sections=[...d.querySelectorAll('main section,article')].filter(valid);
    if(sections.length>=2){
      return sections.map((el,i)=>{
        const titleEl=el.querySelector('h1,h2,h3,h4,.head,.section-title,.title');
        let label=(titleEl?.textContent||'').replace(/\s+/g,' ').trim()||`Sección ${i+1}`;
        if(label.length>88)label=label.slice(0,85)+'…';
        return {el,label,level:2};
      });
    }

    // Prioridad 3: encabezados tradicionales.
    let headings=[...d.querySelectorAll('h2,h3,h4')]
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
    return targets.length;
  }

  function enhance(){
    try{
      const d=frame.contentDocument,w=frame.contentWindow;
      if(!d||!w||!d.body)return;

      let toc=d.getElementById('TOC');
      if(!toc){
        toc=d.createElement('nav');
        toc.id='TOC';
        d.body.prepend(toc);
      }

      // Reconstruimos siempre el menú a partir de la estructura real del módulo.
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