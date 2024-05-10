export default function Heading({
  headingText,
  subHeadingText,
}: {
  headingText: string;
  subHeadingText?: string;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">{headingText}</h1>
      <p className="text-lg mb-1 text-slate-400">{subHeadingText}</p>
      <hr className="mb-3 border-transparent" />
    </div>
  );
}
