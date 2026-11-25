import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useClinicStore } from "../store/clinicStore";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { TopBar } from "../components/TopBar";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { ClinicCard } from "../components/ClinicCard";
import { useRef, useEffect, useState } from "react";

const serviceFilterOptions = [
  "All",
  "General outpatient",
  "Immunisation",
  "Maternal and child health",
  "Follow-up visit",
  "Dental",
  "Pharmacy",
];

export function ClinicsScreen() {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    serviceFilter,
    setServiceFilter,
    openOnly,
    setOpenOnly,
    shortest,
    setShortest,
    remoteOnly,
    setRemoteOnly,
    isLoading,
    error,
    clearFilters,
    getFiltered,
  } = useClinicStore();

  const results = getFiltered();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const wrap = searchRef.current;
    if (!wrap) return;

    const input = wrap.querySelector<HTMLInputElement>("input");
    const mirror = wrap.querySelector<HTMLDivElement>(".t-clear-mirror");
    const phold = wrap.querySelector<HTMLDivElement>(".t-clear-placeholder");
    const glow = wrap.querySelector<HTMLDivElement>(".t-clear-glow");
    const btn = wrap.querySelector<HTMLButtonElement>(".t-clear-btn");
    if (!input || !mirror || !phold || !glow || !btn) return;

    const root = document.documentElement;
    const num = (name: string, fb: number) => {
      const v = parseFloat(getComputedStyle(root).getPropertyValue(name));
      return Number.isFinite(v) ? v : fb;
    };

    function bezier(str: string) {
      const m = String(str).match(/cubic-bezier\(([-\d.]+),([-\d.]+),([-\d.]+),([-\d.]+)\)/);
      if (!m) return (t: number) => t;
      const [x1, y1, x2, y2] = m.slice(1).map(parseFloat);
      const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
      const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      return (t: number) => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        let s = t;
        for (let i = 0; i < 8; i++) {
          const dx = ((ax * s + bx) * s + cx) * s - t;
          const d = (3 * ax * s + 2 * bx) * s + cx;
          if (Math.abs(dx) < 1e-6 || d === 0) break;
          s -= dx / d;
        }
        return ((ay * s + by) * s + cy) * s;
      };
    }

    const canvas = document.createElement("canvas").getContext("2d");
    let clearing = false;

    const sync = () => {
      const has = input.value.length > 0;
      wrap.classList.toggle("has-value", has);
      setQuery(input.value);
      if (has) mirror.textContent = input.value.replace(/ /g, "\u00a0");
    };

    function buildGlow(text: string) {
      canvas.font = getComputedStyle(input).font;
      const isDark = root.getAttribute("data-theme") === "dark";
      const rgb = isDark ? "255,255,255" : "0,0,0";
      const w = wrap.clientWidth || 280;
      const padLeft = parseFloat(getComputedStyle(input).paddingLeft) || 12;
      const spread = num("--glow-spread", 1.5);
      const layers: string[] = [];
      let x = 0;
      text.split(/(\s+)/).forEach((seg) => {
        const segW = canvas.measureText(seg).width;
        if (seg.trim()) {
          const cx = padLeft + x + segW / 2;
          const hw = Math.max(segW * 0.45, 8) * spread;
          [[0, 0.8, 7, 0.22], [hw * 0.45, 0.55, 8, 0.18],
           [-hw * 0.4, 0.65, 6, 0.16], [hw * 0.15, 0.9, 5, 0.14]]
            .forEach(([dx, rwm, rh, a]) => {
              const lx = (((cx + dx) / w) * 100).toFixed(2);
              layers.push(
                `radial-gradient(ellipse ${Math.max(hw * rwm, 2).toFixed(1)}px ${rh}px at ${lx}% 100%, rgba(${rgb},${a}), transparent)`
              );
            });
        }
        x += segW;
      });
      return layers.join(", ");
    }

    function clearWithAnimation() {
      if (clearing || !input.value) return;
      clearing = true;
      const keepFocus = document.activeElement === input;
      mirror.textContent = input.value.replace(/ /g, "\u00a0");

      const total = num("--clear-dur", 1000);
      const outDur = num("--clear-out-dur", 400);
      const inDur = num("--clear-in-dur", 400);
      const outFly = num("--clear-out-fly", 12);
      const inFly = num("--clear-in-fly", 12);
      const blur = num("--clear-blur", 2);
      const delay = num("--glow-delay", 50);
      const peakAt = num("--glow-peak-at", 0.15);
      const gOp = num("--glow-opacity", 0.42);
      const easeOut = bezier(getComputedStyle(root).getPropertyValue("--clear-out-ease"));
      const easeIn = bezier(getComputedStyle(root).getPropertyValue("--clear-in-ease"));

      input.value = "";
      wrap.classList.remove("has-value");
      wrap.classList.add("is-clearing");
      setIsClearing(true);
      setQuery("");
      glow.style.background = buildGlow(mirror.textContent);
      glow.style.opacity = "0";
      phold.style.transform = `translateY(-${inFly}px)`;
      phold.style.opacity = "0.9";
      phold.style.filter = `blur(${blur}px)`;

      const t0 = performance.now();
      (function tick(now: number) {
        const el = now - t0;
        const eo = easeOut(Math.min(1, el / outDur));
        mirror.style.transform = `translateY(${(eo * outFly).toFixed(1)}px)`;
        mirror.style.opacity = (1 - eo).toFixed(3);
        mirror.style.filter = `blur(${(eo * blur).toFixed(1)}px)`;

        const ei = easeIn(Math.min(1, el / inDur));
        phold.style.transform = `translateY(${( -inFly + ei * inFly).toFixed(1)}px)`;
        phold.style.opacity = (0.9 + ei * 0.1).toFixed(3);
        phold.style.filter = `blur(${(blur - ei * blur).toFixed(1)}px)`;

        let g = 0;
        if (el > delay) {
          const gp = Math.min(1, (el - delay) / Math.max(1, total - delay));
          g = gp < peakAt ? gp / peakAt : 1 - (gp - peakAt) / (1 - peakAt);
        }
        glow.style.opacity = (g * gOp).toFixed(3);

        if (el < total) {
          requestAnimationFrame(tick);
        } else {
          wrap.classList.remove("is-clearing");
          setIsClearing(false);
          [mirror, phold].forEach((el) => (el.style.cssText = ""));
          mirror.textContent = "";
          glow.style.opacity = "0";
          glow.style.background = "";
          clearing = false;
          if (keepFocus) requestAnimationFrame(() => input.focus({ preventScroll: true }));
        }
      })(performance.now());
    }

    input.addEventListener("input", sync);
    btn.addEventListener("pointerdown", (e) => { if (document.activeElement === input) e.preventDefault(); });
    btn.addEventListener("mousedown", (e) => { if (document.activeElement === input) e.preventDefault(); });
    btn.addEventListener("click", clearWithAnimation);
    sync();

    return () => {
      input.removeEventListener("input", sync);
      btn.removeEventListener("pointerdown", clearWithAnimation);
      btn.removeEventListener("mousedown", clearWithAnimation);
      btn.removeEventListener("click", clearWithAnimation);
    };
  }, []);

  const hasFilters = openOnly || shortest || remoteOnly || serviceFilter !== "All";

  return (
    <>
      <TopBar
        title="Public Clinics"
      />
      <main className="content content--with-nav">
        {/* Search */}
        <div
          className={`t-clear ${query ? "has-value" : ""} ${isClearing ? "is-clearing" : ""}`}
          ref={searchRef}
        >
          <HugeiconsIcon icon={Search01Icon} size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinic name, road, service..."
          />
          <div className="t-clear-mirror" aria-hidden="true">
            {query.replace(/ /g, "\u00a0")}
          </div>
          <div className="t-clear-placeholder" aria-hidden="true">
            Search clinic name, road, service…
          </div>
          <div className="t-clear-glow" aria-hidden="true"></div>
          {query && (
            <button
              className="t-clear-btn"
              aria-label="Clear search"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="stack">
            <SkeletonLoader className="h-20 w-3/4" />
            <SkeletonLoader className="h-20 w-3/4" />
            <SkeletonLoader className="h-20 w-3/4" />
          </div>
        ) : (
          <>
            {/* Filter chips */}
            <div className="stack">
              <div className="chips chips--wrap">
                <button
                  className={`chip ${openOnly ? "chip--active" : ""}`}
                  onClick={() => setOpenOnly(!openOnly)}
                  aria-pressed={openOnly}
                >
                  {openOnly && <HugeiconsIcon icon={Tick02Icon} size={14} />}
                  <span>Open now</span>
                </button>
                <button
                  className={`chip ${shortest ? "chip--active" : ""}`}
                  onClick={() => setShortest(!shortest)}
                  aria-pressed={shortest}
                >
                  {shortest && <HugeiconsIcon icon={Tick02Icon} size={14} />}
                  <span>Shortest wait</span>
                </button>
                <button
                  className={`chip ${remoteOnly ? "chip--active" : ""}`}
                  onClick={() => setRemoteOnly(!remoteOnly)}
                  aria-pressed={remoteOnly}
                >
                  {remoteOnly && <HugeiconsIcon icon={Tick02Icon} size={14} />}
                  <span>Remote queue</span>
                </button>
              </div>
              <div className="chips chips--wrap">
                {serviceFilterOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`chip ${serviceFilter === opt ? "chip--active" : ""}`}
                    onClick={() => setServiceFilter(opt)}
                    aria-pressed={serviceFilter === opt}
                  >
                    {serviceFilter === opt && (
                      <HugeiconsIcon icon={Tick02Icon} size={14} />
                    )}
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results header */}
            <div className="section-heading">
              <h2>Clinics found ({results.length})</h2>
              {hasFilters && (
                <Button variant="quiet" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="notice">
                <span>Unable to load clinics. Showing cached data.</span>
              </div>
            )}

            {/* Clinic results */}
            {results.length > 0 ? (
              <div className="stack clinic-results">
                {results.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    onJoinQueue={() => {
                      localStorage.setItem("selectedClinicId", clinic.id);
                      navigate(`/clinic/${clinic.id}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <HugeiconsIcon icon={Search01Icon} size={48} />
                <h3>No matching clinics</h3>
                <p>Try a different search or clear your filters.</p>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear search and filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
