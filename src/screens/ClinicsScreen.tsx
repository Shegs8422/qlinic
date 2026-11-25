import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import { useClinicStore } from "../store/clinicStore";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
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

    const inputEl = wrap.querySelector<HTMLInputElement>("input");
    const btn = wrap.querySelector<HTMLButtonElement>(".t-clear-btn");
    if (!inputEl || !btn) return;

    const input = inputEl;

    function handleClearClick() {
      setIsClearing(true);
      input.value = "";
      setQuery("");
      const timer = setTimeout(() => setIsClearing(false), 1000);
      return () => clearTimeout(timer);
    }

    btn.addEventListener("click", handleClearClick as EventListener);
    return () => btn.removeEventListener("click", handleClearClick as EventListener);
  }, []);

  return (
    <>
      <TopBar
        title="Public Clinics"
      />
      <main className="content content--with-nav">
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
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="stack">
            <SkeletonLoader className="h-20 w-3/4" />
            <SkeletonLoader className="h-20 w-3/4" />
            <SkeletonLoader className="h-20 w-3/4" />
          </div>
        ) : (
          <>
            <div className="stack">
              <div className="chips">
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
              <div className="chips">
                {serviceFilterOptions.map((opt) => (
                  <button
                    key={opt}
                    className={`chip ${
                      serviceFilter === opt ? "chip--active" : ""
                    }`}
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

            <div className="section-heading">
              <h2>Clinics found ({results.length})</h2>
              {(openOnly || shortest || remoteOnly || serviceFilter !== "All") && (
                <button
                  className="text-xs font-bold underline"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>

            {error && (
              <div className="notice">
                <span>Unable to load clinics. Showing cached data.</span>
              </div>
            )}

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
              <article className="empty-card">
                <HugeiconsIcon icon={Search01Icon} size={28} />
                <div>
                  <h3>No matching clinics</h3>
                  <p>Try a different search or clear your filters.</p>
                </div>
                <Button variant="secondary" onClick={clearFilters}>
                  Clear search and filters
                </Button>
              </article>
            )}
          </>
        )}
      </main>
    </>
  );
}
