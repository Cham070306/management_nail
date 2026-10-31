(async () => {
  const params = new URLSearchParams(location.search);
  const demo = params.get('demo') === '1';
  const context = params.get('workspace') || '';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const guard = document.createElement('style');
  guard.id = 'appBootstrapGuard';
  guard.textContent = 'body>aside,body>main,body>.sheet,body>dialog{visibility:hidden!important}';
  document.head.append(guard);
  const loading = document.createElement('section');
  loading.id = 'appLoading';
  loading.className = 'app-auth-gate';
  loading.innerHTML = '<div><a href="index.html" class="auth-brand">tiệm.</a><h1>Đang mở không gian của bạn…</h1><p>Kiểm tra tài khoản và dữ liệu.</p></div>';
  document.body.append(loading);
  window.tiemDemo = demo;
  window.tiemContext = context;
  window.workspaceApi = '/api/workspace' + (context ? '?workspace=' + encodeURIComponent(context) : '');
  function login(message, retry) {
    loading.innerHTML = '<div><a href="index.html" class="auth-brand">tiệm.</a><h1>Không gian quản lý của bạn.</h1><p>' + esc(message) + '</p>' +
      (retry ? '<a class="primary" href="#" data-retry>Thử lại</a><a class="secondary" href="app.html?demo=1">Xem bản trải nghiệm</a>'
             : '<a class="primary" target="_top" href="/signin-with-chatgpt?return_to=' + encodeURIComponent(location.pathname + location.search) + '">Đăng nhập bằng ChatGPT</a><a class="secondary" href="app.html?demo=1">Xem bản trải nghiệm</a>') +
      '<p><a href="index.html">Về trang giới thiệu</a></p></div>';
    const again = loading.querySelector('[data-retry]');
    if (again) again.addEventListener('click', (event) => { event.preventDefault(); location.reload(); });
  }
  // Lỗi kỹ thuật chỉ ghi ra console; người dùng chỉ thấy câu dễ hiểu.
  const friendly = (status) =>
    status === 401 ? 'Đăng nhập để truy cập dữ liệu tiệm.'
    : status === 403 ? 'Tài khoản này chưa được cấp quyền vào tiệm. Liên hệ chủ tiệm để được mời.'
    : status === 404 && context ? 'Không tìm thấy không gian làm việc này. Kiểm tra lại đường dẫn.'
    : 'Máy chủ đang tạm thời không phản hồi. Vui lòng thử lại sau ít phút.';
  async function readJson(response) {
    try { return await response.json(); } catch { return null; }
  }
  try {
    let initial = null;
    if (!demo) {
      const response = await fetch(window.workspaceApi, {cache:'no-store'});
      initial = await readJson(response);
      if (!response.ok) {
        if (response.status === 403 && initial && initial.employeeUrl) {
          location.replace(initial.employeeUrl);
          return;
        }
        const needsLogin = response.status === 401 || response.status === 403;
        login((initial && initial.error) || friendly(response.status), !needsLogin);
        return;
      }
      if (!initial || !initial.user) throw Error('Phản hồi không hợp lệ từ ' + window.workspaceApi);
    }
    const userId = demo ? 'demo' : initial.user.id;
    const suffix = ':user:' + userId + (context ? ':workspace:' + context : '');
    window.workspaceStorageKey = 'tiem-workspace-v2' + suffix;
    window.workspaceCloudKey = 'tiem-cloud-enabled' + suffix;
    window.legacyBookingKey = 'tiem-demo-v1' + suffix;
    window.legacyBusinessKey = 'tiem-business' + suffix;
    if (!demo && !context) {
      const oldOwner = localStorage.getItem('tiem-legacy-owner');
      if (!oldOwner) localStorage.setItem('tiem-legacy-owner', userId);
      if ((!oldOwner || oldOwner === userId) && !localStorage.getItem(window.workspaceStorageKey)) {
        const legacy = localStorage.getItem('tiem-workspace-v2');
        if (legacy) localStorage.setItem(window.workspaceStorageKey, legacy);
        const oldCloud = localStorage.getItem('tiem-cloud-enabled');
        if (oldCloud) localStorage.setItem(window.workspaceCloudKey, oldCloud);
      }
    }
    if (!demo && initial.state && !localStorage.getItem(window.workspaceStorageKey)) {
      localStorage.setItem(window.workspaceStorageKey, JSON.stringify(initial.state));
      localStorage.setItem(window.workspaceCloudKey, 'yes');
    }
    window.workspaceHadLocal = !!localStorage.getItem(window.workspaceStorageKey);
    const scripts = ['app.js','enhancements.js','ui.js','operations.js','analytics.js','booking-admin.js','install.js'];
    for (const src of scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(Error('Không tải được ' + src));
        document.body.append(script);
      });
    }
    guard.remove();
    loading.remove();
    if (demo) {
      const note = document.createElement('div');
      note.className = 'demo-mode-note';
      note.innerHTML = 'Bản trải nghiệm · Dữ liệu riêng trên thiết bị <a href="app.html">Đăng nhập quản lý tiệm →</a>';
      document.querySelector('main').prepend(note);
    }
  } catch (error) {
    console.error('[Tiệm] Không khởi động được ứng dụng:', error);
    login(navigator.onLine
      ? 'Chưa mở được ứng dụng. Kết nối có thể đang chập chờn — bạn thử lại hoặc mở bản trải nghiệm nhé.'
      : 'Thiết bị đang mất kết nối Internet. Kết nối lại rồi bấm Thử lại, hoặc mở bản trải nghiệm.', true);
  }
})();
