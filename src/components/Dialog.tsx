import { useState, useEffect } from "react";

interface DialogProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  title?: string;
  showHandle?: boolean;
  textLeft?: boolean;
  textCenter?: boolean;
}

export function Dialog({
  children,
  onClose,
  className = "",
  title,
  showHandle = true,
  textLeft,
  textCenter,
}: DialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  function handleClose() {
    setIsOpen(false);
    setIsClosing(true);
    const closeMs =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--modal-close-dur",
        ),
      ) || 150;
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, closeMs);
  }

  return (
    <div
      className="dialog-backdrop"
      onClick={handleClose}
    >
      <div
        className={`dialog t-modal ${className} ${textLeft ? "text-left" : ""} ${textCenter ? "text-center" : ""} ${isOpen ? "is-open" : ""} ${isClosing ? "is-closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHandle && <div className="dialog__handle" />}
        {title && <h2 className="dialog-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

interface DialogBackdropOnlyProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function DialogBackdrop({ children, onClose }: DialogBackdropOnlyProps) {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
