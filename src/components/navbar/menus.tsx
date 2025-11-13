const menus = [
  { title: "Home", path: "/" },
  {
    title: "About",
    path: "/about",
    childrens: [
      {
        title: "About Us",
        path: "/about/about-us",
      },
      { title: "Departments", path: "/about/departments" },
      { title: "OCA", path: "/about/oca" },
      { title: "Faculty Advisors", path: "/about/advisors" },
      { title: "Executive Body", path: "/about/executive-body" },
      { title: "Former Executive Bodies", path: "/about/former-ebs" },
    ],
  },
  { title: "Events", path: "/events" },
  {
    title: "Publications",
    path: "/publications",
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
