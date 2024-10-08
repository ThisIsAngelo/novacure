import { useEffect, useState } from "react";
import { search } from "../assets";
import { usePrivy } from "@privy-io/react-auth";
import { IconLogin2, IconLogout2, IconMenu2 } from "@tabler/icons-react";
import { navLinks } from "../constants";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";
import toast from "react-hot-toast";
import { useIconActive } from "../hooks/useIconActive";
import { useStateContext } from "../context/useStateContext";
import { RecordDatas } from "../pages/records";

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, login, logout } = usePrivy();
  const [navOpen, setNavOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [userRecords, setUserRecords] = useState<RecordDatas[]>([]);
  const isActive = useIconActive((state) => state.isActive);
  const setIsActive = useIconActive((state) => state.setIsActive);
  const { records } = useStateContext();

  useEffect(() => {
    setUserRecords(records);
  }, [records]);

  const handleLoginLogout = () => {
    try {
      if (authenticated) {
        setIsOpen(true);
      } else {
        login();
      }
    } catch (error) {
      console.error("Failed to login/logout", error);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    logout().then(() => {
      setLoading(false);
      navigate(0);
      toast.success("Logout Successfully");
      setIsOpen(false);
    });
  };

  const handleSearch = () => {
    if (!authenticated) {
      login();
    } else {
      if (keyword.length < 3) {
        toast.error("Keyword should be at least 3 characters long.");
      } else {
        const keywords = keyword;
        const filteredRecord = userRecords.filter((record) =>
          record.recordName.toLowerCase().includes(keyword.toLowerCase())
        );
        navigate(`/search/${keyword}`, {
          state: { keywords, filteredRecord },
        });
        setKeyword("");
      }
    }
  };

  return (
    <div className="mb-14 flex justify-between items-center gap-6 z-[90]">
      {/* Searchbar */}
      <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-slate-800 py-2 pl-4 pr-2 lg:flex-1">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search for records..."
          className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-slate-500"
        />
        <div
          onClick={handleSearch}
          className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-sky-500"
        >
          <img
            src={search}
            alt="Search"
            className="h-[15px] w-[15px] object-contain"
          />
        </div>
      </div>

      <div className="hidden flex-row justify-end gap-2 md:flex">
        <button
          className={`${
            authenticated ? "bg-red-500 active:bg-red-600" : "bg-sky-500"
          } p-3 px-6 rounded-xl outline-none`}
          onClick={handleLoginLogout}
        >
          {authenticated ? "Logout" : "Login"}
        </button>
      </div>

      <AlertModal
        isOpen={isOpen}
        loading={loading}
        onClose={() => setIsOpen(false)}
        title="Are You Sure?"
        typeButton="button"
        onConfirm={handleLogout}
      />

      {/* Hamburger menu */}
      <IconMenu2
        className="h-[34px] w-[34px] cursor-pointer object-contain md:hidden"
        onClick={() => {
          setNavOpen((prev) => !prev);
        }}
      />

      <div
        className={`absolute left-0 right-0 top-24 z-10 bg-slate-800 p-5 rounded-[28px] mx-4 md:hidden ${
          navOpen ? "scale-100" : "scale-0"
        } transition ease-linear duration-200`}
      >
        <ul className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <li
              key={link.pathname}
              className={`flex items-center gap-3 p-4 rounded-xl hover:bg-slate-700 cursor-pointer ${
                isActive === link.pathname && "bg-slate-700"
              }`}
              onClick={() => {
                setIsActive(link.pathname);
                setNavOpen(false);
                navigate(link.pathname);
              }}
            >
              <img
                src={link.icon}
                alt={link.name}
                className={`h-6 w-6 object-contain ${
                  isActive === link.pathname ? "grayscale-0" : "grayscale"
                }`}
              />
              <p
                className={`text-base font-semibold first-letter:uppercase ${
                  isActive === link.pathname ? "text-sky-500" : "text-slate-500"
                }`}
              >
                {link.name}
              </p>
            </li>
          ))}
          <li
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-slate-700 cursor-pointer"
            onClick={handleLoginLogout}
          >
            {authenticated ? (
              <IconLogout2 className="h-6 w-6 object-contain" />
            ) : (
              <IconLogin2 className="h-6 w-6" />
            )}
            <p className="text-base font-semibold text-slate-500">
              {authenticated ? "Logout" : "Login"}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
