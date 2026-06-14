import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import { toast } from "sonner";
import { 
  User, 
  Lock, 
  Sliders, 
  CreditCard, 
  Check, 
  Loader2, 
  Bell, 
  Sun, 
  Moon, 
  ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Preferences {
  theme: "dark" | "light";
  email_notifications: {
    content_ready: boolean;
    weekly_summary: boolean;
    system_updates: boolean;
  };
}

interface SettingsData {
  name: string;
  email: string;
  subscription_plan: string;
  role: string;
  preferences: Preferences;
}

export const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "preferences" | "billing">("profile");

  // Tab 1: Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Tab 2: Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tab 3: Preferences State
  const { theme, setTheme } = useTheme();
  const [notifContentReady, setNotifContentReady] = useState(true);
  const [notifWeeklySummary, setNotifWeeklySummary] = useState(false);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(true);

  // Query to get user settings data
  const { data: settingsData, isLoading } = useQuery<SettingsData>({
    queryKey: ["user-account-settings", user?.id],
    queryFn: () => apiClient.get<SettingsData>("/api/settings/"),
    enabled: !!user,
  });

  // Populate local form state when data is loaded
  useEffect(() => {
    if (settingsData) {
      setName(settingsData.name || "");
      setEmail(settingsData.email || "");
      if (settingsData.preferences) {
        setTheme(settingsData.preferences.theme);
        if (settingsData.preferences.email_notifications) {
          setNotifContentReady(settingsData.preferences.email_notifications.content_ready);
          setNotifWeeklySummary(settingsData.preferences.email_notifications.weekly_summary);
          setNotifSystemUpdates(settingsData.preferences.email_notifications.system_updates);
        }
      }
    }
  }, [settingsData, setTheme]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; email: string }) => apiClient.put("/api/settings/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-account-settings"] });
      // Invalidate auth-user query to refresh sidebar initials/name
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Profile Metadata Updated", {
        description: "Your name and email address have been updated."
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to update profile.";
      toast.error("Profile Save Error", { description: msg });
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: any) => apiClient.put("/api/settings/password", data),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password Updated Securely", {
        description: "Your account credentials have been updated."
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to change password.";
      toast.error("Password Update Error", { description: msg });
    }
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: Preferences) => apiClient.put("/api/settings/preferences", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-account-settings"] });
      toast.success("Preferences Saved Successfully");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    }
  });

  const handleUpdateProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Profile fields cannot be empty");
      return;
    }
    updateProfileMutation.mutate({ name, email });
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    updatePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword
    });
  };

  const handleUpdatePreferences = (updatedTheme?: "dark" | "light") => {
    const selectedTheme = updatedTheme !== undefined ? updatedTheme : theme;
    updatePreferencesMutation.mutate({
      theme: selectedTheme as "dark" | "light",
      email_notifications: {
        content_ready: notifContentReady,
        weekly_summary: notifWeeklySummary,
        system_updates: notifSystemUpdates
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="animate-pulse tracking-widest font-mono text-xs uppercase">Decrypting Account Settings...</p>
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-8 max-w-4xl mx-auto w-full animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your user profile details, credentials, notification settings, and license billing.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-glass/5 border border-glass/10 p-1.5 rounded-2xl w-full">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "password", label: "Security & Credentials", icon: Lock },
          { id: "preferences", label: "Preferences", icon: Sliders },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-glow-sm scale-102"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon size={14} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Tab 1: Profile Settings */}
        {activeTab === "profile" && (
          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-glass/10 pb-4">
              <User className="text-primary" size={20} />
              <h3 className="text-lg font-display font-bold text-foreground">Profile Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Full Profile Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Design Auditor"
                  className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>

              {/* Profile Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. auditor@genmark.com"
                  className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary/50 text-foreground"
                />
              </div>
            </div>

            <div className="p-4 bg-glass/5 rounded-xl border border-glass/10 space-y-3">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block">Account Details</span>
              <div className="flex gap-2.5 flex-wrap">
                <span className="text-foreground px-3 py-1 bg-glass/5 border border-glass/15 rounded-full text-xs font-mono uppercase">
                  Plan License: {settingsData?.subscription_plan || "Free"}
                </span>
                <span className="text-foreground px-3 py-1 bg-glass/5 border border-glass/15 rounded-full text-xs font-mono uppercase">
                  User Role: {settingsData?.role || "user"}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updateProfileMutation.isPending}
                className="gap-2 px-8 rounded-xl font-bold py-2.5"
              >
                {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                Update Profile Details
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === "password" && (
          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-glass/10 pb-4">
              <Lock className="text-red-400" size={20} />
              <h3 className="text-lg font-display font-bold text-foreground">Change Password</h3>
            </div>

            <div className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-400/50 text-foreground"
                />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-400/50 text-foreground"
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-glass/5 border border-glass/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-red-400/50 text-foreground"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleUpdatePassword} 
                disabled={updatePasswordMutation.isPending}
                className="gap-2 px-8 rounded-xl font-bold py-2.5 bg-red-500 hover:bg-red-600 text-white"
              >
                {updatePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={16} />}
                Change Password
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Tab 3: Preferences */}
        {activeTab === "preferences" && (
          <GlassCard className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-glass/10 pb-4">
              <Sliders className="text-purple-400" size={20} />
              <h3 className="text-lg font-display font-bold text-foreground">Preferences & Theme</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Appearance theme */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sun className="text-yellow-400" size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Appearance Mode</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTheme("dark");
                      handleUpdatePreferences("dark");
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border text-xs font-semibold transition-all hover:scale-102",
                      theme === "dark" 
                        ? "bg-primary/15 border-primary text-foreground"
                        : "bg-glass/5 border-glass/5 text-muted-foreground hover:bg-glass/10"
                    )}
                  >
                    <Moon size={16} />
                    <span>Dark Cyber (Glass)</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme("light");
                      handleUpdatePreferences("light");
                      toast.info("Light mode layout applied.");
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border text-xs font-semibold transition-all hover:scale-102",
                      theme === "light" 
                        ? "bg-primary/15 border-primary text-foreground"
                        : "bg-glass/5 border-glass/5 text-muted-foreground hover:bg-glass/10"
                    )}
                  >
                    <Sun size={16} />
                    <span>Light Mode</span>
                  </button>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="text-cyan-400" size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Email Notifications</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { id: "notifContentReady", label: "Generative Content synthesis ready", desc: "Notify when long running copy generation tasks complete.", value: notifContentReady, setter: setNotifContentReady },
                    { id: "notifWeeklySummary", label: "Weekly performance summaries", desc: "Get weekly usage trends and efficiency matrices.", value: notifWeeklySummary, setter: setNotifWeeklySummary },
                    { id: "notifSystemUpdates", label: "Platform updates and security logs", desc: "Alert me when keys rotate or updates roll out.", value: notifSystemUpdates, setter: setNotifSystemUpdates },
                  ].map((notif) => (
                    <label key={notif.id} className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={notif.value}
                        onChange={(e) => {
                          notif.setter(e.target.checked);
                          // Defer update after state toggles
                          setTimeout(() => handleUpdatePreferences(), 50);
                        }}
                        className="mt-1 accent-primary h-4 w-4 rounded border-glass/10 bg-glass/5 focus:ring-0"
                      />
                      <div className="-mt-0.5">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{notif.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{notif.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Tab 4: Billing & Subscription */}
        {activeTab === "billing" && (
          <GlassCard className="p-8 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 border-b border-glass/10 pb-4">
              <CreditCard className="text-emerald-400" size={20} />
              <h3 className="text-lg font-display font-bold text-foreground">License & Subscription</h3>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-emerald-500/5 border border-primary/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 font-mono text-[9px] font-bold uppercase tracking-wider">
                  Active Subscription
                </span>
                <h4 className="text-2xl font-display font-bold text-foreground mt-2.5">
                  {settingsData?.subscription_plan === "pro" 
                    ? "GenMark Professional Plan" 
                    : settingsData?.subscription_plan === "enterprise" 
                      ? "Enterprise Licensing Plan" 
                      : "GenMark Free Plan Tier"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  License status: Active • Renewal automatically managed.
                </p>
              </div>

              <button 
                onClick={() => window.open("https://billing.genmark.ai", "_blank")}
                className="px-6 py-2.5 bg-glass/5 hover:bg-glass/10 text-foreground border border-glass/10 hover:border-glass/20 text-xs font-semibold rounded-xl transition-all shadow-md active:scale-98"
              >
                Manage Billing Portal
              </button>
            </div>

            {/* Shield Notice */}
            <div className="flex gap-3 bg-glass/5 p-4 rounded-xl border border-glass/5 text-xs text-muted-foreground leading-relaxed">
              <ShieldAlert className="text-muted-foreground shrink-0 mt-0.5" size={16} />
              <p>For custom service agreements, seat expansions, or dedicated deployment metrics, contact your GenMark enterprise support agent.</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
