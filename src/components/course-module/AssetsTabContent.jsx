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
  const [activeFilter, setActiveFilter] = useState("quizzes");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const response = await axiosInstance.get(
        `courses/${courseID}/all-attachments`
      );
      setData(response.data.data); // Set the data from the API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [courseID]);

  const filterOptions = [
    {
      id: "quizzes",
      label: "Quizzes",
      icon: CheckSquare,
      count: data?.quizzes?.length || 0,
    },
    {
      id: "files",
      label: "Files",
      icon: Download,
      count: data?.files?.length || 0,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: CheckSquare,
      count: data?.assignments?.length || 0,
    },
    {
      id: "videos",
      label: "Videos",
      icon: Video,
      count: data?.videos?.length || 0,
    },
    {
      id: "external_links",
      label: "External Links",
      icon: Download,
      count: data?.external_link?.length || 0,
    },
  ];

  const filteredData =
    data[activeFilter]?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getAssetTypeColor = (type) => {
    const colors = {
      quizzes: "bg-blue-50 text-blue-700 border-blue-200",
      files: "bg-green-50 text-green-700 border-green-200",
      assignments: "bg-purple-50 text-purple-700 border-purple-200",
      videos: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getAssetIcon = (type) => {
    const icons = {
      quizzes: CheckSquare,
      files: Download,
      assignments: FileText,
      videos: Video,
    };
    const IconComponent = icons[type] || FileText;
    return <IconComponent className="w-5 h-5" />;
  };

  const getActionButton = (type) => {
    const actions = {
      quizzes: { text: "Take Quiz", color: "bg-blue-600 hover:bg-blue-700" },
      files: { text: "Download", color: "bg-green-600 hover:bg-green-700" },
      assignments: {
        text: "Submit",
        color: "bg-purple-600 hover:bg-purple-700",
      },
      videos: { text: "Watch", color: "bg-orange-600 hover:bg-orange-700" },
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
      <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {console.log("Filtered Data:", filteredData)}
        {filteredData.map((item, index) => (
          <div
            key={item?.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${getAssetTypeColor(
                  item?.type
                )} group-hover:scale-110 transition-transform duration-200`}
              >
                {getAssetIcon(item?.type)}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getAssetTypeColor(
                  item?.type
                )}`}
              >
                {item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1)}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {item?.name}
            </h3>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item?.size}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item?.date).toLocaleDateString()}
              </span>
            </div>

            {item?.duration && (
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Duration: {item?.duration}
              </div>
            )}
            {item?.difficulty && (
              <div className="mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item?.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : item?.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item?.difficulty}
                </span>
              </div>
            )}
            {item?.fileType && (
              <div className="text-xs text-gray-500 mb-3">
                File Type: {item?.fileType}
              </div>
            )}
            {item?.readTime && (
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Read Time: {item?.readTime}
              </div>
            )}
            {item?.quality && (
              <div className="text-xs text-gray-500 mb-3">
                Quality: {item?.quality}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                className={`w-full text-white py-2 rounded-lg font-medium transition-all duration-200 group-hover:shadow-lg ${
                  getActionButton(item?.type).color
                }`}
              >
                {getActionButton(item?.type).text}
              </button>
            </div>
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
    </div>
  );
};

export default AssetsTabContent;
