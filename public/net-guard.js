/* ==========================================================================
   Tiệm — net-guard.js
   Nạp TRƯỚC mọi script khác. Biến hai lỗi kỹ thuật thường gặp thành câu dễ hiểu:
     1. Máy chủ trả về HTML/trống thay vì JSON  → "Unexpected token '<' …"
     2. Mất mạng / không tới được máy chủ        → "Failed to fetch" / "Load failed"
   Các script khác (app.js, operations.js, booking.js…) vẫn gọi fetch()/json()
   như cũ; chi tiết kỹ thuật chỉ được ghi ra console để debug.
   ========================================================================== */
(() => {
  if (window.__tiemNetGuard) return;
  window.__tiemNetGuard = true;

  const SERVER_DOWN = 'Máy chủ đang tạm thời không phản hồi. Vui lòng thử lại sau ít phút.';
  const BAD_DATA = 'Dữ liệu trả về không hợp lệ. Vui lòng tải lại trang và thử lại.';
  const OFFLINE = 'Thiết bị đang mất kết nối Internet. Kết nối lại rồi thử lại nhé.';
  const NO_SERVER = 'Không kết nối được máy chủ. Vui lòng kiểm tra mạng và thử lại.';

  const originalJson = Response.prototype.json;
  Response.prototype.json = async function () {
    try {
      return await originalJson.call(this);
    } catch (error) {
      console.error('[Tiệm] Phản hồi không phải JSON:', this.status, this.url, error);
      throw new Error(this.status >= 500 || this.status === 404 || this.status === 0 ? SERVER_DOWN : BAD_DATA);
    }
  };

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    try {
      return await originalFetch(...args);
    } catch (error) {
      if (error && error.name === 'AbortError') throw error; // huỷ chủ động, giữ nguyên
      console.error('[Tiệm] Không gọi được máy chủ:', args[0], error);
      throw new Error(navigator.onLine ? NO_SERVER : OFFLINE);
    }
  };
})();
