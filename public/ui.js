'use strict';
/* ==========================================================================
   Tiệm — Lớp giao diện (chỉ trình bày, không đổi dữ liệu / nghiệp vụ)
   Chạy sau app.js và enhancements.js; bọc ngoài render() để:
   - Tiêu đề trang = tên màn hình, khẩu hiệu thành dòng phụ
   - Nút chọn cửa hàng có icon
   - Nhãn cho ô bảng (để chuyển thành thẻ trên mobile) + chip trạng thái
   - Vạch giờ hiện tại trên lịch
   - Bottom navigation + sheet "Thêm" trên mobile
   ========================================================================== */
(() => {
  const VIEW_NAMES = {
    overview: 'Tổng quan',
    calendar: 'Lịch hẹn',
    customers: 'Khách hàng',
    payments: 'Thanh toán',
    staff: 'Nhân viên & thu nhập',
    services: 'Dịch vụ',
    reports: 'Báo cáo',
    branches:'Chi nhánh',
    team:'Quyền truy cập',
  };
  const SECONDARY_VIEWS = ['payments', 'staff', 'services', 'reports', 'branches', 'team'];
  const icon = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---------- Trạng thái → màu chip ---------- */
  const STATUS_TONE = [
    [/^Hoàn thành|^Đã thu đủ/, 'success'],
    [/^Đã xác nhận/, 'info'],
    [/^Đang làm/, 'primary'],
    [/^Chờ|^Thu một phần/, 'warning'],
    [/^Đã hủy|^Hoàn tiền/, 'danger'],
    [/^Không đến/, 'neutral'],
  ];
  const toneOf = (text) => (STATUS_TONE.find(([re]) => re.test(text)) || [])[1];

  function enhanceHeading() {
    const title = document.querySelector('#title'), subtitle = document.querySelector('#subtitle');
    if (!title || !subtitle || typeof view === 'undefined') return;
    const slogan = title.textContent.trim(), name = VIEW_NAMES[view];
    if (!name || slogan === name) return;
    // Các màn hình cũ (app.js) có dòng phụ riêng → ghép với khẩu hiệu; màn hình mới chỉ có dòng phụ chung → dùng khẩu hiệu.
    const specific = ['calendar', 'overview', 'payments'].includes(view);
    subtitle.textContent = specific ? slogan + ' ' + subtitle.textContent.trim() : slogan;
    title.textContent = name;
    document.title = name + ' · Tiệm';
  }

  function enhanceShop() {
    const shop = document.querySelector('#settings');
    if (!shop || typeof business === 'undefined') return;
    shop.innerHTML = `<span class="shop-icon">${icon('store')}</span><span class="shop-name">${esc(business.name)}</span>${icon('chevron')}`;
    shop.setAttribute('aria-label', 'Thiết lập cửa hàng ' + business.name);
  }

  function enhanceTables(root = document) {
    root.querySelectorAll('.tablewrap table').forEach((table) => {
      const heads = [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim());
      table.querySelectorAll('tbody tr').forEach((tr) => {
        [...tr.children].forEach((td, i) => {
          if (td.hasAttribute('colspan')) return;
          const label = heads[i] || '';
          td.dataset.label = label.charAt(0) + label.slice(1).toLowerCase();
          if (!label) td.dataset.label = '';
          if (/TRẠNG THÁI/i.test(label) && !td.querySelector('.chip')) {
            const text = td.textContent.trim(), tone = toneOf(text);
            if (tone) td.innerHTML = `<span class="chip chip-${tone}">${esc(text)}</span>`;
          }
        });
      });
    });
  }

  function enhanceCalendar() {
    if (typeof view === 'undefined' || view !== 'calendar' || typeof day === 'undefined' || typeof today === 'undefined' || day !== today) return;
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const top = now.getHours() * 60 + now.getMinutes() - 540; // lịch bắt đầu 09:00, 1 phút = 1px
    if (top < 0 || top > 600) return;
    document.querySelectorAll('.schedule .column').forEach((col, i) => {
      const line = document.createElement('div');
      line.className = 'nowline' + (i === 0 ? ' first' : '');
      line.style.top = top + 'px';
      line.setAttribute('aria-hidden', 'true');
      col.append(line);
    });
  }

  function syncMobileNav() {
    const more = document.querySelector('#navMore');
    if (more && typeof view !== 'undefined') more.classList.toggle('active', SECONDARY_VIEWS.includes(view));
  }

  function enhanceWorkspace() {
    const ws = document.querySelector('#workspace');
    if (!ws || ws.querySelector('.icon')) return;
    const text = ws.textContent.replace(/^☁\s*/, '').trim();
    ws.innerHTML = `${icon('cloud')}<span>${esc(text)}</span>`;
    ws.classList.add('shop');
    ws.classList.toggle('warn', /Cần kiểm tra/.test(text));
  }

  function enhance() {
    try {
      enhanceHeading();
      enhanceShop();
      enhanceWorkspace();
      enhanceTables();
      enhanceCalendar();
      syncMobileNav();
    } catch (e) {
      console.warn('ui.js:', e);
    }
  }

  if (typeof setStorageStatus === 'function') {
    const baseStatus = setStorageStatus;
    setStorageStatus = function () {
      baseStatus.apply(this, arguments);
      enhanceWorkspace();
    };
  }

  /* ---------- Bọc render() ---------- */
  if (typeof render === 'function') {
    const baseRender = render;
    render = function () {
      baseRender.apply(this, arguments);
      enhance();
    };
  }

  /* Bảng trong dialog (lịch sử dịch vụ…) không cần, nhưng chip trạng thái trong chi tiết thì có */
  if (typeof modal === 'function') {
    const baseModal = modal;
    modal = function () {
      baseModal.apply(this, arguments);
      document.querySelectorAll('#fields .detailrow').forEach((row) => {
        const label = row.querySelector('span'), value = row.querySelector('strong');
        if (label && value && label.textContent.trim() === 'Trạng thái' && !value.querySelector('.chip')) {
          const tone = toneOf(value.textContent.trim());
          if (tone) value.innerHTML = `<span class="chip chip-${tone}">${esc(value.textContent.trim())}</span>`;
        }
      });
    };
  }

  /* ---------- Mobile: nút + và sheet "Thêm" ---------- */
  const sheet = document.querySelector('#moreSheet'), backdrop = document.querySelector('#moreBackdrop');
  let lastFocus = null;
  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.hidden = false; backdrop.hidden = false;
    document.querySelector('#navMore')?.setAttribute('aria-expanded', 'true');
    sheet.querySelector('button')?.focus();
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true; backdrop.hidden = true;
    document.querySelector('#navMore')?.setAttribute('aria-expanded', 'false');
    lastFocus?.focus?.();
  }
  document.querySelector('#navMore')?.addEventListener('click', openSheet);
  document.querySelector('#moreClose')?.addEventListener('click', closeSheet);
  backdrop?.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  sheet?.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', closeSheet));
  sheet?.querySelectorAll('[data-sheet-action]').forEach((b) => b.addEventListener('click', () => {
    const action = b.dataset.sheetAction;
    if (action === 'theme') {
      if (typeof applyTheme === 'function') applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
      return;
    }
    closeSheet();
    if (action === 'settings') document.querySelector('#settings')?.click();
    if (action === 'account') document.querySelector('#workspace')?.click();
  }));
  document.querySelector('#navNew')?.addEventListener('click', () => document.querySelector('#new')?.click());

  /* Màu thanh trạng thái trình duyệt theo theme đang dùng */
  const syncThemeColor = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#0a0a0a' : '#fafafa'));
  };
  new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  syncThemeColor();

  enhance();
})();
