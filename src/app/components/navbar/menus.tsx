const menus = [
  { title: "Home", path: "/" },
  {
    title: "About",
    path: "#",
    childrens: [
      {
        title: "About Us",
        path: "/about",
      },
      { title: "Departments", path: "/departments" },
      { title: "OCA", path: "/oca" },
      { title: "Faculty Advisors", path: "/advisors" },
      { title: "Executive Body", path: "/executive-body" },
      { title: "Former Executive Bodies", path: "/former-ebs" },
    ],
  },
  { title: "Events", path: "/events" },
  {
    title: "Publications",
    path: "#",
    childrens: [
      { title: "Press Releases", path: "/press-releases" },
      { title: "Blogs", path: "/blogs" },
      { title: "Newsletters", path: "/newsletters" },
      { title: "Magazine", path: "/magazine" },
    ],
  },
  { title: "Gallery", path: "/gallery" },
  { title: "Contact", path: "/contact" },
];

export { menus };
