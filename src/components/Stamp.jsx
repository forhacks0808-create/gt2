import { createContext, useCallback, useContext, useState } from "react";
import "./Stamp.css";

const StampContext = createContext(null);

export function StampProvider({ children }) {
  const [stamp, setStamp] = useState(null);

  const fire = useCallback((text) => {
    setStamp(text);
    window.clearTimeout(fire._t);
    fire._t = window.setTimeout(() => setStamp(null), 1600);
  }, []);

  return (
    <StampContext.Provider value={fire}>
      {children}
      {stamp && (
        <div className="gt-stamp-layer" aria-live="polite">
          <div className="gt-stamp">{stamp}</div>
        </div>
      )}
    </StampContext.Provider>
  );
}

export function useStamp() {
  const ctx = useContext(StampContext);
  if (!ctx) throw new Error("useStamp must be used inside StampProvider");
  return ctx;
}
