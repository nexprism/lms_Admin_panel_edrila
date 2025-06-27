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
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Award,
  Download,
  MessageCircle,
  Lock,
  Calendar,
  Upload,
  Eye,
  Save,
  Loader2,
  AlertCircle,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { createCourse } from "../../store/slices/course";
import CategorySubcategoryDropdowns from "../../components/CategorySubcategoryDropdowns";
import PopupAlert from "../../components/popUpAlert";

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
    errors.seoMetaDescription = "Meta description must be less than 160 characters";
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

  if (demoVideoUrl && !/^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}$/.test(demoVideoUrl)) {
    errors.demoVideoUrl = "Please enter a valid YouTube URL";
  }

  return errors;
};

// Rich Text Editor Component
type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = "Start typing..." }) => {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url && /^https?:\/\/[^\s]+$/.test(url)) {
      execCommand("createLink", url);
    } else {
      alert("Please enter a valid URL");
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url && /\.(jpg|jpeg|png|gif)$/i.test(url)) {
      execCommand("insertImage", url);
    } else {
      alert("Please enter a valid image URL");
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: Heading1, command: "formatBlock", value: "h1", title: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "Heading 3" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
      <div className="border-b bg-gray-50 p-3 flex flex-wrap gap-2">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => execCommand(button.command, button.value)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            title={button.title}
          >
            <button.icon className="w-5 h-5 text-gray-600" />
          </button>
        ))}
        <div className="w-px h-6 bg-gray-200 mx-2" />
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          title="Insert Link"
        >
          <Link className="w-5 h-5 text-gray-600" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          title="Insert Image"
        >
          <Image className="w-5 h-5 text-gray-600" />
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            title="Toggle Preview"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      {isPreview ? (
        <div
          className="p-6 min-h-[250px] prose max-w-none bg-gray-50"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-6 min-h-[250px] outline-none prose max-w-none bg-white"
          style={{ minHeight: "250px" }}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ label, accept, onFileChange, currentFile, icon: Icon }) => {
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
      <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
        <Icon className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
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
            {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

// YouTube URL Input Component
const YouTubeUrlInput = ({ label, value, onChange, error }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
        <Video className="w-5 h-5 text-blue-600" />
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
        placeholder="Enter demo vedio YouTube URL"
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

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
    if (customTag.trim() && !selectedTags.includes(customTag.trim()) && selectedTags.length < 10) {
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
    const errors = validateForm(formData, description, seoContent, selectedTags, files, demoVideoUrl);

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
      setPopup({
        isVisible: true,
        message: isDraft ? "Course saved as draft!" : "Course published successfully!",
        type: "success",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 text-gray-900">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            Create New Course
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
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
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Type className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      formErrors.title ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Enter course title"
                    required
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Course Description *
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your course in detail..."
                />
                {formErrors.description && (
                  <p className="mt-2 text-xs text-red-600">{formErrors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
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
                <p className="mt-1 text-xs text-red-600">{formErrors.categoryId}</p>
              )}
              {formErrors.subCategoryId && (
                <p className="mt-1 text-xs text-red-600">{formErrors.subCategoryId}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Duration (mins) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      formErrors.duration ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Course duration"
                    required
                  />
                  {formErrors.duration && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.duration}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Media Files */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Image className="w-6 h-6 text-blue-600" />
              Media Files
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <YouTubeUrlInput
                label="Add Demo YouTube Link"
                value={demoVideoUrl}
                onChange={(e) => {
                  setDemoVideoUrl(e.target.value);
                  setFormErrors((prev) => ({ ...prev, demoVideoUrl: "" }));
                }}
                error={formErrors.demoVideoUrl}
              />
            </div>
            {formErrors.thumbnailFile && (
              <p className="mt-2 text-xs text-red-600">{formErrors.thumbnailFile}</p>
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
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
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
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              Course Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: "certificateTemplate", label: "Certificate", icon: Award },
                { key: "isDownloadable", label: "Downloadable", icon: Download },
                { key: "courseForum", label: "Forum", icon: MessageCircle },
                { key: "isSubscription", label: "Subscription", icon: Calendar },
                { key: "isPrivate", label: "Private", icon: Lock },
                { key: "enableWaitlist", label: "Waitlist", icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6 text-blue-600" />
              Tags
            </h2>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Add custom tag"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </button>
              </div>
              {formErrors.tags && (
                <p className="mt-1 text-xs text-red-600">{formErrors.tags}</p>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-4 h-4 hover:text-blue-600" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="w-6 h-6 text-blue-600" />
              SEO Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seoMetaDescription"
                  value={formData.seoMetaDescription}
                  onChange={handleInputChange}
                  className={`w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    formErrors.seoMetaDescription ? "border-red-400" : "border-gray-200"
                  }`}
                  rows={3}
                  placeholder="Brief description for search engines (max 160 characters)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.seoMetaDescription.length}/160 characters
                </p>
                {formErrors.seoMetaDescription && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.seoMetaDescription}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  SEO Content
                </label>
                <RichTextEditor
                  value={seoContent}
                  onChange={setSeoContent}
                  placeholder="Additional SEO content..."
                />
                {formErrors.seoContent && (
                  <p className="mt-2 text-xs text-red-600">{formErrors.seoContent}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="px-8 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
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
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-semibold"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookOpen className="w-5 h-5" />
                )}
                Publish Course
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

export default AddCourse;