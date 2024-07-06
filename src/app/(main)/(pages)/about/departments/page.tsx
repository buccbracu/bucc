import UnderConstruction from "@/components/ui/under-construction";

export default function Departments() {
  return (
    <div className="ext-3xl flex min-h-[calc(100vh-140px)] items-center justify-center font-bold">
      <UnderConstruction />
    </div>
    // <div className="w-full">
    //   <PageHeader
    //     title="Departments of BUCC"
    //     description="Explore the diverse departments of the BRAC University Computer
    //     Club and learn more about the exciting opportunities they offer."
    //   />
    //   <section className="py-12 md:py-20">
    //     <div className="container mx-auto px-4 md:px-6">
    //       <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    //         {departmentsInfo.map(({ name, image, description, url }, index) => (
    //           <div
    //             key={name}
    //             className={`group rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-950 ${
    //               index === 6
    //                 ? "md:col-span-2 lg:col-span-1 lg:col-start-2"
    //                 : ""
    //             }`}
    //           >
    //             <Image
    //               src={image}
    //               alt={name}
    //               width={600}
    //               height={400}
    //               className="h-48 w-full rounded-t-lg object-cover"
    //               placeholder="blur"
    //             />
    //             <div className="p-6">
    //               <h3 className="text-xl font-bold">{name}</h3>
    //               <p className="mt-2 text-gray-500 dark:text-gray-400">
    //                 {description}
    //               </p>
    //               <Button variant="link" className="mt-4">
    //                 <Link href={`/about/departments${url}`}>Learn More</Link>
    //               </Button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </section>
    // </div>
  );
}
