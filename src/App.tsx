import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import MedicalRecord from "./pages/records";
import Onboarding from "./pages/Onboarding";
import toast, { Toaster } from "react-hot-toast";
import Profile from "./pages/Profile";
import RecordDetails from "./pages/records/RecordDetails";
import { useEffect } from "react";
import { useStateContext } from "./context/useStateContext";
import { usePrivy } from "@privy-io/react-auth";
import ScreeningSchedule from "./pages/ScreeningSchedule";
import Sidebar from "./components/SideBar";
import { useIconActive } from "./hooks/useIconActive";
import RecordSearch from "./pages/records/RecordSearch";

function App() {
  const { currentUser, fetchUserByEmail, fetchUserRecords } = useStateContext();
  const { user, authenticated } = usePrivy();
  const { pathname } = useLocation();
  const navigate = useNavigate()
  const setIconActive = useIconActive((state) => state.setIsActive);

  useEffect(() => {
    setIconActive(pathname);
  }, [setIconActive, pathname]);

  useEffect(() => {
    const userEmail = user?.email?.address;
    if (!currentUser && userEmail) {
      fetchUserByEmail(userEmail);
      fetchUserRecords(userEmail);
    }
  }, [navigate,authenticated, currentUser, fetchUserByEmail, fetchUserRecords, user]);

  useEffect(() => {
    if (authenticated) {
      toast.success("Login Successfully!");
    }
  }, [authenticated]);

  return (
    <div className="relative bg-slate-900 min-h-screen flex flex-row p-4 overflow-x-hidden md:overflow-x-visible">
      <Toaster toastOptions={{ className: "font-semibold" }} />

      <div className="relative lg:mr-16">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full max-w-[1400px] lg:pr-10 md:mx-12 2xl:mx-16 overflow-x-hidden">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medical-records" element={<MedicalRecord />} />
          <Route path="/medical-records/:id" element={<RecordDetails />} />
          <Route path="/search/:keyword" element={<RecordSearch />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/screening-schedules" element={<ScreeningSchedule />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
