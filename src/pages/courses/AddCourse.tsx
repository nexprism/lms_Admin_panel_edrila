import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BookOpen, FileText, DollarSign, Users, Clock, Tag, Image, Video, 
  Plus, X, Bold, Italic, Underline, List, Link, Code, Award, 
  Download, MessageCircle, Lock, Calendar, Upload, Eye, Save,
  Loader2, CheckCircle, AlertCircle, Type, AlignLeft, AlignCenter,
  AlignRight, Quote, Heading1, Heading2, Heading3
} from 'lucide-react';
import { createCourse } from '../../store/slices/course';
import CategorySubcategoryDropdowns from '../../components/CategorySubcategoryDropdowns';
import PopupAlert from '../../components/popUpAlert';

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder = "Start typing..." }) => {
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
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="border-b bg-gray-50 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => execCommand(button.command, button.value)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            type="button"
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Toggle Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {isPreview ? (
        <div 
          className="p-4 min-h-[200px] prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 min-h-[200px] outline-none prose max-w-none"
          style={{ minHeight: '200px' }}
          suppressContentEditableWarning={true}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
};




// File Upload Component
type FileUploadProps = {
  label: string;
  accept: string;
  onFileChange: (file: File | null) => void;
  currentFile: File | null;
  icon: React.ElementType;
};

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileChange, currentFile, icon: Icon }) => {
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
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
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
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            Drop file here or <span className="text-blue-600 hover:underline">browse</span>
          </p>
        </label>
        {currentFile && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700">
            {currentFile.name} ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  );
};

import { RootState, AppDispatch } from '../../store'; // <-- add this import

const AddCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector((state: RootState) => state.course);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [demoVideoFile, setDemoVideoFile] = useState(null);
  const [description, setDescription] = useState('');
  const [popup, setPopup] = useState({ isVisible: false, message: '', type: '' });

  const [seoContent, setSeoContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    seoMetaDescription: '',
    categoryId: '',
    subCategoryId: '',
    level: 'beginner',
    price: '',
    currency: 'INR',
    duration: '',
    instructorId: '',
    isPublished: false,
    enrollmentType: 'open',
    maxStudents: '',
    certificateTemplate: true,
    isDownloadable: true,
    courseForum: true,
    isSubscription: false,
    isPrivate: false,
    enableWaitlist: false,
  });

  const predefinedTags = [
    'Programming', 'Design', 'Business', 'Marketing', 
    'Data Science', 'Mobile Development', 'AI/ML', 'Web Development'
  ];

  const handleInputChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = (tag: any) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };
    const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
      subCategoryId: '', // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (subCategoryId: string) => {
    setFormData(prev => ({
      ...prev,
      subCategoryId,
    }));
  };

  const removeTag = (tagToRemove: any) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    const submitFormData = new FormData();
    console.log('Submitting form data:', formData);
    
    // Append form data
    (Object.keys(formData) as (keyof typeof formData)[]).forEach(key => {
      submitFormData.append(key, String(formData[key]));
    });
    
    // Append additional data
    submitFormData.append('description', description);
    submitFormData.append('seoContent', seoContent);
    submitFormData.append('tags', JSON.stringify(selectedTags));
    submitFormData.append('isPublished', (!isDraft).toString());
    
    // Append files
    if (thumbnailFile) submitFormData.append('thumbnail', thumbnailFile);
    if (coverImageFile) submitFormData.append('coverImage', coverImageFile);
    if (demoVideoFile) submitFormData.append('demoVideo', demoVideoFile);
    
    // Helper to log FormData contents
    for (const [key, value] of submitFormData.entries()) {
      console.log(`${key}:`, value);
    }
    
  try {
  await dispatch(createCourse(submitFormData)).unwrap();
  
  // Show success popup
  setPopup({
    isVisible: true,
    message: 'Course created successfully!',
    type: 'success'
  });
  
} catch (error: any) {
  console.log('Error creating course:', error?.message);
  console.error('Failed to create course:', error);
  
  // Show error popup
  setPopup({
    isVisible: true,
    message: 'Failed to create course. Please try again.',
    type: 'error'
  });
}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">Fill in the details below to create your new course</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Course created successfully!</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-600" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your course in detail..."
                />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Course Details
            </h2>
            <CategorySubcategoryDropdowns
          selectedCategoryId={formData.categoryId}
          selectedSubcategoryId={formData.subCategoryId}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
        />

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Course duration"
                />
              </div>
            </div>
          </div>

          {/* Media Files */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-600" />
              Media Files
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FileUpload
                label="Course Thumbnail"
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
              <FileUpload
                label="Demo Video"
                accept="video/*"
                onFileChange={setDemoVideoFile}
                currentFile={demoVideoFile}
                icon={Video}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Course price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Course Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'certificateTemplate', label: 'Certificate', icon: Award },
                { key: 'isDownloadable', label: 'Downloadable', icon: Download },
                { key: 'courseForum', label: 'Forum', icon: MessageCircle },
                { key: 'isSubscription', label: 'Subscription', icon: Calendar },
                { key: 'isPrivate', label: 'Private', icon: Lock },
                { key: 'enableWaitlist', label: 'Waitlist', icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Tags
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  placeholder="Add custom tag"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <X
                        className="w-4 h-4 cursor-pointer hover:text-blue-600"
                        onClick={() => removeTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="seoMetaDescription"
                  value={formData.seoMetaDescription}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Brief description for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Content
                </label>
                <RichTextEditor
                  value={seoContent}
                  onChange={setSeoContent}
                  placeholder="Additional SEO content..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                Publish Course
              </button>
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