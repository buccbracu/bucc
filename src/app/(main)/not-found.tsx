import Animated404 from "@/components/ui/animated-404";

// Static page - no revalidation needed
export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <Animated404
      title="Page Not Found"
      message="The page you're looking for doesn't exist or hasn't been implemented yet."
      homeButtonText="Go Back Home"
    />
  );
}
