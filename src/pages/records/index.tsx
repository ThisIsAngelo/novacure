import { useEffect, useState } from "react";
import CreateRecordModal from "./components/CreateRecordModal";
import { IconCirclePlus, IconLoader2 } from "@tabler/icons-react";
import { useStateContext } from "../../context/useStateContext";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import RecordCard from "./components/RecordCard";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export interface RecordDatas {
  userId: number | 0;
  recordName: string;
  analysisResult: string;
  kanbanRecord: string;
  createdBy: string;
};

const Records = () => {
  const { authenticated, login } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [userRecord, setUserRecords] = useState<RecordDatas[]>([]);
  const { currentUser, createRecord, fetchUserRecords, records } =
    useStateContext();
  const { user } = usePrivy();
  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    if (user) {
      const userEmail = user?.email?.address;
      if (userEmail) {
        fetchUserRecords(userEmail);
      }
    }
  }, [fetchUserRecords, user]);

  useEffect(() => {
    setUserRecords(records);
    localStorage.setItem("userRecords", JSON.stringify(records));
    setFetching(false);
  }, [records]);

  const handleCreateRecord = () => {
    if (!authenticated) {
      login();
    } else if (authenticated && !currentUser) {
      navigate("/onboarding");
    } else {
      setIsOpen(true);
    }
  };

  const createFolder = async (folderName: string) => {
    setLoading(true);

    try {
      const isFolderNameDuplicate = userRecord.some(
        (record) => record.recordName === folderName
      );

      if (isFolderNameDuplicate) {
        setLoading(false);
        toast.error(
          "Folder name already exists. Please choose a different one."
        );
        return;
      }

      if (currentUser && currentUser.id) {
        const recordData: RecordDatas = {
          userId: currentUser.id,
          recordName: folderName,
          analysisResult: "",
          kanbanRecord: "",
          createdBy: user?.email?.address || "",
        };
        const newRecord = await createRecord(recordData);

        if (newRecord) {
          fetchUserRecords(currentUser.createdBy);
          toast.success("Record successfully created");
          setIsOpen(false);
        }
      } else {
        toast.error("Failed to create record. Please try again later.");
      }
    } catch (error) {
      console.log("Failed to create Record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (folderName: string) => {
    const filteredRecord = userRecord.find(
      (record) => record.recordName === folderName
    );
    navigate(`/medical-records/${folderName}`, {
      state: filteredRecord,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <Button
          icon={IconCirclePlus}
          title="Create Record"
          onClick={handleCreateRecord}
        />
      </div>
      <CreateRecordModal
        userRecords={userRecord}
        loading={loading}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={createFolder}
      />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {fetching && (
          <p className="flex items-center gap-2">
            Fetching Data... <IconLoader2 className="w-4 h-4 animate-spin" />
          </p>
        )}
        {!fetching && userRecord.length < 1 ? <p>Record Empty</p> : null}
        {userRecord.map((record) => (
          <RecordCard
            key={record.recordName}
            folderName={record.recordName}
            onClick={handleNavigate}
          />
        ))}
      </div>
    </div>
  );
};

export default Records;
