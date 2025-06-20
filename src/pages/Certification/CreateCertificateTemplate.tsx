import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PopupAlert from "../../components/popUpAlert";
import { BookOpen } from "lucide-react";
import Draggable from "react-draggable"; // Import the draggable library
import { motion } from "framer-motion";

const CreateCertificateTemplate = () => {
  const dispatch = useDispatch();
  const [templateContents, setTemplateContents] = useState(
    "<div class='certificate-template-container'></div>"
  );

  const [title, setTitle] = useState({
    title: "This certificate awarded to [student]",
    fontSize: 24,
    fontColor: "#000",
    position: { x: 180, y: 250 },
  });
  const [body, setBody] = useState({
    content: "regarding completing [course]",
    fontSize: 16,
    fontColor: "#000",
    position: { x: 250, y: 300 },
  });

  const [signature, setSignature] = useState(null);
  const [stamp, setStamp] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [stampPosition, setStampPosition] = useState({ x: 0, y: 0 });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [studentName, setStudentName] = useState("[student_name]");
  const [instructorName, setInstructorName] = useState("[instructor_name]");
  const [date, setDate] = useState("[date]");
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const containerRef = useRef(null);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
    // setBackgroundImage(file);
  };

  const getUrlFromFile = (file) => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your existing form submission logic...
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
                  onChange={(e) => handleFileChange(e, setBackgroundImage)}
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setSignature)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stamp
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setStamp)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
            </div>
            {/* Existing form fields... */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Certificate Template
              </button>
            </div>
          </form>

          <div
            className="relative bg-red-400 w-[800px] h-[600px] overflow-hidden"
            ref={containerRef}
          >
            {backgroundImage ? (
              <img
                className="w-full h-full object-cover"
                src={getUrlFromFile(backgroundImage)}
                alt=""
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Upload Background Image
              </div>
            )}
            {backgroundImage && (
              // <div className="absolute flex inset-0 z-999 ">
              // <div className="relative flex inset-0 z-999 bg-red-500">
              <>
                {containerRef.current && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    initial={false}
                    style={{
                      position: "absolute",
                      left: title.position.x,
                      top: title.position.y,
                      fontSize: title.fontSize,
                      color: title.fontColor,
                      cursor: "grab",
                    }}
                    onDragEnd={(event, info) => {
                      const containerRect =
                        containerRef.current.getBoundingClientRect();
                      const x = info.point.x - containerRect.left;
                      const y = info.point.y - containerRect.top;

                      setTitle({ ...title, position: { x, y } });
                    }}
                  >
                    {title.title}
                  </motion.div>
                )}

                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  style={{
                    position: "absolute",
                    left: body.position.x,
                    top: body.position.y,
                    fontSize: body.fontSize,
                    color: body.fontColor,
                  }}
                  onDragEnd={(_, info) => {
                    if (!containerRef.current) return;
                    const containerRect =
                      containerRef.current.getBoundingClientRect();
                    const x = info.point.x - containerRect.left;
                    const y = info.point.y - containerRect.top;

                    setBody({
                      ...body,
                      position: {
                        x,
                        y,
                      },
                    });
                  }}
                >
                  {body.content}
                </motion.div>

                {signature && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    style={{
                      position: "absolute",
                      left: signaturePosition.x,
                      top: signaturePosition.y,
                    }}
                    onDragEnd={(_, info) => {
                      if (!containerRef.current) return;
                      const containerRect =
                        containerRef.current.getBoundingClientRect();
                      const x = info.point.x - containerRect.left;
                      const y = info.point.y - containerRect.top;

                      setSignaturePosition({
                        x,
                        y,
                      });
                    }}
                  >
                    <img
                      src={getUrlFromFile(signature)}
                      alt="Signature"
                      className="w-1/4"
                    />
                  </motion.div>
                )}
                {stamp && (
                  <Draggable>
                    <div>
                      <img
                        src={getUrlFromFile(stamp)}
                        alt="Stamp"
                        className="w-1/4"
                      />
                    </div>
                  </Draggable>
                )}
              </>
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
