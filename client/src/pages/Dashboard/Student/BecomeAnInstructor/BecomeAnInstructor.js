import React, { useState ,useEffect} from "react";
import { ChevronDown, Upload ,Calendar} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { SERVER_URI } from "../../../../utlils/ServerUri";
const BecomeAnInstructor = () => {
  const [formData, setFormData] = useState({
    teachLanguage: "",
    qualification: "",
    name: "",
    linkedin: "",
    dob: null,
    address: "",
    gender: "",
    country: "",
    email: "",
    contactNumber: "",
    password: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const navigate=useNavigate();
  useEffect(() => {
    const fetchLanguages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${SERVER_URI}/languages/all`);
        if (response.data.languages) {
          setLanguages(response.data.languages);
        }
      } catch (error) {
        console.error("Failed to fetch languages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);


  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date
    });
    // Clear error when user selects a date
    if (errors.dob) {
      setErrors({
        ...errors,
        dob: "",
      });
    }
  };


  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const resumeFile = e.target.files[0];

      // Update local state to show the filename
      setFormData({
        ...formData,
        resume: resumeFile
      });

      // Clear resume error if it exists
      if (errors.resume) {
        setErrors({
          ...errors,
          resume: "",
        });
      }

      // Upload the file immediately
      setUploadStatus("Uploading resume...");

      try {
        const formDataForUpload = new FormData();
        formDataForUpload.append('resume', resumeFile);

        // Using cookie-based authentication for file upload
        const response = await axios.post(
          `${SERVER_URI}/auth/upload-resume`,
          formDataForUpload,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
              // No Authorization header - rely on cookies only
            },
            withCredentials: true // This will send the cookies
          }
        );

        if (response.data.success) {
          setResumeUrl(response.data.fileUrl);
          setUploadStatus("Resume uploaded successfully!");
        }
      } catch (error) {
        console.error("Resume upload failed:", error);
        setErrors({
          ...errors,
          resume: error.response?.data?.message || "Failed to upload resume"
        });
        setUploadStatus("Resume upload failed!");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = {};
    const requiredFields = [
      'teachLanguage', 'qualification', 'name', 'dob',
      'address', 'gender', 'country', 'email',
      'contactNumber', 'password'
    ];

    requiredFields.forEach(field => {
      if (field !== 'dob' && !formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Special validation for date
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    }

    // Check if resume was uploaded
    if (!resumeUrl) {
      newErrors.resume = "Please upload your resume";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create the data to submit
    const submitData = {
      ...formData,
      dob: formData.dob ? formData.dob.toISOString().split('T')[0] : "",
      resumeUrl: resumeUrl
    };

    // Remove the actual file object as it can't be sent in JSON
    delete submitData.resume;

    try {
      // Using only cookie-based authentication
      const response = await axios.post(
        `${SERVER_URI}/auth/instructor/become-instructor`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json'
            // No Authorization header - rely on cookies only
          },
          withCredentials: true // This will send the cookies
        }
      );

      if (response.data.success) {

        alert("Your instructor application has been submitted successfully! You will receive an email with the application details.");
        navigate('/')

      }
    } catch (error) {
      console.error("Application submission failed:", error);

      // Show appropriate error message
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.response?.status === 401) {
        alert("Authentication failed. Please try logging in again before submitting.");
      } else {
        alert("Failed to submit application. Please try again later.");
      }
    }
  };
  // CSS classes for input fields - placeholder is gray, input text is black
  const inputClass =
    "w-full px-6 py-3 border border-[#8C8C8C] rounded-md text-black placeholder:text-[#8C8C8C]";
  const selectClass =
    "w-full px-6 py-3 border border-[#8C8C8C] rounded-md appearance-none pr-8 text-black";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="flex justify-center items-center p-2 mt-4 md:p-4 bg-gray-50 md:mt-0">
      <div className="w-full m-1 md:m-2 lg:mx-4 xl:mx-12 p-3 md:py-9 md:px-12 xl:pr-40 bg-white rounded-lg pt-5">
        <h1 className="text-3xl md:text-[2.8rem] xl:text-5xl font-semibold text-blue-500 mb-6 md:mb-12 xl:mb-6">
          Become an Instructor!
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 xl:gap-44">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Which language do you want to teach?
                </label>
                <div className="relative">
                <select
      name="teachLanguage"
      value={formData.teachLanguage}
      onChange={handleChange}
      className={selectClass}
      style={{ color: formData.teachLanguage ? 'black' : '#8C8C8C' }}
      required
      disabled={isLoading}
    >
      <option value="" disabled selected className="text-[#8C8C8C]">
        {isLoading ? "Loading languages..." : "Select the language you want to teach"}
      </option>
      {languages.map(lang => (
        <option key={lang._id} value={lang._id} className="text-black">
          {lang.name}
        </option>
      ))}
    </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.teachLanguage && <p className={errorClass}>{errors.teachLanguage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputClass}
                  required
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="Enter your date of birth"
                  className={inputClass}
                  required
                />
                {errors.dob && <p className={errorClass}>{errors.dob}</p>}
              </div> */}
             <div>
  <label className="block text-sm font-medium mb-2">
    Date of Birth
  </label>
  <div className="relative">
    <DatePicker
      selected={formData.dob ? new Date(formData.dob) : null}
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy"
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
      placeholderText="Select your date of birth"
      className={`${inputClass} pl-10`}
      maxDate={new Date()} // Prevents future dates
      showMonthDropdown
      dropdownMode="select"
      required
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <Calendar className="h-5 w-5 text-gray-400" />
    </div>
  </div>
  {errors.dob && <p className={errorClass}>{errors.dob}</p>}
</div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={selectClass}
                    style={{ color: formData.gender ? 'black' : '#8C8C8C' }}
                    required
                  >
                    <option value="" disabled selected className="text-[#8C8C8C]">
                      Enter your Gender
                    </option>
                    <option value="male" className="text-black">Male</option>
                    <option value="female" className="text-black">Female</option>
                    <option value="other" className="text-black">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.gender && <p className={errorClass}>{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={inputClass}
                  required
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={inputClass}
                  required
                />
                {errors.password && <p className={errorClass}>{errors.password}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Which is your highest qualification
                </label>
                <div className="relative">
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={selectClass}
                    style={{ color: formData.qualification ? 'black' : '#8C8C8C' }}
                    required
                  >
                    <option value="" disabled selected className="text-[#8C8C8C]">
                      Select your highest qualification
                    </option>
                    <option value="high-school" className="text-black">High School</option>
                    <option value="bachelors" className="text-black">Bachelor's Degree</option>
                    <option value="masters" className="text-black">Master's Degree</option>
                    <option value="phd" className="text-black">PhD</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.qualification && <p className={errorClass}>{errors.qualification}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add your LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="Enter your LinkedIn URL (optional)"
                  className={inputClass}
                  // Not required as this is optional
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  className={inputClass}
                  required
                />
                {errors.address && <p className={errorClass}>{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={selectClass}
                    style={{ color: formData.country ? 'black' : '#8C8C8C' }}
                    required
                  >
                    <option value="" disabled selected className="text-[#8C8C8C]">
                      Select your country
                    </option>
                    <option value="us" className="text-black">United States</option>
                    <option value="ca" className="text-black">Canada</option>
                    <option value="uk" className="text-black">United Kingdom</option>
                    <option value="other" className="text-black">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {errors.country && <p className={errorClass}>{errors.country}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className={inputClass}
                  required
                />
                {errors.contactNumber && <p className={errorClass}>{errors.contactNumber}</p>}
              </div>

              {/* <div>
                <label className="block text-sm font-medium mb-2">
                  Upload your Resume
                </label>
                <label className="w-full px-6 py-3 border border-[#8C8C8C] rounded-md flex items-center px-4 cursor-pointer bg-white">
                  <Upload className="h-5 w-5 text-[#8C8C8C] mr-2" />
                  <span className="text-[#8C8C8C]">
                    {formData.resume ? formData.resume.name : "Upload your resume"}
                  </span>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
                {errors.resume && <p className={errorClass}>{errors.resume}</p>}
              </div> */}
<div>
  <label className="block text-sm font-medium mb-2">
    Upload your Resume
  </label>
  <label className="w-full px-6 py-3 border border-[#8C8C8C] rounded-md flex items-center px-4 cursor-pointer bg-white">
    <Upload className="h-5 w-5 text-[#8C8C8C] mr-2" />
    <span className={formData.resume ? "text-black" : "text-[#8C8C8C]"}>
      {formData.resume ? formData.resume.name : "Upload your resume"}
    </span>
    <input
      type="file"
      name="resume"
      onChange={handleFileChange}
      className="hidden"
      required
      accept=".pdf,.doc,.docx"
    />
  </label>
  {uploadStatus && (
    <p className={uploadStatus.includes("success") ? "text-green-500 text-xs mt-1" : "text-blue-500 text-xs mt-1"}>
      {uploadStatus}
    </p>
  )}
  {resumeUrl && (
    <div className="mt-2">
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-xs hover:underline"
      >
        View uploaded resume
      </a>
    </div>
  )}
  {errors.resume && <p className={errorClass}>{errors.resume}</p>}
</div>
              <div className="mt-[50px] md:mt-14">
                <div className="text-xs text-center px-4 md:p-0 text-[#8C8C8C] md:mb-2 mb-3">
                  By continuing, you agree to our{" "}
                  <span className="block md:inline">
                    <Link
                      to="/legal/terms-of-service"
                      className="text-black font-semibold hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/legal/privacy-policy"
                      className="text-black font-semibold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>
                <button
                  type="submit"
                  className="py-3 w-full bg-[#FFB71C] text-white font-medium rounded-lg hover:bg-yellow-400 hover:text-[#0D47A1]"
                >
                  Become an Instructor
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeAnInstructor;