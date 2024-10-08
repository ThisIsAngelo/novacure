import { IconChevronRight } from "@tabler/icons-react";
import React from "react";

type HomeCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  onClick: () => void;
};

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  value,
  icon: Icon,
  onClick,
}) => {
  return (
    <div className="flex flex-col w-full h-[150px] border border-slate-700 rounded-xl overflow-hidden">
      <div className="w-full flex items-center h-[70%] p-4">
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="text-sm xl:text-base font-light">{title}</h3>
          <h1 className="text-base xl:text-xl font-bold">{value}</h1>
        </div>
        <div className="p-2.5 bg-slate-700 rounded-[50%]">
          <Icon className="w-6 h-6 text-sky-500" />
        </div>
      </div>
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full h-[30%] border-t border-slate-700 p-3 hover:bg-slate-700 transition ease-linear duration-100"
      >
        View
        <IconChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HomeCard;
