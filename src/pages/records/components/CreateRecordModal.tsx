import { IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import Modal from "../../../components/Modal";

type RecordDatas = {
  userId: number | 0;
  recordName: string;
  analysisResult: string;
  kanbanRecord: string;
  createdBy: string;
};

type CreateRecordModalProps = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
  userRecords: RecordDatas[];
};

const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  isOpen,
  loading,
  onClose,
  onCreate,
  userRecords,
}) => {
  const [folderName, setFolderName] = useState("");
  const isFolderNameDuplicate = userRecords.some(
    (record) => record.recordName === folderName
  );

  const handleCreate = () => {
    onCreate(folderName);
    setFolderName("");
  };
  return (
    <Modal
      title="Create Record"
      subTitle="Create Folder for your Record"
      isOpen={isOpen}
      onClose={onClose}
      loading={loading}
    >
      <div className="flex flex-col">
        <label htmlFor="record" className="mb-1 text-base">
          Record Name
        </label>
        <input
          id="record"
          type="text"
          required
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          className="p-2 bg-slate-700 focus:outline-none rounded-lg border border-slate-500"
        />
        {isFolderNameDuplicate && (
          <p className="text-red-500 text-sm">
            Folder name already exists. Please choose a different one.
          </p>
        )}
        <button
          disabled={loading || folderName.length < 3 || isFolderNameDuplicate}
          onClick={handleCreate}
          className={`flex justify-center items-center gap-2 mt-4 rounded-lg p-2 font-medium ${
            loading || folderName.length < 3 || isFolderNameDuplicate
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-sky-600 active:bg-sky-700"
          }`}
        >
          Create Folder
          {loading && <IconLoader2 className="w-4 h-4 animate-spin " />}
        </button>
      </div>
    </Modal>
  );
};

export default CreateRecordModal;
