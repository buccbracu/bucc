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
  { title: "Communications and Marketing" },
  { title: "Creative" },
  { title: "Event Management" },
  { title: "Finance" },
  { title: "Human Resources" },
  { title: "Press Release and Publications" },
  { title: "Research and Development" },
];

export const departmentsInfo = [
  {
    name: "Communications and Marketing",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: cnmImage,
    url: "/communication-and-marketing",
    color: "bg-blue-500",
  },
  {
    name: "Creative",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: creativeImage,
    url: "/creative",
    color: "bg-yellow-500",
  },
  {
    name: "Event Management",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: emImage,
    url: "/event-management",
    color: "bg-red-500",
  },
  {
    name: "Finance",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: financeImage,
    url: "/finance",
    color: "bg-green-500",
  },
  {
    name: "Human Resources",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: hrImage,
    url: "/human-resources",
    color: "bg-purple-500",
  },
  {
    name: "Press Release and Publications",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: prImage,
    url: "/press-release-and-publications",
    color: "bg-pink-500",
  },

  {
    name: "Research and Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec ultricies lacus, nisl nec ultricies lacus.",
    image: rndImage,
    url: "/research-and-development",
    color: "bg-indigo-500",
  },
];

export default departments;
