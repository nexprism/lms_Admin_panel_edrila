import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendNotification } from "../../src/store/slices/notification";

export default function AppNotificationSender() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.notification);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    image: null,
    webPushLink: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token") || "";
      await dispatch(sendNotification({ ...form, token })).unwrap();
      setMessage("Notification sent successfully!");
      setForm({
        title: "",
        description: "",
        type: "",
        image: null,
        webPushLink: "",
      });
    } catch (err) {
      setMessage(error || "Failed to send notification.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Send Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Web Push Link</label>
          <input
            type="text"
            name="webPushLink"
            value={form.webPushLink}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-3 rounded ${success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
