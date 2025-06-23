import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PopupAlert from "../../components/popUpAlert";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const CreateCertificateTemplate = () => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const [isContainerReady, setIsContainerReady] = useState(false);

  useEffect(() => {
    if (containerRef.current) setIsContainerReady(true);
  }, []);

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
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
  };

  const getUrlFromFile = (file) => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your existing submit logic
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
        </div>

        <div className="flex gap-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Name */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <label className="block font-medium">Student Name</label>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Background</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setBackgroundImage)}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {/* Title Customization */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <label className="block font-medium">Title Text</label>
              <input
                value={title.title}
                onChange={(e) => setTitle({ ...title, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Font Size</label>
              <input
                type="number"
                value={title.fontSize}
                onChange={(e) =>
                  setTitle({ ...title, fontSize: parseInt(e.target.value) })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Font Color</label>
              <input
                type="color"
                value={title.fontColor}
                onChange={(e) =>
                  setTitle({ ...title, fontColor: e.target.value })
                }
              />
            </div>

            {/* Body Customization */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <label className="block font-medium">Body Text</label>
              <textarea
                value={body.content}
                onChange={(e) => setBody({ ...body, content: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Font Size</label>
              <input
                type="number"
                value={body.fontSize}
                onChange={(e) =>
                  setBody({ ...body, fontSize: parseInt(e.target.value) })
                }
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Font Color</label>
              <input
                type="color"
                value={body.fontColor}
                onChange={(e) =>
                  setBody({ ...body, fontColor: e.target.value })
                }
              />
            </div>

            {/* Signature and Stamp Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <label className="block font-medium">Signature</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setSignature)}
                className="w-full border rounded-lg px-4 py-3"
              />
              <label className="block font-medium">Stamp</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setStamp)}
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Create Certificate Template
              </button>
            </div>
          </form>

          {/* Preview Canvas */}
          <div
            className="relative bg-red-400 w-[800px] h-[600px] overflow-hidden rounded-lg shadow"
            ref={containerRef}
          >
            {backgroundImage ? (
              <img
                src={getUrlFromFile(backgroundImage)}
                className="w-full h-full object-cover absolute top-0 left-0"
                alt="Background"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Upload Background Image
              </div>
            )}

            {isContainerReady && (
              <>
                {/* Title */}
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  style={{
                    position: "absolute",
                    fontSize: title.fontSize,
                    color: title.fontColor,
                    cursor: "grab",
                  }}
                  onDragEnd={(e, info) => {
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = info.point.x - rect.left;
                    const y = info.point.y - rect.top;
                    setTitle({ ...title, position: { x, y } });
                  }}
                >
                  {title.title}
                </motion.div>

                {/* Body */}
                <motion.div
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  style={{
                    position: "absolute",
                    fontSize: body.fontSize,
                    color: body.fontColor,
                    cursor: "grab",
                  }}
                  onDragEnd={(e, info) => {
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = info.point.x - rect.left;
                    const y = info.point.y - rect.top;
                    setBody({ ...body, position: { x, y } });
                  }}
                >
                  {body.content}
                </motion.div>

                {/* Signature */}
                {signature && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    style={{
                      position: "absolute",
                      cursor: "grab",
                    }}
                    onDragEnd={(e, info) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      const x = info.point.x - rect.left;
                      const y = info.point.y - rect.top;
                      setSignaturePosition({ x, y });
                    }}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${getUrlFromFile(signature)})`,
                      }}
                    ></div>
                  </motion.div>
                )}

                {/* Stamp */}
                {stamp && (
                  <motion.div
                    drag
                    dragConstraints={containerRef}
                    dragMomentum={false}
                    style={{ position: "absolute", cursor: "grab" }}
                    onDragEnd={(e, info) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      const x = info.point.x - rect.left;
                      const y = info.point.y - rect.top;
                      setStampPosition({ x, y });
                    }}
                  >
                    <div>
                      <img
                        src={getUrlFromFile(stamp)}
                        alt="Stamp"
                        className="w-24"
                      />
                    </div>
                  </motion.div>
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
