import React from "react";
import "./Button.css";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  icon,
  disabled = false,
  loading = false,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-loader"></span>
      ) : (
        <>
          {icon && (
            <span className="btn-icon">
              {icon}
            </span>
          )}

          {children}
        </>
      )}
    </button>
  );
};

export default Button;