import EventBannersManager from "@/components/admin/EventBannersManager";

export default function EventBannersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Event Banners Management</h1>
      <EventBannersManager />
    </div>
  );
}
