// Lightweight wizard controller for step-based layout
(function(){
  const steps = Array.from(document.querySelectorAll('[data-step]'));
  if (!steps.length) return;

  let current = 0;
  const total = steps.length;

  const progressBar = document.querySelector('.progress > i');
  const stepPills = Array.from(document.querySelectorAll('.step-pill'));
  const nextBtn = document.getElementById('wizardNext');
  const backBtn = document.getElementById('wizardBack');

  function showStep(index){
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;
    steps.forEach((s,i)=>{
      s.classList.toggle('active', i===index);
      if (i===index){
        s.querySelectorAll('input,button,select,textarea').forEach(el=>el.removeAttribute('inert'));
        // focus first focusable element
        const first = s.querySelector('input,button,select,textarea,a');
        if (first) first.focus();
      } else {
        s.querySelectorAll('input,button,select,textarea').forEach(el=>el.setAttribute('inert','true'));
      }
    });
    // update pills
    stepPills.forEach((p,i)=>p.setAttribute('aria-current', i===index?'true':'false'));
    // progress
    const pct = Math.round(((index+1)/total)*100);
    if (progressBar) progressBar.style.width = pct + '%';

    // buttons
    if (backBtn) backBtn.disabled = index===0;
    if (nextBtn) nextBtn.textContent = (index===total-1)?'Finish':'Next';
  }

  // allow jumping by clicking pills if present
  document.querySelectorAll('.step-pill').forEach((pill, idx)=>{
    pill.addEventListener('click', ()=> showStep(idx));
  });

  if (nextBtn) nextBtn.addEventListener('click', ()=>{
    // validation gating: ensure required elements in current step are present
    const step = steps[current];
    const required = step.querySelectorAll('[data-required]');
    for (const el of required){
      if ((el.type === 'checkbox' && !el.checked) || (el.value !== undefined && String(el.value).trim()==='')){
        el.focus();
        return; // block advance
      }
    }
    if (current === total -1){
      // finalize: just alert or could trigger a save
      showStep(current);
    } else showStep(current+1);
  });

  if (backBtn) backBtn.addEventListener('click', ()=> showStep(current-1));

  // keyboard shortcuts: Alt+ArrowLeft/Right to navigate
  window.addEventListener('keydown', (e)=>{
    if (e.altKey && e.key === 'ArrowRight') { showStep(current+1); }
    if (e.altKey && e.key === 'ArrowLeft') { showStep(current-1); }
  });

  // initialize
  showStep(0);
})();
