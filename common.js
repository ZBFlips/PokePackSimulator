(() => {
  const SNAPSHOT_STALE_DAYS = 14;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sanitizeHttpUrl(urlValue) {
    const value = String(urlValue || "").trim();
    if (!value) return "#";
    try {
      const parsed = new URL(value, window.location.origin);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.href;
      }
    } catch {
      // Ignore parse errors and fall back to an inert URL.
    }
    return "#";
  }

  function formatDateLabel(isoDate) {
    if (!isoDate) return "Unknown";
    const parsed = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function getSnapshotAgeDays(isoDate) {
    if (!isoDate) return Number.POSITIVE_INFINITY;
    const then = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(then.getTime())) return Number.POSITIVE_INFINITY;
    const now = new Date();
    const utcThen = Date.UTC(then.getUTCFullYear(), then.getUTCMonth(), then.getUTCDate());
    const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.max(0, Math.floor((utcNow - utcThen) / 86400000));
  }

  function isSnapshotStale(isoDate, thresholdDays = SNAPSHOT_STALE_DAYS) {
    return getSnapshotAgeDays(isoDate) > thresholdDays;
  }

  function getSnapshotFreshnessLabel(isoDate, thresholdDays = SNAPSHOT_STALE_DAYS) {
    const age = getSnapshotAgeDays(isoDate);
    if (!Number.isFinite(age)) return "Snapshot date unavailable";
    if (age <= thresholdDays) return `Snapshot fresh (${age}d old)`;
    return `Snapshot stale (${age}d old)`;
  }

  function registerServiceWorker(swPath = "./sw.js") {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(swPath).catch(() => {
      // Service worker support is optional.
    });
  }

  window.PackSimCommon = Object.freeze({
    SNAPSHOT_STALE_DAYS,
    escapeHtml,
    sanitizeHttpUrl,
    formatDateLabel,
    getSnapshotAgeDays,
    isSnapshotStale,
    getSnapshotFreshnessLabel,
    registerServiceWorker,
  });
})();

