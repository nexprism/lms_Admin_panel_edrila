import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  FileText,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  createAssignment,
  updateAssignment,
  fetchAssignmentById,
} from "../../../store/slices/assignment";
import PopupAlert from "../../../components/popUpAlert";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

interface AddAssignmentFormProps {
  courseId: string;
  lessonId: string;
  assignmentId?: string; // If provided, edit mode
  onClose?: () => void;
  onSaveSuccess?: (data: any) => void;
}

export default function AddAssignmentForm({
  courseId,
  lessonId,
  assignmentId,
  onClose,
  onSaveSuccess,
}: AddAssignmentFormProps) {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state: any) => state.assignment
  );
  console.log("assignmentId", assignmentId);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    language: "English",
    description: "",
    score: "",
    maxScore: "",
    duration: "",
    maxAttempts: "",
    materials: "",
    file: null as File | null,
    document: null as File | null,
  });

  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch assignment if editing
  const getData = async () => {
    const response = await dispatch(fetchAssignmentById(assignmentId) as any);
    console.log("Fetched assignment data: -------------", response);

    const data = response.payload.data;
    setFormData({
      title: data.title || "",
      subject: data.subject || "",
      language: data.language || "English",
      description: data.description || "",
      score: data.score?.toString() || "",
      maxScore: data.maxScore?.toString() || "",
      duration: data.duration?.toString() || "",
      materials: data.materials || "",
      file: data.attachmentFile || null,
      maxAttempts: data.maxAttempts || "",
      document: data.documentFile || null,
    });
  };
  useEffect(() => {
    if (assignmentId) {
      setIsEditMode(true);
      console.log(`Fetching assignment with ID: ${assignmentId}`);
      getData();
    } else {
      setIsEditMode(false);
    }
  }, [assignmentId, dispatch]);

  // Prefill form in edit mode
  useEffect(() => {
    if (isEditMode && data && Array.isArray(data)) {
      const assignment = data.find((a: any) => a._id === assignmentId);
      console.log("Fetched assignment data:", assignment);
      if (assignment) {
        setFormData({
          title: assignment.title || "",
          subject: assignment.subject || "",
          language: assignment.language || "English",
          description: assignment.description || "",
          score: assignment.score?.toString() || "",
          maxScore: assignment.maxScore?.toString() || "",
          duration: assignment.duration?.toString() || "",
          materials: assignment.materials || "",
          maxAttempts: assignment.maxAttempts || "",
          file: null,
          document: null,
        });
      }
    }
  }, [isEditMode, data, assignmentId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "document"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const removeFile = (type: "file" | "document") => {
    setFormData((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiFormData = new FormData();
    apiFormData.append("courseId", courseId);
    apiFormData.append("lessonId", lessonId);
    apiFormData.append("title", formData.title);
    apiFormData.append("subject", formData.subject);
    apiFormData.append("language", formData.language);
    apiFormData.append("description", formData.description);
    apiFormData.append(
      "maxAttempts",
      formData.maxAttempts || "1"
    );
    if (formData.score) apiFormData.append("score", formData.score);
    if (formData.maxScore) apiFormData.append("maxScore", formData.maxScore);
    if (formData.duration) apiFormData.append("duration", formData.duration);
    if (formData.materials) apiFormData.append("materials", formData.materials);
    if (formData.file) apiFormData.append("attachmentFile", formData.file);
    if (formData.document)
      apiFormData.append("documentFile", formData.document);

    try {
      let result;
      if (isEditMode && assignmentId) {
        result = await dispatch(
          updateAssignment({ id: assignmentId, formData: apiFormData }) as any
        );
      } else {
        result = await dispatch(createAssignment(apiFormData) as any);
      }
      if (
        (isEditMode && updateAssignment.fulfilled.match(result)) ||
        (!isEditMode && createAssignment.fulfilled.match(result))
      ) {
        
        setPopup({
          isVisible: true,
          message: `Assignment ${
            isEditMode ? "updated" : "created"
          } successfully!`,
          type: "success",
        });
        setFormData({
          title: "",
          subject: "",
          language: "English",
          description: "",
          score: "",
          maxScore: "",
          duration: "",
          materials: "",
          file: null,
          document: null,
        });
        if (onSaveSuccess) onSaveSuccess(result.payload);
        setTimeout(() => {
          setPopup({ isVisible: false, message: "", type: "" });
          if (onClose) onClose();
        }, 1500);
      }
    } catch (err) {
      setPopup({
        isVisible: true,
        message: `Failed to ${
          isEditMode ? "update" : "create"
        } Assignment. Please try again.`,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-fit overflow-scroll bg-gray-50 p-4 hide-scrollbar">
      <div className="max-w-full max-h-[60vh] overflow-scroll mx-auto hide-scrollbar">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600  to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Assignments</h1>
              <p className="text-blue-100">
                {isEditMode ? "Edit Assignment" : "Add New Assignment"}
              </p>
            </div>
          </div>
        </div>
        {/* Form */}
        <form
          className="bg-white rounded-b-lg shadow-lg p-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            {/* Assignment Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter assignment title"
                required
                disabled={loading}
              />
            </div>

            {/* Subject and Language Row */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject*
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Art">Art</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div> */}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="A homework is to be completed on your course of CSS and research yourself that you've got this! Please send your homework as soon as possible. Regards."
                required
                disabled={loading}
              />
            </div>

            {/* Score and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="100"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pass Marks
                </label>
                <input
                  type="number"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="250"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="60"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Number of Attempts
              </label>
              <input
                type="number"
                name="maxAttempts"
                value={formData.maxAttempts || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. 3"
                min={1}
                disabled={loading}
              />
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Maximum 255 characters"
                maxLength={255}
                disabled={loading}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {formData.file ? (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <a
                        href={`${baseUrl}/${formData.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formData.file.name || formData.file}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeFile("file")}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Choose an attachment
                      </p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "file")}
                        className="hidden"
                        id="file-upload"
                        disabled={loading}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  {formData.document ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <a
                        href={`${baseUrl}/${formData.document}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {formData.document.name || formData.document}
                          </span>
                        </div>
                      </a>

                      <button
                        type="button"
                        onClick={() => removeFile("document")}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload document
                      </p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "document")}
                        className="hidden"
                        id="document-upload"
                        accept=".pdf,.doc,.docx,.txt"
                        disabled={loading}
                      />
                      <label
                        htmlFor="document-upload"
                        className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Browse Documents
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Assignment"
                : "Save Assignment"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="ml-4 px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <PopupAlert
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ ...popup, isVisible: false })}
      />
    </div>
  );
}
