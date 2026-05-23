"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import Alert from "@/ui/Alert";

export default function ProfileForm({ user }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name === "User" ? "" : user?.name || "",
    gender: user?.gender || "",
    age: user?.age || "",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.gender || !formData.age || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>{error}</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-900 dark:text-slate-200">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="focus-ring h-12 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm font-medium text-slate-900 dark:text-white shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20"
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Age *"
          name="age"
          type="number"
          min="0"
          max="120"
          value={formData.age}
          onChange={handleChange}
          placeholder="e.g. 35"
          required
        />

        <Input
          label="Profile Image URL (Optional)"
          name="profileImage"
          type="url"
          value={formData.profileImage}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-900 dark:text-slate-200">
          Full Address *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Enter your complete residential address..."
          className="focus-ring w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm font-medium text-slate-900 dark:text-white shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" loading={loading} className="w-full md:w-auto px-10">
          Save Profile & Continue
        </Button>
      </div>
    </form>
  );
}
