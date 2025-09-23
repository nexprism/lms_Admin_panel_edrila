import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  FileText,
  DollarSign,
  Users,
  Clock,
  Tag,
  Image,
  Video,
  Plus,
  X,
  Award,
  Download,
  MessageCircle,
  Lock,
  Calendar,
  Upload,
  Menu,
  Save,
  Loader2,
  AlertCircle,
  Type,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BookOpenCheck,
  PlayCircle,
  FileEdit,
  Layers,
} from "lucide-react";
import { createCourse } from "../../store/slices/course";
import CategorySubcategoryDropdowns from "../../components/CategorySubcategoryDropdowns";
import PopupAlert from "../../components/popUpAlert";
import QuillEditor from "../../components/QuillEditor";
import { useNavigate } from "react-router-dom";

// Validation schema
type FormErrors = {
  title?: string;
  description?: string;
  categoryId?: string;
  subCategoryId?: string;
  duration?: string;
  price?: string;
  seoMetaDescription?: string;
  seoContent?: string;
  tags?: string;
  thumbnailFile?: string;
  demoVideoUrl?: string;
  salePrice?: any;
};

const validateForm = (
  formData: any,
  description: string,
  seoContent: string,
  selectedTags: string[],
  files: { thumbnailFile: File | null; coverImageFile: File | null },
  demoVideoUrl: string
): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = "Course title is required";
  } else if (formData.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  // if (formData.price) {
  //   if (isNaN(formData.price) || formData.price < 0) {
  //     errors.price = "Price must be a non-negative number";
  //   } else if (formData.price > 100000) {
  //     errors.price = "Price cannot exceed 100,000";
  //   }
  // } else {
  //   errors.price = "Price is required";
  // }

  // Validate salePrice only if it's provided
  // if (formData.salePrice && formData.salePrice.trim() !== "") {
  //   if (isNaN(formData.salePrice) || formData.salePrice < 0) {
  //     errors.salePrice = "Sale price must be a non-negative number";
  //   } else if (formData.salePrice > 100000) {
  //     errors.salePrice = "Sale price cannot exceed 100,000";
  //   }
  // }

  if (formData.seoMetaDescription.length > 160) {
    errors.seoMetaDescription =
      "Meta description must be less than 160 characters";
  }

  if (seoContent.length > 10000) {
    errors.seoContent = "SEO content must be less than 10,000 characters";
  }

  if (selectedTags.length === 0) {
    errors.tags = "At least one tag is required";
  } else if (selectedTags.length > 5) {
    errors.tags = "Maximum 5 tags allowed";
  }

  if (!files.thumbnailFile) {
    errors.thumbnailFile = "Thumbnail image is required";
  }

  if (
    demoVideoUrl &&
    !/^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(demoVideoUrl)
  ) {
    errors.demoVideoUrl = "Please enter a valid YouTube URL";
  }

  return errors;
};

// Success Popup Component
const SuccessPopup = ({ isVisible, onClose, onAddContent, courseId }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleAddContent = () => {
    if (courseId) {
      navigate(`/courses/edit/${courseId}`);
    } else if (onAddContent) {
      onAddContent();
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-h-[90vh] max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 transform rotate-12 scale-150"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Course Created Successfully! 🎉
            </h2>
            <p className="text-emerald-100 text-lg">
              Your course has been created and is ready for content
            </p>
          </div>
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-white opacity-30" />
          <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-white opacity-30" />
        </div>
        <div className="p-8 mb-96 overflow-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold dark:text-gray-100 mb-2">
              What's Next?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Add modules and lessons to make your course complete
            </p>
          </div>
          <div className="space-y-4 mb-8 max-h-[200px] overflow-scroll">
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-gray-100">
                  Create Modules
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Organize your course into logical sections
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <FileEdit className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-gray-100">
                  Add Lessons
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create engaging lessons with videos and content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-gray-100">
                  Upload Videos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Add video content to your lessons
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 fixed w-full pt-10 bottom-4 px-8 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            Close
          </button>
          <button
            onClick={handleAddContent}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            Add Content
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// File Upload Component
const FileUpload = ({
  label,
  accept,
  onFileChange,
  currentFile,
  icon: Icon,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file) => {
    if (!file) return "";
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      return "Please upload a valid image file";
    }
    return "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileError = validateFile(files[0]);
      if (fileError) {
        setError(fileError);
      } else {
        setError("");
        onFileChange(files[0]);
      }
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
    } else {
      setError("");
      onFileChange(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
          dragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
        } ${error ? "border-red-400" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          id={`file-${label}`}
        />
        <label htmlFor={`file-${label}`} className="cursor-pointer">
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drop file here or{" "}
            <span className="text-blue-600 hover:underline">browse</span>
          </p>
        </label>
        {currentFile && (
          <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-300">
            {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};

// YouTube URL Input Component
const YouTubeUrlInput = ({ label, value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full border rounded-xl px-4 py-3 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
          error ? "border-red-400" : "border-gray-200 dark:border-gray-600"
        }`}
        placeholder="Enter demo video YouTube URL"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {value && (
        <div className="mt-3">
          <iframe
            width="100%"
            height="200"
            src={value.replace("watch?v=", "embed/")}
            title="YouTube video preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

const AddCourse = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector((state) => state.course);
  const navigate = useNavigate();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [successPopup, setSuccessPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    certificateTemplate: false,
    isDownloadable: false,
    courseForum: false,
    isSubscription: false,
    isPrivate: false,
    enableWaitlist: false
    
  });

  // Plans state
  const [plans, setPlans] = useState<
    { name: string; price: string; description: string; durationType: string; duration: string; salePrice: string }[]
  >([]);

  // Plan form state
  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    description: "",
    durationType: "Month",
    duration: "",
    salePrice: "",
  });

  // Plan form errors
  const [planFormError, setPlanFormError] = useState("");

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

  const getUrlFromFile = (file) => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
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

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
      subCategoryId: "",
    }));
    setFormErrors((prev) => ({ ...prev, categoryId: "", subCategoryId: "" }));
  };

  const handleSubcategoryChange = (subCategoryId) => {
    setFormData((prev) => ({
      ...prev,
      subCategoryId,
    }));
    setFormErrors((prev) => ({ ...prev, subCategoryId: "" }));
  };

  // Add plan to plans array
  const handleAddPlan = () => {
    if (!planForm.name.trim() || !planForm.price.trim() || !planForm.durationType || !planForm.duration.trim()) {
      setPlanFormError("Name, price, duration type, and duration are required");
      return;
    }
    setPlans([...plans, { ...planForm }]);
    setPlanForm({ name: "", price: "", description: "", durationType: "Month", duration: "", salePrice: "" });
    setPlanFormError("");
  };

  // Remove plan
  const handleRemovePlan = (idx: number) => {
    setPlans(plans.filter((_, i) => i !== idx));
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

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log(errors);
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
      if (key === 'salePrice' && (!value || value === '')) {
        return;
      }
      submitFormData.append(key, String(value));
    });
    submitFormData.append("description", description);
    submitFormData.append("seoContent", seoContent);
    submitFormData.append("tags", JSON.stringify(selectedTags));
    submitFormData.append("isPublished", (!isDraft).toString());
    submitFormData.append("demoVideo", demoVideoUrl);

    if (thumbnailFile) submitFormData.append("thumbnail", thumbnailFile);
    if (coverImageFile) submitFormData.append("coverImage", coverImageFile);

    // --- FLATTEN PLANS IN PAYLOAD WITHOUT QUOTES ---
    plans.forEach((plan, idx) => {
      Object.entries(plan).forEach(([key, value]) => {
        // Use bracket notation, not quotes
        submitFormData.append(`plans[${idx}][${key}]`, value);
      });
    });
    // --- END FLATTEN PLANS ---

    try {
      await dispatch(createCourse(submitFormData) as any).unwrap();

      if (!isDraft) {
        setSuccessPopup(true);
      } else {
        setPopup({
          isVisible: true,
          message: "Course saved as draft!",
          type: "success",
        });
      }

      setFormData({
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
        certificateTemplate: false,
        isDownloadable: false,
        courseForum: false,
        isSubscription: false,
        isPrivate: false,
        enableWaitlist: false
       
      });
      setDescription("");
      setSeoContent("");
      setSelectedTags([]);
      setThumbnailFile(null);
      setCoverImageFile(null);
      setDemoVideoUrl("");
    } catch (error: any) {
      // Extract the actual error message from the server response
      let errorMessage = "Failed to create course. Please try again.";

      // Show backend error for max tags
      if (
        error &&
        (error.message === "Maximum 5 tags allowed" ||
          error.err === "Maximum 5 tags allowed" ||
          (error.data && error.data.message === "Maximum 5 tags allowed"))
      ) {
        errorMessage = "Maximum 5 tags allowed";
      } else if (error) {
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.err) {
          errorMessage = error.err;
        } else if (error.data && error.data.message) {
          errorMessage = error.data.message;
        }
      }

      setPopup({
        isVisible: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  const handleAddContent = () => {
    setSuccessPopup(false);
    if (data && data?.data?.course?._id) {
      navigate(`/courses/edit/${data?.data?.course?._id}`);
    }
  };

  const tabs = [
    { key: "basic", title: "Basic Information", icon: Type, isRequired: true },
    { key: "details", title: "Course Details", icon: FileText, isRequired: true },
    { key: "media", title: "Media Files", icon: Image, isRequired: true },
    { key: "pricing", title: "Pricing", icon: DollarSign, isRequired: true },
    { key: "tags", title: "Tags", icon: Tag, isRequired: true },
    { key: "settings", title: "Advanced Settings", icon: Users, isRequired: false },
    { key: "seo", title: "SEO Settings", icon: Target, isRequired: false },
  ];

  // Check if a section is complete (for sidebar indicators)
  const isSectionComplete = (tabKey) => {
    switch (tabKey) {
      case "basic":
        return formData.title.trim() && description.trim();
      case "details":
        return formData.categoryId && formData.subCategoryId && formData.duration;
      case "media":
        return thumbnailFile !== null;
      case "tags":
        return selectedTags.length > 0;
      default:
        return true; // Non-required sections are always "complete"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <SuccessPopup
        isVisible={successPopup}
        onClose={() => setSuccessPopup(false)}
        onAddContent={handleAddContent}
        courseId={data?.data?.course?._id}
      />
      <PopupAlert
        isVisible={popup.isVisible}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ isVisible: false, message: "", type: "" })}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Create Course
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
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
                {tab.isRequired && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </div>
              {isSectionComplete(tab.key) ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                tab.isRequired && (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )
              )}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-4 lg:p-8">
        <button
          className="lg:hidden mb-4 p-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-100">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            Create New Course
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Build an engaging course by filling in the details below
          </p>
        </div>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Basic Information
                </h3>
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
                      <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
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
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    height="300px"
                    toolbar="full"
                  />
                  {formErrors.description && (
                    <p className="mt-2 text-xs text-red-600">{formErrors.description}</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "details" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Course Details
                </h3>
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
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option className="dark:text-black" value="beginner">
                        Beginner
                      </option>
                      <option className="dark:text-black" value="intermediate">
                        Intermediate
                      </option>
                      <option className="dark:text-black" value="advanced">
                        Advanced
                      </option>
                      
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
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      step="1"
                      min="1"
                      className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300 dark:border-gray-600`}
                      placeholder="Course duration"
                      required
                    />
                  </div>
                </div>
               
              </div>
            )}
            {activeTab === "media" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Media Files
                </h3>
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
                  <p className="mt-2 text-xs text-red-600">{formErrors.thumbnailFile}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {thumbnailFile && (
                    <div className="relative">
                      <button
                        onClick={() => setThumbnailFile(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        className="h-48 w-full object-cover rounded-lg"
                        src={getUrlFromFile(thumbnailFile)}
                        alt="Thumbnail Preview"
                      />
                    </div>
                  )}
                  {coverImageFile && (
                    <div className="relative">
                      <button
                        onClick={() => setCoverImageFile(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        className="h-48 w-full object-cover rounded-lg"
                        src={getUrlFromFile(coverImageFile)}
                        alt="Cover Image Preview"
                      />
                    </div>
                  )}
                </div>
                <YouTubeUrlInput
                  label="Demo Video URL"
                  value={demoVideoUrl}
                  onChange={(e) => {
                    setDemoVideoUrl(e.target.value);
                    setFormErrors((prev) => ({ ...prev, demoVideoUrl: "" }));
                  }}
                  error={formErrors.demoVideoUrl}
                />
              </div>
            )}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pricing
                </h3>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
                      step="0.01"
                      min="0"
                      className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.price
                          ? "border-red-400"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Course price"
                      required
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
                    )}
                  </div>
                  <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                     Sale Price 
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
                     step="0.01"
                     min="0"
                     className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                       formErrors.salePrice
                         ? "border-red-400"
                         : "border-gray-300 dark:border-gray-600"
                     }`}
                     placeholder="Course sale price"
                   />
                   {formErrors.salePrice && (
                     <p className="mt-1 text-xs text-red-600">{formErrors.salePrice}</p>
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
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option className="dark:text-black" value="INR">
                        INR (₹)
                      </option>
                      <option className="dark:text-black" value="USD">
                        USD ($)
                      </option>
                      <option className="dark:text-black" value="EUR">
                        EUR (€)
                      </option>
                      <option className="dark:text-black" value="GBP">
                        GBP (£)
                      </option>
                    </select>
                  </div>
                </div> */}
                {/* --- Plans Section --- */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Course Plans
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-2">
                    <input
                      type="text"
                      placeholder="Plan Name"
                      value={planForm.name}
                      onChange={e => setPlanForm({ ...planForm, name: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={planForm.price}
                      onChange={e => setPlanForm({ ...planForm, price: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={planForm.description}
                      onChange={e => setPlanForm({ ...planForm, description: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    />
                    <select
                      value={planForm.durationType}
                      onChange={e => setPlanForm({ ...planForm, durationType: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    >
                      <option value="Month">Month</option>
                      <option value="Year">Year</option>
                      <option value="Day">Day</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Duration"
                      value={planForm.duration}
                      onChange={e => setPlanForm({ ...planForm, duration: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Sale Price"
                      value={planForm.salePrice}
                      onChange={e => setPlanForm({ ...planForm, salePrice: e.target.value })}
                      className="border rounded px-2 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPlan}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Add Plan
                  </button>
                  {planFormError && (
                    <div className="text-xs text-red-600 mt-1">{planFormError}</div>
                  )}
                  {plans.length > 0 && (
                    <div className="mt-4">
                      <table className="w-full text-sm border">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="p-2">Name</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Duration Type</th>
                            <th className="p-2">Duration</th>
                            <th className="p-2">Sale Price</th>
                            <th className="p-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {plans.map((plan, idx) => (
                            <tr key={idx}>
                              <td className="p-2">{plan.name}</td>
                              <td className="p-2">{plan.price}</td>
                              <td className="p-2">{plan.description}</td>
                              <td className="p-2">{plan.durationType}</td>
                              <td className="p-2">{plan.duration}</td>
                              <td className="p-2">{plan.salePrice}</td>
                              <td className="p-2">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlan(idx)}
                                  className="text-red-500 hover:underline"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {/* --- End Plans Section --- */}
              </div>
            )}
            {activeTab === "tags" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Tags
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Select Tags *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {predefinedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
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
                      onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                      placeholder="Add custom tag"
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <p className="mt-1 text-xs text-red-600">{formErrors.tags}</p>
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
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Advanced Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="certificateTemplate"
                      checked={formData.certificateTemplate}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      Certificate Template
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDownloadable"
                      checked={formData.isDownloadable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600" />
                      Downloadable Content
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="courseForum"
                      checked={formData.courseForum}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      Course Forum
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isSubscription"
                      checked={formData.isSubscription}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Subscription Based
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Private Course
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="enableWaitlist"
                      checked={formData.enableWaitlist}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Enable Waitlist
                    </span>
                  </label>
                </div>
              </div>
            )}
            {activeTab === "seo" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  SEO Settings
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    SEO Meta Description
                  </label>
                  <textarea
                    name="seoMetaDescription"
                    value={formData.seoMetaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full border rounded-lg px-4 py-3 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.seoMetaDescription
                        ? "border-red-400"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Brief description for search engines (max 160 characters)"
                    maxLength={160}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {formErrors.seoMetaDescription && (
                      <p className="text-xs text-red-600">{formErrors.seoMetaDescription}</p>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                      {formData.seoMetaDescription.length}/160
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    SEO Content
                  </label>
                  <QuillEditor
                    value={seoContent}
                    onChange={setSeoContent}
                    placeholder="Additional SEO content for better search visibility..."
                    height="200px"
                    toolbar="minimal"
                  />
                  {formErrors.seoContent && (
                    <p className="mt-2 text-xs text-red-600">{formErrors.seoContent}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Before You Create
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Please ensure all required fields are completed in the following sections:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2">
                <li>Basic Information (Title, Description)</li>
                <li>Course Details (Category, Subcategory, Duration)</li>
                <li>Media Files (Thumbnail)</li>
                <li>Pricing (Price)</li>
                <li>Tags (At least one tag)</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpenCheck className="w-4 h-4" />
                    Create Course
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;