import { Spinner } from "./ui/spinner";

export default function SpinnerComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner>Loading...</Spinner>
    </div>
  );
}
