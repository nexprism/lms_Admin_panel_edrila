import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
// import { createCertificateTemplate } from "../../store/slices/certificate"; // Import your action for API submission
import PopupAlert from "../../components/popUpAlert";
import { BookOpen } from "lucide-react";

const CreateCertificateTemplate = () => {
  const dispatch = useDispatch();
  const [templateContents, setTemplateContents] = useState(
    "<div class='certificate-template-container'></div>"
  );

  const [title, setTitle] = useState({
    title: "This certificate awarded to [student]",
    fontSize: 24,
    fontColor: "#000",
  });
  const [body, setBody] = useState({
    content: "regarding completing [course]",
    fontSize: 16,
    fontColor: "#000",
  });

  const [studentName, setStudentName] = useState("[student_name]");
  const [instructorName, setInstructorName] = useState("[instructor_name]");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [platformName, setPlatformName] = useState("[platform_name]");
  const [date, setDate] = useState("[date]");
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setBackgroundImage(file);
  };
  const getUrlFromFile = (file) => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      locale: "EN",
      title: "Course Completion Certificate 12",
      type: "course",
      status: "publish",
      template_contents: templateContents,
      elements: {
        title: {
          content: "Certificate of Completion",
          font_size: 24,
          font_color: "#000",
          styles: "font-family: Arial;",
          font_weight_bold: true,
          text_center: true,
          enable: true,
        },
        subtitle: {
          content: "Awarded for Excellence",
          font_size: 18,
          font_color: "#333",
          enable: true,
        },
        body: {
          content: `This certificate is awarded to ${studentName} for successfully completing the course.`,
          font_size: 16,
          font_color: "#000",
          text_center: true,
          enable: true,
        },
        date: {
          content: date,
          font_size: 14,
          font_color: "#000",
          display_date: "textual",
          enable: true,
        },
        // Add other elements as needed...
      },
    };

    try {
      await dispatch(createCertificateTemplate(formData)).unwrap();
      setPopup({
        isVisible: true,
        message: "Certificate template created successfully!",
        type: "success",
      });
    } catch (error) {
      setPopup({
        isVisible: true,
        message: "Failed to create certificate template. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            Create New Certificate Template
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create your new course
          </p>
        </div>
        <div className="flex gap-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white space-y-4 rounded-lg shadow-sm p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Type
                </label>
                <select
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option>Select Type</option>
                  <option>Quiz</option>
                  <option>Assignment</option>
                  <option>Project</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  background
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter student name"
                />
              </div>
            </div>
            <div className="bg-white rounded-lg space-y-4 shadow-sm p-6">
              <h2 className="text-md font-semibold mb-4">Title</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title.title}
                  onChange={(e) =>
                    setTitle({ ...title, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={title.fontSize}
                  onChange={(e) =>
                    setTitle({ ...title, fontSize: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter font size"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>

                <div className="relative h-12 text-lg flex items-center justify-between px-4 border border-gray-300 rounded-lg">
                  <h2>#{title.fontColor}</h2>

                  <div className="w-7 h-7 ml-2 rounded-sm bg-[#546545]"></div>
                  <input
                    type="color"
                    value={title.fontColor}
                    onChange={(e) =>
                      setTitle({ ...title, fontColor: e.target.value })
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    placeholder="Enter student name"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg space-y-4 shadow-sm p-6">
              <h2 className="text-md font-semibold mb-4">Body</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  rows={4}
                  value={body.content}
                  onChange={(e) =>
                    setBody({ ...body, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="number"
                  value={body.fontSize}
                  onChange={(e) =>
                    setBody({ ...body, fontSize: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Enter font size"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>

                <div className="relative h-12 text-lg flex items-center justify-between px-4 border border-gray-300 rounded-lg">
                  <h2>#{title.fontColor}</h2>

                  <div className="w-7 h-7 ml-2 rounded-sm bg-[#546545]"></div>
                  <input
                    type="color"
                    value={body.fontColor}
                    onChange={(e) =>
                      setBody({ ...body, fontColor: e.target.value })
                    }
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    placeholder="Enter student name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Certificate Template
              </button>
            </div>
          </form>

          <div className="relative w-5/6 h-fit ">
            <img
              className="w-full h-full"
              src={getUrlFromFile(backgroundImage)}
              alt=""
            />
            {backgroundImage && (
              <div className="absolute flex  inset-0 ">
                <div className="absolute flex flex-col items-center gap-4 text-center h-[60%] w-full  bottom-0">
                  <h2
                    style={{ fontSize: title.fontSize, color: title.fontColor }}
                  >
                    {title.title}
                  </h2>

                  <p className="w-2/3  text-center">
                    {body.content
                      .replace("[student_name]", studentName)
                      .replace("[instructor_name]", instructorName)}
                  </p>
                </div>
              </div>
            )}
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

export default CreateCertificateTemplate;
