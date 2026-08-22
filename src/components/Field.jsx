import { useId, useState } from "react";
import "./Field.css";

export default function Field({
  label,
  error,
  type = "text",
  rightSlot,
  className = "",
  ...props
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div className={`gt-field ${className}`}>
      {label && (
        <label htmlFor={id} className={`gt-field__label ${focused ? "is-focused" : ""}`}>
          {label}
        </label>
      )}
      <div className={`gt-field__control ${focused ? "is-focused" : ""} ${error ? "has-error" : ""}`}>
        <input
          id={id}
          type={type}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightSlot}
      </div>
      {error && <p className="gt-field__error">{error}</p>}
    </div>
  );
}
