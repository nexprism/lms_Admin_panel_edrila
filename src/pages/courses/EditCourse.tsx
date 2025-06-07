import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../../store/slices/course';
import CategorySubcategoryDropdowns from '../../components/CategorySubcategoryDropdowns';
import { RootState, AppDispatch } from '../../store';
import { useLocation, useParams } from 'react-router-dom';
import {
 FileText, DollarSign, Users, Tag, Image, Video,
Plus, X, Bold, Italic, Underline, List, Link, Award,
Download, MessageCircle, Lock, Calendar, Upload, Eye,
Loader2, AlertCircle, Type, AlignLeft, AlignCenter,
AlignRight, Quote, Heading1, Heading2, Heading3, Edit, Trash2,
Search
} from 'lucide-react';
import ModuleSection from './ModuleSection';

// Rich Text Editor Component (same as before)
type RichTextEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
const editorRef = useRef<HTMLDivElement>(null);
const [isPreview, setIsPreview] = useState(false);

const execCommand = (command: any, value?: string) => {
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

// File Upload Component (same as before)
type FileUploadProps = {
    label: any;
    accept: any;
    onFileChange: (file: File | null) => void;
    currentFile: File | null;
    icon: React.ElementType;
};

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onFileChange, currentFile, icon: Icon }) => {
const [dragOver, setDragOver] = useState(false);

const handleDrop = (e:any) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        onFileChange(files[0]);
    }
};

const handleDragOver = (e:any) => {
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

// Module & Lesson Management Components
type Lesson = {
    title: string;
    content: string;
};

type LessonEditorProps = {
    lesson: Lesson;
    onChange: (lesson: Lesson) => void;
    onRemove: () => void;
};

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, onChange, onRemove }) => (
<div className="border rounded-lg p-4 mb-2 bg-gray-50">
    <div className="flex gap-2 items-center mb-2">
        <input
            type="text"
            value={lesson.title}
            onChange={e => onChange({ ...lesson, title: e.target.value })}
            placeholder="Lesson Title"
            className="flex-1 border border-gray-300 rounded px-2 py-1"
        />
        <button type="button" onClick={onRemove} className="text-red-500 hover:bg-red-100 rounded p-1">
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
    <RichTextEditor
        value={lesson.content}
        onChange={content => onChange({ ...lesson, content })}
        placeholder="Lesson Content"
    />
</div>
);

// const ModuleEditor = ({ module, onChange, onRemove, onAddLesson, onLessonChange, onLessonRemove }) => (
// <div className="border rounded-lg p-4 mb-4 bg-white">
//     <div className="flex gap-2 items-center mb-2">
//         <input
//             type="text"
//             value={module.title}
//             onChange={e => onChange({ ...module, title: e.target.value })}
//             placeholder="Module Title"
//             className="flex-1 border border-gray-300 rounded px-2 py-1"
//         />
//         <button type="button" onClick={onRemove} className="text-red-500 hover:bg-red-100 rounded p-1">
//             <Trash2 className="w-4 h-4" />
//         </button>
//     </div>
//     <div className="space-y-2">
//         {module.lessons.map((lesson, idx) => (
//             <LessonEditor
//                 key={idx}
//                 lesson={lesson}
//                 onChange={l => onLessonChange(idx, l)}
//                 onRemove={() => onLessonRemove(idx)}
//             />
//         ))}
//         <button
//             type="button"
//             onClick={onAddLesson}
//             className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
//         >
//             <Plus className="w-4 h-4" /> Add Lesson
//         </button>
//     </div>
// </div>
// );

const EditCourse = () => {
const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Fallback extraction from pathname
  const courseId = id || location.pathname.split('/').pop();const { loading, error, data: courseData } = useSelector((state: RootState) => state.course);

// Course state
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [customTag, setCustomTag] = useState('');
const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
const [demoVideoFile, setDemoVideoFile] = useState<File | null>(null);
const [description, setDescription] = useState('');
const [seoContent, setSeoContent] = useState('');
const [modules, setModules] = useState<any[]>([]);
const [dataLoaded, setDataLoaded] = useState(false);

const [formData, setFormData] = useState<any>({
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

// Predefined tags
const predefinedTags = [
    'Programming', 'Design', 'Business', 'Marketing',
    'Data Science', 'Mobile Development', 'AI/ML', 'Web Development'
];

// Fetch course data for editing - Fixed useEffect
useEffect(() => {
    console.log('Fetching course data for ID:', courseId);
   
    // Check if course data is already loaded
   console.log('Current dataLoaded state:', dataLoaded);
    if (courseId ) {
        const token = localStorage.getItem('token') || '';
        dispatch(fetchCourseById({ courseId, token }));
    }
}, [id, dispatch, dataLoaded]);

// Separate useEffect to handle course data when it's loaded
useEffect(() => {
    if (courseData && !dataLoaded) {
        // Handle different response structures
        const course = courseData.data || courseData;
        
        console.log('Setting course data:', course);
        
        setFormData((prev: any) => ({
            ...prev,
            title: course.title || '',
            subtitle: course.subtitle || '',
            seoMetaDescription: course.seoMetaDescription || '',
            categoryId: course.categoryId || course.category?._id || course.categoryId?._id||'',
            subCategoryId: course.subCategoryId || course.subCategory?._id || course.subCategoryId?._id||'',
            level: course.level || 'beginner',
            price: course.price || '',
            currency: course.currency || 'INR',
            duration: course.duration || '',
            instructorId: course.instructorId || course.instructor?._id || '',
            isPublished: course.isPublished || false,
            enrollmentType: course.enrollmentType || 'open',
            maxStudents: course.maxStudents || '',
            certificateTemplate: course.certificateTemplate !== undefined ? course.certificateTemplate : true,
            isDownloadable: course.isDownloadable !== undefined ? course.isDownloadable : true,
            courseForum: course.courseForum !== undefined ? course.courseForum : true,
            isSubscription: course.isSubscription || false,
            isPrivate: course.isPrivate || false,
            enableWaitlist: course.enableWaitlist || false,
        }));
        
        setDescription(course.description || '');
        setSeoContent(course.seoContent || '');
        setSelectedTags(course.tags || []);
        setModules(course.modules || []);
        setDataLoaded(true);
    }
}, [courseData, dataLoaded]);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
};

const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
    }
};

const handleCategoryChange = (categoryId: string, categoryName: string) => {
    setFormData(prev => ({
        ...prev,
        categoryId,
        subCategoryId: '',
    }));
};

const handleSubcategoryChange = (subCategoryId: string, subCategoryName: string) => {
    setFormData(prev => ({
        ...prev,
        subCategoryId,
    }));
};

const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
};

const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
        setSelectedTags([...selectedTags, customTag.trim()]);
        setCustomTag('');
    }
};

// Module/Lesson handlers
const addModule = () => {
    setModules([...modules, { title: '', lessons: [] }]);
};

const removeModule = (idx: number) => {
    setModules(modules.filter((_, i) => i !== idx));
};

const updateModule = (idx: number, updated: any) => {
    setModules(modules.map((m, i) => (i === idx ? updated : m)));
};

const addLesson = (moduleIdx: number) => {
    setModules(modules.map((m, i) =>
        i === moduleIdx
            ? { ...m, lessons: [...m.lessons, { title: '', content: '' }] }
            : m
    ));
};

const updateLesson = (moduleIdx: number, lessonIdx: number, updated: any) => {
    setModules(modules.map((m, i) =>
        i === moduleIdx
            ? {
                    ...m,
                    lessons: m.lessons.map((l, j) => (j === lessonIdx ? updated : l))
                }
            : m
    ));
};

const removeLesson = (moduleIdx: number, lessonIdx: number) => {
    setModules(modules.map((m, i) =>
        i === moduleIdx
            ? { ...m, lessons: m.lessons.filter((_, j) => j !== lessonIdx) }
            : m
    ));
};

const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    const submitFormData = new FormData();
    (Object.keys(formData) as (keyof typeof formData)[]).forEach(key => {
        submitFormData.append(key, String(formData[key]));
    });

    submitFormData.append('description', description);
    submitFormData.append('seoContent', seoContent);
    submitFormData.append('tags', JSON.stringify(selectedTags));
    submitFormData.append('modules', JSON.stringify(modules));
    submitFormData.append('isPublished', (!isDraft).toString());

    if (thumbnailFile) submitFormData.append('thumbnail', thumbnailFile);
    if (coverImageFile) submitFormData.append('coverImage', coverImageFile);
    if (demoVideoFile) submitFormData.append('demoVideo', demoVideoFile);

    try {
        // await dispatch(updateCourse({ id, data: submitFormData })).unwrap();
        console.log('Form submitted with data:', Object.fromEntries(submitFormData));
        // Handle success (redirect, show message, etc.)
    } catch (error: any) {
        console.log('Error updating course:', error?.message);
    }
};

// Show loading state while fetching course data
if (loading && !dataLoaded) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading course data...</p>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50">
        <div className="mx-auto py-8 px-4">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Edit className="w-8 h-8 text-blue-600" />
                    </div>
                    Edit Course
                </h1>
                <p className="text-gray-600 mt-2">Update your course details below</p>
                {formData.title && (
                    <p className="text-sm text-gray-500 mt-1">Currently editing: <strong>{formData.title}</strong></p>
                )}
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{typeof error === 'string' ? error : 'An error occurred'}</span>
                </div>
            )}

            <form onSubmit={e => handleSubmit(e, false)}>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter course subtitle"
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
                        <div className="space-y-4">
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
                                    Add Tag
                                </button>
                            </div>
                                
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* SEO Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-600" />
                            SEO Content
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Meta Description
                                </label>
                                <textarea
                                    name="seoMetaDescription"
                                    value={formData.seoMetaDescription}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter SEO meta description"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Content
                                </label>
                                <RichTextEditor
                                    value={seoContent}
                                    onChange={setSeoContent}
                                    placeholder="SEO content for search engines..."
                                />
                            </div>
                        </div>
                    </div>
                    {/* Modules and Lessons */}
                   <ModuleSection 
    courseId={courseId || ''} 
    modules={modules} 
    onModulesChange={setModules} 
/>
                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => handleSubmit(new Event('submit'), true)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Save as Draft
                        </button>
                        <button
                            type="submit"
                            onClick={(e) => handleSubmit(e, false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Update Course
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
);
}
export default EditCourse;