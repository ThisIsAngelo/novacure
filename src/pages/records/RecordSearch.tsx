import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RecordDatas } from ".";
import RecordCard from "./components/RecordCard";
import { IconLoader2 } from "@tabler/icons-react";

const RecordSearch = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [userRecords, setUserRecords] = useState<RecordDatas[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setFetching(true);
    setUserRecords(state.filteredRecord);
    setFetching(false);
  }, [state]);

  const handleNavigate = (folderName: string) => {
    const filteredRecord = userRecords.find(
      (record) => record.recordName === folderName
    );
    navigate(`/medical-records/${folderName}`, {
      state: filteredRecord,
    });
  };

  console.log("state:", state);

  return (
    <div>
      <h1 className="text-lg font-light">
        Search for <span className="font-bold">{state.keywords}</span>...
      </h1>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {fetching && (
          <p className="flex items-center gap-2">
            Fetching Data... <IconLoader2 className="w-4 h-4 animate-spin" />
          </p>
        )}
        {!fetching && userRecords.length < 1 ? <p>Record Not Found</p> : null}
        {userRecords.map((record) => (
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

export default RecordSearch;
