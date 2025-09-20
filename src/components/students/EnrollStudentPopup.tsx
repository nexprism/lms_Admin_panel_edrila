  import React, { useEffect, useState } from "react";
  import { useAppDispatch, useAppSelector } from "../../hooks/redux";
  import { enrollStudent, fetchAllStudents } from "../../store/slices/students";
  import { fetchCourses } from "../../store/slices/course";
  import { X } from "lucide-react";

  interface EnrollStudentPopupProps {
    open: boolean;
    onClose: () => void;
    studentId?: string;
  }

  const EnrollStudentPopup: React.FC<EnrollStudentPopupProps> = ({ open, onClose, studentId }) => {
    const dispatch = useAppDispatch<any>();
    const { students, loading } = useAppSelector((state: any) => state.students);
    const courseState = useAppSelector((state: any) => state.course);

    const [selectedStudent, setSelectedStudent] = useState(studentId || "");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
      if (open) {
        dispatch(fetchAllStudents({ limit: 1000 }));
        dispatch(fetchCourses({ limit: 1000 }));
        setSelectedStudent(studentId || "");
        setSelectedCourse("");
        setSubmitted(false);
        setLocalError(null);
        setSuccess(false);
      }
    }, [open, dispatch, studentId]);

    // Use courses from redux state
    const courses = courseState?.data?.courses || [];

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      setLocalError(null);
      setSuccess(false);
      if (!selectedStudent || !selectedCourse) {
        setLocalError("Please select both a student and a course.");
        return;
      }
      try {
        const result = await dispatch(
          enrollStudent({
            userId: selectedStudent,
            courseId: selectedCourse,
          })
        );
        if (result.meta.requestStatus === "fulfilled") {
          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
          window.location.reload(); // Reload to reflect changes
        } else {
          setLocalError(result.payload || "Failed to enroll student.");
        }
      } catch (err: any) {
        setLocalError(err.message || "Failed to enroll student.");
      }
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100 animate-in zoom-in-90">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
            onClick={onClose}
            disabled={loading}
            aria-label="Close popup"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Enroll a Student
            </h2>
            <div onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="student-select"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Student
                </label>
                <select
                  id="student-select"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  disabled={!!studentId || loading}
                  aria-describedby={localError && submitted ? "student-error" : undefined}
                >
                  <option value="">Select a student</option>
                  {students.map((s: any) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName || s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="course-select"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Course
                </label>
                <select
                  id="course-select"
                  className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                  disabled={loading}
                  aria-describedby={localError && submitted ? "course-error" : undefined}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              {localError && submitted && (
                <div
                  id="error-message"
                  className="bg-red-50 text-red-700 rounded-lg p-3 text-sm animate-in fade-in"
                  role="alert"
                >
                  {localError}
                </div>
              )}
              {success && (
                <div
                  id="success-message"
                  className="bg-green-50 text-green-700 rounded-lg p-3 text-sm animate-in fade-in"
                  role="status"
                >
                  Student enrolled successfully!
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default EnrollStudentPopup;