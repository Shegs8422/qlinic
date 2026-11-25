import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, Clock01Icon, Ticket01Icon, Directions01Icon } from "@hugeicons/core-free-icons";
import type { Clinic } from "../types";
import { Badge } from "./Badge";
import { useRef, useEffect, useState } from "react";

interface ClinicCardProps {
  clinic: Clinic;
  onJoinQueue?: () => void;
}

export function ClinicCard({ clinic, onJoinQueue }: ClinicCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    const MAX = 14;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");

    function reset() {
      setIsHover(false);
      card!.classList.remove("is-tilting");
      card!.style.setProperty("--tilt-rx", "0deg");
      card!.style.setProperty("--tilt-ry", "0deg");
    }

    function track(e: PointerEvent) {
      if (reduce.matches) return;
      const r = tilt!.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      setIsHover(true);
      card!.classList.add("is-tilting");
      card!.style.setProperty("--tilt-ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
      card!.style.setProperty("--tilt-rx", ((0.5 - py) * MAX).toFixed(2) + "deg");
      card!.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
      card!.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
    }

    tilt.addEventListener("pointermove", track);
    tilt.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") reset();
    });
    tilt.addEventListener("pointerup", reset);
    tilt.addEventListener("pointercancel", reset);

    return () => {
      tilt.removeEventListener("pointermove", track);
      tilt.removeEventListener("pointerleave", reset);
      tilt.removeEventListener("pointerup", reset);
      tilt.removeEventListener("pointercancel", reset);
    };
  }, []);

  return (
    <div className="t-tilt" ref={tiltRef}>
      <article className="card t-tilt-card" ref={cardRef}>
        <div className="row row--between row--start">
          <div className="flex-1 pr-2">
            <div className="card__title">{clinic.name}</div>
            <div className="text-neutral-500 text-xs row row--compact mt-1">
              <HugeiconsIcon icon={Location01Icon} size={14} />
              <span>{clinic.area}</span>
            </div>
          </div>
          <Badge tone={clinic.open ? "success" : "neutral"}>
            {clinic.open ? "Open now" : "Closed"}
          </Badge>
        </div>

        <div className="p-3.5 rounded-2xl bg-neutral-100/60 border border-neutral-200/60 flex items-center gap-3">
          <HugeiconsIcon icon={Clock01Icon} size={20} />
          <div>
            <span className="eyebrow block">Estimated wait</span>
            <strong className="text-base font-extrabold text-black">
              {clinic.wait || "Unavailable"}
            </strong>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {clinic.services.map((svc) => (
            <button
              key={svc}
              className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold border border-neutral-200 transition-colors"
              onClick={() => {
                // Navigation handled by parent via onJoinQueue or link
              }}
            >
              {svc}
            </button>
          ))}
        </div>

        <div className="row row--between pt-2 border-t border-neutral-100">
          <button
            className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1.5"
            onClick={() => {
              // Directions handled by parent
            }}
          >
            <HugeiconsIcon icon={Directions01Icon} size={14} />
            <span>Transit</span>
          </button>
          <div className="flex gap-2">
            <Link to={`/clinic/${clinic.id}`} className="button button--quiet">
              Details
            </Link>
            {clinic.open && clinic.rule === "remote" && (
              <button
                className="px-4 py-2 bg-black text-white rounded-full text-xs font-extrabold hover:bg-neutral-900 transition-all flex items-center gap-1.5 active:scale-95"
                onClick={onJoinQueue}
              >
                <HugeiconsIcon icon={Ticket01Icon} size={13} />
                <span>Join queue</span>
              </button>
            )}
          </div>
        </div>

        <div className="t-tilt-glare" />
      </article>
    </div>
  );
}
