import React from "react";
import { useRef, useEffect, useState } from "react";

interface TooltipProps {
  children: React.ReactElement;
  label: string;
}

export function Tooltip({ children, label }: TooltipProps) {
  const [show, setShow] = useState(false);
  const [x, setX] = useState("0px");
  const [width, setWidth] = useState("0px");
  const groupRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const group = groupRef.current!;
    const tip = tipRef.current!;

    const ms = (name: string, fb: number) => {
      const v = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(name)
      );
      return Number.isFinite(v) ? v : fb;
    };

    function place() {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const cs = getComputedStyle(tip);
      const w = Math.ceil(
        (textRef.current?.scrollWidth || 0) +
          parseFloat(cs.paddingLeft) +
          parseFloat(cs.paddingRight)
      );
      const g = group.getBoundingClientRect();
      const r = trigger.getBoundingClientRect();
      const x = r.left - g.left + r.width / 2 - w / 2;
      if (!show) {
        tip.style.transition = "none";
        tip.style.width = `${w}px`;
        tip.style.setProperty("--tt-x", `${x}px`);
        void tip.offsetWidth;
        tip.style.transition = "";
      } else {
        tip.style.width = `${w}px`;
        tip.style.setProperty("--tt-x", `${x}px`);
      }
      setWidth(`${w}px`);
      setX(`${x}px`);
    }

    const onEnter = () => {
      setShow(true);
      place();
    };
    const onLeave = () => setShow(false);

    const trigger = triggerRef.current;
    if (!trigger) return undefined;
    trigger.addEventListener("pointerenter", onEnter);
    trigger.addEventListener("focus", onEnter);
    trigger.addEventListener("blur", onLeave);
    group.addEventListener("pointerleave", onLeave);

    return () => {
      trigger.removeEventListener("pointerenter", onEnter);
      trigger.removeEventListener("focus", onEnter);
      trigger.removeEventListener("blur", onLeave);
      group.removeEventListener("pointerleave", onLeave);
    };
  }, [show]);

  return (
    <div className="t-tt-group" ref={groupRef}>
      {React.cloneElement(children as React.ReactElement, {
        ref: (el: HTMLElement | null) => { triggerRef.current = el; },
        className: "t-tt-trigger",
        "data-tooltip": label,
        "aria-describedby": "tt-1",
      } as any)}
      <div
        className="t-tt"
        id="tt-1"
        role="tooltip"
        aria-hidden={show ? "false" : "true"}
        data-show={show ? "true" : "false"}
        style={{ width, "--tt-x": x } as React.CSSProperties}
      >
        <span className="t-tt-text" ref={textRef}>
          {label}
        </span>
      </div>
    </div>
  );
}
