import { IconLoader2 } from "@tabler/icons-react";
import Modal from "./Modal";

type AlertModalProps = {
  title: string;
  subtitle?: string;
  loading: boolean;
  typeButton: "button" | "submit";
  isOpen: boolean;
  onConfirm?: () => void;
  onClose: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  subtitle,
  loading,
  typeButton,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      loading={loading}
      onClose={onClose}
      title={title}
      subTitle={subtitle}
      hideExit={true}
    >
      <div className="w-full grid grid-cols-2 gap-4 justify-between items-center">
        <button
          disabled={loading}
          className={`bg-red-500 p-2.5 rounded-xl active:bg-red-600 ${
            loading && "bg-slate-500"
          }`}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={onConfirm}
          className={`flex gap-2 items-center justify-center bg-sky-500 p-2.5 rounded-xl active:bg-sky-600 ${
            loading && "bg-slate-500"
          }`}
          type={typeButton}
        >
          Confirm
          {loading && <IconLoader2 className="animate-spin w-4 h-4" />}
        </button>
      </div>
    </Modal>
  );
};

export default AlertModal;
