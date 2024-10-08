import {
  IconArrowBackUp,
  IconChevronRight,
  IconFileUpload,
  IconFolderOpen,
  IconLoader2,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import FileUploadModal from "./components/FileUploadModal";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useStateContext } from "../../context/useStateContext";
import toast from "react-hot-toast";
import ReactMarkDown from "react-markdown";
import IconButton from "../../components/IconButton";
import Button from "../../components/Button";

const geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;

const RecordDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateRecord } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [filename, setFilename] = useState("");
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || ""
  );

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error("Failed to read file as base64"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    setLoading(true);

    const genAI = new GoogleGenerativeAI(geminiAPIKey);

    try {
      if (file) {
        const base64Data = await readFileAsBase64(file);

        const imageParts = [
          {
            inlineData: {
              data: base64Data,
              mimeType: fileType,
            },
          },
        ];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `You are an expert in cancer diagnosis. Analyze the document uploaded, identifying key diagnostic markers and mutations related to cancer. Summarize the findings and provide a detailed explanation of the potential treatment options based on current scientific evidence. Make sure the information is clear and easy to understand, structuring your response in paragraphs for better readability. Remember to avoid giving personalized recommendations.`;

        const result = await model.generateContent([prompt, ...imageParts]);
        if (!result) {
          toast.error("Please try again later");
        } else {
          const response = result.response;
          const text = response.text();
          setAnalysisResult(text);
          updateRecord({
            documentId: state.id,
            analysisResult: text,
            kanbanRecord: "",
          });
          setUploadSuccess(true);
          setFile(null);
          setFilename("");
          setFileType("");
          toast.success("Upload and Analyze Successfully!");
        }
      }
    } catch (error) {
      console.log("Error Uploading and Analyze:", error);
      toast.error("Error Uploading and Analyze");
    } finally {
      setIsModalOpen(false);
      setLoading(false);
      setUploadSuccess(false);
    }
  };

  const proccessTreatmentPlan = async () => {
    setLoading(true);

    if (state.kanbanRecord) {
      const recordId = state.id;
      const kanbanRecord = state.kanbanRecord;
      const parsedKanbanRecord = JSON.parse(kanbanRecord);
      navigate(`/screening-schedules`, {
        state: { recordId, ...parsedKanbanRecord },
      });
    } else {
      const genAI = new GoogleGenerativeAI(geminiAPIKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Your role and goal is to be an that will be using this treatment plan ${analysisResult} to create Columns:
                  - Todo: Tasks that need to be started
                  - Doing: Tasks that are in progress
                  - Done: Tasks that are completed
            
                  Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
            
                  Please provide the results in the following  format for easy front-end display no quotating or what so ever just pure the structure below:
  
                  {
                    "columns": [
                      { "id": "todo", "title": "Todo" },
                      { "id": "doing", "title": "Work in progress" },
                      { "id": "done", "title": "Done" }
                    ],
                    "tasks": [
                      { "id": "1", "columnId": "todo", "content": "Example task 1" },
                      { "id": "2", "columnId": "todo", "content": "Example task 2" },
                      { "id": "3", "columnId": "doing", "content": "Example task 3" },
                      { "id": "4", "columnId": "doing", "content": "Example task 4" },
                      { "id": "5", "columnId": "done", "content": "Example task 5" }
                    ]
                  }
                  `;
      const result = await model.generateContent(prompt);
      if (!result) {
        toast.error("Please try again later");
      } else {
        const response = result.response;
        const text = response.text();
        const parsedResponse = JSON.parse(text);
        updateRecord({
          documentId: state.id,
          analysisResult,
          kanbanRecord: text,
        });

        const recordId = state.id;
        navigate(`/screening-schedules`, {
          state: { recordId, ...parsedResponse },
        });
      }
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        console.log("Selected File:", file);
        setUploadSuccess(true);
        setFileType(file.type);
        setFilename(file.name);
        setFile(file);
        setUploading(false);
      }
    }
  };

  const removeFile = (fileInput: HTMLInputElement) => {
    fileInput.value = "";
    setUploadSuccess(false);
    setFileType("");
    setFilename("");
    setFile(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[70%] xs:w-[60%] sm:w-1/2 md:w-[40%] xl:w-1/4 flex gap-2">
        <Button
          icon={IconArrowBackUp}
          onClick={() => navigate("/medical-records")}
          className="max-w-[18%]"
        />
        <Button
          icon={IconFileUpload}
          title="Upload Report"
          onClick={handleOpenModal}
          className="hidden md:flex flex-1"
        />

        <IconButton
          title="Upload Report"
          icon={IconFileUpload}
          onClick={handleOpenModal}
          className="hover:flex-1"
        />
      </div>

      <FileUploadModal
        filename={filename}
        loading={loading}
        onFileChange={handleFileChange}
        removeFile={removeFile}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <div className="w-[70%] xs:w-[60%] sm:w-1/2 md:w-[40%] xl:w-1/4 border bg-slate-800 bg-opacity-40 border-slate-700 hover:border-sky-500 transition ease-linear duration-100 rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 h-[70%]">
          <IconFolderOpen className="w-10 h-10 text-sky-500" />
        </div>
        <div className="h-[30%] flex justify-between items-center border-t border-slate-600 px-4 py-6 transition ease-linear duration-100 rounded-b-2xl">
          <h1 className="font-medium text-base">{state.recordName}</h1>
        </div>
      </div>

      <div className="flex flex-col border border-slate-600 rounded-2xl">
        {/* Title  */}
        <div className="flex flex-col p-4 border-b border-slate-700">
          <h1 className="font-bold text-lg">
            Personalized AI-Driven Treatment Plan
          </h1>
          <p className="text-base">
            A tailored medical strategy leveraging advanced AI insights.
          </p>
        </div>

        {/* Ai Result */}
        <div className="flex p-4 border-b border-slate-700">
          <div className="flex flex-col gap-1">
            {!analysisResult && <p className="font-medium">No Result</p>}
            <ReactMarkDown>{analysisResult}</ReactMarkDown>
          </div>
        </div>

        {/* View Treatment Button */}
        <div className="flex p-4">
          <button
            disabled={loading || !analysisResult}
            onClick={proccessTreatmentPlan}
            className={`flex items-center gap-2 py-3 px-5 rounded-3xl border border-slate-600 transition ease-linear duration-100 ${
              loading || !analysisResult
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-800 active:bg-slate-900 hover:bg-slate-700"
            }`}
          >
            View Treatment Plan
            <IconChevronRight className="w-6 h-6" />
            {loading && <IconLoader2 className="w-4 h-4 animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordDetails;
