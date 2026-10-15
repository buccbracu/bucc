"use client";

import { useState } from "react";
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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, KeyRound, RefreshCw, QrCode } from "lucide-react";

export default function TwoFactorSettings() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const is2faEnabled = session?.user?.twoFactorEnabled;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"idle" | "verifying">("idle");
  const [totpData, setTotpData] = useState<{ totpURI: string; backupCodes: string[] } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const handleEnableInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your current password to enable 2FA.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.twoFactor.enable({
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to generate 2FA setup");
      } else if (data && "totpURI" in data) {
        setTotpData(data);
        setStep("verifying");
        toast.success("TOTP key generated. Scan the QR code to continue.");
      } else {
        toast.error("Unsupported two-factor method response");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6 || isNaN(Number(verificationCode))) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
      });

      if (error) {
        toast.error(error.message || "Invalid code. Setup verification failed.");
      } else {
        toast.success("Two-factor authentication successfully activated!");
        setStep("idle");
        setTotpData(null);
        setVerificationCode("");
        setPassword("");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your current password to disable 2FA.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.twoFactor.disable({
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to disable 2FA");
      } else {
        toast.success("Two-factor authentication has been disabled.");
        setPassword("");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetSetup = () => {
    setStep("idle");
    setTotpData(null);
    setVerificationCode("");
    setPassword("");
  };

  if (sessionPending) {
    return (
      <Card className="border-border shadow-none bg-card">
        <CardContent className="py-8 text-center text-xs text-muted-foreground">
          <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" /> Loading Security Settings...
        </CardContent>
      </Card>
    );
  }

  // 1. Two-Factor Authentication is ENABLED
  if (is2faEnabled) {
    return (
      <Card className="border-border shadow-none bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <CardTitle className="text-xl font-serif">Two-Factor Auth</CardTitle>
          </div>
          <CardDescription>Extra security is active on your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDisable2FA} className="space-y-6">
            <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-md text-xs text-green-500/90 leading-relaxed font-light">
              TOTP (Authenticator App) 2FA is currently active. Every sign-in will require a 6-digit code.
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Verify password to disable</Label>
              <div className="relative">
                <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  type="password"
                  value={password}
                  placeholder="Enter current password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-0 border-b border-border rounded-none pl-7 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              variant="destructive"
              className="w-full font-medium py-5"
            >
              {loading ? "Disabling..." : "Disable Two-Factor Auth"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // 2. Setup Mode - Scan QR and input 6-digit confirmation code
  if (step === "verifying" && totpData) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpData.totpURI)}`;

    return (
      <Card className="border-border shadow-none bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-serif">Setup Authenticator</CardTitle>
          </div>
          <CardDescription>Scan the QR code and input the generated code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            {/* QR Code container */}
            <div className="bg-white p-3 rounded-lg w-fit mx-auto border border-border/80">
              <img src={qrCodeUrl} alt="2FA QR Code" width={180} height={180} className="block" />
            </div>

            <div className="space-y-2 text-left">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Secret Key (Manual Entry)</Label>
              <code className="block bg-muted/65 p-2 rounded text-center text-xs font-mono select-all break-all border border-border/40">
                {(() => {
                  try {
                    const url = new URL(totpData.totpURI);
                    return url.searchParams.get("secret") || "N/A";
                  } catch (e) {
                    return "N/A";
                  }
                })()}
              </code>
            </div>

            {totpData.backupCodes && totpData.backupCodes.length > 0 && (
              <div className="space-y-2 text-left pt-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Backup Recovery Codes</Label>
                <div className="grid grid-cols-2 gap-1 bg-muted/50 p-3 rounded font-mono text-[10px] text-muted-foreground text-center border border-border/40">
                  {totpData.backupCodes.map((code, idx) => <div key={idx}>{code}</div>)}
                </div>
                <p className="text-[9px] text-destructive/80 italic text-center font-light leading-relaxed">
                  Save these codes! If you lose access to your phone, these are the only way to recover your account.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleVerifyActivation} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Enter Authenticator Code</Label>
              <Input 
                type="text"
                maxLength={6}
                value={verificationCode}
                placeholder="000000"
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="bg-transparent border-0 border-b border-border rounded-none text-center font-mono text-xl tracking-[0.2em] focus-visible:ring-0 focus-visible:border-primary transition-colors"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={resetSetup}
                disabled={loading}
                className="flex-1 font-medium border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground font-medium"
              >
                {loading ? "Activating..." : "Verify & Activate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  // 3. Two-Factor Authentication is DISABLED
  return (
    <Card className="border-border shadow-none bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-muted-foreground/80" />
          <CardTitle className="text-xl font-serif">Two-Factor Auth</CardTitle>
        </div>
        <CardDescription>Secure your portal access with two-factor authentication.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEnableInitiate} className="space-y-6">
          <div className="p-3 bg-muted/40 border border-border/80 rounded-md text-xs text-muted-foreground leading-relaxed font-light">
            Keep your account secure by requiring a 6-digit security code generated by an app on your phone whenever you log in.
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Enter password to enable</Label>
            <div className="relative">
              <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <Input 
                type="password"
                value={password}
                placeholder="Enter current password"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-0 border-b border-border rounded-none pl-7 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors text-sm"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background hover:opacity-90 transition-all font-medium py-5"
          >
            {loading ? "Initiating..." : "Setup Authenticator App"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
