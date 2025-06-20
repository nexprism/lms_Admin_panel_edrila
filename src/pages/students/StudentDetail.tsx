import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { fetchStudentById } from "../../store/slices/students";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  Phone,
  Edit,
  Settings,
  FileText,
  GraduationCap,
  Star,
  Clock,
} from "lucide-react";

const ImageUrl = import.meta.env.VITE_IMAGE_URL;

function StudentDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const { studentId } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await dispatch(fetchStudentById(studentId));
        setData(response.payload);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchData();
    }
  }, [studentId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Student
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Student Not Found
          </h3>
          <p className="text-gray-600">
            The requested student could not be found.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatusBadge = ({ verified, label }) => (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {verified ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data.fullName}
                  </h1>
                  <p className="text-sm text-gray-500 capitalize">
                    {data.role}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <StatusBadge
                      verified={data.isActive}
                      label={data.isActive ? "Active" : "Inactive"}
                    />
                    <StatusBadge
                      verified={data.emailVerified}
                      label="Email Verified"
                    />
                    <StatusBadge
                      verified={data.mobileVerified}
                      label="Mobile Verified"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button> */}
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Contact Information
                </h3>
                <dl className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900">{data.email}</dd>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Mobile
                      </dt>
                      <dd className="text-sm text-gray-900">Not provided</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Account Details
                </h3>
                <dl className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Created
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(data.createdAt)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Last Updated
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(data.updatedAt)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Right Column - Academic Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                    Enrolled Courses
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {data.enrolledCourses.length} courses
                  </span>
                </div>
                {data.enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.enrolledCourses.map((course, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900">
                          {course.title || `Course ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {course.description || "No description available"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No enrolled courses
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Student hasn't enrolled in any courses yet.
                    </p>
                  </div>
                )}
              </div>
            </div> */}

            {/* Skills & Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Skills
                  </h3>
                  {data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <Award className="mr-2 h-5 w-5 text-green-500" />
                    Qualifications
                  </h3>
                  {data.qualifications.length > 0 ? (
                    <div className="space-y-2">
                      {data.qualifications.map((qualification, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded"
                        >
                          <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {qualification}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No qualifications listed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Education & Documentation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <GraduationCap className="mr-2 h-5 w-5 text-purple-500" />
                    Education
                  </h3>
                  {data.education.length > 0 ? (
                    <div className="space-y-3">
                      {data.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-purple-500 pl-4"
                        >
                          <h4 className="font-medium text-gray-900">
                            {edu.degree || "Degree"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {edu.institution || "Institution"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {formatDate(edu.startDate) || "Ongoing"}
                            </p>{" "}
                            <p>-</p>
                            <p className="text-xs text-gray-500">
                              {formatDate(edu.endDate) || "Ongoing"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No education records
                    </p>
                  )}
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                    <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                    Documentation
                  </h3>
                  {data.documentation.length > 0 ? (
                    <div className="space-y-2">
                      {data.documentation.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-900">
                            {doc.name || `Document ${index + 1}`}
                          </span>
                          <a
                            href={`${ImageUrl}/${doc.Doc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <button className="text-blue-600 hover:text-blue-500 text-sm">
                              View
                            </button>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No documents uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            {/* <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Learning Progress
                </h3>
                {data.progress.length > 0 ? (
                  <div className="space-y-4">
                    {data.progress.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">
                            {item.course || `Course ${index + 1}`}
                          </h4>
                          <span className="text-sm font-medium text-blue-600">
                            {item.percentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No progress data
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Student progress will appear here as they complete
                      courses.
                    </p>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
