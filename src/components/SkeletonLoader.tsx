import { useEffect, useState } from "react";

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  revealAfter?: number;
}

export function SkeletonLoader({
  className = "",
  width = "100%",
  height = "16px",
  borderRadius = "4px",
  revealAfter = 1500,
}: SkeletonLoaderProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), revealAfter);
    return () => clearTimeout(timer);
  }, [revealAfter]);

  return (
    <div
      className={`t-skel ${revealed ? "is-revealed" : ""} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    >
      <div className="t-skel-skeleton is-pulsing">
        <div
          className="skeleton-loader"
          style={{ width, height, borderRadius }}
        />
      </div>
      <div className="t-skel-content" style={{ opacity: revealed ? 1 : 0 }} />
    </div>
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  revealAfter?: number;
}

export function SkeletonText({ lines = 3, className = "", revealAfter = 1500 }: SkeletonTextProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), revealAfter);
    return () => clearTimeout(timer);
  }, [revealAfter]);

  return (
    <div className={`t-skel ${revealed ? "is-revealed" : ""} ${className}`} aria-hidden="true">
      <div className="t-skel-skeleton is-pulsing">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton-line"
            style={{
              width: i === lines - 1 ? "60%" : "100%",
              height: "14px",
              marginBottom: "8px",
              borderRadius: "4px",
            }}
          />
        ))}
      </div>
      <div className="t-skel-content" style={{ opacity: revealed ? 1 : 0 }} />
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  revealAfter?: number;
}

export function SkeletonCard({ className = "", revealAfter = 1500 }: SkeletonCardProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), revealAfter);
    return () => clearTimeout(timer);
  }, [revealAfter]);

  return (
    <div
      className={`t-skel ${revealed ? "is-revealed" : ""} ${className}`}
      style={{ height: "200px", borderRadius: "22px" }}
      aria-hidden="true"
    >
      <div className="t-skel-skeleton is-pulsing">
        <div className="skeleton-card" style={{ height: "100%", borderRadius: "22px" }} />
      </div>
      <div className="t-skel-content" style={{ opacity: revealed ? 1 : 0 }} />
    </div>
  );
}
