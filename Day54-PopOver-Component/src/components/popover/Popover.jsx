import React, { useState, useRef, useEffect } from "react";
import "./Popover.css";

const Popover = ({ buttonLabel = "Click Me", children }) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="popover-container" ref={popoverRef}>
      <button className="popover-btn" onClick={() => setOpen(!open)}>
        {buttonLabel}
      </button>

      {open && <div className="popover-content">{children}</div>}
    </div>
  );
};

export default Popover;
