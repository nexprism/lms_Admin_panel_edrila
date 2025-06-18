import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  HelpCircle,
  AlertCircle,
  Eye,
  Settings,
  FolderPlus,
  Folder,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createQuiz,
  upadateQuiz,
  fetchQuiz,
  fetchQuizById,
} from "../../../store/slices/quiz";
import PopupAlert from "../../../components/popUpAlert";

// Types
type QuestionType = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type SectionType = {
  sectionTitle: string;
  sectionDescription: string;
  questions: QuestionType[];
};

type LessonType = {
  quizTitle?: string;
  quizDuration?: number | string;
  quizDifficulty?: string;
  passMark?: number;
  quizDescription?: string;
  sections?: SectionType[];
  isTestSeries?: boolean;
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

const Quiz = ({
  sectionId,
  lessonId,
  lesson,
  quizId,
  onClose,
  onSaveSuccess,
}: QuizModalProps) => {
  const dispatch = useDispatch();
  const {
    loading,
    error: saveError,
    data: saveData,
  } = useSelector((state: RootState) => state.quiz);

  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [showSectionBuilder, setShowSectionBuilder] = useState(false);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{
    sectionIndex: number;
    questionIndex: number;
  } | null>(null);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [activeQuestionSectionIndex, setActiveQuestionSectionIndex] =
    useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const [quizData, setQuizData] = useState({
    quizTitle: "",
    quizDuration: "",
    quizDifficulty: "",
    passMark: 70,
    quizDescription: "",
    courseId: "",
    courseTitle: "",
    lessonTitle: "",
    totalMarks: 100,
    isTestSeries: false,
  });

  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const getData = async () => {
    const response = await dispatch(fetchQuizById(quizId) as any);
    const data = response?.payload?.data || response?.payload;
    setQuizData({
      quizTitle: data.quizTitle || "",
      quizDuration: data.timeLimit || "",
      quizDifficulty: data.level || "",
      passMark: data.passMark || 70,
      quizDescription: data.quizDescription || "",
      courseId: data?.course?._id || "",
      courseTitle: data?.course?.title || "",
      lessonTitle: data?.lesson?.title || "",
      totalMarks: data.totalMarks || 100,
      isTestSeries: data.isTestSeries || false,
    });
    setSections(data.sections || []);
    setIsEditMode(true);
  };

  // Initialize component based on mode
  useEffect(() => {
    if (quizId) {
      getData();
    } else {
      setQuizData({
        quizTitle: lesson?.quizTitle || "",
        quizDuration: lesson?.quizDuration || "",
        quizDifficulty: lesson?.quizDifficulty || "",
        passMark: lesson?.passMark || 70,
        quizDescription: lesson?.quizDescription || "",
        courseId: sectionId,
        totalMarks: lesson?.totalMarks || 100,
        courseTitle: "",
        lessonTitle: "",
        isTestSeries: lesson?.isTestSeries || false,
      });
      setSections(lesson?.sections || []);
      setIsEditMode(false);
    }
  }, [quizId, lesson, sectionId, dispatch]);

  // Handle quiz data from Redux when fetching for edit mode
  useEffect(() => {
    if (isEditMode && saveData && !loading && !saveError) {
      const data = saveData?.data || saveData;
      if (data && typeof data === "object") {
        setQuizData({
          quizTitle: data.title || "",
          quizDuration: data.duration || "",
          quizDifficulty: data.difficulty || "",
          passMark: data.passMark || 70,
          quizDescription: data.description || "",
          courseId: data?.course?._id || "",
          courseTitle: data?.course?.title || "",
          lessonTitle: data?.lesson?.title || "",
          totalMarks: data.totalMarks || 100,
          isTestSeries: data.isTestSeries || false,
        });
        setSections(data.sections || []);
      }
    }
  }, [saveData, loading, saveError, isEditMode]);

  // Handle save success and error popups
  useEffect(() => {
    if (!loading) {
      if (saveData && !saveError && !isEditMode) {
        const isCreateOrUpdate = saveData?.message || saveData?.success;
        if (isCreateOrUpdate) {
          setPopup({
            isVisible: true,
            message: `Quiz ${isEditMode ? "updated" : "created"} successfully!`,
            type: "success",
          });
          if (onSaveSuccess) {
            onSaveSuccess(saveData);
          }
        }
      } else if (saveError) {
        setPopup({
          isVisible: true,
          message: `Failed to ${
            isEditMode ? "update" : "create"
          } quiz: ${saveError}`,
          type: "error",
        });
      }
    }
  }, [saveData, loading, saveError, isEditMode, onSaveSuccess]);

  const handleChange = (
    field: keyof typeof quizData,
    value: string | number | boolean
  ) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionsUpdate = (updatedSections: SectionType[]) => {
    setSections(updatedSections);
  };

  const handleSectionUpdate = (
    sectionIndex: number,
    updatedSection: SectionType
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = updatedSection;
    setSections(updatedSections);
  };

  const handleDeleteSection = (sectionIndex: number) => {
    const updatedSections = sections.filter(
      (_, index) => index !== sectionIndex
    );
    setSections(updatedSections);
    // Update expanded sections
    setExpandedSections((prev) =>
      prev
        .map((index) => (index > sectionIndex ? index - 1 : index))
        .filter((index) => index !== sectionIndex)
    );
  };

  const handleQuestionsUpdate = (
    sectionIndex: number,
    updatedQuestions: QuestionType[]
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const updatedSection = {
        ...updatedSections[sectionIndex],
        questions: updatedQuestions, // Create a new questions array
      };
      updatedSections[sectionIndex] = updatedSection; // Update the section with the new questions
      return updatedSections; // Return the new sections array
    });
  };

  const toggleSectionExpanded = (sectionIndex: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionIndex)
        ? prev.filter((index) => index !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  const getTotalQuestions = () => {
    return sections.reduce(
      (total, section) => total + section.questions.length,
      0
    );
  };

  const handleSaveQuiz = async () => {
    // Validation
    if (!quizData.quizTitle.trim()) {
      setPopup({
        isVisible: true,
        message: "Please enter a quiz title.",
        type: "error",
      });
      return;
    }

    if (sections.length === 0) {
      setPopup({
        isVisible: true,
        message: "Please add at least one section to the quiz.",
        type: "error",
      });
      return;
    }

    const totalQuestions = getTotalQuestions();
    if (totalQuestions === 0) {
      setPopup({
        isVisible: true,
        message: "Please add at least one question to the quiz.",
        type: "error",
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
        sections: sections,
        quizTitle: quizData.quizTitle,
        timeLimit: quizData.quizDuration,
        level: quizData.quizDifficulty,
        quizDescription: quizData.quizDescription,
        totalMarks: quizData.totalMarks || 100,
        isTestSeries: quizData.isTestSeries,
      };
      dispatch(upadateQuiz(payload) as any);
    } else {
      // Create new quiz
      payload = {
        course: sectionId,
        lesson: lessonId,
        sections: sections,
        passMark: quizData.passMark,
        quizTitle: quizData.quizTitle,
        timeLimit: quizData.quizDuration,
        level: quizData.quizDifficulty,
        quizDescription: quizData.quizDescription,
        totalMarks: quizData.totalMarks || 100,
        isTestSeries: quizData.isTestSeries,
      };
      dispatch(createQuiz(payload) as any);
    }
    handleClose();
  };

  const handleClose = () => {
    setPopup({ isVisible: false, message: "", type: "" });
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
    <div>
      <div className="bg-white rounded-xl max-w-full w-full max-h-[70vh] overflow-y-auto transform scale-95 animate-scale-in hide-scrollbar">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex justify-between items-center shadow-md">
          <h2 className="text-xl font-bold flex items-center">
            <BookOpen className="w-6 h-6 mr-3" />
            {isEditMode
              ? `Edit Quiz: ${quizData.quizTitle || "Untitled Quiz"}`
              : "Create New Quiz"}
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
                  onChange={(e) => handleChange("quizTitle", e.target.value)}
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
                  onChange={(e) =>
                    handleChange("quizDuration", parseInt(e.target.value) || "")
                  }
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
                  onChange={(e) =>
                    handleChange("quizDifficulty", e.target.value)
                  }
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
                  Total Marks (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={quizData.totalMarks}
                  onChange={(e) =>
                    handleChange("totalMarks", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Pass Mark (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max={quizData.totalMarks}
                  value={quizData.passMark}
                  onChange={(e) =>
                    handleChange("passMark", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={quizData.isTestSeries}
                    onChange={(e) =>
                      handleChange("isTestSeries", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Test Series Quiz
                  </span>
                </label>
              </div>
            </div>

            {/* Show course and lesson info in edit mode */}
            {isEditMode && (quizData.courseTitle || quizData.lessonTitle) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Quiz Context
                </h4>
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
                onChange={(e) =>
                  handleChange("quizDescription", e.target.value)
                }
                placeholder="Brief description of the quiz content and objectives"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>
          </div>

          {/* Sections Management */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Folder className="w-5 h-5 mr-2 text-green-600" />
                    Quiz Sections ({sections.length}) - Total Questions (
                    {getTotalQuestions()})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Organize your quiz into sections with questions
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSection(null);
                    setShowSectionBuilder(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <FolderPlus className="w-4 h-4" />
                  Add Section
                </button>
              </div>
            </div>
            <div className="p-6">
              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No sections yet
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Start building your quiz by adding sections
                  </p>
                  <button
                    onClick={() => setShowSectionBuilder(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Add First Section
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, sectionIndex) => (
                    <SectionCard
                      key={sectionIndex}
                      section={section}
                      sectionIndex={sectionIndex}
                      isExpanded={expandedSections.includes(sectionIndex)}
                      onToggleExpanded={() =>
                        toggleSectionExpanded(sectionIndex)
                      }
                      onEditSection={() => {
                        setEditingSection(sectionIndex);
                        setShowSectionBuilder(true);
                      }}
                      onDeleteSection={() => handleDeleteSection(sectionIndex)}
                      onEditQuestion={(questionIndex) => {
                        setEditingQuestion({ sectionIndex, questionIndex });
                        setActiveQuestionSectionIndex(sectionIndex);
                        setShowQuestionBuilder(true);
                      }}
                      onDeleteQuestion={(questionIndex) => {
                        const updatedQuestions = section.questions.filter(
                          (_, i) => i !== questionIndex
                        );
                        handleQuestionsUpdate(sectionIndex, updatedQuestions);
                      }}
                      onAddQuestion={() => {
                        setEditingQuestion(null);
                        setActiveQuestionSectionIndex(sectionIndex);
                        setShowQuestionBuilder(true);
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
            disabled={
              loading ||
              sections.length === 0 ||
              !quizData.quizTitle.trim() ||
              getTotalQuestions() === 0
            }
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow ${
              loading ||
              sections.length === 0 ||
              !quizData.quizTitle.trim() ||
              getTotalQuestions() === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Save className="w-5 h-5" />
            {loading
              ? `${isEditMode ? "Updating" : "Creating"} Quiz...`
              : `${isEditMode ? "Update" : "Create"} Quiz`}
          </button>
        </div>
      </div>

      {/* Section Builder Modal */}
      {showSectionBuilder && (
        <SectionBuilder
          section={editingSection !== null ? sections[editingSection] : null}
          onSave={(sectionData: SectionType) => {
            let updatedSections;
            if (editingSection !== null) {
              updatedSections = [...sections];
              updatedSections[editingSection] = sectionData;
            } else {
              updatedSections = [...sections, sectionData];
            }
            handleSectionsUpdate(updatedSections);
            setShowSectionBuilder(false);
            setEditingSection(null);
          }}
          onClose={() => {
            setShowSectionBuilder(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Question Builder Modal */}
      {showQuestionBuilder && (
        <QuestionBuilder
          question={
            editingQuestion !== null
              ? sections[editingQuestion.sectionIndex].questions[
                  editingQuestion.questionIndex
                ]
              : null
          }
          onSave={(questionData: QuestionType) => {
            const sectionIndex = activeQuestionSectionIndex;
            let updatedQuestions;
            if (editingQuestion !== null) {
              updatedQuestions = [...sections[sectionIndex].questions];
              updatedQuestions[editingQuestion.questionIndex] = questionData;
            } else {
              updatedQuestions = [
                ...sections[sectionIndex].questions,
                questionData,
              ];
            }
            handleQuestionsUpdate(sectionIndex, updatedQuestions);
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
        onClose={() => setPopup({ isVisible: false, message: "", type: "" })}
      />
    </div>
  );
};

// SectionBuilder component - basic implementation
type SectionBuilderProps = {
  section: SectionType | null;
  onSave: (section: SectionType) => void;
  onClose: () => void;
};

const SectionBuilder = ({ section, onSave, onClose }: SectionBuilderProps) => {
  const [sectionTitle, setSectionTitle] = useState(section?.sectionTitle || "");
  const [sectionDescription, setSectionDescription] = useState(
    section?.sectionDescription || ""
  );

  const handleSave = () => {
    if (!sectionTitle.trim()) {
      alert("Section title cannot be empty");
      return;
    }
    onSave({
      sectionTitle: sectionTitle.trim(),
      sectionDescription: sectionDescription.trim(),
      questions: section?.questions || [],
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-lg overflow-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold text-gray-900">
          {section ? "Edit Section" : "Add New Section"}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Title *
          </label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter section title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Section Description
          </label>
          <textarea
            rows={3}
            value={sectionDescription}
            onChange={(e) => setSectionDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter section description (optional)"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save Section
          </button>
        </div>
      </div>
    </div>
  );
};

// QuestionBuilder component - basic implementation
type QuestionBuilderProps = {
  question: QuestionType | null;
  onSave: (question: QuestionType) => void;
  onClose: () => void;
};

const QuestionBuilder = ({
  question,
  onSave,
  onClose,
}: QuestionBuilderProps) => {
  const [questionText, setQuestionText] = useState(question?.question || "");
  const [options, setOptions] = useState<OptionType[]>(
    question?.options || [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ]
  );
  const [correctAnswer, setCorrectAnswer] = useState(
    question?.correctAnswer || ""
  );

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    const newLabel = String.fromCharCode(65 + options.length); // A, B, C, ...
    setOptions([...options, { label: newLabel, text: "" }]);
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    if (correctAnswer === options[index]?.label) {
      setCorrectAnswer("");
    }
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      alert("Question text cannot be empty");
      return;
    }
    const filteredOptions = options
      .map((opt) => opt.text.trim())
      .filter((opt) => opt !== "");
    if (filteredOptions.length < 2) {
      alert("Please provide at least two options.");
      return;
    }
    if (!correctAnswer || !options.some((opt) => opt.label === correctAnswer)) {
      alert("Please select a valid correct answer.");
      return;
    }
    onSave({
      question: questionText.trim(),
      options: options,
      correctAnswer, // Pass the label (A, B, C, D) as the correct answer
    });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-lg overflow-auto max-h-[90vh]">
        <h3 className="text-lg font-semibold text-gray-900">
          {question ? "Edit Question" : "Add New Question"}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text *
          </label>
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter the question"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options *
          </label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${option.label}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  title="Remove Option"
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center px-3 py-1 text-blue-600 hover:text-blue-800 font-medium space-x-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Option</span>
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer *
          </label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select correct answer</option>
            {options.map((option, index) =>
              option.text.trim() ? (
                <option key={index} value={option.label}>
                  {option.label}: {option.text}
                </option>
              ) : null
            )}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

// SectionCard component
const SectionCard = ({
  section,
  sectionIndex,
  isExpanded,
  onToggleExpanded,
  onEditSection,
  onDeleteSection,
  onEditQuestion,
  onDeleteQuestion,
  onAddQuestion,
}: {
  section: SectionType;
  sectionIndex: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onEditSection: () => void;
  onDeleteSection: () => void;
  onEditQuestion: (questionIndex: number) => void;
  onDeleteQuestion: (questionIndex: number) => void;
  onAddQuestion: () => void;
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={onToggleExpanded}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Section {sectionIndex + 1}
                </span>
              </button>
              <span className="text-sm text-gray-500">
                {section.questions?.length || 0} questions
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">
              {section.sectionTitle}
            </h4>
            {section.sectionDescription && (
              <p className="text-sm text-gray-600">
                {section.sectionDescription}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={onAddQuestion}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Add Question"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onEditSection}
              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Edit Section"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteSection}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Questions */}
      {isExpanded && (
        <div className="p-4">
          {section.questions?.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No questions in this section</p>
              <button
                onClick={onAddQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {section.questions.map((question, questionIndex) => (
                <QuestionCard
                  key={questionIndex}
                  question={question}
                  index={questionIndex}
                  onEdit={() => onEditQuestion(questionIndex)}
                  onDelete={() => onDeleteQuestion(questionIndex)}
                />
              ))}
              <button
                onClick={onAddQuestion}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// QuestionCard component
const QuestionCard = ({
  question,
  index,
  onEdit,
  onDelete,
}: {
  question: QuestionType;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Question {index + 1}
            </span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-gray-500 hover:text-blue-600"
              title="Preview Question"
              aria-label="Preview Question"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">
            {question.question}
          </h4>
          {showPreview && (
            <div className="mt-2">
              <h5 className="font-medium text-gray-800">Options:</h5>
              <ul className="list-disc list-inside">
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex} className="text-gray-700">
                    {option.label}: {option.text}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-1">
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Edit Question"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
