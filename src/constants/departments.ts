import cnmImage from "/public/images/departments/cnm.jpeg";
import creativeImage from "/public/images/departments/creative.jpeg";
import emImage from "/public/images/departments/em.jpeg";
import financeImage from "/public/images/departments/finance.jpeg";
import hrImage from "/public/images/departments/hr.jpeg";
import prImage from "/public/images/departments/pr.jpeg";
import rndImage from "/public/images/departments/rnd.jpeg";

export const departments = [
  { title: "Advisors Body" },
  { title: "Governing Body" },
  { title: "Communication and Marketing" },
  { title: "Creative" },
  { title: "Event Management" },
  { title: "Finance" },
  { title: "Human Resources" },
  { title: "Press Release and Publications" },
  { title: "Research and Development" },
];

export const departmentsInfo = [
  {
    name: "Communication and Marketing",
    description:
      "At BUCC’s Communication and Marketing department, we’re the storytellers and strategists behind the club’s vibrant image. We craft compelling narratives, design eye-catching campaigns, and connect with audiences through diverse channels. Whether promoting events, engaging with the community, or building our brand, our team ensures BUCC’s message is heard loud and clear. Join us to be at the forefront of dynamic marketing initiatives and strategic communication efforts, driving the club’s success and expanding our reach.",
    image: cnmImage,
    url: "/communication-and-marketing",
    color: "bg-blue-500",
  },
  {
    name: "Creative",
    description:
      "The Creative Department of BUCC is the hub of innovation and artistic expression. We transform ideas into visually stunning and impactful creations, from graphics and videos to interactive media. Our team thrives on imagination and ingenuity, turning visions into reality. We are the designers, artists, and visionaries who breathe life into every project, program, and so on. Collaborate with us to unleash your creativity and collaborate on projects that push the boundaries of visual storytelling.",
    image: creativeImage,
    url: "/creative",
    color: "bg-yellow-500",
  },
  {
    name: "Event Management",
    description:
      "BUCC’s Event Management department is where ideas come to life through meticulously planned and executed events. We organize workshops, seminars, and social gatherings that inspire, educate, and entertain. Our team excels in logistics, coordination, and creating memorable experiences. From brainstorming themes to managing on-the-day details, we ensure every event is a success. Hence, you have a passion for planning and a knack for making things happen, let us grow together.",
    image: emImage,
    url: "/event-management",
    color: "bg-red-500",
  },
  {
    name: "Finance",
    description:
      "The Finance department is the backbone of BUCC’s operations, managing budgets, securing funding, and ensuring financial stability. We handle everything from budgeting for events to seeking sponsorships and managing expenses. Our team is dedicated to maintaining transparency and financial health. Let us welcome you to develop your financial acumen and contribute to the sustainable growth of BUCC.",
    image: financeImage,
    url: "/finance",
    color: "bg-green-500",
  },
  {
    name: "Human Resources",
    description:
      "In the Human Resources department, we focus on nurturing talent and fostering a positive club culture. We recruit passionate members, facilitate training sessions, and ensure the well-being and development of our team. Our mission is to create an inclusive and motivating environment where everyone can thrive. Join us to play a crucial role in building and supporting a dynamic and engaged community at BUCC.",
    image: hrImage,
    url: "/human-resources",
    color: "bg-purple-500",
  },
  {
    name: "Press Release and Publications",
    description:
      "The Press Release and Publications department is the voice of BUCC, producing high-quality content that informs and engages. We handle newsletters, articles, and official Communication, ensuring accurate and compelling storytelling. Our team of writers and editors captures the essence of our activities and shares them with the world. If you have a passion for writing and want to contribute to our narrative, you're in the right place.",
    image: prImage,
    url: "/press-release-and-publications",
    color: "bg-pink-500",
  },

  {
    name: "Research and Development",
    description:
      "At BUCC’s Research and Development department, we’re the innovators pushing the boundaries of technology and creativity. We explore new ideas, develop projects, and keep BUCC at the cutting edge of computer science advancements. Our team thrives on curiosity and problem-solving, working on everything from software development to experimental tech. Like so this amazing website was pulled through purely by us. You're welcome to dive deep into research and drive the club’s technological progress.",
    image: rndImage,
    url: "/research-and-development",
    color: "bg-indigo-500",
  },
];

export default departments;
