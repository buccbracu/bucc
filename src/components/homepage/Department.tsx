import Image from "next/image";

export default function Department({ department }: { department: any }) {
  return (
    <div>
      <div className="relative h-64">
        <Image
          src={department.image}
          alt={department.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="p-4">
        <p className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-100">
          {department.description}
        </p>
      </div>
    </div>
  );
}
