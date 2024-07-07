import Image from "next/image";

export default function Department({ department }: { department: any }) {
  return (
    <div className="relative h-[500px]">
      <Image
        src={department.image}
        alt={department.name}
        placeholder="blur"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black to-transparent"></div>
      <div className="absolute bottom-0 p-4 text-white">
        <p className="text-center text-sm font-normal">
          {department.description}
        </p>
      </div>
    </div>
  );
}
