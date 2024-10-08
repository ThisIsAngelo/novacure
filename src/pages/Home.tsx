import { useNavigate } from "react-router-dom";
import HomeCard from "../components/HomeCard";
import {
  IconAlertCircle,
  IconCircleDashedCheck,
  IconFolder,
  IconHourglass,
  IconHourglassHigh,
  IconUserScan,
} from "@tabler/icons-react";
import { useStateContext } from "../context/useStateContext";
import { useIconActive } from "../hooks/useIconActive";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Tasks } from "../components/KanbanBoard";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, records } = useStateContext();
  const { user, authenticated, login } = usePrivy();
  const [metrics, setMetrics] = useState({
    totalFolders: 0,
    totalScreenings: 0,
    toDoScreenings: 0,
    pendingScreenings: 0,
    completedScreenings: 0,
  });
  const setIsIconActive = useIconActive((state) => state.setIsActive);

  useEffect(() => {
    if (user && records.length > 0) {
      const totalFolders = records.length;
      let totalScreenings = 0;
      let toDoScreenings = 0;
      let pendingScreenings = 0;
      let completedScreenings = 0;

      records.forEach((record) => {
        if (record.kanbanRecord) {
          try {
            const kanban = JSON.parse(record.kanbanRecord);
            totalScreenings += kanban.tasks.length;
            toDoScreenings += kanban.tasks.filter(
              (task: Tasks) => task.columnId === "todo"
            ).length;
            pendingScreenings += kanban.tasks.filter(
              (task: Tasks) => task.columnId === "doing"
            ).length;
            completedScreenings += kanban.tasks.filter(
              (task: Tasks) => task.columnId === "done"
            ).length;
          } catch (error) {
            console.error("Failed to parse kanbanRecord", error);
          }
        }
      });

      setMetrics({
        totalFolders,
        totalScreenings,
        toDoScreenings,
        pendingScreenings,
        completedScreenings,
      });
    }
  }, [user, records]);

  const handleNavigate = () => {
    if (!authenticated) {
      login();
    } else if (authenticated && !currentUser) {
      navigate("/onboarding");
    } else {
      navigate("medical-records");
      setIsIconActive("records");
    }
  };

  const metricsData = [
    {
      title: "Specialist Appointments Pending",
      value: metrics.pendingScreenings,
      icon: IconHourglass,
    },
    {
      title: "Treatment Progress Update",
      value: `${metrics.completedScreenings} Completed of ${metrics.totalScreenings} Screenings`,
      icon: IconCircleDashedCheck,
    },
    {
      title: "Total Folders",
      value: metrics.totalFolders,
      icon: IconFolder,
    },
    {
      title: "Total Screenings",
      value: metrics.totalScreenings,
      icon: IconUserScan,
    },
    {
      title: "To Do Screenings",
      value: metrics.toDoScreenings,
      icon: IconAlertCircle,
    },
    {
      title: "Pending Screenings",
      value: metrics.pendingScreenings,
      icon: IconHourglassHigh,
    },
    {
      title: "Completed Screenings",
      value: metrics.completedScreenings,
      icon: IconCircleDashedCheck,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full grid sm:grid-cols-2 gap-5">
        {metricsData.slice(0, 2).map((metric) => (
          <HomeCard key={metric.title} {...metric} onClick={handleNavigate} />
        ))}
      </div>
      <div className="w-full grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {metricsData.slice(2).map((metric) => (
          <HomeCard key={metric.title} {...metric} onClick={handleNavigate} />
        ))}
      </div>
    </div>
  );
};

export default Home;
