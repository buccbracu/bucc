export default function Heading({
  headingText,
  subHeadingText,
}: {
  headingText: string;
  subHeadingText?: string;
}) {
  return (
    <div className="mt-10 md:mt-0">
      <h1 className="mb-3 text-3xl font-bold">{headingText}</h1>
      <p className="mb-1 text-lg text-slate-400">{subHeadingText}</p>
      <hr className="mb-3 border-transparent" />
    </div>
  );
}
