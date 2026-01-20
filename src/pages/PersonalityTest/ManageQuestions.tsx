import React, { useState, useEffect, useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../services/axiosConfig";
import { Plus, Trash, Save, List, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";

const ManageQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        dimension: "IE",
        agreeType: "E",
        disagreeType: "I",
        weight: 1
    });

    const questionInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/personality/questions");
            setQuestions(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosInstance.put(`/personality/questions/${editingId}`, newQuestion);
                toast.success("Question updated successfully!");
                setEditingId(null);
            } else {
                await axiosInstance.post("/personality/questions", { questions: [newQuestion] });
                toast.success("Question created successfully!");
            }

            setNewQuestion({
                question: "",
                dimension: "IE",
                agreeType: "E",
                disagreeType: "I",
                weight: 1
            });
            fetchQuestions();
        } catch (error: any) {
            console.error("Error saving question:", error);
            toast.error(error.response?.data?.message || "Error saving question");
        }
    };

    const handleEdit = (q: any) => {
        setEditingId(q._id);
        // Safety check for dimension uppercase and existence in types mapping
        const dimension = q.dimension?.toUpperCase() || "IE";
        const currentTypes = types[dimension] || ["I", "E"];

        setNewQuestion({
            question: q.question || "",
            dimension: dimension,
            agreeType: q.agreeType || currentTypes[1],
            disagreeType: q.disagreeType || currentTypes[0],
            weight: q.weight || 1
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => questionInputRef.current?.focus(), 100);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await axiosInstance.delete(`/personality/questions/${id}`);
            toast.success("Question deleted successfully!");
            fetchQuestions();
        } catch (error: any) {
            console.error("Error deleting question:", error);
            toast.error(error.response?.data?.message || "Error deleting question");
        }
    };

    const dimensions = ["IE", "SN", "TF", "JP"];
    const types: Record<string, string[]> = {
        IE: ["I", "E"],
        SN: ["S", "N"],
        TF: ["T", "F"],
        JP: ["J", "P"]
    };

    const handleDimensionChange = (dimension: string) => {
        const [disagreeType, agreeType] = types[dimension];
        setNewQuestion({ ...newQuestion, dimension, agreeType, disagreeType });
    };

    return (
        <>
            <PageMeta title="Manage Personality Questions | LMS Admin" description="Create and manage personality test questions" />
            <PageBreadcrumb pageTitle="Personality Test" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Create/Edit Question Form */}
                <div className={`p-6 rounded-xl shadow mb-8 transition-colors duration-300 ${editingId ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            {editingId ? <Pencil className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5" />}
                            {editingId ? 'Edit Question' : 'Add New Question'}
                        </h2>
                        {editingId && (
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setNewQuestion({ question: "", dimension: "IE", agreeType: "E", disagreeType: "I", weight: 1 });
                                }}
                                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-4 h-4" /> Cancel Edit
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Text</label>
                            <input
                                ref={questionInputRef}
                                type="text"
                                value={newQuestion.question}
                                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g., You enjoy vibrant social events..."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dimension</label>
                                <select
                                    value={newQuestion.dimension}
                                    onChange={(e) => handleDimensionChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {dimensions.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agree Type</label>
                                <select
                                    value={newQuestion.agreeType}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, agreeType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {(types[newQuestion.dimension] || ["I", "E"]).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disagree Type</label>
                                <select
                                    value={newQuestion.disagreeType}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, disagreeType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {(types[newQuestion.dimension] || ["I", "E"]).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight</label>
                                <input
                                    type="number"
                                    value={newQuestion.weight}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, weight: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    min="1"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                        >
                            {editingId ? <Pencil className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {editingId ? 'Update Question' : 'Save Question'}
                        </button>
                    </form>
                </div>

                {/* Questions List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <List className="w-5 h-5" /> Existing Questions
                        </h2>
                        <span className="text-sm text-gray-500">{questions.length} questions found</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700 uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Question</th>
                                    <th className="px-6 py-4">Dim</th>
                                    <th className="px-6 py-4">Agree</th>
                                    <th className="px-6 py-4">Disagree</th>
                                    <th className="px-6 py-4">Weight</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Loading questions...</td>
                                    </tr>
                                ) : questions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No questions found. Add your first one above!</td>
                                    </tr>
                                ) : (
                                    questions.map((q) => (
                                        <tr key={q._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{q.question}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400">{q.dimension}</td>
                                            <td className="px-6 py-4 text-sm font-mono">{q.agreeType}</td>
                                            <td className="px-6 py-4 text-sm font-mono">{q.disagreeType}</td>
                                            <td className="px-6 py-4 text-sm">{q.weight}</td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(q)}
                                                    className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                                                    title="Edit Question"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q._id)}
                                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                    title="Delete Question"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageQuestions;
