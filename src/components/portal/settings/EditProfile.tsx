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
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Github, 
  Linkedin, 
  ShieldCheck,
  Lock,
  HeartPulse,
  Briefcase,
  Calendar
} from "lucide-react";
import MultipleSelector from "@/components/ui/multiple-selector";
import SKILLS_LIST from "@/constants/skills";

export default function EditProfile() {
  const { user, setUser, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (user && !formData) {
      setFormData({
        phoneNumber: user.phoneNumber || "",
        personalEmail: user.personalEmail || "",
        bloodGroup: user.bloodGroup || "",
        gender: user.gender || "",
        emergencyContact: user.emergencyContact || "",
        memberSkills: user.memberSkills || [],
        memberSocials: user.memberSocials || { Facebook: "", Github: "", Linkedin: "" },
      });
    }
  }, [user, formData]);

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
        toast.success("Profile updated successfully");
        const data = await res.json();
        if (data?.user) {
          setUser((prev: any) => ({ ...prev, ...data.user }));
          setFormData((prev: any) => ({ ...prev, ...data.user }));
        }
        await refreshUser();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!formData || !user) return null;

  return (
    <div className="space-y-8 lg:col-span-2">
      {/* 1. Official Records (Read-Only) */}
      <Card className="border-border shadow-none bg-muted/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            <CardTitle className="text-lg font-serif">Official Identity</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-widest">System-managed records. Non-editable.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <ReadOnlyField label="Full Name" value={user.name} icon={<User className="w-3 h-3" />} />
          <ReadOnlyField label="Student ID" value={user.studentId} icon={<ShieldCheck className="w-3 h-3" />} />
          <ReadOnlyField label="G-Suite Email" value={user.email} icon={<Mail className="w-3 h-3" />} />
          <ReadOnlyField label="BUCC Department" value={user.buccDepartment} icon={<Briefcase className="w-3 h-3" />} />
          <ReadOnlyField label="Designation" value={user.designation} icon={<Briefcase className="w-3 h-3" />} />
          <ReadOnlyField label="Joined BUCC" value={user.joinedBucc || "N/A"} icon={<Calendar className="w-3 h-3" />} />
          <ReadOnlyField label="Joined BRACU" value={user.joinedBracu || "N/A"} icon={<Calendar className="w-3 h-3" />} />
        </CardContent>
        <div className="px-6 pb-4">
          <p className="text-[9px] text-muted-foreground/60 italic font-light">
            * Contact HR department to request changes to official records.
          </p>
        </div>
      </Card>

      {/* 2. Personal Profile (Editable) */}
      <Card className="border-border shadow-none bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-serif">Personal Information</CardTitle>
          <CardDescription>Update your contact and professional presence.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Phone Number</Label>
                <Input 
                  value={formData.phoneNumber} 
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Personal Email</Label>
                <Input 
                  value={formData.personalEmail} 
                  onChange={(e) => setFormData({...formData, personalEmail: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Emergency Contact</Label>
                <Input 
                  value={formData.emergencyContact} 
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blood Group</Label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg cursor-pointer outline-none dark:bg-card"
                  >
                    <option value="" disabled className="bg-card">Select Blood Group</option>
                    <option value="A+" className="bg-card">A+</option>
                    <option value="A-" className="bg-card">A-</option>
                    <option value="B+" className="bg-card">B+</option>
                    <option value="B-" className="bg-card">B-</option>
                    <option value="AB+" className="bg-card">AB+</option>
                    <option value="AB-" className="bg-card">AB-</option>
                    <option value="O+" className="bg-card">O+</option>
                    <option value="O-" className="bg-card">O-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Gender</Label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-transparent border-0 border-b border-border rounded-none px-0 py-1.5 focus-visible:ring-0 focus-visible:border-primary transition-colors text-lg cursor-pointer outline-none dark:bg-card"
                  >
                    <option value="" disabled className="bg-card">Select Gender</option>
                    <option value="Male" className="bg-card">Male</option>
                    <option value="Female" className="bg-card">Female</option>
                    <option value="Other" className="bg-card">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills & Socials */}
            <div className="space-y-8 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Expertise & Skills</Label>
                <MultipleSelector
                  value={(formData.memberSkills || []).map((s: string) => ({ label: s, value: s }))}
                  onChange={(options) => setFormData({...formData, memberSkills: options.map(o => o.value)})}
                  defaultOptions={SKILLS_LIST}
                  placeholder="Select or search skills..."
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 min-h-[40px]"
                  badgeClassName="bg-primary/10 text-primary border-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Facebook className="w-3 h-3" /> Facebook
                    </Label>
                    <Input 
                      value={formData.memberSocials.Facebook || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Facebook: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Github className="w-3 h-3" /> Github
                    </Label>
                    <Input 
                      value={formData.memberSocials.Github || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Github: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </Label>
                    <Input 
                      value={formData.memberSocials.Linkedin || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Linkedin: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-background hover:opacity-90 transition-all font-medium py-6"
            >
              {loading ? "Updating Profile..." : "Save Profile Details"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadOnlyField({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className="text-md font-medium text-foreground/80 border-b border-border/40 pb-1">{value}</p>
    </div>
  );
}
