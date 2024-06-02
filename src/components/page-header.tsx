export default function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 page-header">
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
