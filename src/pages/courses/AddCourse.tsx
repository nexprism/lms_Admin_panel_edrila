import React, { useState, useRef, useEffect } from "react";
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

  if (!description.trim()) {
    errors.description = "Course description is required";
  } else if (description.length > 5000) {
    errors.description = "Description must be less than 5000 characters";
  }

  if (!formData.categoryId) {
    errors.categoryId = "Category is required";
  }

  if (!formData.subCategoryId) {
    errors.subCategoryId = "Subcategory is required";
  }

  if (!formData.duration) {
    errors.duration = "Duration is required";
  } else if (isNaN(formData.duration) || formData.duration <= 0) {
    errors.duration = "Duration must be a positive number";
  } else if (formData.duration > 100000) {
    errors.duration = "Duration cannot exceed 100000 hours";
  }

  if (!formData.price) {
    errors.price = "Price is required";
  } else if (isNaN(formData.price) || formData.price < 0) {
    errors.price = "Price must be a non-negative number";
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

  if (selectedTags.length === 0) {
    errors.tags = "At least one tag is required";
  } else if (selectedTags.length > 10) {
    errors.tags = "Cannot add more than 10 tags";
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
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header with gradient */}
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

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold dark:text-white/90 mb-2">
              What's Next?
            </h3>
            <p className="text-gray-600">
              Add modules and lessons to make your course complete
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-white/90">
                  Create Modules
                </h4>
                <p className="text-sm text-gray-600">
                  Organize your course into logical sections
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileEdit className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-white/90">
                  Add Lessons
                </h4>
                <p className="text-sm text-gray-600">
                  Create engaging lessons with videos and content
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold dark:text-white/90">
                  Upload Videos
                </h4>
                <p className="text-sm text-gray-600">
                  Add video content to your lessons
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
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
      <label className="block text-sm font-semibold dark:text-white/90 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
          dragOver
            ? "border-blue-400 bg-blue-50 "
            : "border-gray-200 bg-white dark:bg-white/[0.03]"
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
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drop file here or{" "}
            <span className="text-blue-600 hover:underline">browse</span>
          </p>
        </label>
        {currentFile && (
          <div className="mt-3 p-2 bg-gray-100 rounded-lg text-xs text-gray-700">
            {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)}{" "}
            MB)
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
      <label className="block text-sm font-semibold dark:text-white/90  flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full border rounded-xl px-4 py-3 dark:text-white/90 dark:placeholder:text-white/60 text-black placeholder:text-black/80  focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
          error ? "border-red-400" : "border-gray-200"
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

  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoContent, setSeoContent] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [successPopup, setSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    seoMetaDescription: "",
    categoryId: "",
    subCategoryId: "",
    level: "beginner",
    price: "",
    currency: "INR",
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
    enableWaitlist: false,
    accessType: "lifetime", // added
    accessPeriod: "",       // added
  });

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
    if (!selectedTags.includes(tag) && selectedTags.length < 10) {
      setSelectedTags([...selectedTags, tag]);
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (
      customTag.trim() &&
      !selectedTags.includes(customTag.trim()) &&
      selectedTags.length < 10
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
      setPopup({
        isVisible: true,
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    const submitFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitFormData.append(key, String(formData[key]));
    });
    submitFormData.append("description", description);
    submitFormData.append("seoContent", seoContent);
    submitFormData.append("tags", JSON.stringify(selectedTags));
    submitFormData.append("isPublished", (!isDraft).toString());
    submitFormData.append("demoVideo", demoVideoUrl);

    if (thumbnailFile) submitFormData.append("thumbnail", thumbnailFile);
    if (coverImageFile) submitFormData.append("coverImage", coverImageFile);

    try {
      await dispatch(createCourse(submitFormData)).unwrap();

      if (!isDraft) {
        setSuccessPopup(true);
      } else {
        setPopup({
          isVisible: true,
          message: "Course saved as draft!",
          type: "success",
        });
      }

      // Reset form
      setFormData({
        title: "",
        subtitle: "",
        seoMetaDescription: "",
        categoryId: "",
        subCategoryId: "",
        level: "beginner",
        price: "",
        currency: "INR",
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
        enableWaitlist: false,
        accessType: "lifetime",
        accessPeriod: "",
      });
      setDescription("");
      setSeoContent("");
      setSelectedTags([]);
      setThumbnailFile(null);
      setCoverImageFile(null);
      setDemoVideoUrl("");
    } catch (error) {
      setPopup({
        isVisible: true,
        message: error.message || "Failed to create course. Please try again.",
        type: "error",
      });
    }
  };

  const navigate = useNavigate();

  const handleAddContent = () => {
    setSuccessPopup(false);

    // Use the created course ID from the redux state (data)
    if (data && data?.data?.course?._id) {
      window.location.href = `/courses/edit/${data?.data?.course?._id}`;
    }
  };

  return (
    <div className="min-h-screen rounded-2xl border-gray-200 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12 */}
      <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl dark:text-white/90 font-extrabold flex items-center gap-3 text-gray-900">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            Create New Course
          </h1>
          <p className=" dark:text-white/90 mt-3 text-lg">
            Build an engaging course by filling in the details below
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-2xl border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl dark:text-white/90 font-bold mb-6 flex items-center gap-2">
              <Type className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl dark:text-white/90 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      formErrors.title ? "border-red-400" : "border-gray-200"
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
                  <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                    Course Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter course subtitle"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold dark:text-white/90  mb-2">
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
                  <p className="mt-2 text-xs text-red-600">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="rounded-2xl border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl dark:text-white/90 font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Course Details
            </h2>
            <div className="space-y-6">
              <CategorySubcategoryDropdowns
                selectedCategoryId={formData.categoryId}
                selectedSubcategoryId={formData.subCategoryId}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
              {formErrors.categoryId && (
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.categoryId}
                </p>
              )}
              {formErrors.subCategoryId && (
                <p className="mt-1 text-xs text-red-600">
                  {formErrors.subCategoryId}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 dark:text-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                    Duration (mins) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={(e) => {
                      // Only allow integers (no decimals)
                      const value = e.target.value;
                      if (value === "" || /^\d+$/.test(value)) {
                        handleInputChange(e);
                      }
                    }}
                    step="1"
                    min="1"
                    className={`w-full border rounded-xl px-4 py-3 dark:text-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      formErrors.duration ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Course duration"
                    required
                  />
                  {formErrors.duration && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.duration}
                    </p>
                  )}
                </div>
              </div>
              {/* Access Type & Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                    Access Type
                  </label>
                  <select
                    name="accessType"
                    value={formData.accessType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 dark:text-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="lifetime">Lifetime</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
                {(formData.accessType === "limited" || formData.accessType === "subscription") && (
                    <div>
                    <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                      Access Period
                    </label>
                    <input
                      type="text"
                      name="accessPeriod"
                      value={formData.accessPeriod}
                      onChange={(e) => {
                      const value = e.target.value;
                      // Only allow values containing "day", "month", or "year"
                      const valid =
                        value.trim() === "" ||
                        /(day|month|year)/i.test(value);
                      handleInputChange(e);
                      setFormErrors((prev) => ({
                        ...prev,
                        accessPeriod:
                        !valid && value.trim() !== ""
                          ? 'Access period must include "day", "month", or "year"'
                          : "",
                      }));
                      }}
                      min="1"
                      className={`w-full border border-gray-200 rounded-xl px-4 py-3 dark:text-white/90 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      formErrors.accessPeriod ? "border-red-400" : ""
                      }`}
                      placeholder="2 weeks, 1 month, etc."
                    />
                    {formErrors.accessPeriod && (
                      <p className="mt-1 text-xs text-red-600">
                      {formErrors.accessPeriod}
                      </p>
                    )}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Media Files */}
          <div className="bg-white  dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white/90 flex items-center gap-2">
              <Image className="w-6 h-6 text-blue-600 " />
              Media Files
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FileUpload
                label="Course Thumbnail *"
                accept="image/*"
                onFileChange={setThumbnailFile}
                // currentFile={thumbnailFile}
                icon={Image}
              />
              <FileUpload
                label="Cover Image"
                accept="image/*"
                onFileChange={setCoverImageFile}
                currentFile={coverImageFile}
                icon={Image}
              />
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
            {formErrors.thumbnailFile && (
              <p className="mt-2 text-xs text-red-600">
                {formErrors.thumbnailFile}
              </p>
            )}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {thumbnailFile && (
                <div className="relative">
                  <button
                    onClick={() => setThumbnailFile(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    className="h-48 w-full object-cover rounded-xl"
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
                    className="h-48 w-full object-cover rounded-xl"
                    src={getUrlFromFile(coverImageFile)}
                    alt="Cover Image Preview"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white/90 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) => {
                // Allow only numbers with up to 2 decimal places
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
                className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                formErrors.price ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Course price"
                required
              />
              {formErrors.price && (
                <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>
              )}
              </div>
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 dark:text-white/90 dark:placeholder:text-white/80  placeholder:text-black/80  text-black rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            </div>

          {/* Tags */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex dark:text-white/90 text-black items-center gap-2">
              <Tag className="w-6 h-6 text-blue-600" />
              Tags
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                  Select Tags *
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                  placeholder="Add custom tag"
                  className="flex-1 border border-gray-200 dark:text-white/90 text-black dark:placeholder:text-white/80 placeholder:text-black/80 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {formErrors.tags && (
                <p className="mt-1 text-xs text-red-600">{formErrors.tags}</p>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white/90 text-black flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Advanced Settings
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="certificateTemplate"
                    checked={formData.certificateTemplate}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Certificate Template
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isDownloadable"
                    checked={formData.isDownloadable}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Downloadable Content
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="courseForum"
                    checked={formData.courseForum}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Course Forum
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isSubscription"
                    checked={formData.isSubscription}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Subscription Based
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Private Course
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableWaitlist"
                    checked={formData.enableWaitlist}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-white/90 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Enable Waitlist
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 dark:text-white/90 text-black flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              SEO Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 mb-2">
                  SEO Meta Description
                </label>
                <textarea
                  name="seoMetaDescription"
                  value={formData.seoMetaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full border rounded-xl dark:text-white/90 text-black dark:placeholder:text-white/60 placeholder:text-black/80 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    formErrors.seoMetaDescription
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  placeholder="Brief description for search engines (max 160 characters)"
                  maxLength={160}
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.seoMetaDescription && (
                    <p className="text-xs text-red-600">
                      {formErrors.seoMetaDescription}
                    </p>
                  )}
                  <span className="text-xs text-gray-500 ml-auto">
                    {formData.seoMetaDescription.length}/160
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 mb-2">
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
                  <p className="mt-2 text-xs text-red-600">
                    {formErrors.seoContent}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookOpenCheck className="w-5 h-5" />
                )}
                Create Course
              </button>
            </div>
          </div> */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl shadow-xl p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookOpenCheck className="w-5 h-5" />
                )}
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isVisible={successPopup}
        onClose={() => setSuccessPopup(false)}
        onAddContent={handleAddContent}
      />

      {/* General Popup */}
      <PopupAlert
        isVisible={popup.isVisible}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ isVisible: false, message: "", type: "" })}
      />
    </div>
  );
};

export default AddCourse;
