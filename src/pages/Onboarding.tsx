import { IconLoader2, IconUserCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useStateContext } from "../context/useStateContext";
import toast from "react-hot-toast";
import AlertModal from "../components/AlertModal";

interface UserType {
  username: string;
  age: string;
  location: string;
}

// Kita mengambil semua type dari UserType kecuali age untuk mendifinisikan ulang agar bisa masuk ke dalam database dalam bentuk number. Lalu untuk age di UserType itu untuk menyimpan data sementara dari form saja dalam bentuk string agar default input age nya bisa dari kosong/"" bukan dari 0
interface UserData extends Omit<UserType, "age"> {
  age: number;
  createdBy: string;
}

const Onboarding = () => {
  const [users, setUsers] = useState<UserType>({
    username: "",
    age: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { createUser } = useStateContext();
  const { user } = usePrivy();

  const openAlertModal = () => {
    if (users.username === "") {
      toast.error("Username is required");
      return;
    } else if (users.age === "" || isNaN(parseInt(users.age, 10))) {
      toast.error("Age is required");
      return;
    } else if (users.location === "") {
      toast.error("Location is required");
      return;
    } else {
      setOpen(true);
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    setLoading(true);

    if (users.username === "") {
      toast.error("Username is required");
      setLoading(false);
      return;
    } else if (users.age === "" || isNaN(parseInt(users.age, 10))) {
      toast.error("Age is required");
      setLoading(false);
      return;
    } else if (users.location === "") {
      toast.error("Location is required");
      setLoading(false);
      return;
    } else {
      const userData: UserData = {
        username: users.username,
        age: parseInt(users.age, 10),
        location: users.location,
        createdBy: user?.email?.address || "",
      };

      const newUser = await createUser(userData);
      if (newUser) {
        navigate("/profile");
        toast.success("User created successfully");
        setLoading(false);
      } else {
        alert("Failed to create user. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-[75vh] justify-center items-center">
      <div className="w-full xs:w-3/4 md:w-[65%] lg:w-[55%] xl:w-[40%] 2xl:w-[30%] p-6 lg:p-8 flex flex-col gap-6 justify-center items-center bg-slate-800 border border-slate-700 rounded-2xl">
        <h1 className="text-base flex flex-col items-center text-center">
          <IconUserCircle className="w-12 h-12" />
          <span className="font-semibold text-2xl">Welcome!</span> Let's get
          started with creating your profile
        </h1>
        <form
          onSubmit={handleOnboarding}
          className="w-full flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1">
            <label
              className="text-base text-slate-100 font-medium"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={users.username}
              onChange={(e) => setUsers({ ...users, username: e.target.value })} // menggunakan spread users agar value dari atribut nya juga tercatat saat value username nya berubah
              required
              className="rounded-sm py-1 px-2 bg-slate-700 border border-slate-600 focus:outline-none text-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="text-base text-slate-100 font-medium"
              htmlFor="age"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              value={users.age}
              onChange={(e) => setUsers({ ...users, age: e.target.value })}
              required
              className="rounded-sm py-1 px-2 bg-slate-700 border border-slate-600 focus:outline-none text-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="text-base text-slate-100 font-medium"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={users.location}
              onChange={(e) => setUsers({ ...users, location: e.target.value })}
              required
              className="rounded-sm py-1 px-2 bg-slate-700 border border-slate-600 focus:outline-none text-white"
            />
          </div>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 p-2 w-full rounded-sm font-medium ${
              loading ? "bg-slate-400" : "bg-sky-600 active:bg-sky-700"
            }`}
            onClick={openAlertModal}
            disabled={loading}
          >
            Get Started
            {loading && <IconLoader2 className="w-4 h-4 animate-spin " />}
          </button>
          <AlertModal
            loading={loading}
            title="Are you sure?"
            typeButton="submit"
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
