import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateModule, getModuleById } from "../../store/slices/module";

const EditModulePopup = ({ module, courseId, onClose, onModuleUpdated }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        title: module.title || "",
        description: module.description || "",
        estimatedDuration: module.estimatedDuration ?? 60,
        isPublished: module.isPublished ?? false,
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Update form state when module prop changes (show initial values immediately)
    useEffect(() => {
        setForm({
            title: module.title || "",
            description: module.description || "",
            estimatedDuration: module.estimatedDuration ?? 60,
            isPublished: module.isPublished ?? false,
        });
    }, [module]);

    useEffect(() => {
        const fetchModule = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token") || "";
                const result = await dispatch(getModuleById({ moduleId: module._id, token })).unwrap();
                const data = result.data || result;
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    estimatedDuration: data.estimatedDuration ?? 60,
                    isPublished: data.isPublished ?? false,
                });
            } catch (e) {
                setError("Failed to fetch module details");
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
        // eslint-disable-next-line
    }, [module._id, dispatch]);

    const handleSave = async () => {
        if (!form.title.trim()) {
            setError("Module title is required");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const payload = {
                moduleId: module._id,
                courseId,
                title: form.title,
                description: form.description,
                order: module.order || 1,
                estimatedDuration: form.estimatedDuration,
                isPublished: form.isPublished,
            };
            await dispatch(updateModule(payload)).unwrap();
            if (onModuleUpdated) onModuleUpdated();
            onClose();
        } catch (e) {
            setError("Failed to update module");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-4">Edit Module</h3>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                rows={3}
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estimated Duration (minutes)</label>
                            <input
                                type="number"
                                value={form.estimatedDuration}
                                onChange={e => setForm({ ...form, estimatedDuration: parseInt(e.target.value) || 60 })}
                                className="w-full border rounded px-3 py-2"
                                min={1}
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Published</label>
                            <input
                                type="checkbox"
                                checked={form.isPublished}
                                onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                                disabled={saving}
                                className="mr-2"
                                id="isPublished"
                            />
                            <label htmlFor="isPublished" className="text-sm">
                                {form.isPublished ? "Yes" : "No"}
                            </label>
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                    </div>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                        disabled={saving || loading}
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModulePopup;



