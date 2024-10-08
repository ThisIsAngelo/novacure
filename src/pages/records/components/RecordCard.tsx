import { IconChevronRight, IconFolder } from "@tabler/icons-react";

type RecordCardProps = {
  folderName: string;
  onClick: (folderName: string) => void;
};

const RecordCard: React.FC<RecordCardProps> = ({ folderName, onClick }) => {
  return (
    <div className="w-full border bg-slate-800 bg-opacity-40 border-slate-700 hover:border-sky-500 transition ease-linear duration-100 rounded-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 h-[70%]">
        <IconFolder className="w-10 h-10 text-sky-500" />
      </div>
      <div
        onClick={() => onClick(folderName)}
        className="h-[30%] cursor-pointer flex justify-between items-center border-t border-slate-600 px-4 py-6 hover:bg-slate-700 transition ease-linear duration-100 rounded-b-xl"
      >
        <h1 className="font-medium text-base">{folderName}</h1>
        <IconChevronRight className="w-6 h-6" />
      </div>
    </div>
  );
};

export default RecordCard;
