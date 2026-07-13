"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and system configurations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "appearance", label: "Appearance", icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? "border-[#003366] text-[#003366]" 
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" defaultValue="john.doe@idbibank.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <input type="text" defaultValue="Senior Credit Officer" disabled className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                  <input type="text" defaultValue="Mumbai Central" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between py-4 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive email updates about application status changes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-900">Push Notifications</p>
                  <p className="text-sm text-slate-500">Receive browser notifications for urgent actions.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003366]"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input type="password" className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none" />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Two-Factor Authentication (2FA)
                </p>
                <p className="text-sm text-blue-600 mt-1">2FA is currently enabled for your account to ensure maximum security.</p>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Theme Preference</label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-[#003366] bg-slate-50 rounded-lg text-center transition-all">
                    <div className="w-full h-16 bg-white border border-slate-200 rounded mb-2 shadow-sm"></div>
                    <span className="text-sm font-medium text-slate-900">Light</span>
                  </button>
                  <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300 transition-all">
                    <div className="w-full h-16 bg-slate-800 rounded mb-2 shadow-sm"></div>
                    <span className="text-sm font-medium text-slate-900">Dark</span>
                  </button>
                  <button className="p-4 border border-slate-200 rounded-lg text-center hover:border-slate-300 transition-all">
                    <div className="w-full h-16 bg-gradient-to-r from-white to-slate-800 rounded mb-2 shadow-sm"></div>
                    <span className="text-sm font-medium text-slate-900">System</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button className="inline-flex items-center gap-2 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}