import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { fetchStudentById, disableDripForUser } from "../../store/slices/students";
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
  MapPin,
  Activity,
  TrendingUp,
  Download,
  Eye,
  Plus,
  ArrowRight,
  Users,
  Target,
  Bookmark,
} from "lucide-react";
import EnrollStudentPopup from "../../components/students/EnrollStudentPopup";

const ImageUrl = import.meta.env.VITE_IMAGE_URL;

function StudentDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const { studentId } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollPopupOpen, setEnrollPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Add local state to track disabling drip
  const [dripLoading, setDripLoading] = useState<string | null>(null);

  // Add state for confirmation popup
  const [confirmDrip, setConfirmDrip] = useState<{ courseId: string, courseTitle: string } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    // Auto-hide toast after 2.5s
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  // Handler for disabling drip (called after confirmation)
  const handleDisableDrip = async (courseId: string) => {
    if (!data?._id) return;
    setDripLoading(courseId);
    try {
      await dispatch(disableDripForUser({ courseId, userId: data._id }));
      setData((prev: any) => ({
        ...prev,
        enrollments: prev.enrollments.map((enr: any) =>
          enr.course?._id === courseId
            ? { ...enr, dripEnabled: false }
            : enr
        ),
      }));
      setConfirmDrip(null); // Close popup first
      setTimeout(() => {
        setToast({ message: "Drip setting disabled successfully.", type: "success" });
      }, 100); // Delay to ensure popup closes before toast shows
    } catch (e) {
      setConfirmDrip(null);
      setTimeout(() => {
        setToast({ message: "Failed to disable drip setting.", type: "error" });
      }, 100);
    } finally {
      setDripLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Student
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
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

  const StatusBadge = ({ verified, label, icon: Icon }) => (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        verified 
          ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
          : "bg-rose-100 text-rose-800 border border-rose-200"
      }`}
    >
      {Icon && <Icon className="w-3 h-3 mr-1.5" />}
      {label}
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "profile", label: "Profile", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {data.fullName}
                  </h1>
                  <p className="text-lg text-gray-600 capitalize mb-3">
                    {data.role} • Member since {formatDate(data.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge
                      verified={data.isActive}
                      label={data.isActive ? "Active" : "Inactive"}
                      icon={data.isActive ? CheckCircle : XCircle}
                    />
                    <StatusBadge
                      verified={data.emailVerified}
                      label="Email Verified"
                      icon={Mail}
                    />
                    <StatusBadge
                      verified={data.mobileVerified}
                      label="Mobile Verified"
                      icon={Phone}
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6 lg:mt-0">
                <button
                  onClick={() => setEnrollPopupOpen(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Enroll in Course
                </button>
                {/* <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={BookOpen}
                title="Enrolled Courses"
                value={data?.enrollments?.length}
                subtitle="Active enrollments"
                color="blue"
              />
              {/* <StatCard
                icon={Award}
                title="Certificates"
                value={data.enrollments.filter(e => e.certificateIssued).length}
                subtitle="Earned certificates"
                color="yellow"
              />
              <StatCard
                icon={TrendingUp}
                title="Average Progress"
                value={`${Math.round(data.enrollments.reduce((acc, e) => acc + e.progressPercentage, 0) / data.enrollments.length || 0)}%`}
                subtitle="Across all courses"
                color="green"
              />
              <StatCard
                icon={Target}
                title="Completion Rate"
                value={`${Math.round((data.enrollments.filter(e => e.progressPercentage === 100).length / data.enrollments.length) * 100 || 0)}%`}
                subtitle="Courses completed"
                color="purple"
              /> */}
            </div>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-blue-500" />
                    Recent Activity
                  </h3>
                
                </div>
                <div className="space-y-4">
                  {Array.isArray(data?.enrollments) && data.enrollments.length > 0 && Object.keys(data.enrollments[0]).length > 0 ? (
                  data.enrollments.slice(0, 3).map((enrollment, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                      {enrollment.course?.title || "Untitled Course"}
                      </p>
                    </div>
                    </div>
                  ))
                  ) : (
                  <div className="text-center text-gray-500 py-8">
                    No enrollments found.
                  </div>
                  )}
                </div>
              </div>

              {/* Contact & Account Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-500" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{data.email}</p>
                      <p className="text-xs text-gray-500">Primary Email</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{data?.phone}</p>
                      <p className="text-xs text-gray-500">Mobile Number</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(data.createdAt)}</p>
                      <p className="text-xs text-gray-500">Member Since</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-8">
            {/* Course Enrollment Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Enrollments</h2>
                  <p className="text-gray-600">Track progress across all enrolled courses</p>
                </div>
                <button
                  onClick={() => setEnrollPopupOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Enroll in New Course
                </button>
              </div>
            </div>

                    {Array.isArray(data.enrollments) && data.enrollments.length > 0 && Object.keys(data.enrollments[0]).length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data.enrollments.map((enrollment, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            {/* <span
                            className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              (enrollment.status === "active")
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                            >
                            {(enrollment.status
                              ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)
                              : "Unknown")}
                            </span> */}
                          </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                            {enrollment.course?.title || "Untitled Course"}
                          </h4>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {enrollment.course?.subtitle || "No subtitle available"}
                          </p>
                          {/* Drip Setting Button */}
                            <button
                              className="inline-flex items-center px-3 py-1.5 bg-rose-100 text-rose-700 rounded-md text-xs font-medium hover:bg-rose-200 transition-colors mb-2"
                              onClick={() =>
                                setConfirmDrip({
                                  courseId: enrollment.course._id,
                                  courseTitle: enrollment.course?.title || "this course",
                                })
                              }
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Disable Drip
                            </button>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <a
                            href={enrollment.course?._id ? `/courses/edit/${enrollment.course._id}` : "#"}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Course
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                          {enrollment.certificateIssued && (
                            <span className="inline-flex items-center text-sm text-green-600">
                            <Award className="w-4 h-4 mr-1" />
                            Certified
                            </span>
                          )}
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No Enrolled Courses
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This student hasn't enrolled in any courses yet. Get started by enrolling them in a course.
                    </p>
                    <button
                      onClick={() => setEnrollPopupOpen(true)}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Enroll in Course
                    </button>
                    </div>
                  )}
                </div>
                )}

      {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
        <User className="mr-2 h-5 w-5 text-indigo-500" />
        About {data.fullName}
      </h3>
      {data.bio ? (
        <div className="prose prose-indigo max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{data.bio}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">
            {data.fullName} hasn't added a bio yet
          </p>
        </div>
      )}
    </div>
            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                Skills & Expertise
              </h3>
              {(() => {
                // Parse skills from different formats
                const parseSkills = (skills) => {
                  if (!skills) return [];
                  if (Array.isArray(skills)) {
                    // If it's an array, flatten any comma-separated strings
                    return skills.flatMap(skill => 
                      typeof skill === 'string' ? skill.split(',').map(s => s.trim()).filter(Boolean) : skill
                    );
                  }
                  if (typeof skills === 'string') {
                    // If it's a string, split by comma
                    return skills.split(',').map(s => s.trim()).filter(Boolean);
                  }
                  return [];
                };

                const skillsArray = parseSkills(data.skills);
                
                return skillsArray.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No skills listed yet</p>
                  </div>
                );
              })()}
            </div>

            {/* Qualifications */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <Award className="mr-2 h-5 w-5 text-green-500" />
                Qualifications
              </h3>
              {(() => {
                // Parse qualifications from different formats (same logic as skills)
                const parseQualifications = (qualifications) => {
                  if (!qualifications) return [];
                  if (Array.isArray(qualifications)) {
                    return qualifications.flatMap(qual => 
                      typeof qual === 'string' ? qual.split(',').map(q => q.trim()).filter(Boolean) : qual
                    );
                  }
                  if (typeof qualifications === 'string') {
                    return qualifications.split(',').map(q => q.trim()).filter(Boolean);
                  }
                  return [];
                };

                const qualificationsArray = parseQualifications(data.qualifications);
                
                return qualificationsArray.length > 0 ? (
                  <div className="space-y-3">
                    {qualificationsArray.map((qualification, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {qualification}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No qualifications listed yet</p>
                  </div>
                );
              })()}
            </div> */}

            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <GraduationCap className="mr-2 h-5 w-5 text-purple-500" />
                Education History
              </h3>
              {data.education?.length > 0 ? (
                <div className="space-y-4">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 transition-colors duration-200 rounded-r-lg"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {edu.degree || "Degree"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {edu.institution || "Institution"}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {(edu.startDate ? formatDate(edu.startDate) : "Start")} - {(edu.endDate ? formatDate(edu.endDate) : "Ongoing")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No education records found</p>
                </div>
              )}
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                Documents
              </h3>
              {data.documentation?.length > 0 ? (
                <div className="space-y-3">
                  {data.documentation.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {doc.name || `Document ${index + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={doc.Doc ? `${ImageUrl}/${doc.Doc}` : "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </a>
                        {/* <a
                          href={doc.Doc ? `${ImageUrl}/${doc.Doc}` : "#"}
                          download
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </a> */}
                        <a
  href={doc.Doc ? `${ImageUrl}/${doc.Doc}` : "#"}
  download={doc.name || `document-${index + 1}.pdf`}
  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
>
  <Download className="w-3 h-3 mr-1" />
  Download
</a>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enroll Student Popup */}
      <EnrollStudentPopup
        open={enrollPopupOpen}
        onClose={() => setEnrollPopupOpen(false)}
        studentId={data?._id}
      />

      {/* Confirmation Popup for Drip Disable */}
      {confirmDrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Disable Drip Setting
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to disable drip setting for <span className="font-semibold">{confirmDrip.courseTitle}</span>?<br />
              <span className="text-xs text-gray-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setConfirmDrip(null)}
                disabled={!!dripLoading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 flex items-center ${dripLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleDisableDrip(confirmDrip.courseId)}
                disabled={!!dripLoading}
              >
                {dripLoading ? (
                  <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Yes, Disable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600"
              : "bg-rose-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default StudentDetail;