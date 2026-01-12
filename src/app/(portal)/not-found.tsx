import Animated404 from "@/components/ui/animated-404";

export default function NotFound() {
  return (
    <Animated404
      title="Page Not Found"
      message="The dashboard page you're looking for doesn't exist."
      homeButtonText="Back to Dashboard"
    />
  );
}
