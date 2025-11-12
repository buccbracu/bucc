"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import {
  getAllEventBanners,
  createEventBanner,
  updateEventBanner,
  deleteEventBanner,
  toggleEventBannerStatus,
} from "@/actions/eventBanners";
import type { EventBanner } from "@/lib/db/schema/eventBanners";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

export default function EventBannersManager() {
  const [banners, setBanners] = useState<EventBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    targetUrl: "",
    isActive: true,
    eventDate: "",
    eventEndDate: "",
    description: "",
    location: "",
    tags: [] as string[],
    category: "",
    isExclusive: false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setIsLoading(true);
    const result = await getAllEventBanners();
    if (result.success && result.data) {
      setBanners(result.data);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      alert("Please upload an image first");
      return;
    }
    
    const submitData = {
      ...formData,
      eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
      eventEndDate: formData.eventEndDate ? new Date(formData.eventEndDate) : null,
    };
    
    const result = await createEventBanner(submitData as any);
    
    if (result.success) {
      alert("Event banner created successfully!");
      setFormData({ 
        title: "", 
        imageUrl: "", 
        targetUrl: "", 
        isActive: true,
        eventDate: "",
        eventEndDate: "",
        description: "",
        location: "",
        tags: [],
        category: "",
        isExclusive: false,
      });
      setTagInput("");
      setShowForm(false);
      fetchBanners();
    } else {
      alert("Failed to create event banner: " + (result.error || "Unknown error"));
    }
  }

  function handleAddTag() {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  }

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    await toggleEventBannerStatus(id, !currentStatus);
    fetchBanners();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this banner?")) {
      await deleteEventBanner(id);
      fetchBanners();
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400">
          Manage event banners that appear on the homepage
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Banner Image</label>
            <ImageUploader
              onUploadComplete={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            {formData.imageUrl && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                  ✓ Image uploaded successfully
                </p>
                <a 
                  href={formData.imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {formData.imageUrl}
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Target URL</label>
            <input
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="https://example.com/event"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
              placeholder="Brief description of the event"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Date</label>
              <input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event End Date (Optional)</label>
              <input
                type="datetime-local"
                value={formData.eventEndDate}
                onChange={(e) => setFormData({ ...formData, eventEndDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., UB40101, BRAC University"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select a category</option>
              <option value="Workshop">Workshop</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Meetup">Meetup</option>
              <option value="Conference">Conference</option>
              <option value="Training">Training</option>
              <option value="Social">Social</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (show on homepage)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isExclusive"
                checked={formData.isExclusive}
                onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isExclusive" className="text-sm font-medium">
                Exclusive Event (shows special badge)
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!formData.imageUrl || !formData.title || !formData.targetUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              Create Banner
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ 
                  title: "", 
                  imageUrl: "", 
                  targetUrl: "", 
                  isActive: true,
                  eventDate: "",
                  eventEndDate: "",
                  description: "",
                  location: "",
                  tags: [],
                  category: "",
                  isExclusive: false,
                });
                setTagInput("");
                setShowForm(false);
              }}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500">No event banners yet. Create one to get started!</p>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid md:grid-cols-3 gap-4 p-4">
                <div className="relative h-40 md:h-full">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{banner.title}</h3>
                      {banner.isExclusive && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                          Exclusive
                        </span>
                      )}
                      {banner.category && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                          {banner.category}
                        </span>
                      )}
                    </div>
                    {banner.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {banner.description}
                      </p>
                    )}
                    {banner.tags && banner.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {banner.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={banner.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm mb-2"
                    >
                      {banner.targetUrl}
                      <ExternalLink size={14} />
                    </a>
                    <div className="text-sm text-gray-500 space-y-1">
                      {banner.eventDate && (
                        <p>Event Date: {new Date(banner.eventDate).toLocaleDateString()}</p>
                      )}
                      {banner.location && (
                        <p>Location: {banner.location}</p>
                      )}
                      <p>Created: {new Date(banner.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleToggleStatus(banner.id, banner.isActive)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        banner.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {banner.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>

                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 transition-colors"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
