import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import InstructorContext from "../../../../context/instructor/instructorContext";
import { toast } from "react-hot-toast";
import { ArrowLeft, Upload } from "lucide-react";

const EditInstructor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const instructorContext = useContext(InstructorContext);
  const { currentInstructor, loading, error, getInstructorById, updateInstructorStatus } = instructorContext;

  // Form state
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    language: "",
    currentLevel: "",
    fullAddress: "",
    country: "",
    socialProfile: "",
    phoneNumber: "",
    bio: "",
    commissionRate: "",
    resume: null,
    password: ""
  });

  // Photo upload state
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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
        role: currentInstructor.role || "instructor",
        name: currentInstructor.name || "",
        email: currentInstructor.email || "",
        dateOfBirth: currentInstructor.dateOfBirth || "",
        gender: currentInstructor.gender || "",
        qualification: currentInstructor.instructorProfile?.qualification || "",
        language: currentInstructor.instructorProfile?.teachLanguage?._id || "",
        currentLevel: currentInstructor.instructorProfile?.proficiencyLevel || "",
        fullAddress: currentInstructor.address || "",
        country: currentInstructor.country || "",
        socialProfile: currentInstructor.socialProfile || "",
        phoneNumber: currentInstructor.phoneNumber || "",
        bio: currentInstructor.instructorProfile?.bio || "",
        commissionRate: currentInstructor.instructorProfile?.commissionRate || "",
        password: ""
      });

      if (currentInstructor.photoUrl) {
        setPhotoPreview(currentInstructor.photoUrl);
      }
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

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        resume: file
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // In a real implementation, you would update all the instructor details
      // For now, we're only updating the status since that's the only API we have

      // Map frontend status to API status format
      const statusMap = {
        "instructor": "Active",
        "suspended": "Suspended",
        "pending": "Pending",
        "student": "Pending",
        "admin": "Active"
      };

      // Update instructor status
      await updateInstructorStatus(id, statusMap[formData.role] || "Pending");

      // Refresh instructor data
      await getInstructorById(id);

      toast.success("Instructor updated successfully");
      navigate(`/admin/instructors/${id}`);
    } catch (err) {
      toast.error("Failed to update instructor");
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
                Add / Edit User
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
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:justify-between mb-8">
                <div className="w-full md:w-3/4">
                  {/* Photo upload section */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-200">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">Photo</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">We only support JPG, JPEG, PNG file</p>
                      <div className="flex space-x-2">
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm">Upload Photo</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                        </label>
                        <button type="button" className="px-4 py-2 bg-yellow-400 text-white rounded-md text-sm">
                          Delete Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select the Role</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Highest qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest qualification</label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select the language you want to learn</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your email"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Language and Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Language</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="english">English</option>
                      <option value="german">German</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
                    <select
                      name="currentLevel"
                      value={formData.currentLevel}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Country and Social Profile */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Social Profile (Optional)</label>
                    <select
                      name="socialProfile"
                      value={formData.socialProfile}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                {/* Email address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Bio text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Bio text (30 words max)</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>

                {/* Commission Rate and Resume */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="commissionRate"
                        value={formData.commissionRate}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload your Resume</label>
                    <label className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md cursor-pointer">
                      <Upload size={20} className="mr-2" />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="mt-8">
                <div className="mb-4 text-sm text-gray-600">
                  By continuing, you agree to our <a href="#" className="text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-500">Privacy Policy</a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors"
                >
                  Submit
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
