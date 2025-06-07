import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createModule } from '../../store/slices/module';
import { createLesson } from '../../store/slices/lesson';
import { RootState, AppDispatch } from '../../store';
import {
    BookOpen, Plus, X, Bold, Italic, Underline, List, Link, 
    Image, Video, Eye, Trash2, Edit, Save, Loader2, 
    CheckCircle, AlertCircle, Type, AlignLeft, AlignCenter,
    AlignRight, Quote, Heading1, Heading2, Heading3, Play,
    FileText, HelpCircle, ClipboardList, Clock, Users,
    Settings, ChevronDown, ChevronUp, GripVertical, ArrowRight
} from 'lucide-react';
import Files from './components/Files';
import TextLesson from './components/TextLesson';
import Quiz from './components/Quiz';
import Assignment from './components/Assignment';

// Enhanced Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder = "Start typing..." }) => {
    const editorRef = useRef(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

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
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                        {toolbarButtons.slice(0, isExpanded ? toolbarButtons.length : 6).map((button, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => execCommand(button.command, button.value)}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-gray-900"
                                title={button.title}
                            >
                                <button.icon className="w-4 h-4" />
                            </button>
                        ))}
                        {!isExpanded && toolbarButtons.length > 6 && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded(true)}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-500"
                                title="More options"
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        )}
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <button
                            type="button"
                            onClick={insertLink}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-blue-600"
                            title="Insert Link"
                        >
                            <Link className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={insertImage}
                            className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-green-600"
                            title="Insert Image"
                        >
                            <Image className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsPreview(!isPreview)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                            isPreview 
                                ? 'bg-blue-100 text-blue-600 shadow-sm' 
                                : 'hover:bg-white hover:shadow-sm text-gray-600'
                        }`}
                        title="Toggle Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {isPreview ? (
                <div
                    className="p-6 min-h-[200px] prose max-w-none bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            ) : (
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="p-6 min-h-[200px] outline-none prose max-w-none focus:bg-blue-50/30 transition-colors duration-200"
                    style={{ minHeight: '200px' }}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: value }}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

// Module Creation Form Component
const ModuleCreationForm = ({ onModuleCreated, courseId }) => {
    const dispatch = useDispatch();
    const { loading: moduleLoading } = useSelector((state) => state.module);
    
    const [moduleData, setModuleData] = useState({
        title: '',
        description: '',
        order: 1,
        estimatedDuration: 60,
        isPublished: false
    });
    
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateModule = async () => {
        if (!moduleData.title.trim()) {
            alert('Please enter a module title');
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token') || '';
            const payload = {
                courseId,
                title: moduleData.title,
                description: moduleData.description,
                order: moduleData.order,
                estimatedDuration: moduleData.estimatedDuration,
                isPublished: moduleData.isPublished,
                token
            };

            const result = await dispatch(createModule(payload)).unwrap();
            onModuleCreated(result.data);
        } catch (error) {
            console.error('Error creating module:', error);
            alert('Failed to create module. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Module</h3>
                <p className="text-gray-600">First, create your module. Then you'll be able to add lessons to it.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Title *
                    </label>
                    <input
                        type="text"
                        value={moduleData.title}
                        onChange={e => setModuleData({ ...moduleData, title: e.target.value })}
                        placeholder="e.g., Introduction to React Basics"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Description
                    </label>
                    <textarea
                        value={moduleData.description}
                        onChange={e => setModuleData({ ...moduleData, description: e.target.value })}
                        placeholder="Describe what students will learn in this module..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={moduleData.estimatedDuration}
                            onChange={e => setModuleData({ ...moduleData, estimatedDuration: parseInt(e.target.value) || 60 })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            min="1"
                            placeholder="60"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Module Order
                        </label>
                        <input
                            type="number"
                            value={moduleData.order}
                            onChange={e => setModuleData({ ...moduleData, order: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            min="1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={moduleData.isPublished}
                        onChange={e => setModuleData({ ...moduleData, isPublished: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPublished" className="text-gray-700 font-medium">
                        Publish module immediately
                    </label>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleCreateModule}
                        disabled={isSaving || !moduleData.title.trim()}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating Module...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Create Module
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Lesson Editor Component (only shows when module exists)
const LessonEditor = ({ lesson, moduleId, onChange, onRemove, onSave }) => {
    const dispatch = useDispatch();
    const { loading: lessonLoading } = useSelector((state) => state.lesson);
    const [isSaving, setIsSaving] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const lessonTypeConfig = {
        video: { icon: Play, label: 'File', color: 'text-red-500 bg-red-50 border-red-200' },
        text: { icon: FileText, label: 'Text Lesson', color: 'text-blue-500 bg-blue-50 border-blue-200' },
        quiz: { icon: HelpCircle, label: 'Quiz', color: 'text-green-500 bg-green-50 border-green-200' },
        assignment: { icon: ClipboardList, label: 'Assignment', color: 'text-purple-500 bg-purple-50 border-purple-200' }
    };

    const currentConfig = lessonTypeConfig[lesson.type || 'video'];

    const handleSaveLesson = async () => {
        if (!lesson.title.trim()) {
            alert('Please enter a lesson title');
            return;
        }

        setIsSaving(true);
        try {
            const lessonData = {
                moduleId,
                title: lesson.title,
                description: lesson.content || '',
                type: lesson.type || 'video',
                order: lesson.order || 1,
                isRequired: lesson.isRequired || true,
                language: 'en',
                section: 'main',
                ...(lesson.type === 'quiz' && {
                    quizTitle: lesson.quizTitle,
                    quizDescription: lesson.quizDescription,
                    quizDuration: lesson.quizDuration,
                    quizDifficulty: lesson.quizDifficulty
                })
            };

            await dispatch(createLesson(lessonData)).unwrap();
            onSave && onSave(lesson);
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Failed to save lesson');
        } finally {
            setIsSaving(false);
        }
    };

    const renderLessonForm = () => {
        switch (lesson.type) {
            case 'video':
                return <Files/>;
            case 'text':
                return <TextLesson/>;
            case 'quiz':
                return <Quiz lesson={lesson} onChange={onChange} />;
            case 'assignment':
                return <Assignment />;
            default:
                return <Files/>;
        }
    };

    return (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${currentConfig.color}`}>
                        <currentConfig.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">{currentConfig.label}</h4>
                        <p className="text-sm text-gray-500">Lesson {lesson.order || 1}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSaveLesson}
                        disabled={isSaving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onRemove} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    value={lesson.title}
                    onChange={e => onChange({ ...lesson, title: e.target.value })}
                    placeholder="Lesson Title"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                />
                <select
                    value={lesson.type || 'video'}
                    onChange={e => onChange({ ...lesson, type: e.target.value })}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                    <option value="video">📹 File</option>
                    <option value="text">📄 Text Lesson</option>
                    <option value="quiz">❓ Quiz</option>
                    <option value="assignment">📋 Assignment</option>
                </select>
            </div>

            {isExpanded && (
                <div className="space-y-6">
                    {renderLessonForm()}
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={lesson.isRequired || true}
                                onChange={e => onChange({ ...lesson, isRequired: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700 font-medium">Required Lesson</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium">Order:</label>
                            <input
                                type="number"
                                value={lesson.order || 1}
                                onChange={e => onChange({ ...lesson, order: parseInt(e.target.value) || 1 })}
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Module Display Component (shows saved module with lessons)
const SavedModuleDisplay = ({ module, onAddLesson, onLessonChange, onLessonRemove }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const totalLessons = module.lessons?.length || 0;

    const addLesson = () => {
        const newLesson = {
            title: '',
            content: '',
            type: 'video',
            order: totalLessons + 1,
            isRequired: true
        };
        onAddLesson(newLesson);
    };

    return (
        <div className="bg-white border-2 border-green-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {module.estimatedDuration} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    {totalLessons} lessons
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    module.isPublished 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {module.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {module.description && (
                    <p className="text-gray-700 bg-white/50 p-3 rounded-lg">{module.description}</p>
                )}
            </div>

            {isExpanded && (
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Lessons ({totalLessons})
                        </h4>
                        <button
                            type="button"
                            onClick={addLesson}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Lesson
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {module.lessons?.map((lesson, idx) => (
                            <LessonEditor
                                key={idx}
                                lesson={lesson}
                                moduleId={module._id}
                                onChange={l => onLessonChange(idx, l)}
                                onRemove={() => onLessonRemove(idx)}
                                onSave={() => console.log('Lesson saved')}
                            />
                        ))}
                        
                        {totalLessons === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to add lessons!</h4>
                                <p className="text-gray-600 mb-4">Your module is created. Now you can start adding lessons.</p>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mx-auto"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add First Lesson
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Enhanced Module Section Component
const ModuleSection = ({ courseId }) => {
    const { loading: moduleLoading, error: moduleError } = useSelector((state) => state.module);
    const { loading: lessonLoading, error: lessonError } = useSelector((state) => state.lesson);
    
    const [savedModules, setSavedModules] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleModuleCreated = (newModule) => {
        setSavedModules([...savedModules, { ...newModule, lessons: [] }]);
        setShowCreateForm(false);
    };

    const addLessonToModule = (moduleIndex, newLesson) => {
        const updatedModules = savedModules.map((module, idx) =>
            idx === moduleIndex
                ? { ...module, lessons: [...(module.lessons || []), newLesson] }
                : module
        );
        setSavedModules(updatedModules);
    };

    const updateLessonInModule = (moduleIndex, lessonIndex, updatedLesson) => {
        const updatedModules = savedModules.map((module, idx) =>
            idx === moduleIndex
                ? {
                    ...module,
                    lessons: (module.lessons || []).map((lesson, lIdx) =>
                        lIdx === lessonIndex ? updatedLesson : lesson
                    )
                }
                : module
        );
        setSavedModules(updatedModules);
    };

    const removeLessonFromModule = (moduleIndex, lessonIndex) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            const updatedModules = savedModules.map((module, idx) =>
                idx === moduleIndex
                    ? { ...module, lessons: (module.lessons || []).filter((_, lIdx) => lIdx !== lessonIndex) }
                    : module
            );
            setSavedModules(updatedModules);
        }
    };

    const totalModules = savedModules.length;
    const publishedModules = savedModules.filter(m => m.isPublished).length;
    const totalLessons = savedModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <BookOpen className="w-8 h-8 text-blue-600" />
                            </div>
                            Course Modules
                        </h2>
                        <p className="text-gray-600 mt-2">Build your course content step by step</p>
                    </div>
                    {!showCreateForm && (
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Create Module
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Published Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{publishedModules}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Users className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Module Creation Form */}
                {showCreateForm && (
                    <ModuleCreationForm
                        onModuleCreated={handleModuleCreated}
                        courseId={courseId}
                    />
                )}
                {/* Saved Modules Display */}
                <div className="space-y-6">
                    {savedModules.map((module, index) => (
                        <SavedModuleDisplay
                            key={module._id || index}
                            module={module}
                            onAddLesson={(newLesson) => addLessonToModule(index, newLesson)}
                            onLessonChange={(lessonIndex, updatedLesson) => updateLessonInModule(index, lessonIndex, updatedLesson)}
                            onLessonRemove={(lessonIndex) => removeLessonFromModule(index, lessonIndex)}
                        />
                    ))}
                    {moduleLoading && (
                        <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <p className="mt-4 text-gray-600">Loading modules...</p>
                        </div>
                    )}
                    {moduleError && (
                        <div className="text-red-600 text-center py-8">
                            <p>Error loading modules: {moduleError.message}</p>
                        </div>
                    )}

                    {savedModules.length === 0 && !moduleLoading && !moduleError && (
                        <div className="text-center py-8">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No modules created yet!</h4>
                            <p className="text-gray-600 mb-4">Start by creating your first module.</p>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Create First Module
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ModuleSection;