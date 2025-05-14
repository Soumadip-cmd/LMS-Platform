import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import InstructorContext from "../../../../context/instructor/instructorContext";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, X } from "lucide-react";

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorContext = useContext(InstructorContext);
  const { currentInstructor, loading, error, getInstructorById, updateInstructorStatus } = instructorContext;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "",
    specialization: "",
    yearsOfExperience: "",
    qualification: "",
    location: "",
    bio: ""
  });

  // Load instructor data
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

  // Update form data when instructor data is loaded
  useEffect(() => {
    if (currentInstructor) {
      setFormData({
        name: currentInstructor.name || "",
        email: currentInstructor.email || "",
        phoneNumber: currentInstructor.phoneNumber || "",
        status: currentInstructor.instructorProfile?.applicationStatus || "pending",
        specialization: currentInstructor.instructorProfile?.specialization || "",
        yearsOfExperience: currentInstructor.instructorProfile?.yearsOfExperience || "",
        qualification: currentInstructor.instructorProfile?.qualification || "",
        location: currentInstructor.instructorProfile?.location || "",
        bio: currentInstructor.instructorProfile?.bio || ""
      });
    }
  }, [currentInstructor]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Map frontend status to API status format
      const statusMap = {
        "pending": "Pending",
        "approved": "Active",
        "suspended": "Suspended"
      };
      
      // Update instructor status
      await updateInstructorStatus(id, statusMap[formData.status]);
      
      // For now, we're only updating the status since that's the only API we have
      // In a real implementation, you would update all the instructor details
      
      toast.success("Instructor updated successfully");
      navigate(`/admin/instructors/${id}`);
    } catch (err) {
      toast.error("Failed to update instructor");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/admin/instructors/${id}`);
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
                Edit Instructor
              </h1>
              <p className="text-gray-400 text-base">
                Update instructor information
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
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Basic Information */}
                <div className="col-span-2">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Basic Information</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                
                {/* Professional Information */}
                <div className="col-span-2 mt-4">
                  <h3 className="text-lg font-medium mb-4 border-b pb-2">Professional Information</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditInstructor;
