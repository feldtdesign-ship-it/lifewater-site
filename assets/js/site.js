
(function(){
  var nav=document.getElementById('nav');
  function onScroll(){nav.classList.toggle('scrolled',window.scrollY>60)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  window.toggleMobile=function(){
    var m=document.getElementById('mobileNav');
    var open=m.classList.toggle('open');
    document.body.classList.toggle('nav-open',open);
  };

  window.switchTab=function(btn,id){
    var tabs=btn.closest('.tabs');
    tabs.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active')});
    btn.classList.add('active');
    tabs.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active')});
    var panel=document.getElementById(id);if(panel)panel.classList.add('active');
  };

  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}})},{threshold:0.08});
    reveals.forEach(function(el){io.observe(el)});
  }else{reveals.forEach(function(el){el.classList.add('visible')})}

  // Contact form: Formspree when configured, otherwise open the visitor's mail app.
  document.querySelectorAll('[data-contact-form]').forEach(function(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var status=form.querySelector('[data-form-status]');
      var btn=form.querySelector('.btn-submit');
      var data=new FormData(form);
      if(form.action.indexOf('FORM_ID')!==-1){
        var body='Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\nPhone: '+(data.get('phone')||'')+'\nSubject: '+data.get('subject')+'\nLocation: '+(data.get('location')||'')+'\n\n'+data.get('message');
        window.location.href='mailto:info@lifewaterengineering.com?subject='+encodeURIComponent('Website inquiry: '+data.get('subject'))+'&body='+encodeURIComponent(body);
        status.className='form-status ok';status.textContent='Opening your email app so you can send this message to info@lifewaterengineering.com.';
        return;
      }
      btn.disabled=true;
      fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}}).then(function(r){
        if(r.ok){form.reset();status.className='form-status ok';status.textContent='Thank you! Your message has been sent. We\'ll be in touch within one business day.';}
        else{throw new Error('bad status')}
      }).catch(function(){
        status.className='form-status err';status.textContent='Sorry, something went wrong. Please email info@lifewaterengineering.com or call 1 (907) 458-7024.';
      }).finally(function(){btn.disabled=false});
    });
  });
})();
