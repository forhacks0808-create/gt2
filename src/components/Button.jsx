import { useRef } from "react";
import "./Button.css";

/**
 * Primary interactive control for the whole app.
 * variant: "black" | "orange" | "outline" | "ghost"
 * loading: swaps label for the boarding-progress bar (never a spinner)
 */
export default function Button({
  children,
  variant = "black",
  loading = false,
  magnetic = true,
  className = "",
  as = "button",
  ...props
}) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0)";
  }

  const Comp = as;

  return (
    <Comp
      ref={ref}
      className={`gt-btn gt-btn--${variant} ${loading ? "is-loading" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="gt-btn__progress" aria-live="polite" aria-label="Loading">
          <span className="gt-btn__progress-bar" />
        </span>
      ) : (
        <span className="gt-btn__label">{children}</span>
      )}
    </Comp>
  );
}
