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

  function buildToc(d,toc){
    let headings=[...d.querySelectorAll('h2,h3')]
      .filter(h=>!h.closest('#TOC') && !h.closest('footer') && h.textContent.trim().length>2);

    // Si el documento usa una jerarquía muy ligera, incorporamos h4 para no dejar temas fuera.
    if(headings.length<3){
      headings=[...d.querySelectorAll('h2,h3,h4')]
        .filter(h=>!h.closest('#TOC') && !h.closest('footer') && h.textContent.trim().length>2);
    }

    // Evitar duplicados por texto/elemento conservando el orden del documento.
    const seen=new Set();
    headings=headings.filter(h=>{
      if(seen.has(h))return false;
      seen.add(h);return true;
    });

    let ul=toc.querySelector('ul');
    if(!ul){ul=d.createElement('ul');toc.appendChild(ul)}
    ul.innerHTML='';

    headings.forEach(h=>{
      if(!h.id)h.id=uniqueId(d,slugify(h.textContent));
      const li=d.createElement('li');
      if(h.tagName==='H3')li.className='toc-level-3';
      if(h.tagName==='H4')li.className='toc-level-4';
      const a=d.createElement('a');
      a.href='#'+h.id;
      a.textContent=h.textContent.trim();
      li.appendChild(a);ul.appendChild(li);
    });
  }

  function enhance(){
    try{
      const d=frame.contentDocument,w=frame.contentWindow;
      if(!d||!w)return;

      let toc=d.getElementById('TOC');
      if(!toc){
        toc=d.createElement('nav');
        toc.id='TOC';
        d.body.prepend(toc);
      }

      // En algunos módulos de B2/B3 el TOC existe pero llega vacío.
      // Si tiene menos de dos enlaces útiles, se reconstruye desde los encabezados reales.
      if(toc.querySelectorAll('a[href^="#"]').length<2)buildToc(d,toc);

      if(!toc.querySelector('.class-nav-title')){
        const lab=d.createElement('div');
        lab.className='class-nav-title';
        lab.textContent='Navegación de la clase';
        toc.prepend(lab);
      }

      const old=d.getElementById('student-nav-enhancement');
      if(old)old.remove();
      const style=d.createElement('style');
      style.id='student-nav-enhancement';
      style.textContent=`
        #TOC:before{display:none!important}
        #TOC .class-nav-title{padding:8px 10px 11px;color:#585858;font-size:.75rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #e6e6e6;margin-bottom:6px}
        #TOC ul{list-style:none!important;padding:0!important;margin:0!important}
        #TOC li{margin:2px 0!important;padding:0!important}
        #TOC li.toc-level-3 a{padding-left:18px!important;font-size:.85rem!important}
        #TOC li.toc-level-4 a{padding-left:27px!important;font-size:.82rem!important;color:#5a5a5a!important}
        #TOC a{display:block!important;padding:8px 10px!important;border-radius:7px!important;text-decoration:none!important;color:#444!important;font-size:.88rem!important;line-height:1.25!important;transition:.15s!important}
        #TOC a:hover{background:#FFF0F1!important;color:#9E0A16!important}
        #TOC a.active{background:#FDE8EA!important;color:#A60E1C!important;font-weight:900!important;box-shadow:inset 4px 0 0 #E20613!important;padding-left:15px!important}
        #TOC::-webkit-scrollbar{width:10px}
        #TOC::-webkit-scrollbar-track{background:#f2f2f2;border-radius:10px}
        #TOC::-webkit-scrollbar-thumb{background:#888;border-radius:10px;border:2px solid #f2f2f2}
        @media(min-width:1180px){
          body{max-width:1180px!important;padding-left:330px!important;padding-right:34px!important}
          #TOC{position:fixed!important;left:max(20px,calc((100vw - 1180px)/2 + 6px))!important;top:24px!important;width:270px!important;max-height:calc(100vh - 48px)!important;overflow-y:auto!important;overflow-x:hidden!important;z-index:1000!important;background:#fff!important;border:1px solid #E6E6E6!important;border-top:5px solid #E20613!important;border-left:1px solid #E6E6E6!important;border-radius:12px!important;padding:10px!important;box-shadow:0 7px 22px rgba(38,26,26,.08)!important;scrollbar-color:#888 #f2f2f2!important;scrollbar-width:auto!important}
        }
        @media(max-width:1179px){
          #TOC{position:relative!important;left:auto!important;top:auto!important;width:auto!important;max-height:none!important;margin:0 0 18px!important;border-top:5px solid #E20613!important;border-left:1px solid #E6E6E6!important}
        }`;
      d.head.appendChild(style);

      const links=[...toc.querySelectorAll('a[href^="#"]')];
      const pairs=links.map(a=>{
        const id=decodeURIComponent(a.getAttribute('href').slice(1));
        return {a,el:d.getElementById(id)};
      }).filter(x=>x.el);

      const sync=()=>{
        let current=pairs[0]?.a||null;
        for(const x of pairs){
          if(x.el.getBoundingClientRect().top<=155)current=x.a;
        }
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

  frame.addEventListener('load',enhance);
  if(frame.contentDocument?.readyState==='complete')enhance();
})();