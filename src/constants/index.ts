import { apps, records, screening, user } from "../assets";

type navLinks = {
  name: string;
  icon: string;
  pathname: string;
};

export const navLinks: navLinks[] = [
  {
    name: "dashboard",
    icon: apps,
    pathname: "/",
  },
  {
    name: "medical-records",
    icon: records,
    pathname: "/medical-records",
  },
  {
    name: "screening-schedules",
    icon: screening,
    pathname: "/screening-schedules",
  },
  {
    name: "profile",
    icon: user,
    pathname: "/profile",
  },
];
