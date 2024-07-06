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
      <p className="text-base font-medium text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
