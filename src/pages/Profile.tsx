import { IconPlus, IconUserCircle } from "@tabler/icons-react";
import { useStateContext } from "../context/useStateContext";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Profile = () => {
  const { currentUser } = useStateContext();
  const { authenticated } = usePrivy();
  const navigate = useNavigate();

  if (!authenticated) {
    return (
      <div className="flex flex-col min-h-[75vh] justify-center items-center">
        <h1 className="font-bold text-2xl">User Not Found</h1>
        <h4 className="">
          {!authenticated && "Please Login to create profile"}
        </h4>
      </div>
    );
  }

  if (authenticated && !currentUser) {
    return (
      <div className="flex flex-col min-h-[75vh] justify-center items-center">
        <h1 className="font-bold text-2xl">User Not Found</h1>
        <h4 className="">
          {!authenticated && "Please Login to create profile"}
        </h4>
        <Button
          icon={IconPlus}
          title="Create Profile"
          onClick={() => navigate("/onboarding")}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[75vh] justify-center items-center">
      <div className="w-full xs:w-[90%] sm:w-3/4 lg:w-[60%] xl:w-1/2 2xl:w-[30%] bg-slate-800 p-6 rounded-xl shadow-md shadow-sky-500">
        <div className="flex flex-col gap-2 items-center w-full">
          <IconUserCircle className="w-12 h-12 " />
          <h1 className="font-bold text-2xl">User Profile</h1>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col">
            <h3 className="text-sm xs:text-lg font-light">Email:</h3>
            <h1 className="text-base xs:text-xl font-semibold">
              {currentUser?.createdBy}
            </h1>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm xs:text-lg font-light">Username:</h3>
            <h1 className="text-base xs:text-xl font-semibold">
              {currentUser?.username}
            </h1>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm xs:text-lg font-light">Age:</h3>
            <h1 className="text-base xs:text-xl font-semibold">
              {currentUser?.age}
            </h1>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm xs:text-lg font-light">Location:</h3>
            <h1 className="text-base xs:text-xl font-semibold">
              {currentUser?.location}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
