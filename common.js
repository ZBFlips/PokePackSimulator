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

  function createCollapsibleSection(sectionEl, options = {}) {
    if (!sectionEl || sectionEl.dataset.collapsibleWired === "1") return null;

    const storageKey = options.storageKey || "";
    const defaultExpanded = options.defaultExpanded !== false;
    const titleText =
      options.title ||
      sectionEl.getAttribute("data-collapse-title") ||
      sectionEl.querySelector("h2, h3")?.textContent?.trim() ||
      "Section";
    const buttonClass = options.buttonClass ? ` ${options.buttonClass}` : "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hud-collapse-btn${buttonClass}`;
    button.setAttribute("aria-expanded", "true");

    const icon = document.createElement("span");
    icon.className = "hud-collapse-icon";
    icon.textContent = "-";

    const title = document.createElement("span");
    title.className = "hud-collapse-title";
    title.textContent = titleText;

    const state = document.createElement("span");
    state.className = "hud-collapse-state";
    state.textContent = "Hide";

    button.append(icon, title, state);
    sectionEl.before(button);
    sectionEl.dataset.collapsibleWired = "1";

    const sync = (expanded) => {
      sectionEl.hidden = !expanded;
      sectionEl.classList.toggle("is-collapsed", !expanded);
      button.setAttribute("aria-expanded", String(expanded));
      icon.textContent = expanded ? "-" : "+";
      state.textContent = expanded ? "Hide" : "Show";
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, expanded ? "1" : "0");
        } catch {
          // Ignore storage errors.
        }
      }
    };

    let expanded = defaultExpanded;
    if (storageKey) {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved !== null) {
          expanded = saved !== "0";
        }
      } catch {
        // Ignore storage errors.
      }
    }

    sync(expanded);
    button.addEventListener("click", () => {
      const nextExpanded = button.getAttribute("aria-expanded") !== "true";
      sync(nextExpanded);
    });

    return {
      button,
      sectionEl,
      expand: () => sync(true),
      collapse: () => sync(false),
      toggle: () => sync(button.getAttribute("aria-expanded") !== "true"),
      isExpanded: () => button.getAttribute("aria-expanded") === "true",
    };
  }

  function mergeSetDefinitions(baseSets, importedSets) {
    const merged = new Map();
    for (const setDef of Array.isArray(baseSets) ? baseSets : []) {
      if (setDef && typeof setDef === "object" && setDef.key) {
        merged.set(setDef.key, { ...setDef });
      }
    }
    for (const setDef of Array.isArray(importedSets) ? importedSets : []) {
      if (setDef && typeof setDef === "object" && setDef.key) {
        merged.set(setDef.key, { ...setDef });
      }
    }
    return [...merged.values()];
  }

  function buildSparklineSvg(values, options = {}) {
    const data = Array.isArray(values) ? values.map((value) => Number(value)).filter((value) => Number.isFinite(value)) : [];
    if (!data.length) return "";

    const width = Math.max(120, Number(options.width) || 320);
    const height = Math.max(56, Number(options.height) || 92);
    const padding = Math.max(6, Number(options.padding) || 10);
    const includeZero = options.includeZero !== false;
    const domain = includeZero ? [...data, 0] : [...data];

    let min = Math.min(...domain);
    let max = Math.max(...domain);
    if (min === max) {
      min -= 1;
      max += 1;
    }

    const plotWidth = Math.max(1, width - padding * 2);
    const plotHeight = Math.max(1, height - padding * 2);
    const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;
    const toY = (value) => padding + ((max - value) / (max - min)) * plotHeight;
    const baselineY = toY(0);
    const points = data.map((value, index) => {
      const x = padding + index * stepX;
      const y = toY(value);
      return { x, y };
    });

    const linePath = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${baselineY.toFixed(2)} L ${points[0].x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
    const latest = data[data.length - 1];
    const latestPoint = points[points.length - 1];
    const accent = options.accentColor || (latest >= 0 ? "#8ef2ad" : "#ff7b7b");
    const fill = options.fillColor || (latest >= 0 ? "rgba(142, 242, 173, 0.18)" : "rgba(255, 123, 123, 0.18)");
    const grid = options.gridColor || "rgba(160, 210, 255, 0.12)";
    const baseline = options.baselineColor || "rgba(205, 225, 255, 0.22)";

    return `
      <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <line x1="${padding}" y1="${baselineY.toFixed(2)}" x2="${(width - padding).toFixed(2)}" y2="${baselineY.toFixed(2)}" stroke="${baseline}" stroke-width="1" />
        <line x1="${padding}" y1="${padding}" x2="${(width - padding).toFixed(2)}" y2="${padding}" stroke="${grid}" stroke-width="1" />
        <line x1="${padding}" y1="${(height - padding).toFixed(2)}" x2="${(width - padding).toFixed(2)}" y2="${(height - padding).toFixed(2)}" stroke="${grid}" stroke-width="1" />
        <path d="${areaPath}" fill="${fill}" />
        <path d="${linePath}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="${latestPoint.x.toFixed(2)}" cy="${latestPoint.y.toFixed(2)}" r="4" fill="${accent}" />
      </svg>
    `;
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
    createCollapsibleSection,
    mergeSetDefinitions,
    buildSparklineSvg,
  });
})();
