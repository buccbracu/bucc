import Image from "next/image";
import Link from "next/link";

export default function DepartmentCard({
  name,
  description,
  image,
  url,
  color,
}: any) {
  return (
    <div className="sticky top-0 flex items-center justify-center">
      <div className={`${color} h-[500px] w-[1000px]`}>
        <h2>{name}</h2>
        <p>{description}</p>
        <Image width={100} height={100} src={image} alt={`${name} image`} />
        <Link href={url}>Learn more</Link>
      </div>
    </div>
  );
}
