"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineRefresh,
} from "react-icons/hi";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [saving, setSaving] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await update({ name: name.trim() });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPortfolio = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setResetting(true);
    try {
      const res = await fetch("/api/settings/reset-portfolio", { method: "POST" });
      if (!res.ok) throw new Error("Failed to reset");
      toast.success("Portfolio reset to ₹10,00,000!");
      setConfirmReset(false);
    } catch {
      toast.error("Failed to reset portfolio");
    } finally {
      setResetting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/settings/delete-account", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Account deleted. Goodbye!");
      signOut({ callbackUrl: "/" });
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Settings</h1>
          <p className="text-white/50">Manage your profile, preferences, and account.</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <HiOutlineUser className="text-accent" /> Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1">Email</label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              />
              <p className="text-xs text-white/30 mt-1">Email cannot be changed</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-accent text-background font-semibold hover:bg-accent-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
            <HiOutlineBell className="text-blue-400" /> Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-xs text-white/40">Get notified about portfolio updates</p>
              </div>
              <button
                onClick={() => {
                  setEmailNotifs(!emailNotifs);
                  toast.success(`Email notifications ${!emailNotifs ? "enabled" : "disabled"}`);
                }}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  emailNotifs ? "bg-accent" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    emailNotifs ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-xs text-white/40">
                  Alert when watchlist stocks hit targets
                </p>
              </div>
              <button
                onClick={() => {
                  setPriceAlerts(!priceAlerts);
                  toast.success(`Price alerts ${!priceAlerts ? "enabled" : "disabled"}`);
                }}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  priceAlerts ? "bg-accent" : "bg-white/20"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    priceAlerts ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 border border-red-500/30 mb-6"
        >
          <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2 text-red-400">
            <HiOutlineExclamation /> Danger Zone
          </h2>
          <div className="space-y-4">
            {/* Reset Portfolio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5">
              <div>
                <p className="font-medium">Reset Portfolio</p>
                <p className="text-xs text-white/40">
                  Delete all trades & holdings, reset to ₹10,00,000
                </p>
              </div>
              <button
                onClick={handleResetPortfolio}
                disabled={resetting}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap ${
                  confirmReset
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white/5 border border-white/10 text-orange-400 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HiOutlineRefresh size={16} />
                  {resetting
                    ? "Resetting..."
                    : confirmReset
                    ? "Confirm Reset"
                    : "Reset Portfolio"}
                </span>
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-xs text-white/40">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap ${
                  confirmDelete
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white/5 border border-white/10 text-red-400 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <HiOutlineTrash size={16} />
                  {deleting
                    ? "Deleting..."
                    : confirmDelete
                    ? "Yes, Delete Everything"
                    : "Delete Account"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
