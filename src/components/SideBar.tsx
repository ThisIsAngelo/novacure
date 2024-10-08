import { navLinks } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { useIconActive } from "../hooks/useIconActive";

type IconProps = {
  name: string;
  icon: string;
  isActive: string;
  style?: string;
  handleClick: () => void;
};

const Icon: React.FC<IconProps> = ({
  name,
  icon,
  isActive,
  handleClick,
  style,
}) => {
  return (
    <div
      className={`h-[48px] w-[48px] rounded-[10px] ${
        isActive && isActive === name && "bg-slate-700"
      } flex items-center justify-center cursor-pointer hover:bg-slate-700 transition ease-linear duration-150 ${style}`}
      onClick={handleClick}
    >
      <img
        src={icon}
        alt="Logo"
        className={`h-6 w-6 ${isActive !== name && "grayscale"}`}
      />
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const isActive = useIconActive((state) => state.isActive);
  const setIsActive = useIconActive((state) => state.setIsActive);

  return (
    <div className="sticky top-2 h-[93vh] flex-col items-center justify-between hidden md:flex">
      <Link to="/" onClick={() => setIsActive("dashboard")}>
        <div className="rounded-[10px] bg-slate-700 p-2 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        </div>
      </Link>

      <div className="mt-12 flex w-[76px] flex-1 flex-col items-center justify-between rounded-[20px] bg-slate-800 py-4">
        <div className="flex flex-col items-center justify-center gap-3">
          {navLinks.map((link) => (
            <Icon
              key={link.pathname}
              name={link.pathname}
              icon={link.icon}
              isActive={isActive}
              handleClick={() => {
                setIsActive(link.pathname);
                navigate(link.pathname);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
