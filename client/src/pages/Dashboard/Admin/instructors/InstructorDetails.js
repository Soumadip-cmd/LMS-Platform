import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import InstructorContext from "../../../../context/instructor/instructorContext";
import { toast } from "react-hot-toast";
import { ArrowLeft, Mail, Phone, Calendar, Award, BookOpen, DollarSign, Edit, User, MapPin, Briefcase, Clock } from "lucide-react";

const InstructorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorContext = useContext(InstructorContext);
  const { currentInstructor, loading, error, getInstructorById } = instructorContext;

  // Local state for formatted date
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const fetchInstructorDetails = async () => {
      try {
        await getInstructorById(id);
      } catch (err) {
        toast.error("Failed to load instructor details");
      }
    };

    fetchInstructorDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // Format the date when instructor data is loaded
    if (currentInstructor && currentInstructor.createdAt) {
      const date = new Date(currentInstructor.createdAt);
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    }
  }, [currentInstructor]);

  // Function to get status class
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-500 text-white";
    
    const applicationStatus = 
      status === "approved" ? "Active" :
      status === "suspended" ? "Suspended" : "Pending";
      
    switch (applicationStatus) {
      case "Active":
        return "bg-blue-500 text-white";
      case "Suspended":
        return "bg-red-500 text-white";
      case "Pending":
        return "bg-yellow-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to format status text
  const formatStatus = (status) => {
    if (!status) return "Pending";
    return status === "approved" ? "Active" : status === "suspended" ? "Suspended" : "Pending";
  };

  return (
    <div className="flex">
      <AdminSidebar active="Instructors" />

      {/* Main content area */}
      <div className="flex-1 pl-0 overflow-x-auto">
        <div className="p-4 lg:p-6 pt-9">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/dashboard/admin/instructors")}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-medium text-gray-600">
                Instructor Details
              </h1>
              <p className="text-gray-400 text-base">
                View and manage instructor information
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
              <span className="ml-3 text-lg text-gray-500">Loading instructor details...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p className="text-xl">Error loading instructor details</p>
              <p className="mt-2">{error}</p>
            </div>
          ) : currentInstructor ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Instructor profile */}
              <div className="col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                      <img
                        src={currentInstructor.photoUrl || "https://placehold.co/200x200"}
                        alt={currentInstructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-semibold">{currentInstructor.name}</h2>
                    <p className="text-gray-500 mb-2">{currentInstructor.email}</p>
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getStatusClass(
                        currentInstructor.instructorProfile?.applicationStatus
                      )}`}
                    >
                      {formatStatus(currentInstructor.instructorProfile?.applicationStatus)}
                    </span>
                    <div className="mt-6 w-full">
                      <button
                        onClick={() => navigate(`/dashboard/admin/instructors/edit/${id}`)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail size={18} className="text-gray-500 mr-3" />
                        <span>{currentInstructor.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone size={18} className="text-gray-500 mr-3" />
                        <span>{currentInstructor.phoneNumber || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={18} className="text-gray-500 mr-3" />
                        <span>Joined on {formattedDate}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={18} className="text-gray-500 mr-3" />
                        <span>{currentInstructor.instructorProfile?.location || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Instructor details */}
              <div className="col-span-1 lg:col-span-2">
                {/* Professional Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Specialization</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.specialization || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Experience</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.yearsOfExperience || "0"} years</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Teaching Language</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.teachLanguage?.name || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Qualification</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.qualification || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-500 text-sm mb-1">Bio</p>
                    <p className="text-gray-700">{currentInstructor.instructorProfile?.bio || "No bio provided."}</p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-medium mb-4">Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <BookOpen size={20} className="text-blue-500 mr-2" />
                        <span className="text-gray-600 font-medium">Courses</span>
                      </div>
                      <p className="text-2xl font-bold">{currentInstructor.instructorProfile?.courses?.length || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <User size={20} className="text-green-500 mr-2" />
                        <span className="text-gray-600 font-medium">Students</span>
                      </div>
                      <p className="text-2xl font-bold">{currentInstructor.instructorProfile?.totalStudents || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign size={20} className="text-yellow-500 mr-2" />
                        <span className="text-gray-600 font-medium">Earnings</span>
                      </div>
                      <p className="text-2xl font-bold">${currentInstructor.instructorProfile?.earnings || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Courses</h3>
                    <button className="text-blue-500 text-sm font-medium">View All</button>
                  </div>
                  
                  {currentInstructor.instructorProfile?.courses?.length > 0 ? (
                    <div className="space-y-4">
                      {/* Course items would go here */}
                      <p className="text-gray-500">Course list would be displayed here</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No courses created yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">Instructor not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
