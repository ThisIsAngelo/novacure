import { useLocation } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";

const ScreeningSchedule = () => {
  const state = useLocation();

  return (
    <div className="w-full">
      <KanbanBoard state={state.state} />
    </div>
  );
};

export default ScreeningSchedule;
