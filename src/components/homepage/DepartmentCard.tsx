import Image from "next/image";

export default function DepartmentCard({
  name,
  description,
  image,
  url,
  color,
}: any) {
  return (
    <div className="flex justify-center items-center sticky top-0">
      <div className={`${color} w-[1000px] h-[500px]`}>
        <h2>{name}</h2>
        <p>{description}</p>
        <Image width={100} height={100} src={image} alt={`${name} image`} />
        <a href={url}>Learn more</a>
      </div>
    </div>
  );
}
