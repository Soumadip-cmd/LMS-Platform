import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import toast from "react-hot-toast";
import AdminSidebar from "../../../AdminSidebar";
import AdminNavbar from "../../../../../../components/Header/AdminNavbar";

const AddQuiz = ({ sectionName, onSave, onCancel }) => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizSummary, setQuizSummary] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Question 1",
      description: "",
      type: "TrueFalse",
      correctAnswer: "True",
      options: ["True", "False"],
      explanation: "",
      points: 1,
      settings: {
        required: true,
        displayPoints: true,
        randomizeChoice: false,
        imageMatching: false,
        multipleCorrect: false,
      },
    },
  ]);
  const [activeQuestion, setActiveQuestion] = useState(1);

  const handleAddQuestion = () => {
    const newQuestionId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newQuestionId,
        title: `Question ${newQuestionId}`,
        description: "",
        type: "TrueFalse",
        correctAnswer: "True",
        options: ["True", "False"],
        explanation: "",
        points: 1,
        settings: {
          required: true,
          displayPoints: true,
          randomizeChoice: false,
          imageMatching: false,
          multipleCorrect: false,
        },
      },
    ]);
    setActiveQuestion(newQuestionId);
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSettingChange = (id, setting, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? { ...q, settings: { ...q.settings, [setting]: value } }
          : q
      )
    );
  };

  const handleSave = () => {
    if (!quizTitle.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (questions.length === 0) {
      toast.error("At least one question is required");
      return;
    }

    onSave({
      title: quizTitle,
      summary: quizSummary,
      questions,
    });

    // Show success toast
    toast.success("Quiz added successfully");
  };

  return (
    <div className="flex-1 bg-white">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={onCancel}
                  className="mr-4 text-blue-500"
                >
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-medium text-gray-700">Add Quiz</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-400 rounded-md text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </header>

        {/* Main content scrollable area */}
        <main className="overflow-y-auto p-4">
          {/* Course Builder Header */}
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium uppercase text-gray-500 mr-4">COURSE BUILDER</span>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">
                    1
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Basics</span>
                </div>
                <div className="w-8 mx-2 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs">
                    2
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Course Material</span>
                </div>
                <div className="w-8 mx-2 h-px bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    3
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Additional</span>
                </div>
              </div>
            </div>
          </div>

        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-gray-700">Section Name : </span>
            <span className="text-blue-500 ml-1">&lt; {sectionName || "Section 1"} &gt;</span>
          </div>
        </div>

        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => {}}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
          >
            Quiz Settings
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-4">Quiz Title and Summary</h3>
          <div className="mb-4">
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Add a Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <textarea
              value={quizSummary}
              onChange={(e) => setQuizSummary(e.target.value)}
              placeholder="Add Content"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Questions</h3>
              <button
                onClick={handleAddQuestion}
                className="flex items-center justify-center px-3 py-1 bg-yellow-400 rounded-md text-white"
              >
                <Plus size={16} className="mr-1" />
                Add a Question
              </button>
            </div>
            <div className="space-y-2">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    activeQuestion === question.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveQuestion(question.id)}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm mr-2">
                    {question.id}
                  </div>
                  <span className="text-gray-700">{question.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            {questions.map(
              (question) =>
                activeQuestion === question.id && (
                  <div key={question.id}>
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Question Title</h3>
                      <input
                        type="text"
                        value={question.title}
                        onChange={(e) =>
                          handleQuestionChange(question.id, "title", e.target.value)
                        }
                        placeholder="Question 1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                      />
                    </div>

                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Question Description (Optional)</h3>
                      <div className="border border-gray-300 rounded-md">
                        <div className="bg-gray-100 p-2 border-b border-gray-300">
                          <div className="flex items-center space-x-2">
                            <select className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">
                              <option>Paragraph</option>
                            </select>
                            <div className="flex items-center space-x-1">
                              <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                              <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                              <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                            </div>
                          </div>
                        </div>
                        <textarea
                          value={question.description}
                          onChange={(e) =>
                            handleQuestionChange(
                              question.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Add description..."
                          className="w-full px-4 py-2 border-none focus:outline-none min-h-[100px]"
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Question Type</h3>
                        <div className="flex items-center mb-4">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm mr-2">
                            <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                          </div>
                          <span>True False</span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center p-2 bg-green-100 rounded-md mb-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mr-2">
                              ✓
                            </div>
                            <span>True</span>
                          </div>
                          <div className="flex items-center p-2 border border-gray-300 rounded-md">
                            <input
                              type="text"
                              value="False"
                              readOnly
                              className="w-full border-none focus:outline-none bg-transparent"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Answer Explanation</h3>
                          <textarea
                            value={question.explanation}
                            onChange={(e) =>
                              handleQuestionChange(
                                question.id,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Write answer explanation..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none min-h-[80px]"
                          ></textarea>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Conditions</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Answer Required</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.settings.required}
                                onChange={(e) =>
                                  handleSettingChange(
                                    question.id,
                                    "required",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Point For This Question</span>
                            <input
                              type="number"
                              min="0"
                              value={question.points}
                              onChange={(e) =>
                                handleQuestionChange(
                                  question.id,
                                  "points",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none text-center"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Display Points</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.settings.displayPoints}
                                onChange={(e) =>
                                  handleSettingChange(
                                    question.id,
                                    "displayPoints",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Randomize Choice</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.settings.randomizeChoice}
                                onChange={(e) =>
                                  handleSettingChange(
                                    question.id,
                                    "randomizeChoice",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Image Matching</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.settings.imageMatching}
                                onChange={(e) =>
                                  handleSettingChange(
                                    question.id,
                                    "imageMatching",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Multiple Correct Answer</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={question.settings.multipleCorrect}
                                onChange={(e) =>
                                  handleSettingChange(
                                    question.id,
                                    "multipleCorrect",
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        </main>
    </div>
  );
};

export default AddQuiz;
