import React, { useEffect, useState } from "react";
import {
  FileText,
  Video,
  Download,
  CheckSquare,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react";
import axiosInstance from "../../services/axiosConfig"; // Adjust the import path as necessary
const AssetsTabContent = ({ courseID }) => {
  const [activeFilter, setActiveFilter] = useState("quiz");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [data, setData] = useState({
    quiz: [],
    file: [],
    video: [],
    text: [],
    assignment: [],
    external_link: [],
  });

  const getData = async () => {
    try {
      Object.keys(data).forEach(async (key) => {
        const response = await axiosInstance.get(
          `/courses/${courseID}/attachments`
        );
        console.log(`Fetched ------------- ${key} data:`, response.data.data);
        setData((prevData) => ({
          ...prevData,
          [key]: response.data.data || [],
        }));
      });
      // Simulate fetching data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [courseID]);

  const filterOptions = [
    {
      id: "quiz",
      label: "Quizzes",
      icon: CheckSquare,
      count: data?.quiz?.length,
    },
    {
      id: "files",
      label: "Files",
      icon: Download,
      count: data?.file?.length,
    },
    {
      id: "lessons",
      label: "Lessons",
      icon: FileText,
      count: data?.text?.length,
    },
    { id: "videos", label: "Videos", icon: Video, count: data?.video?.length },
    {
      id: "assignments",
      label: "Assignments",
      icon: CheckSquare,
      count: data?.assignments?.length,
    },
    {
      id: "external_links",
      label: "External Links",
      icon: Download,
      count: data?.external_links?.length,
    },
  ];

  const courseData = {
    quiz: [
      {
        moduleId: 1,
        moduleName: "Introduction to Web Development",
        lessons: [
          {
            lessonId: 1,
            lessonName: "Getting Started with HTML",
            assets: [
              {
                id: 1,
                name: "HTML Basics Quiz",
                type: "quiz",
                size: "10 questions",
                date: "2024-06-10",
                duration: "15 min",
                difficulty: "Easy",
              },
              {
                id: 2,
                name: "HTML Elements Assessment",
                type: "quiz",
                size: "15 questions",
                date: "2024-06-09",
                duration: "20 min",
                difficulty: "Medium",
              },
            ],
          },
          {
            lessonId: 2,
            lessonName: "CSS Fundamentals",
            assets: [
              {
                id: 3,
                name: "CSS Selectors Quiz",
                type: "quiz",
                size: "8 questions",
                date: "2024-06-08",
                duration: "12 min",
                difficulty: "Easy",
              },
              {
                id: 4,
                name: "CSS Layout Challenge",
                type: "quiz",
                size: "12 questions",
                date: "2024-06-07",
                duration: "25 min",
                difficulty: "Hard",
              },
            ],
          },
        ],
      },
      {
        moduleId: 2,
        moduleName: "JavaScript Essentials",
        lessons: [
          {
            lessonId: 3,
            lessonName: "Variables and Data Types",
            assets: [
              {
                id: 5,
                name: "JavaScript Basics Quiz",
                type: "quiz",
                size: "20 questions",
                date: "2024-06-06",
                duration: "30 min",
                difficulty: "Medium",
              },
            ],
          },
          {
            lessonId: 4,
            lessonName: "Functions and Scope",
            assets: [
              {
                id: 6,
                name: "Functions Mastery Test",
                type: "quiz",
                size: "18 questions",
                date: "2024-06-05",
                duration: "35 min",
                difficulty: "Hard",
              },
              {
                id: 7,
                name: "Scope Understanding Quiz",
                type: "quiz",
                size: "6 questions",
                date: "2024-06-04",
                duration: "10 min",
                difficulty: "Easy",
              },
            ],
          },
        ],
      },
    ],
    files: [
      {
        moduleId: 1,
        moduleName: "Introduction to Web Development",
        lessons: [
          {
            lessonId: 1,
            lessonName: "Getting Started with HTML",
            assets: [
              {
                id: 8,
                name: "HTML Cheat Sheet.pdf",
                type: "files",
                size: "2.1 MB",
                date: "2024-06-10",
                fileType: "PDF",
              },
              {
                id: 9,
                name: "HTML Templates.zip",
                type: "files",
                size: "5.7 MB",
                date: "2024-06-09",
                fileType: "ZIP",
              },
              {
                id: 10,
                name: "Exercise Files.zip",
                type: "files",
                size: "3.2 MB",
                date: "2024-06-08",
                fileType: "ZIP",
              },
            ],
          },
          {
            lessonId: 2,
            lessonName: "CSS Fundamentals",
            assets: [
              {
                id: 11,
                name: "CSS Reference Guide.pdf",
                type: "files",
                size: "4.3 MB",
                date: "2024-06-07",
                fileType: "PDF",
              },
              {
                id: 12,
                name: "CSS Framework Kit.zip",
                type: "files",
                size: "12.5 MB",
                date: "2024-06-06",
                fileType: "ZIP",
              },
            ],
          },
        ],
      },
      {
        moduleId: 2,
        moduleName: "JavaScript Essentials",
        lessons: [
          {
            lessonId: 3,
            lessonName: "Variables and Data Types",
            assets: [
              {
                id: 13,
                name: "JavaScript Handbook.pdf",
                type: "files",
                size: "8.9 MB",
                date: "2024-06-05",
                fileType: "PDF",
              },
              {
                id: 14,
                name: "Code Examples.zip",
                type: "files",
                size: "1.8 MB",
                date: "2024-06-04",
                fileType: "ZIP",
              },
            ],
          },
        ],
      },
    ],
    lessons: [
      {
        moduleId: 1,
        moduleName: "Introduction to Web Development",
        lessons: [
          {
            lessonId: 1,
            lessonName: "Getting Started with HTML",
            assets: [
              {
                id: 15,
                name: "What is HTML?",
                type: "lessons",
                size: "1,200 words",
                date: "2024-06-10",
                readTime: "5 min",
              },
              {
                id: 16,
                name: "HTML Document Structure",
                type: "lessons",
                size: "1,800 words",
                date: "2024-06-09",
                readTime: "7 min",
              },
              {
                id: 17,
                name: "Common HTML Tags",
                type: "lessons",
                size: "2,100 words",
                date: "2024-06-08",
                readTime: "8 min",
              },
            ],
          },
          {
            lessonId: 2,
            lessonName: "CSS Fundamentals",
            assets: [
              {
                id: 18,
                name: "Introduction to CSS",
                type: "lessons",
                size: "1,500 words",
                date: "2024-06-07",
                readTime: "6 min",
              },
              {
                id: 19,
                name: "CSS Box Model Explained",
                type: "lessons",
                size: "2,400 words",
                date: "2024-06-06",
                readTime: "10 min",
              },
            ],
          },
        ],
      },
      {
        moduleId: 2,
        moduleName: "JavaScript Essentials",
        lessons: [
          {
            lessonId: 3,
            lessonName: "Variables and Data Types",
            assets: [
              {
                id: 20,
                name: "Understanding Variables",
                type: "lessons",
                size: "1,900 words",
                date: "2024-06-05",
                readTime: "8 min",
              },
              {
                id: 21,
                name: "Working with Data Types",
                type: "lessons",
                size: "2,600 words",
                date: "2024-06-04",
                readTime: "11 min",
              },
            ],
          },
        ],
      },
    ],
    videos: [
      {
        moduleId: 1,
        moduleName: "Introduction to Web Development",
        lessons: [
          {
            lessonId: 1,
            lessonName: "Getting Started with HTML",
            assets: [
              {
                id: 22,
                name: "HTML Basics Tutorial",
                type: "videos",
                size: "15:30",
                date: "2024-06-10",
                quality: "1080p",
              },
              {
                id: 23,
                name: "Building Your First Webpage",
                type: "videos",
                size: "22:45",
                date: "2024-06-09",
                quality: "1080p",
              },
            ],
          },
          {
            lessonId: 2,
            lessonName: "CSS Fundamentals",
            assets: [
              {
                id: 24,
                name: "CSS Styling Basics",
                type: "videos",
                size: "18:20",
                date: "2024-06-08",
                quality: "1080p",
              },
              {
                id: 25,
                name: "Responsive Design Principles",
                type: "videos",
                size: "25:10",
                date: "2024-06-07",
                quality: "4K",
              },
            ],
          },
        ],
      },
      {
        moduleId: 2,
        moduleName: "JavaScript Essentials",
        lessons: [
          {
            lessonId: 3,
            lessonName: "Variables and Data Types",
            assets: [
              {
                id: 26,
                name: "JavaScript Variables Explained",
                type: "videos",
                size: "12:15",
                date: "2024-06-06",
                quality: "1080p",
              },
            ],
          },
        ],
      },
    ],
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleLesson = (moduleId, lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [`${moduleId}:${lessonId}`]: !prev[`${moduleId}:${lessonId}`],
    }));
  };

  const filteredData =
    courseData[activeFilter]
      ?.map((module) => ({
        ...module,
        lessons: module.lessons
          ?.map((lesson) => ({
            ...lesson,
            assets: lesson.assets.filter((asset) =>
              asset.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          }))
          ?.filter((lesson) => lesson?.assets?.length > 0),
      }))
      ?.filter((module) => module?.lessons?.length > 0) || [];

  const getAssetTypeColor = (type) => {
    const colors = {
      quiz: "bg-blue-50 text-blue-700 border-blue-200",
      files: "bg-green-50 text-green-700 border-green-200",
      lessons: "bg-purple-50 text-purple-700 border-purple-200",
      videos: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getAssetIcon = (type) => {
    const icons = {
      quiz: CheckSquare,
      files: Download,
      lessons: FileText,
      videos: Video,
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="w-5 h-5" />;
  };

  const getActionButton = (type) => {
    const actions = {
      quiz: { text: "Download", color: "bg-blue-600 hover:bg-blue-700" },
      files: { text: "Download", color: "bg-green-600 hover:bg-green-700" },
      lessons: { text: "Download", color: "bg-purple-600 hover:bg-purple-700" },
      videos: { text: "Download", color: "bg-orange-600 hover:bg-orange-700" },
    };
    return (
      actions[type] || {
        text: "Access Asset",
        color: "bg-blue-600 hover:bg-blue-700",
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Course Assets</h2>
        <p className="text-gray-600">
          Access all your course materials organized by modules and lessons
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-xl">
          {filterOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = activeFilter === option.id;
            return (
              <button
                type="button"
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105
                                    ${
                                      isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                        : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm"
                                    }
                                `}
              >
                <IconComponent className="w-4 h-4" />
                <span>{option.label}</span>
                <span
                  className={`
                                    px-2 py-0.5 rounded-full text-xs font-semibold
                                    ${
                                      isActive
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                    }
                                `}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Content */}
      <div className="space-y-4">
        {filteredData?.map((module) => (
          <div
            key={module?.moduleId}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Module Header */}
            <button
              type="button"
              onClick={() => toggleModule(module.moduleId)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {module?.quizTitle}
                </h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {module?.lessons?.reduce(
                    (total, lesson) => total + lesson?.assets?.length,
                    0
                  )}{" "}
                  items
                </span>
              </div>
              {expandedModules?.[module?.moduleId] ? (
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200" />
              )}
            </button>

            {/* Module Content */}
            {expandedModules?.[module?.moduleId] && (
              <div className="p-6 space-y-6 bg-gray-50/30">
                {module?.lessons?.map((lesson) => (
                  <div
                    key={lesson?.lesson}
                    className="border-l-4 border-blue-200 pl-4"
                  >
                    {/* Lesson Header */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleLesson(module?.moduleId, lesson?.lessonId)
                      }
                      className="w-full flex items-center justify-between py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <h4 className="text-md font-medium text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {lesson?.lessonName}
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs border">
                          {lesson?.assets?.length}{" "}
                          {lesson?.assets?.length === 1 ? "item" : "items"}
                        </span>
                      </h4>
                      {expandedLessons[
                        `${module?.moduleId}:${lesson?.lessonId}`
                      ] ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      )}
                    </button>

                    {/* Lesson Assets */}
                    {expandedLessons[
                      `${module?.moduleId}:${lesson?.lessonId}`
                    ] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {lesson?.assets?.map((asset, index) => (
                          <div
                            key={asset?.id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                            style={{
                              animationDelay: `${index * 100}ms`,
                              animation: "fadeInUp 0.6s ease-out forwards",
                            }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div
                                className={`p-3 rounded-lg ${getAssetTypeColor(
                                  asset?.type
                                )} group-hover:scale-110 transition-transform duration-200`}
                              >
                                {getAssetIcon(asset?.type)}
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getAssetTypeColor(
                                  asset?.type
                                )}`}
                              >
                                {asset?.type.charAt(0).toUpperCase() +
                                  asset?.type.slice(1)}
                              </span>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                              {asset?.name}
                            </h3>

                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {asset?.size}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(asset?.date).toLocaleDateString()}
                              </span>
                            </div>

                            {asset?.duration && (
                              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Duration: {asset?.duration}
                              </div>
                            )}
                            {asset?.difficulty && (
                              <div className="mb-3">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    asset?.difficulty === "Easy"
                                      ? "bg-green-100 text-green-700"
                                      : asset?.difficulty === "Medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {asset?.difficulty}
                                </span>
                              </div>
                            )}
                            {asset?.fileType && (
                              <div className="text-xs text-gray-500 mb-3">
                                File Type: {asset?.fileType}
                              </div>
                            )}
                            {asset?.readTime && (
                              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Read Time: {asset?.readTime}
                              </div>
                            )}
                            {asset?.quality && (
                              <div className="text-xs text-gray-500 mb-3">
                                Quality: {asset?.quality}
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                              <button
                                type="button"
                                className={`w-full text-white py-2 rounded-lg font-medium transition-all duration-200 group-hover:shadow-lg ${
                                  getActionButton(asset?.type).color
                                }`}
                              >
                                {getActionButton(asset?.type).text}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-blue-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            No assets found
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filter to find what you're
            looking for.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Search
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AssetsTabContent;
