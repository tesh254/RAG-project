import React, { LegacyRef, ReactNode, forwardRef } from "react";

interface IButtonProps {
  kind: "primary" | "secondary";
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  className: string;
}

const Button = forwardRef<LegacyRef<HTMLButtonElement>, IButtonProps>(
  ({ kind, onClick, className, children, icon }, ref) => {
    return (
      <button
        className={`button-${kind} ${className}`}
        ref={ref as LegacyRef<HTMLButtonElement>}
        onClick={onClick}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
