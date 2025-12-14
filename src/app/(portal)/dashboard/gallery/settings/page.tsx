"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGallerySettings, updateGallerySettings } from "@/actions/gallerySettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
type GallerySettings = {
  id: string;
  isGalleryEnabled: boolean;
  galleryTitle?: string;
  galleryDescription?: string;
  showEventCount: boolean;
  showPhotoCount: boolean;
  cardsPerRow?: string;
  enableLightbox: boolean;
  showCaptions: boolean;
  featuredEventIds?: string[];
};

export default function GallerySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<GallerySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const result = await getGallerySettings();
      if (result.success && result.data) {
        setSettings(result.data);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    const result = await updateGallerySettings({
      isGalleryEnabled: settings.isGalleryEnabled,
      galleryTitle: settings.galleryTitle,
      galleryDescription: settings.galleryDescription,
      showEventCount: settings.showEventCount,
      showPhotoCount: settings.showPhotoCount,
      cardsPerRow: settings.cardsPerRow,
      enableLightbox: settings.enableLightbox,
      showCaptions: settings.showCaptions,
      featuredEventIds: settings.featuredEventIds,
    });

    if (result.success) {
      alert("Settings saved successfully!");
      router.refresh();
    } else {
      alert(result.error || "Failed to save settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => router.push("/dashboard/gallery")}
        className="mb-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Gallery
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gallery Settings</h1>
        <p className="text-muted-foreground">
          Configure how the gallery appears on your website
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Gallery</Label>
                <p className="text-sm text-muted-foreground">
                  Show or hide the gallery section on your website
                </p>
              </div>
              <Switch
                checked={settings.isGalleryEnabled}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, isGalleryEnabled: checked })
                }
              />
            </div>

            <div>
              <Label htmlFor="title">Gallery Title</Label>
              <Input
                id="title"
                value={settings.galleryTitle || ""}
                onChange={(e) =>
                  setSettings({ ...settings, galleryTitle: e.target.value })
                }
                placeholder="Event Gallery"
              />
            </div>

            <div>
              <Label htmlFor="description">Gallery Description</Label>
              <Textarea
                id="description"
                value={settings.galleryDescription || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    galleryDescription: e.target.value,
                  })
                }
                placeholder="Browse photos from our events"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Event Count</Label>
                <p className="text-sm text-muted-foreground">
                  Display number of events in gallery
                </p>
              </div>
              <Switch
                checked={settings.showEventCount}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, showEventCount: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Photo Count</Label>
                <p className="text-sm text-muted-foreground">
                  Display photo count badge on event cards
                </p>
              </div>
              <Switch
                checked={settings.showPhotoCount}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, showPhotoCount: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Lightbox</Label>
                <p className="text-sm text-muted-foreground">
                  Allow full-screen image viewing
                </p>
              </div>
              <Switch
                checked={settings.enableLightbox}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, enableLightbox: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Captions</Label>
                <p className="text-sm text-muted-foreground">
                  Display image captions on hover
                </p>
              </div>
              <Switch
                checked={settings.showCaptions}
                onCheckedChange={(checked: boolean) =>
                  setSettings({ ...settings, showCaptions: checked })
                }
              />
            </div>

            <div>
              <Label htmlFor="cardsPerRow">Cards Per Row (Desktop)</Label>
              <select
                id="cardsPerRow"
                value={settings.cardsPerRow || "3"}
                onChange={(e) =>
                  setSettings({ ...settings, cardsPerRow: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="2">2 Cards</option>
                <option value="3">3 Cards</option>
                <option value="4">4 Cards</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                Number of event cards displayed per row on desktop
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/gallery")}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
