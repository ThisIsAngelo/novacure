import React from "react";

type ButtonProps = {
  title?: string;
  icon: React.ElementType;
  onClick: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  title,
  icon: Icon,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3.5 w-[200px] border border-slate-600 hover:border-sky-500 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-3 rounded-2xl transition ease-linear duration-100 ${className}`}
    >
      <Icon className="w-6 h-6" />
      {title}
    </button>
  );
};

export default Button;
