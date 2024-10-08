import React from "react";

type IconButtonProps = {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  className?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  title,
  icon: Icon,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`md:hidden group flex items-center justify-start w-[55px] h-[55px] cursor-pointer relative overflow-hidden duration-[0.3s] bg-slate-800 border border-slate-600 rounded-2xl border-[none] hover:w-[125px] hover:duration-[0.3s] hover:rounded-[40px] active:translate-x-0.5 active:translate-y-0.5 ${className}`}
    >
      <div className="w-full duration-[0.3s] flex items-center justify-center group-hover:w-[30%] group-hover:duration-[0.3s] group-hover:pl-5">
        <Icon className="w-6 h-6" />
      </div>

      <div className="absolute w-[0%] opacity-0 text-[white] text-sm font-semibold duration-[0.3s] right-[0%] group-hover:opacity-100 group-hover:w-[70%] group-hover:duration-[0.3s] group-hover:pr-2.5">
        {title}
      </div>
    </button>
  );
};

export default IconButton;
