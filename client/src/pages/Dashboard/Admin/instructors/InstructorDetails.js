import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import InstructorContext from "../../../../context/instructor/instructorContext";
import { toast } from "react-hot-toast";
import { ArrowLeft, Mail, Phone, Calendar, Award, BookOpen, DollarSign, Edit, User, MapPin, Briefcase, Clock, Download } from "lucide-react";

const InstructorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorContext = useContext(InstructorContext);
  const { currentInstructor, loading, error, getInstructorById, updateInstructorStatus } = instructorContext;

  // Local state for formatted date
  const [formattedDate, setFormattedDate] = useState("");

  // State to track if we need to refresh data
  const [refreshData, setRefreshData] = useState(false);

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
  }, [id, refreshData]);

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

  // Handle resume download
  const handleResumeDownload = () => {
    if (currentInstructor?.instructorProfile?.resumeUrl) {
      // If there's a resume URL, open it in a new tab
      window.open(currentInstructor.instructorProfile.resumeUrl, '_blank');
    } else {
      toast.error("No resume available for download");
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (!currentInstructor) return;

    try {
      const currentStatus = currentInstructor.instructorProfile?.applicationStatus;
      let newStatus;

      // Cycle through statuses: approved -> suspended -> pending -> approved
      if (currentStatus === "approved") {
        newStatus = "Suspended";
      } else if (currentStatus === "suspended") {
        newStatus = "Pending";
      } else {
        newStatus = "Active";
      }

      await updateInstructorStatus(id, newStatus);

      // Refresh the data
      setRefreshData(!refreshData);

      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
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
              <h1 className="text-2xl font-medium text-blue-500">
                Instructor Details
              </h1>
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
            <div className="bg-white rounded-lg p-6 max-w-7xl mx-auto">
              {/* Profile header with photo and actions */}
              <div className="flex flex-col md:flex-row md:justify-between mb-8">
                <div className="flex items-center mb-6 md:mb-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-200">
                    <img
                      src={currentInstructor.photoUrl || "https://placehold.co/200x200"}
                      alt={currentInstructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{currentInstructor.name}</h2>
                    <p className="text-gray-500">{currentInstructor.email}</p>
                    <span
                      onClick={handleStatusChange}
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium mt-2 cursor-pointer ${getStatusClass(
                        currentInstructor.instructorProfile?.applicationStatus
                      )}`}
                      title="Click to change status"
                    >
                      {formatStatus(currentInstructor.instructorProfile?.applicationStatus)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => navigate(`/admin/instructors/edit/${id}`)}
                    className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 px-4 rounded-md"
                  >
                    <Edit size={20} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleResumeDownload}
                    className="flex items-center justify-center gap-2 bg-yellow-400 text-white py-2 px-4 rounded-md"
                  >
                    <Download size={20} />
                    Download Resume
                  </button>
                </div>
              </div>

              {/* Information sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Full Name</p>
                      <p className="font-medium">{currentInstructor.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Email</p>
                      <p className="font-medium">{currentInstructor.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Phone</p>
                      <p className="font-medium">{currentInstructor.phoneNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Gender</p>
                      <p className="font-medium">{currentInstructor.gender || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Date of Birth</p>
                      <p className="font-medium">{currentInstructor.dateOfBirth || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Address</p>
                      <p className="font-medium">{currentInstructor.address || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Country</p>
                      <p className="font-medium">{currentInstructor.country || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Joined On</p>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Professional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Role</p>
                      <p className="font-medium">{currentInstructor.role || "Instructor"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Qualification</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.qualification || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Teaching Language</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.teachLanguage?.name || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Proficiency Level</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.proficiencyLevel || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Experience</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.yearsOfExperience || "0"} years</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Commission Rate</p>
                      <p className="font-medium">{currentInstructor.instructorProfile?.commissionRate || "0"}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Social Profile</p>
                      <p className="font-medium">{currentInstructor.socialProfile || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white border rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Bio</h3>
                  <p className="text-gray-700">{currentInstructor.instructorProfile?.bio || "No bio provided."}</p>
                </div>

                {/* Statistics */}
                <div className="bg-white border rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Statistics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="bg-white border rounded-lg p-6 md:col-span-2">
                  <div className="flex justify-between items-center mb-4 border-b pb-2">
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
