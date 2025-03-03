import Image from "next/image";
import star from "/public/assets/star.png";
const activities = [
  "Hackathon",
  "Programming Competition",
  "Workshops",
  "Seminars",
  "Gaming Tournaments",
  "Career Talks",
  "Webinars",
  "Hackathon",
  "Programming Competition",
  "Workshops",
  "Seminars",
  "Gaming Tournaments",
  "Career Talks",
  "Webinars",
  "Hackathon",
  "Programming Competition",
  "Workshops",
  "Seminars",
  "Gaming Tournaments",
  "Career Talks",
  "Webinars",
  "Hackathon",
  "Programming Competition",
  "Workshops",
  "Seminars",
  "Gaming Tournaments",
  "Career Talks",
  "Webinars",
];

export default function Activities() {
  return (
    <div className="group relative flex gap-3 overflow-hidden p-6">
      <div className="animate-loop-scroll flex gap-8 space-x-16 whitespace-nowrap group-hover:paused">
        {activities.concat(activities).map((activity, index) => (
          <div key={index} className="flex items-center space-x-8">
            <p className="text-7xl font-bold text-gray-700">{activity}</p>
            <Image src={star} alt="star" width={64} height={64} />
          </div>
        ))}
      </div>
    </div>
  );
}
