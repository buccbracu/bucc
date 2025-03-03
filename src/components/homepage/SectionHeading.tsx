export default function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200 md:text-4xl">
        {title}
      </h2>
      <hr className="mx-auto mb-4 mt-2 h-1 w-20 border-0 bg-gradient-to-r from-[#4a91c0] to-[#2479b1]" />
      <div className="flex justify-center">
        <p className="max-w-2xl text-base font-medium text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}
