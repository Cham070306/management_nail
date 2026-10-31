const homeDialog=document.querySelector('#homeDialog'),dialogContent=document.querySelector('#homeDialogContent');
function showHomeDialog(html){dialogContent.innerHTML=html;if(!homeDialog.open)homeDialog.showModal()}
document.querySelector('#closeHomeDialog').onclick=()=>homeDialog.close();homeDialog.addEventListener('click',e=>{if(e.target===homeDialog)homeDialog.close()});
let savedTheme=localStorage.getItem('tiem-theme')||'system';function homeTheme(){document.documentElement.dataset.theme=savedTheme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):savedTheme}homeTheme();document.querySelector('#homeTheme').onclick=()=>{savedTheme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('tiem-theme',savedTheme);homeTheme()};matchMedia('(prefers-color-scheme: dark)').addEventListener('change',homeTheme);
let yearly=false;document.querySelectorAll('[data-billing]').forEach(button=>button.onclick=()=>{yearly=button.dataset.billing==='year';document.querySelectorAll('[data-billing]').forEach(b=>{const on=b===button;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});document.querySelectorAll('[data-price]').forEach(p=>p.textContent=(Number(p.dataset.price)*(yearly?.85:1)).toLocaleString('vi-VN'));document.querySelectorAll('.price-card').forEach(card=>{const base=Number(card.querySelector('[data-price]').dataset.price);card.querySelector('.billing-note').textContent=yearly?`Dự kiến ${(base*12*.85).toLocaleString('vi-VN')}đ / năm · Trả theo năm`:'Thanh toán theo tháng'})});
document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>{const card=b.closest('.price-card'),title=b.dataset.plan;showHomeDialog(`<div class="kicker">GÓI DỊCH VỤ DỰ KIẾN</div><h2>${title}</h2><p>${card.querySelector('.price').textContent} · ${yearly?'Quy đổi khi thanh toán theo năm':'Thanh toán theo tháng'}</p><ul>${card.querySelector('ul').innerHTML}</ul><p>Gói này chưa mở bán. Bản trải nghiệm hiện dùng chung dữ liệu mẫu, chưa áp dụng giới hạn gói hay thu phí.</p><a href="app.html?demo=1" class="button">Khám phá bản trải nghiệm ↗</a>`)});
document.querySelector('#installHelp').onclick=()=>window.showInstallHelp();

/* Menu mobile (drawer) */
(() => {
  const nav = document.querySelector('.nav'), toggle = document.querySelector('#menuToggle');
  if (!nav || !toggle) return;
  const set = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  };
  toggle.onclick = () => set(!nav.classList.contains('open'));
  nav.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) set(false); });
})();
