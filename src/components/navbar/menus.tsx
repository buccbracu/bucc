const menus = [
  { title: "Home", path: "/" },
  {
    title: "About",
    path: "/about",
    childrens: [
      {
        title: "About Us",
        path: "/",
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

const footer_menu = [
  {
    title: "Services",
    childrens: [
      { title: "Branding", path: "/branding" },
      { title: "Design", path: "/design" },
      { title: "Marketing", path: "/marketing" },
      { title: "Advertisement", path: "/advertisement" },
    ],
  },

  {
    title: "Company",
    childrens: [
      { title: "About Us", path: "/about" },
      { title: "Contact", path: "/contact" },
      { title: "Jobs", path: "/jobs" },
      { title: "Press", path: "/press" },
    ],
  },

  {
    title: "Legal",
    childrens: [
      { title: "Terms of Use", path: "/tou" },
      { title: "Privacy Policy", path: "/privacy-policy" },
      { title: "Cookie Policy", path: "/cookie-policy" },
    ],
  },
];

export { menus };
