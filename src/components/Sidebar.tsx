"use client";
 
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  LogOut, 
  FileText, 
  Users, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  UserPlus, 
  ClipboardCheck, 
  GraduationCap,
  UserCheck,
  Database,
  Megaphone,
  Radio,
  MessageSquare,
  FolderRoot,
  PlusCircle,
  Globe,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
 
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onExpand?: () => void;
  onToggleCollapse?: () => void;
}
 
export function Sidebar({ 
  isOpen = false, 
  onClose,
  isCollapsed = false,
  onExpand,
  onToggleCollapse
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
 
  // Fetch recruitment configuration dynamically
  const { data: configData } = useQuery({
    queryKey: ["recruitment-config"],
    queryFn: async () => {
      const res = await fetch("/api/config?key=recruitment_config");
      if (!res.ok) return { allowSERecruitmentAccess: false };
      const json = await res.json();
      return json?.value || { allowSERecruitmentAccess: false };
    },
    staleTime: 60 * 1000,
  });
 
  // Auto-expand if on a related path
  useEffect(() => {
    if (pathname.includes("/dashboard/recruitment") && !isCollapsed) {
      setIsRecruitmentOpen(true);
    }
    if (pathname.includes("/dashboard/projects") && !isCollapsed) {
      setIsProjectsOpen(true);
    }
  }, [pathname, isCollapsed]);
 
  const isAlumni = 
    user?.memberStatus?.toLowerCase() === "alumni" || 
    user?.designation?.toLowerCase() === "alumni" ||
    (user?.memberStatus && user?.memberStatus?.toLowerCase() !== "active");
  const userDesignation = user?.designation?.toLowerCase() || "";
  const canViewMembers = user && !isAlumni && [
    "president", "vice president", "vice-president", "general secretary", "treasurer",
    "director", "assistant director"
  ].includes(userDesignation);
 
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(!isAlumni ? [
      ...(canViewMembers ? [{ href: "/dashboard/members", label: "Members", icon: Users }] : []),
      { href: "/dashboard/events", label: "Events", icon: Calendar },
    ] : []),
    { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
  ];
 
  const recruitmentLinks = [
    { href: "/dashboard/recruitment/prereg", label: "Pre-Reg Members", icon: UserPlus },
    { href: "/dashboard/evaluation", label: "Evaluation", icon: GraduationCap },
    { href: "/dashboard/registration", label: "Account Creation", icon: UserPlus },
  ];
  const userDept = user?.buccDepartment?.toLowerCase() || "";
 
  const isGB = ["president", "vice president", "vice-president", "general secretary", "treasurer"].includes(userDesignation) && !isAlumni;
  const isHRHead = userDept === "human resources" && ["director", "assistant director"].includes(userDesignation) && !isAlumni;
  const isRDAdmin = userDept === "research and development" && ["director", "assistant director"].includes(userDesignation) && !isAlumni;
  const isPR = (userDept === "press release and publications" || isGB || isRDAdmin) && !isAlumni;
  
  const canManagePR = isPR && [
    "president", "vice president", "vice-president", "general secretary", "treasurer",
    "director", "assistant director", "senior executive"
  ].includes(userDesignation);
 
  const canBroadcast = (isGB || ["director", "assistant director"].includes(userDesignation)) && !isAlumni;
 
  const isEB = ["director", "assistant director"].includes(userDesignation) && !isAlumni;

  const canSeeRecruitment = user && !isAlumni && (
    isGB ||
    isEB ||
    (configData?.allowSERecruitmentAccess && userDesignation === "senior executive")
  );
 
  const canManageData = isGB || isHRHead || isRDAdmin;
  const canManageInquiries = isGB || isHRHead || isRDAdmin;
  const canManageProjects = isGB || isHRHead || isRDAdmin;
  
  const isMember = user && !canManageProjects;
 
  const handleSubmenuClick = (type: "projects" | "recruitment") => {
    if (isCollapsed && onExpand) {
      onExpand();
      if (type === "projects") setIsProjectsOpen(true);
      if (type === "recruitment") setIsRecruitmentOpen(true);
    } else {
      if (type === "projects") setIsProjectsOpen(!isProjectsOpen);
      if (type === "recruitment") setIsRecruitmentOpen(!isRecruitmentOpen);
    }
  };
 
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
        />
      )}
 
      {/* Sidebar Container */}
      <aside 
        className={cn(
          "flex-shrink-0 border-r border-border bg-card flex flex-col h-full z-50 transition-all duration-300 ease-in-out",
          "fixed inset-y-0 left-0 md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn(
          "border-b border-border flex items-center justify-between transition-all duration-300",
          isCollapsed ? "p-3 flex-col gap-3 justify-center" : "p-6"
        )}>
          <div className={cn("flex items-center gap-3", isCollapsed && "flex-col gap-3")}>
            <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={onClose}>
              <Image 
                src="/assets/bucc-icon.svg" 
                alt="BUCC Icon" 
                width={40} 
                height={40} 
                className="h-10 w-10 transition-transform group-hover:scale-110 dark:invert dark:hue-rotate-180 shrink-0"
              />
              {!isCollapsed && (
                <span className="font-serif text-2xl font-bold tracking-tight text-foreground whitespace-nowrap animate-in fade-in duration-300">Portal.</span>
              )}
            </Link>
            
            {/* Toggle Button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={cn(
                  "p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0 hidden md:block",
                  isCollapsed ? "mt-1" : "ml-1"
                )}
                aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {!isCollapsed && (
            <button 
              onClick={onClose}
              className="md:hidden p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className={cn("flex-1 overflow-y-auto p-4 space-y-1 transition-all duration-300", isCollapsed && "px-2")}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? link.label : undefined}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">{link.label}</span>}
            </Link>
          ))}
 
          {canManagePR && (
            <Link
              href="/dashboard/press-releases"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === "/dashboard/press-releases" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? "Press Releases" : undefined}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Press Releases</span>}
            </Link>
          )}
 
          {canBroadcast && (
            <Link
              href="/dashboard/broadcast"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === "/dashboard/broadcast" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? "Broadcast Center" : undefined}
            >
              <Radio className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Broadcast Center</span>}
            </Link>
          )}
 
          {canManageData && (
            <Link
              href="/dashboard/manage-data"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === "/dashboard/manage-data" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? "Manage Data" : undefined}
            >
              <Database className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Manage Data</span>}
            </Link>
          )}
 
          {canManageInquiries && (
            <Link
              href="/dashboard/inquiries"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === "/dashboard/inquiries" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? "Inquiries" : undefined}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Inquiries</span>}
            </Link>
          )}
 
          {canManageProjects && (
            <div className="space-y-1">
              <button
                onClick={() => handleSubmenuClick("projects")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2",
                  pathname.includes("/dashboard/projects") && "text-foreground"
                )}
                title={isCollapsed ? "Projects" : undefined}
              >
                <div className="flex items-center gap-3">
                  <FolderRoot className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="animate-in fade-in duration-300">Projects</span>}
                </div>
                {!isCollapsed && <ChevronDown className={cn("w-4 h-4 transition-transform", isProjectsOpen && "rotate-180")} />}
              </button>
              
              {isProjectsOpen && !isCollapsed && (
                <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200">
                  <Link
                    href="/dashboard/projects/add"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === "/dashboard/projects/add" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Project
                  </Link>
                  <Link
                    href="/dashboard/projects/requests"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === "/dashboard/projects/requests" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Requests
                  </Link>
                </div>
              )}
            </div>
          )}
 
          {isMember && (
            <Link
              href="/dashboard/projects/submit"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isCollapsed && "justify-center px-2",
                pathname === "/dashboard/projects/submit" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isCollapsed ? "Submit Project" : undefined}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="animate-in fade-in duration-300">Submit Project</span>}
            </Link>
          )}
 
          {canSeeRecruitment && (
            <div className="space-y-1">
              <button
                onClick={() => handleSubmenuClick("recruitment")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center px-2",
                  pathname.includes("/dashboard/recruitment") && "text-foreground"
                )}
                title={isCollapsed ? "Recruitment" : undefined}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span className="animate-in fade-in duration-300">Recruitment</span>}
                </div>
                {!isCollapsed && <ChevronDown className={cn("w-4 h-4 transition-transform", isRecruitmentOpen && "rotate-180")} />}
              </button>
              
              {isRecruitmentOpen && !isCollapsed && (
                <div className="pl-4 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200">
                  {recruitmentLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === link.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
 
          <Link
            href="/dashboard/public-profile"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isCollapsed && "justify-center px-2",
              pathname === "/dashboard/public-profile" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={isCollapsed ? "Public Profile" : undefined}
          >
            <Globe className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Public Profile</span>}
          </Link>
 
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isCollapsed && "justify-center px-2",
              pathname === "/dashboard/settings" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Settings</span>}
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link 
            href="/logout" 
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Sign Out</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
