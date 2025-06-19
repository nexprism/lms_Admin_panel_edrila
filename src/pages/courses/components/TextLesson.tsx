import React, { useState, useRef, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTextLesson,
  fetchTextLessonById,
  updateTextLesson,
} from "../../../store/slices/textLesson"; // Adjust import path as needed
import PopupAlert from "../../../components/popUpAlert";
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

const TextLessonEditor = ({
  section,
  lesson,
  onChange,
  courseId,
  lessonId,
  textLessonId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.textLesson);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const [formData, setFormData] = useState({
    language: "English",
    title: "",
    bookTitle: "",
    accessibility: "free",
    attachments: [],
    summary: "",
    content: "",
  });

  const [titleCharCount, setTitleCharCount] = useState(0);
  const [bookTitleCharCount, setBookTitleCharCount] = useState(0);
  const [archive, setArchive] = useState(true);
  const [dropContent, setDropContent] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const getData = async () => {
    try {
      if (textLessonId) {
        setIsEditMode(true);
        const response = await dispatch(
          fetchTextLessonById(textLessonId)
        ).unwrap();
        const data = response.data;
        setFormData({
          language: data.language,
          title: data.title,
          bookTitle: data.bookTitle,
          accessibility: data.accessibility,
          attachments: data.attachments,
          summary: data.summary,
        });

        editorRef.current.innerHTML = data.content || "";
        console.log("Fetched text lesson data:", response);
      }
    } catch (error) {
      console.error("Error fetching text lesson data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [textLessonId]);
  useEffect(() => {
    // Load Quill dynamically
    const loadQuill = async () => {
      if (typeof window !== "undefined" && !window.Quill) {
        // Load Quill CSS
        const link = document.createElement("link");
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        // Load Quill JS
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
        script.onload = initializeQuill;
        document.head.appendChild(script);
      } else if (window.Quill) {
        initializeQuill();
      }
    };

    const initializeQuill = () => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new window.Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Start writing your lesson content...",
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link", "image", "video"],
              ["blockquote", "code-block"],
              [{ script: "sub" }, { script: "super" }],
              ["clean"],
            ],
          },
        });

        quillRef.current.on("text-change", () => {
          const content = quillRef.current.root.innerHTML;
          setFormData((prev) => ({ ...prev, content }));
        });
      }
    };

    loadQuill();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Handle successful save
  useEffect(() => {
    if (data && !loading && !error) {
      setSaveSuccess(true);
    }
  }, [data, loading, error]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "title") {
      setTitleCharCount(value.length);
    } else if (field === "bookTitle") {
      setBookTitleCharCount(value.length);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      // Create FormData object for multipart/form-data
      const apiFormData = new FormData();

      // Append basic form fields

      apiFormData.append("language", formData.language);
      apiFormData.append("title", formData.title);
      apiFormData.append("subTitle", formData.bookTitle);
      apiFormData.append("accessibility", formData.accessibility);
      apiFormData.append("summary", formData.summary);
      apiFormData.append("content", formData.content);
      apiFormData.append("archive", archive.toString());
      apiFormData.append("dropContent", dropContent.toString());

      if (!isEditMode) {
        apiFormData.append("course", courseId);
        apiFormData.append("lessonId", lessonId);
      }
      // Append file attachments
      formData.attachments.forEach((file, index) => {
        if (file instanceof File) {
          apiFormData.append(`attachments[${index}]`, file);
        }
      });

      // Dispatch the async thunk
      if (isEditMode) {
        await dispatch(
          updateTextLesson({ lessonId: textLessonId, formData: apiFormData })
        ).unwrap();
      } else {
        await dispatch(createTextLesson(apiFormData)).unwrap();
      }
      // Show success popup

      onClose();
      setPopup({
        isVisible: true,
        message: "Text Lesson created successfully!",
        type: "success",
      });
    } catch (err) {
      setPopup({
        isVisible: true,
        message: "Failed to create Text Lesson. Please try again.",
        type: "error",
      });
      console.error("Failed to save lesson:", err);
    }
  };

  const handleCancel = () => {
    setFormData({
      language: "English",
      title: "",
      bookTitle: "",
      accessibility: "free",
      attachments: [],
      summary: "",
      content: "",
    });
    setTitleCharCount(0);
    setBookTitleCharCount(0);
    onClose();
    if (quillRef.current) {
      quillRef.current.setContents([]);
    }
  };

  return (
    <div className="min-h-fit bg-gray-50 py-8 px-4">
      <div className=" mx-auto bg-white  rounded-lg max-h-[60vh] overflow-scroll hide-scrollbar">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              Add new text lesson
            </h1>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Lesson saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="English">English</option>
              <option value="Spanish">Hindi</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Between 255 characters"
              maxLength={255}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {titleCharCount}/255
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Title
            </label>
            <input
              type="text"
              value={formData.bookTitle}
              onChange={(e) => handleInputChange("bookTitle", e.target.value)}
              placeholder="+"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Accessibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accessibility
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessibility"
                  value="free"
                  checked={formData.accessibility === "free"}
                  onChange={(e) =>
                    handleInputChange("accessibility", e.target.value)
                  }
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Free</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessibility"
                  value="paid"
                  checked={formData.accessibility === "paid"}
                  onChange={(e) =>
                    handleInputChange("accessibility", e.target.value)
                  }
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Paid</span>
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-sm">
                  Choose related files or lesson attachments.
                </span>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <a
                      href={`${baseUrl}/uploads/${file.name}` || file.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <span className="text-sm text-gray-700">
                        {file.name || file.fileName}
                      </span>
                    </a>
                    <button
                      onClick={() => removeAttachment(index)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              rows={4}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100"
              placeholder="Write a brief summary of the lesson..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div
              className={`border border-gray-300 rounded-md overflow-hidden ${
                loading ? "opacity-50" : ""
              }`}
            >
              <div ref={editorRef} style={{ minHeight: "300px" }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={archive}
                  onChange={(e) => setArchive(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dropContent}
                  onChange={(e) => setDropContent(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Drip content</span>
              </label>
            </div>

            <div className="flex gap-3">
              <div
                onClick={handleCancel}
                disabled={loading}
                className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </div>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PopupAlert
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ ...popup, isVisible: false })}
      />
    </div>
  );
};

export default TextLessonEditor;
