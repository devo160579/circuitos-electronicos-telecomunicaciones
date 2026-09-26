(function(){
  function topicFromFile(href){
    const m=(href||'').match(/tema-(\d+)-(\d+)\.html(?:$|[?#])/i);
    return m?m[1]+'.'+m[2]:null;
  }

  function enhanceCalcNav(frame){
    try{
      const d=frame.contentDocument,w=frame.contentWindow;
      if(!d||!w)return;
      const nav=d.querySelector('aside.class-nav');
      if(!nav)return;
      const old=d.getElementById('calc-nav-circuitos-style');
      if(old)old.remove();
      const style=d.createElement('style');
      style.id='calc-nav-circuitos-style';
      style.textContent=`
        @media (min-width:821px){
          .layout{grid-template-columns:360px minmax(0,1fr)!important;gap:24px!important;max-width:1240px!important}
          aside.class-nav{position:sticky!important;top:10px!important;width:100%!important;max-height:calc(100vh - 20px)!important;overflow-y:auto!important;overflow-x:hidden!important}
        }
        aside.class-nav{
          display:block!important;background:#fff!important;color:#292929!important;
          border:1px solid #e4e4e4!important;border-top:6px solid #E20613!important;
          border-radius:14px!important;padding:18px 14px 16px!important;
          box-shadow:0 8px 24px rgba(33,24,24,.07)!important;
          scrollbar-width:auto!important;scrollbar-color:#8a8a8a #f2f2f2!important;
        }
        .class-nav-title{
          display:block!important;margin:0 0 8px!important;padding:4px 10px 14px!important;
          border-bottom:1px solid #dedede!important;color:#555!important;
          font-size:.92rem!important;line-height:1.2!important;font-weight:900!important;
          letter-spacing:.08em!important;text-transform:uppercase!important;
        }
        aside.class-nav button{
          display:block!important;width:100%!important;min-height:0!important;margin:0!important;
          padding:10px 10px!important;border:0!important;border-radius:0!important;
          background:transparent!important;color:#292929!important;text-align:left!important;
          font-family:"Source Sans 3","Source Sans Pro","Segoe UI",Arial,sans-serif!important;
          font-size:1.03rem!important;font-weight:400!important;line-height:1.35!important;
          box-shadow:none!important;white-space:normal!important;
          transition:background .14s ease,color .14s ease,padding-left .14s ease!important;
        }
        aside.class-nav button:hover{background:#fafafa!important;color:#9b101b!important}
        aside.class-nav button.active{
          position:relative!important;background:#fff4f5!important;color:#A60E1C!important;
          font-weight:700!important;padding-left:16px!important;
        }
        aside.class-nav button.active::before{
          content:""!important;position:absolute!important;left:0!important;top:7px!important;bottom:7px!important;
          width:3px!important;border-radius:3px!important;background:#E20613!important;
        }
        aside.class-nav::-webkit-scrollbar{width:10px!important}
        aside.class-nav::-webkit-scrollbar-track{background:#f2f2f2!important;border-radius:10px!important}
        aside.class-nav::-webkit-scrollbar-thumb{background:#888!important;border-radius:10px!important;border:2px solid #f2f2f2!important}
        @media(max-width:820px){
          .layout{grid-template-columns:1fr!important}
          aside.class-nav{display:flex!important;position:static!important;max-height:none!important;overflow-x:auto!important;overflow-y:hidden!important;gap:5px!important;padding:8px!important;border-top-width:5px!important}
          .class-nav-title{display:none!important}
          aside.class-nav button{width:auto!important;min-width:max-content!important;padding:9px 11px!important;border-radius:7px!important;font-size:.92rem!important;white-space:nowrap!important}
          aside.class-nav button.active{padding-left:12px!important}
          aside.class-nav button.active::before{display:none!important}
        }
      `;
      d.head.appendChild(style);
      const buttons=[...nav.querySelectorAll('button[data-go]')];
      const sections=buttons.map(b=>({b,el:d.getElementById(b.dataset.go)})).filter(x=>x.el);
      const sync=()=>{
        let current=sections[0]||null;
        for(const x of sections){if(x.el.getBoundingClientRect().top<=170)current=x;}
        buttons.forEach(b=>b.classList.toggle('active',!!current&&b===current.b));
      };
      w.addEventListener('scroll',sync,{passive:true});
      buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
      sync();
    }catch(e){console.warn('No se pudo aplicar la navegación unificada de Cálculo Integral',e)}
  }

  function prepareBlockPage(){
    document.querySelectorAll('a.filelink').forEach(a=>{
      const topic=topicFromFile(a.getAttribute('href'));
      if(topic)a.setAttribute('href','?tema='+encodeURIComponent(topic));
    });
    const direct=document.getElementById('directLink');
    if(direct){
      direct.addEventListener('click',e=>{
        const topic=topicFromFile(direct.getAttribute('href'));
        if(topic){e.preventDefault();location.href='?tema='+encodeURIComponent(topic);}
      });
    }
    const requested=new URLSearchParams(location.search).get('tema');
    if(requested){
      const button=document.querySelector('.topic[data-topic="'+CSS.escape(requested)+'"]');
      if(button)button.click();
    }
  }

  window.enhanceCalcNav=enhanceCalcNav;
  setTimeout(prepareBlockPage,0);
})();