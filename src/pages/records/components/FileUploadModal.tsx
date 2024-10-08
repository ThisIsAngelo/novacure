import { IconCloudUpload, IconLoader2 } from "@tabler/icons-react";
import Modal from "../../../components/Modal";

type FileUploadModalProps = {
  isOpen: boolean;
  loading: boolean;
  uploading: boolean;
  uploadSuccess: boolean;
  filename: string;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  removeFile: (e: HTMLInputElement) => void;
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  loading,
  uploading,
  uploadSuccess,
  filename,
  onClose,
  onFileChange,
  onFileUpload,
  removeFile,
}) => {
  const fileInput = document.getElementById("fileInput");
  return (
    <Modal
      loading={loading}
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Report"
      hideExit={uploadSuccess}
    >
      <div
        className={`w-full flex flex-col justify-center ${
          uploading || (uploadSuccess && "bg-slate-600")
        } items-center border border-dashed border-slate-500 rounded-xl p-8`}
      >
        <IconCloudUpload className="w-11 h-11" />

        <label
          htmlFor="fileInput"
          className={`${
            uploading || uploadSuccess
              ? "text-slate-400 hover:no-underline cursor-not-allowed"
              : "cursor-pointer"
          } text-sky-600 text-lg hover:underline`}
        >
          <input
            type="file"
            id="fileInput"
            className="sr-only"
            aria-describedby="validFormatFile"
            onChange={onFileChange}
            disabled={uploading || uploadSuccess}
          />
          Browse here
        </label>
        <small id="validFormatFile">PNG, PDF, JPEG, - Max 5MB</small>
      </div>
      {uploading && (
        <div className="flex items-center text-slate-300 gap-2">
          Uploading <IconLoader2 className="w-4 h-4 animate-spin " />
        </div>
      )}
      {uploadSuccess && (
        <div className="text-green-500 flex flex-col">
          Report uploaded successfully:{" "}
          <span className="text-white font-semibold flex gap-2">
            {filename}{" "}
            {!loading && (
              <button
                onClick={() => removeFile(fileInput as HTMLInputElement)}
                className="underline font-normal"
              >
                Remove File
              </button>
            )}
          </span>
        </div>
      )}
      <button
        type="button"
        className={`flex items-center justify-center gap-2 p-2 w-full rounded-xl font-medium ${
          loading || !filename
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-sky-600 active:bg-sky-700"
        }`}
        onClick={onFileUpload}
        disabled={loading || !filename}
      >
        {loading ? "Please wait..." : "Upload And Analyze"}
        {loading && <IconLoader2 className="w-4 h-4 animate-spin " />}
      </button>
    </Modal>
  );
};

export default FileUploadModal;
