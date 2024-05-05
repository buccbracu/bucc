import {
  LayoutDashboard,
  Settings,
  UserSearch,
  UsersRound,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    variant: "default",
  },
  {
    title: "Members",
    path: "/dashboard/members",
    icon: UsersRound,
    variant: "ghost",
  },
  {
    title: "Recruitment",
    path: "/dashboard/recruitment",
    icon: UserSearch,
    variant: "ghost",
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    variant: "ghost",
  },
];

export default menus;
