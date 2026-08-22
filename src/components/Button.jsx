import "./Button.css";

/**
 * Primary interactive control for the whole app.
 * variant: "black" | "orange" | "outline" | "white" | "ghost"
 * loading: swaps label for the boarding-progress bar
 */
export default function Button({
  children,
  variant = "black",
  loading = false,
  className = "",
  as = "button",
  ...props
}) {
  const Comp = as;

  return (
    <Comp
      className={`gt-btn gt-btn--${variant} ${loading ? "is-loading" : ""} ${className}`}
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
