import { IconX } from "@tabler/icons-react";
import React from "react";

type ModalProps = {
  title?: string;
  subTitle?: string;
  children: React.ReactNode;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  hideExit?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  title,
  subTitle,
  children,
  isOpen,
  loading,
  onClose,
  hideExit,
}) => {
  if (isOpen === false) return null;
  return (
    <div className="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-slate-900 bg-opacity-70">
      <div className="relative w-3/4 md:w-1/2 lg:w-[35%] xl:w-1/4 rounded-xl border border-slate-500 bg-slate-900 shadow-sm">
        <div className="p-7">
          <div className="text-center">
            <h2 className="block text-2xl font-bold text-white">{title}</h2>
            <p className="text-lg">{subTitle}</p>
          </div>

          <div className="mt-5 flex flex-col gap-4">{children}</div>
        </div>
        {!hideExit && (
          <button
            disabled={loading}
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-800 hover:text-gray-600 dark:text-neutral-200 dark:hover:text-neutral-400"
          >
            <IconX />
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
