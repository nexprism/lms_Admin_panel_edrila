import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BookOpen, FileText, Clock, CheckCircle, Plus, Edit2, Trash2,
    X, Save, HelpCircle, AlertCircle, Eye, Settings
} from 'lucide-react';
import { createQuiz, upadateQuiz, fetchQuiz } from '../../../store/slices/quiz';
import PopupAlert from '../../../components/popUpAlert';

// Types
type QuestionType = {
    question: string;
    options: string[];
    correctAnswer: string;
};

type LessonType = {
    quizTitle?: string;
    quizDuration?: number | string;
    quizDifficulty?: string;
    passMark?: number;
    quizDescription?: string;
    questions?: QuestionType[];
};

interface RootState {
    quiz: {
        loading: boolean;
        error: string | null;
        data: any;
    };
}

// Props for the Quiz component when used as a modal
type QuizModalProps = {
    sectionId: string;
    lessonId: string;
    lesson?: LessonType;
    quizId?: string; // If provided, component will edit existing quiz
    onClose: () => void;
    onSaveSuccess?: (data: any) => void;
};

const Quiz = ({ sectionId, lessonId, lesson, quizId, onClose, onSaveSuccess }: QuizModalProps) => {
    const dispatch = useDispatch();
    const { loading, error: saveError, data: saveData } = useSelector((state: RootState) => state.quiz);

    const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
    const [quizData, setQuizData] = useState({
        quizTitle: '',
        quizDuration: '',
        quizDifficulty: '',
        passMark: 70,
        quizDescription: '',
        courseId: '',
        courseTitle: '',
        lessonTitle: '',
    });
    const [popup, setPopup] = useState({ isVisible: false, message: '', type: '' });
    const [isEditMode, setIsEditMode] = useState(false);

    // Initialize component based on mode
    useEffect(() => {
        if (quizId) {
            // Fetch quiz data using Redux
            dispatch(fetchQuiz(quizId) as any);
            setIsEditMode(true);
        } else {
            // Create mode - initialize with lesson data if provided
            setQuizData({
                quizTitle: lesson?.quizTitle || '',
                quizDuration: lesson?.quizDuration || '',
                quizDifficulty: lesson?.quizDifficulty || '',
                passMark: lesson?.passMark || 70,
                quizDescription: lesson?.quizDescription || '',
                courseId: sectionId,
                courseTitle: '',
                lessonTitle: '',
            });
            setQuestions(lesson?.questions || []);
            setIsEditMode(false);
        }
    }, [quizId, lesson, sectionId, dispatch]);

    // Handle quiz data from Redux when fetching for edit mode
    useEffect(() => {
        if (isEditMode && saveData && !loading && !saveError) {
            const data = saveData?.data || saveData;
            if (data && typeof data === 'object') {
                setQuizData({
                    quizTitle: data.title || '',
                    quizDuration: data.duration || '',
                    quizDifficulty: data.difficulty || '',
                    passMark: data.passMark || 70,
                    quizDescription: data.description || '',
                    courseId: data?.course?._id || '',
                    courseTitle: data?.course?.title || '',
                    lessonTitle: data?.lesson?.title || '',
                });
                setQuestions(data.questions || []);
            }
        }
    }, [saveData, loading, saveError, isEditMode]);

    // Handle save success and error popups
    useEffect(() => {
        if (!loading) {
            if (saveData && !saveError && !isEditMode) {
                // Only show success popup for create/update operations, not fetch
                const isCreateOrUpdate = saveData?.message || saveData?.success;
                if (isCreateOrUpdate) {
                    setPopup({
                        isVisible: true,
                        message: `Quiz ${isEditMode ? 'updated' : 'created'} successfully!`,
                        type: 'success'
                    });
                    if (onSaveSuccess) {
                        onSaveSuccess(saveData);
                    }
                }
            } else if (saveError) {
                setPopup({
                    isVisible: true,
                    message: `Failed to ${isEditMode ? 'update' : 'create'} quiz: ${saveError}`,
                    type: 'error'
                });
            }
        }
    }, [saveData, loading, saveError, isEditMode, onSaveSuccess]);

    const handleChange = (field: keyof typeof quizData, value: string | number) => {
        setQuizData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuestionsUpdate = (updatedQuestions: QuestionType[]) => {
        setQuestions(updatedQuestions);
    };

    const handleSaveQuiz = async () => {
        // Validation
        if (!quizData.quizTitle.trim()) {
            setPopup({
                isVisible: true,
                message: 'Please enter a quiz title.',
                type: 'error'
            });
            return;
        }

        if (questions.length === 0) {
            setPopup({
                isVisible: true,
                message: 'Please add at least one question to the quiz.',
                type: 'error'
            });
            return;
        }

        // Prepare payload based on mode
        let payload;
        if (isEditMode && quizId) {
            // Update existing quiz
            payload = {
                id: quizId,
                passMark: quizData.passMark,
                questions: questions,
                title: quizData.quizTitle,
                duration: quizData.quizDuration,
                difficulty: quizData.quizDifficulty,
                description: quizData.quizDescription,
            };
            dispatch(upadateQuiz(payload) as any);
        } else {
            // Create new quiz
            payload = {
                course: sectionId,
                lesson: lessonId,
                questions: questions,
                passMark: quizData.passMark,
                title: quizData.quizTitle,
                duration: quizData.quizDuration,
                difficulty: quizData.quizDifficulty,
                description: quizData.quizDescription,
            };
            dispatch(createQuiz(payload) as any);
        }
    };

    const handleClose = () => {
        // Close any open popups and then close the modal
        setPopup({ isVisible: false, message: '', type: '' });
        onClose();
    };

    if (loading && isEditMode) {
        return (
            <div className="fixed inset-0 overflow-scroll flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading quiz data...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div >
            <div className="bg-white rounded-xl  max-w-full w-full max-h-[70vh]  overflow-y-auto transform scale-95 animate-scale-in hide-scrollbar">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center shadow-md">
                    <h2 className="text-xl font-bold flex items-center">
                        <BookOpen className="w-6 h-6 mr-3" />
                        {isEditMode 
                            ? `Edit Quiz: ${quizData.quizTitle || 'Untitled Quiz'}` 
                            : 'Create New Quiz'
                        }
                    </h2>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-8">
                    {/* Basic Quiz Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-blue-600" />
                            Quiz Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <BookOpen className="w-4 h-4 inline mr-2" />
                                    Quiz Title *
                                </label>
                                <input
                                    type="text"
                                    value={quizData.quizTitle}
                                    onChange={e => handleChange('quizTitle', e.target.value)}
                                    placeholder="Enter quiz title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={quizData.quizDuration}
                                    onChange={e => handleChange('quizDuration', parseInt(e.target.value) || '')}
                                    placeholder="30"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CheckCircle className="w-4 h-4 inline mr-2" />
                                    Difficulty Level
                                </label>
                                <select
                                    value={quizData.quizDifficulty}
                                    onChange={e => handleChange('quizDifficulty', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="easy">🟢 Easy</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="hard">🔴 Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <AlertCircle className="w-4 h-4 inline mr-2" />
                                    Pass Mark (%) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={quizData.passMark}
                                    onChange={e => handleChange('passMark', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Show course and lesson info in edit mode */}
                        {isEditMode && (quizData.courseTitle || quizData.lessonTitle) && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Quiz Context</h4>
                                {quizData.courseTitle && (
                                    <p className="text-sm text-blue-800">
                                        <strong>Course:</strong> {quizData.courseTitle}
                                    </p>
                                )}
                                {quizData.lessonTitle && (
                                    <p className="text-sm text-blue-800">
                                        <strong>Lesson:</strong> {quizData.lessonTitle}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Description
                            </label>
                            <textarea
                                value={quizData.quizDescription}
                                onChange={e => handleChange('quizDescription', e.target.value)}
                                placeholder="Brief description of the quiz content and objectives"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            />
                        </div>
                    </div>

                    {/* Questions Management */}
                    <div className="bg-white overflow-scroll rounded-xl border-2 border-gray-200 overflow-hidden shadow">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <HelpCircle className="w-5 h-5 mr-2 text-green-600" />
                                        Quiz Questions ({questions.length})
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Manage your quiz questions and answers
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingQuestion(null);
                                        setShowQuestionBuilder(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {questions.length === 0 ? (
                                <div className="text-center py-12">
                                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h4>
                                    <p className="text-gray-500 mb-4">Start building your quiz by adding questions</p>
                                    <button
                                        onClick={() => setShowQuestionBuilder(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add First Question
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((question, index) => (
                                        <QuestionCard
                                            key={index}
                                            question={question}
                                            index={index}
                                            onEdit={() => {
                                                setEditingQuestion(index);
                                                setShowQuestionBuilder(true);
                                            }}
                                            onDelete={() => {
                                                const updatedQuestions = questions.filter((_, i) => i !== index);
                                                handleQuestionsUpdate(updatedQuestions);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal Footer (Save Button) */}
                <div className="sticky bottom-0 bg-gray-100 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end items-center gap-4 shadow-inner">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveQuiz}
                        disabled={loading || questions.length === 0 || !quizData.quizTitle.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow ${
                            loading || questions.length === 0 || !quizData.quizTitle.trim()
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        <Save className="w-5 h-5" />
                        {loading 
                            ? `${isEditMode ? 'Updating' : 'Creating'} Quiz...` 
                            : `${isEditMode ? 'Update' : 'Create'} Quiz`
                        }
                    </button>
                </div>
            </div>

            {/* Question Builder Modal */}
            {showQuestionBuilder && (
                <QuestionBuilder
                    question={editingQuestion !== null ? questions[editingQuestion] : null}
                    onSave={(questionData: QuestionType) => {
                        let updatedQuestions;
                        if (editingQuestion !== null) {
                            updatedQuestions = [...questions];
                            updatedQuestions[editingQuestion] = questionData;
                        } else {
                            updatedQuestions = [...questions, questionData];
                        }
                        handleQuestionsUpdate(updatedQuestions);
                        setShowQuestionBuilder(false);
                        setEditingQuestion(null);
                    }}
                    onClose={() => {
                        setShowQuestionBuilder(false);
                        setEditingQuestion(null);
                    }}
                />
            )}

            <PopupAlert
                message={popup.message}
                type={popup.type}
                isVisible={popup.isVisible}
                onClose={() => setPopup({ isVisible: false, message: '', type: '' })}
            />
        </div>
    );
};

// QuestionCard component
const QuestionCard = ({ question, index, onEdit, onDelete }) => {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            Q{index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                            {question.options?.length || 0} options
                        </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {question.question}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Correct: {question.correctAnswer}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {showPreview && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                        {question.options?.map((option, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded border ${
                                    option === question.correctAnswer
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                                {option}
                                {option === question.correctAnswer && (
                                    <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// QuestionBuilder component
const QuestionBuilder = ({ question, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        question: question?.question || '',
        options: question?.options && question.options.length > 0 ? question.options : ['', '', '', ''],
        correctAnswer: question?.correctAnswer || ''
    });
    const [popup, setPopup] = useState({ isVisible: false, message: '', type: '' });

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        if (formData.options.length < 6) {
            setFormData({
                ...formData,
                options: [...formData.options, '']
            });
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({
                ...formData,
                options: newOptions,
                correctAnswer: formData.correctAnswer === formData.options[index] ? '' : formData.correctAnswer
            });
        } else {
            setPopup({
                isVisible: true,
                message: 'You must have at least 2 options for a question.',
                type: 'error'
            });
        }
    };

    const handleSave = () => {
        if (!formData.question.trim()) {
            setPopup({
                isVisible: true,
                message: 'Please enter a question.',
                type: 'error'
            });
            return;
        }
        const filledOptions = formData.options.filter(opt => opt.trim());
        if (filledOptions.length < 2) {
            setPopup({
                isVisible: true,
                message: 'Please provide at least 2 options.',
                type: 'error'
            });
            return;
        }
        if (!formData.correctAnswer || !filledOptions.includes(formData.correctAnswer)) {
            setPopup({
                isVisible: true,
                message: 'Please select a valid correct answer from the provided options.',
                type: 'error'
            });
            return;
        }
        onSave({
            question: formData.question.trim(),
            options: filledOptions,
            correctAnswer: formData.correctAnswer
        });
    };

    const handleClose = () => {
        // Close popup and then close modal
        setPopup({ isVisible: false, message: '', type: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-200 transform scale-95 animate-scale-in">
                <div className="sticky top-0 bg-blue-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {question ? 'Edit Question' : 'Add New Question'}
                        </h3>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                        </label>
                        <textarea
                            value={formData.question}
                            onChange={e => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Enter your question here..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Answer Options *
                            </label>
                            {formData.options.length < 6 && (
                                <button
                                    onClick={addOption}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Option
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={formData.correctAnswer === option && option.trim() !== ''}
                                            onChange={() => option.trim() && setFormData({ ...formData, correctAnswer: option })}
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                            disabled={!option.trim()}
                                        />
                                    </div>
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded min-w-[24px] text-center">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={e => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {formData.options.length > 2 && (
                                            <button
                                                onClick={() => removeOption(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Select the radio button next to the correct answer.
                        </p>
                    </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end items-center gap-4 shadow-inner">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        Save Question
                    </button>
                </div>
                <PopupAlert
                    message={popup.message}
                    type={popup.type}
                    isVisible={popup.isVisible}
                    onClose={() => setPopup({ isVisible: false, message: '', type: '' })}
                />
            </div>
        </div>
    );
    
}
export default Quiz;