"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Globe, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicProfileSettings() {
  const { user, setUser, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (user && !formData) {
      setFormData({
        profileSlug: user.profileSlug || "",
        isPublicProfile: user.isPublicProfile ?? false,
        bio: user.bio || "",
        currentJob: user.currentJob || "",
        cvLink: user.cvLink || "",
        showPersonalEmail: user.showPersonalEmail ?? false,
        showPhoneNumber: user.showPhoneNumber ?? false,
        showProjects: user.showProjects ?? true,
        showBlogs: user.showBlogs ?? true,
        showTestimonials: user.showTestimonials ?? true,
        coverImage: user.coverImage || "",
        experience: user.experience || "",
        recentActivity: user.recentActivity || "",
        showExperience: user.showExperience ?? true,
        showRecentActivity: user.showRecentActivity ?? true,
        education: user.education || "",
        achievements: user.achievements || "",
        certifications: user.certifications || "",
        showEducation: user.showEducation ?? true,
        showAchievements: user.showAchievements ?? true,
        showCertifications: user.showCertifications ?? true,
        showGithubStats: user.showGithubStats ?? true,
      });
    }
  }, [user, formData]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setUploadingCover(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload?type=cover", {
        method: "POST",
        body: body,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev: any) => ({ ...prev, coverImage: data.url }));
      toast.success("Cover photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload cover photo");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/member?id=${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Public profile settings updated successfully");
        const data = await res.json();
        if (data?.user) {
          setUser((prev: any) => ({ ...prev, ...data.user }));
          setFormData((prev: any) => ({ ...prev, ...data.user }));
        }
        await refreshUser();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update public profile settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("basic"); // "basic", "content", "visibility"

  if (!formData || !user) return null;
 
  return (
    <Card className="border-border shadow-none bg-card">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-serif">Public Profile Settings</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Customize your public directory landing page and select what information you want to share.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Custom Tab Selector */}
        <div className="flex border-b border-border/60 mb-8 shrink-0 overflow-x-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={cn(
              "px-4 py-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all duration-300 whitespace-nowrap",
              activeTab === "basic"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={cn(
              "px-4 py-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all duration-300 whitespace-nowrap",
              activeTab === "content"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Rich Content (Markdown)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("visibility")}
            className={cn(
              "px-4 py-2.5 text-xs uppercase tracking-widest font-bold border-b-2 transition-all duration-300 whitespace-nowrap",
              activeTab === "visibility"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Visibility Controls
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Profile URL Slug</Label>
                  <Input 
                    value={formData.profileSlug} 
                    onChange={(e) => setFormData({...formData, profileSlug: e.target.value})}
                    placeholder="e.g. johndoe"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                  />
                  {formData.profileSlug ? (
                    <p className="text-xs text-muted-foreground/60">
                      Your profile link: <a href={`/m/${formData.profileSlug.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] underline hover:text-foreground">/m/{formData.profileSlug.toLowerCase()}</a>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground/40 italic">Claim a unique slug to activate your profile page.</p>
                  )}
                </div>
 
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">CV / Resume Link (Google Drive / Dropbox)</Label>
                  <Input 
                    value={formData.cvLink} 
                    onChange={(e) => setFormData({...formData, cvLink: e.target.value})}
                    placeholder="https://drive.google.com/..."
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Cover Photo URL</Label>
                  <div className="flex gap-4 items-end">
                    <Input 
                      value={formData.coverImage} 
                      onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-md flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploadingCover}
                      onClick={() => document.getElementById("cover-photo-upload-input")?.click()}
                      className="border-border text-xs py-1 h-9 px-3 shrink-0"
                    >
                      {uploadingCover ? "Uploading..." : "Upload File"}
                    </Button>
                    <input 
                      type="file" 
                      id="cover-photo-upload-input" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleCoverUpload} 
                    />
                  </div>
                </div>
 
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Current Job / Working As</Label>
                  <Input 
                    value={formData.currentJob} 
                    onChange={(e) => setFormData({...formData, currentJob: e.target.value})}
                    placeholder="e.g. SWE in Meta"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-md"
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Biography / About Me</Label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  placeholder="Write a brief intro about yourself to display on your profile..."
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-md font-light resize-y"
                />
              </div>
            </div>
          )}
          
          {/* TAB 2: RICH CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Work Experience</Label>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">Supports Markdown</span>
                </div>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  rows={5}
                  placeholder={`### Software Engineer @ TechCorp\n- Built scalable cloud services using Node.js and Next.js\n- Designed responsive components aligning with design tokens\n\n### Junior Developer @ StartupCo\n- Collaborated on web apps and optimized SQL queries`}
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-sm font-mono resize-y"
                />
              </div>
 
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Recent Activity / Updates</Label>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">One update per line (bullets added automatically)</span>
                </div>
                <textarea
                  value={formData.recentActivity}
                  onChange={(e) => setFormData({...formData, recentActivity: e.target.value})}
                  rows={4}
                  placeholder={`Completed the BUCC portal public profile settings section\nContributed 5 PRs to the open-source repository\nRefactored member dashboard components for better mobile layout`}
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-sm font-light resize-y"
                />
              </div>
 
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Education</Label>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">Supports Markdown</span>
                </div>
                <textarea
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  rows={4}
                  placeholder={`### BSc. in Computer Science & Engineering\n**BRAC University** (2022 - Present)\n- CGPA: 3.85 / 4.00\n- Specialized Track: Artificial Intelligence & Software Engineering`}
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-sm font-mono resize-y"
                />
              </div>
 
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Achievements & Awards</Label>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">Supports Markdown</span>
                </div>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                  rows={4}
                  placeholder={`- **Champion**, BUCC Intra-University Programming Contest (2025)\n- **Dean's List Honoree**, Fall 2024 & Spring 2025 semesters\n- **Top 50**, National Girls Programming Contest (2024)`}
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-sm font-mono resize-y"
                />
              </div>
 
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Certifications</Label>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">Supports Markdown</span>
                </div>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  rows={4}
                  placeholder={`- **AWS Certified Cloud Practitioner** (Amazon Web Services, 2025)\n- **Next.js Developer Professional** (Vercel, 2024)\n- **Meta Front-End Developer Specialization** (Coursera, 2024)`}
                  className="w-full bg-transparent border border-border rounded-none p-3 focus-visible:outline-none focus:border-primary transition-colors text-sm font-mono resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 3: VISIBILITY CONTROLS */}
          {activeTab === "visibility" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Master Profile Visibility Toggle */}
              <div className="flex items-center gap-4 p-5 bg-primary/[0.03] border border-primary/20 rounded-md">
                <input 
                  type="checkbox"
                  id="isPublicProfile"
                  checked={formData.isPublicProfile}
                  onChange={(e) => setFormData({...formData, isPublicProfile: e.target.checked})}
                  className="w-5 h-5 border border-border accent-primary cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <Label htmlFor="isPublicProfile" className="text-sm font-bold cursor-pointer text-foreground">Activate Public Profile Page</Label>
                  <p className="text-xs text-muted-foreground font-light">Enable this to allow anyone on the internet to view your claimed profile page.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Section Visibility Control</Label>
                  <p className="text-xs text-muted-foreground font-light">Choose what elements to show or hide on your public page.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-2">
                  {/* Show Personal Email */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showPersonalEmail"
                      checked={formData.showPersonalEmail}
                      onChange={(e) => setFormData({...formData, showPersonalEmail: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showPersonalEmail" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showPersonalEmail ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Personal Email
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Allow public visitors to see your personal email address.</p>
                    </div>
                  </div>
 
                  {/* Show Phone Number */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showPhoneNumber"
                      checked={formData.showPhoneNumber}
                      onChange={(e) => setFormData({...formData, showPhoneNumber: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showPhoneNumber" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showPhoneNumber ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Phone Number
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Expose your phone number on your public profile.</p>
                    </div>
                  </div>
 
                  {/* Show Projects */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showProjects"
                      checked={formData.showProjects}
                      onChange={(e) => setFormData({...formData, showProjects: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showProjects" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showProjects ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Projects Showcase
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Display the projects you have published on this site.</p>
                    </div>
                  </div>
 
                  {/* Show Blogs */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showBlogs"
                      checked={formData.showBlogs}
                      onChange={(e) => setFormData({...formData, showBlogs: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showBlogs" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showBlogs ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Publications (Blogs)
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Display articles written by you in the publications section.</p>
                    </div>
                  </div>
 
                  {/* Show Testimonials */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showTestimonials"
                      checked={formData.showTestimonials}
                      onChange={(e) => setFormData({...formData, showTestimonials: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showTestimonials" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showTestimonials ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Testimonials
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Display EB panel and Alumni recommendations on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show Experience */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showExperience"
                      checked={formData.showExperience}
                      onChange={(e) => setFormData({...formData, showExperience: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showExperience" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showExperience ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Experience Section
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Toggle showing the Work & Experience section on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show Recent Activity */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showRecentActivity"
                      checked={formData.showRecentActivity}
                      onChange={(e) => setFormData({...formData, showRecentActivity: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showRecentActivity" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showRecentActivity ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Recent Activity Feed
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Toggle showing your recent activities feed on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show Education */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showEducation"
                      checked={formData.showEducation}
                      onChange={(e) => setFormData({...formData, showEducation: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showEducation" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showEducation ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Education Section
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Toggle showing the Education section on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show Achievements */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showAchievements"
                      checked={formData.showAchievements}
                      onChange={(e) => setFormData({...formData, showAchievements: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showAchievements" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showAchievements ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Achievements & Awards
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Toggle showing your achievements and awards on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show Certifications */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showCertifications"
                      checked={formData.showCertifications}
                      onChange={(e) => setFormData({...formData, showCertifications: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showCertifications" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showCertifications ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show Certifications Section
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Toggle showing the Certifications section on your profile.</p>
                    </div>
                  </div>
 
                  {/* Show GitHub Stats */}
                  <div className="flex items-start gap-3 p-3 bg-muted/10 border border-border/40 rounded-sm hover:border-border/80 transition-colors">
                    <input 
                      type="checkbox"
                      id="showGithubStats"
                      checked={formData.showGithubStats}
                      onChange={(e) => setFormData({...formData, showGithubStats: e.target.checked})}
                      className="w-4 h-4 border border-border accent-primary cursor-pointer mt-0.5 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <Label htmlFor="showGithubStats" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                        {formData.showGithubStats ? <Eye className="w-3.5 h-3.5 text-green-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground/60" />}
                        Show GitHub Stats
                      </Label>
                      <p className="text-[10px] text-muted-foreground font-light leading-snug">Display a visual summary of your GitHub code contributions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-border flex items-center justify-end gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-foreground text-background hover:opacity-90 transition-all font-medium px-8 py-5 shrink-0"
            >
              {loading ? "Saving Settings..." : "Save Public Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
