import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById, updateCourse } from "../../store/slices/course";
import CategorySubcategoryDropdowns from "../../components/CategorySubcategoryDropdowns";
import { RootState, AppDispatch } from "../../store";
import { useLocation, useParams } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Users,
  Tag,
  Image,
  Video,
  Plus,
  X,
  Award,
  Download,
  MessageCircle,
  Lock,
  Upload,
  Eye,
  Loader2,
  AlertCircle,
  Type,
  Edit,
  Search,
  Check,
  Save,
  CheckCircle,
  Settings,
  Menu,
} from "lucide-react";
import ModuleSection from "./ModuleSection";
import Faqs from "./components/Faqs";
import QuillEditor from "../../components/QuillEditor";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

// Success Popup Component (unchanged)
const SuccessPopup = ({
  isVisible,
  onClose,
  message,
  type = "success",
}: {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error";
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {type === "success" ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {type === "success" ? "Success!" : "Error!"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              type === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// File Upload Component (unchanged)
type FileUploadProps = {
  label: string;
  accept: string;
  onFileChange: (file: File | null) => void;
  currentFile: File | null;
  icon: React.ElementType;
};

const FileUpload = ({
  label,
  accept,
  onFileChange,
  currentFile,
  icon: Icon,
}: FileUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30" : "border-gray-300 dark:border-gray-600"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="hidden"
          id={`file-${label}`}
        />
        <label htmlFor={`file-${label}`} className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drop file here or{" "}
            <span className="text-blue-600 hover:underline">browse</span>
          </p>
        </label>
        {currentFile && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
            {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  );
};

// YouTube URL Input Component (unchanged)
type YouTubeUrlInputProps = {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
};

const YouTubeUrlInput = ({
  label,
  value,
  onChange,
  error,
}: YouTubeUrlInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Video className="w-4 h-4 text-blue-600" />
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full border dark:text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-600"
        }`}
        placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=xyz)"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {typeof value === "string" && value && (
        <div className="mt-3">
          <iframe
            width="100%"
            height="200"
            src={value?.replace("watch?v=", "embed/")}
            title="YouTube video preview"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

const EditCourse = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // Fallback extraction from pathname
  const courseId = id || location.pathname.split("/").pop();
  const {
    loading,
    error,
    data: courseData,
  } = useSelector((state) => state.course);

  // Tab state
  const [activeTab, setActiveTab] = useState("basic");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

  // Course state (unchanged)
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [modules, setModules] = useState([]);
  const [popup, setPopup] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    seoMetaDescription: "",
    categoryId: "",
    subCategoryId: "",
    level: "beginner",
    price: "",
    currency: "INR",
    salePrice: "",
    duration: "",
    instructorId: "",
    isPublished: false,
    enrollmentType: "open",
    maxStudents: "",
    certificateTemplate: true,
    isDownloadable: true,
    courseForum: true,
    isSubscription: false,
    isPrivate: false,
    enableWaitlist: false,
    accessType: "lifetime",
    accessPeriod: "",
  });

  // Predefined tags (unchanged)
  const predefinedTags = [
    "Programming",
    "Design",
    "Business",
    "Marketing",
    "Data Science",
    "Mobile Development",
    "AI/ML",
    "Web Development",
  ];

  // Validation schema (unchanged)
  const validateForm = (
    formData,
    description,
    seoContent,
    selectedTags,
    files,
    demoVideoUrl
  ) => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Course title is required";
    } else if (formData.title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    } else if (isNaN(formData.price) || formData.price < 0) {
      errors.price- "Price must be a non-negative number";
    } else if (formData.price > 100000) {
      errors.price = "Price cannot exceed 100,000";
    }

    if (formData.seoMetaDescription.length > 160) {
      errors.seoMetaDescription =
        "Meta description must be less than 160 characters";
    }

    if (seoContent.length > 10000) {
      errors.seoContent = "SEO content must be less than 10,000 characters";
    }

    if (!files.thumbnailFile && !formData.thumbnail) {
      errors.thumbnailFile = "Thumbnail image is required";
    }

    if (
      demoVideoUrl &&
      !/^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(
        demoVideoUrl
      )
    ) {
      errors.demoVideoUrl = "Please enter a valid YouTube URL";
    }

    if (selectedTags.length === 0) {
      errors.tags = "At least one tag is required";
    } else if (selectedTags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }

    return errors;
  };

  // Fetch course data for editing (unchanged)
  useEffect(() => {
    if (courseId) {
      const token = localStorage.getItem("token") || "";
      dispatch(fetchCourseById({ courseId, token }));
    }
  }, [courseId, dispatch]);

  // Always process course data when it changes
  useEffect(() => {
    if (courseData) {
      const course = courseData.data || courseData;

      setFormData((prev) => ({
        ...prev,
        title: course.title || "",
        subtitle: course.subtitle || "",
        seoMetaDescription: course.seoMetaDescription || "",
        thumbnail: course.thumbnail || "",
        demoVideo: course.demoVideo || "",
        coverImage: course.coverImage || "",
        categoryId:
          course.categoryId ||
          course.category?._id ||
          course.categoryId?._id ||
          "",
        subCategoryId:
          course.subCategoryId ||
          course.subCategory?._id ||
          course.subCategoryId?._id ||
          "",
        level: course.level || "beginner",
        price:
          typeof course.price === "object" && course.price?.$numberDecimal
            ? course.price.$numberDecimal
            : course.price || "",
        salePrice:
          typeof course.salePrice === "object" && course.salePrice?.$numberDecimal
            ? course.salePrice.$numberDecimal
            : course.salePrice || "",
        currency: course.currency || "INR",
        duration: course.duration || "",
        instructorId: course.instructorId || course.instructor?._id || "",
        isPublished: course.isPublished || false,
        enrollmentType: course.enrollmentType || "open",
        maxStudents: course.maxStudents || "",
        certificateTemplate:
          course.certificateTemplate !== undefined
            ? course.certificateTemplate
            : true,
        isDownloadable:
          course.isDownloadable !== undefined ? course.isDownloadable : true,
        courseForum:
          course.courseForum !== undefined ? course.courseForum : true,
        isSubscription: course.isSubscription || false,
        isPrivate: course.isPrivate || false,
        enableWaitlist: course.enableWaitlist || false,
        accessType: course.accessType || "lifetime",
        accessPeriod: course.accessPeriod || "",
      }));

      setDescription(course.description || "");
      setSeoContent(course.seoContent || "");
      setSelectedTags(course.tags || []);
      setDemoVideoUrl(course.demoVideo || "");

      const courseModules = course.modules || [];
      // Map modules and lessons, including textLessons and files for each lesson
      const processedModules = courseModules.map((module) => ({
        _id: module._id || undefined,
        title: module.title || "",
        description: module.description || "",
        lessons: (module.lessons || []).map((lesson) => ({
          _id: lesson._id || undefined,
          title: lesson.title || "",
          type: lesson.type || "video",
          content: lesson.content || "",
          videoUrl: lesson.videoUrl || "",
          duration: lesson.duration || "",
          order: lesson.order || 0,
          // Add textLessons and files if present
          quiz: lesson.quiz || [ ],
          videoLessons: lesson.videoLessons || [],
          assignment: lesson?.assignment || [],
          textLessons: lesson.textLessons || [],
          files: lesson.files || [],
        })),
        order: module.order || 0,
      }));

      setModules(processedModules);
    }
  }, [courseData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addTag = (tag) => {
    if (selectedTags.length >= 5) {
      setPopup({
        isVisible: true,
        message: "Maximum 5 tags allowed",
        type: "error",
      });
      return;
    }
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleCategoryChange = (categoryId, categoryName) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
      subCategoryId: "",
    }));
    setFormErrors((prev) => ({ ...prev, categoryId: "", subCategoryId: "" }));
  };

  const handleSubcategoryChange = (subCategoryId, subCategoryName) => {
    setFormData((prev) => ({
      ...prev,
      subCategoryId,
    }));
    setFormErrors((prev) => ({ ...prev, subCategoryId: "" }));
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (selectedTags.length >= 5) {
      setPopup({
        isVisible: true,
        message: "Maximum 5 tags allowed",
        type: "error",
      });
      return;
    }
    if (
      customTag.trim() &&
      !selectedTags.includes(customTag.trim())
    ) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleModulesChange = (updatedModules: any) => {
    // Only update modules state, do not show popup here
    setModules(updatedModules);
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();

    const files = { thumbnailFile, coverImageFile };
    const errors = validateForm(
      formData,
      description,
      seoContent,
      selectedTags,
      files,
      demoVideoUrl
    );

    console?.log('Validation errors:', errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setPopup({
        isVisible: true,
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    const submitFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === "isPublished") {
        // Pass as boolean
        submitFormData.set("isPublished", (!isDraft && !!formData.isPublished).toString());
      } else if (Array.isArray(value)) {
        submitFormData.append(key, value.length > 0 ? String(value[0]) : "");
      } else {
        submitFormData.append(key, String(value));
      }
    });

    submitFormData.set("title", String(formData.title));
    submitFormData.set("subtitle", String(formData.subtitle));
    submitFormData.set(
      "seoMetaDescription",
      String(formData.seoMetaDescription)
    );

    submitFormData.set("description", description);
    submitFormData.set("seoContent", seoContent);
    submitFormData.set("tags", JSON.stringify(selectedTags));
    // isPublished already set above as boolean string
    submitFormData.set("level", formData.level || "beginner");
    submitFormData.set("demoVideo", demoVideoUrl);

    if (thumbnailFile) submitFormData.set("thumbnail", thumbnailFile);
    if (coverImageFile) submitFormData.set("coverImage", coverImageFile);

    try {
      await dispatch(
        updateCourse({ id: courseId, data: submitFormData })
      ).unwrap();
      // Refetch course data after update to get latest price/salePrice
      const token = localStorage.getItem("token") || "";
      dispatch(fetchCourseById({ courseId, token }));
      setPopup({
        isVisible: true,
        message: isDraft
          ? "Course saved as draft successfully!"
          : "Course updated successfully!",
        type: "success",
      });
    } catch (error) {
      setPopup({
        isVisible: true,
        message: error.message || "Failed to update course. Please try again.",
        type: "error",
      });
    }
  };

  const getUrlFromFile = (file) => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  if (loading && !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading course data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "basic", title: "Basic Information", icon: Type, isRequired: true },
    { key: "details", title: "Course Details", icon: FileText, isRequired: true },
    { key: "media", title: "Media Files", icon: Image, isRequired: true },
    { key: "pricing", title: "Pricing", icon: DollarSign, isRequired: true },
    { key: "features", title: "Course Features", icon: Award, isRequired: false },
    { key: "tags", title: "Tags", icon: Tag, isRequired: true },
    { key: "seo", title: "SEO Content", icon: Search, isRequired: false },
    { key: "modules", title: "Course Modules", icon: Settings, isRequired: false },
    { key: "faqs", title: "FAQs", icon: MessageCircle, isRequired: false },
    { key: "publication", title: "Publication Status", icon: Eye, isRequired: false },
  ];

  return (
    <>
      <SuccessPopup
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ ...popup, isVisible: false })}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:w-64`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Course Editor
            </h2>
            <button
              className="lg:hidden mt-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
                {tab.isRequired && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Mobile Sidebar Toggle */}
          <button
            className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Edit className="w-8 h-8 text-blue-600" />
              </div>
              Edit Course
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Update your course details below
            </p>
            {formData.title && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Currently editing: <strong>{formData.title}</strong>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, false)}>
            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.title
                            ? "border-red-400"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter course title"
                        required
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.title}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Course Subtitle
                      </label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 dark:text-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter course subtitle"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Course Description *
                    </label>
                    <QuillEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Describe your course in detail..."
                    />
                    {formErrors.description && (
                      <p className="mt-2 text-xs text-red-600">
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Details</h3>
                  <CategorySubcategoryDropdowns
                    selectedCategoryId={formData.categoryId}
                    selectedSubcategoryId={formData.subCategoryId}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={handleSubcategoryChange}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Level
                      </label>
                      <select
                        name="level"
                        value={typeof formData.level == "string" && formData.level ? formData.level : "beginner"}
                        onChange={handleInputChange}
                        className="w-full border dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Duration (mins) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className={`w-full border dark:text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 dark:border-gray-600`}
                        placeholder="Enter duration in minutes"
                        min={1}
                        step={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (value && value.includes(".")) {
                            e.currentTarget.value = value.split(".")[0];
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Access Type
                      </label>
                      <select
                        name="accessType"
                        value={formData.accessType}
                        onChange={handleInputChange}
                        className="w-full border dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="lifetime">Lifetime</option>
                        <option value="limited">Limited</option>
                      </select>
                    </div>
                    {(formData.accessType === "limited" ||
                      formData.accessType === "subscription") && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Access Period
                        </label>
                        <input
                          type="String"
                          name="accessPeriod"
                          value={formData.accessPeriod}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full border dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1 year, 3 month, 2 week etc"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "media" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Media Files</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUpload
                      label="Course Thumbnail *"
                      accept="image/*"
                      onFileChange={setThumbnailFile}
                      currentFile={thumbnailFile}
                      icon={Image}
                    />
                    <FileUpload
                      label="Cover Image"
                      accept="image/*"
                      onFileChange={setCoverImageFile}
                      currentFile={coverImageFile}
                      icon={Image}
                    />
                  </div>
                  {formErrors.thumbnailFile && (
                    <p className="text-xs text-red-600">
                      {formErrors.thumbnailFile}
                    </p>
                  )}
                  {(formData.thumbnail || formData.coverImage) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formData.thumbnail && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Current Thumbnail
                          </h4>
                          <img
                            src={`${baseUrl}/${formData.thumbnail}`}
                            alt="Current thumbnail"
                            className="w-full h-40 object-cover rounded-lg border dark:border-gray-600"
                          />
                        </div>
                      )}
                      {formData.coverImage && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Current Cover Image
                          </h4>
                          <img
                            src={`${baseUrl}/${formData.coverImage}`}
                            alt="Current cover"
                            className="w-full h-40 object-cover rounded-lg border dark:border-gray-600"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <YouTubeUrlInput
                    label="Demo Video (YouTube URL)"
                    value={demoVideoUrl}
                    onChange={(e) => {
                      setDemoVideoUrl(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        demoVideoUrl: "",
                      }));
                    }}
                    error={formErrors.demoVideoUrl}
                  />
                </div>
              )}

              {activeTab === "pricing" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            /^\d+(\.\d{0,2})?$/.test(value)
                          ) {
                            handleInputChange(e);
                          }
                        }}
                        className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.price ? "border-red-400" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter price"
                        required
                        step="0.01"
                        min="0"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {formErrors.price && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.price}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        sale Price
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "" ||
                            /^\d+(\.\d{0,2})?$/.test(value)
                          ) {
                            handleInputChange(e);
                          }
                        }}
                        className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.salePrice ? "border-red-400" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="Enter Sale price"
                        required
                        step="0.01"
                        min="0"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                      {formErrors.salePrice && (
                        <p className="mt-1 text-xs text-red-600">
                          {formErrors.salePrice}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full border dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option className="dark:text-black" value="INR">
                          INR (₹)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="certificateTemplate"
                        checked={formData.certificateTemplate}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Certificate Available
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isDownloadable"
                        checked={formData.isDownloadable}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <Download className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Downloadable Content
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="courseForum"
                        checked={formData.courseForum}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Course Forum
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPrivate"
                        checked={formData.isPrivate}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <Lock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Private Course
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="enableWaitlist"
                        checked={formData.enableWaitlist}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Enable Waitlist
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "tags" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Tags</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Course Tags *
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {predefinedTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => addTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-600"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        className="flex-1 border dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add custom tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomTag();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={addCustomTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {formErrors.tags && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.tags}
                      </p>
                    )}
                  </div>
                  {selectedTags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Selected Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">SEO Content</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      SEO Meta Description
                    </label>
                    <textarea
                      name="seoMetaDescription"
                      value={formData.seoMetaDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full border dark:text-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.seoMetaDescription
                          ? "border-red-400"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter meta description for search engines (max 160 characters)"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.seoMetaDescription.length}/160 characters
                    </p>
                    {formErrors.seoMetaDescription && (
                      <p className="mt-1 text-xs text-red-600">
                        {formErrors.seoMetaDescription}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      SEO Content
                    </label>
                    <QuillEditor
                      value={seoContent}
                      onChange={setSeoContent}
                      placeholder="Add SEO-friendly content for better search rankings..."
                    />
                    {formErrors.seoContent && (
                      <p className="mt-2 text-xs text-red-600">
                        {formErrors.seoContent}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "modules" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Modules</h3>
                  {console?.log("modules 0987",modules)}
                  <ModuleSection
                    modules={modules}
                    onModulesChange={handleModulesChange}
                    courseId={courseId}
                  />
                </div>
              )}

              {activeTab === "faqs" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">FAQs</h3>
                  <Faqs courseId={courseId} />
                </div>
              )}

              {activeTab === "publication" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Publication Status</h3>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                      Publication Status
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                      Choose whether to publish your course immediately or save as draft.
                    </p>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        // Only update local state, do NOT call handleSubmit here
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            isPublished: checked,
                          }));
                          setFormErrors((prev) => ({ ...prev, isPublished: "" }));
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                      />
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Publish Course
                      </span>
                    </label>
                  </div>
                  {formData.isPublished && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900 dark:text-green-300">
                          Ready to Publish
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Your course will be visible to students once published.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Update Course
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCourse;