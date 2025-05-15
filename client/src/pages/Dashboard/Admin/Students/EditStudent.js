import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import StudentContext from '../../../../context/student/studentContext';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentContext = useContext(StudentContext);
  const { getStudentById, updateStudent, currentStudent, loading, error } = studentContext;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    learningGoal: '',
    status: 'active',
    notes: ''
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        await getStudentById(id);
      } catch (err) {
        toast.error('Failed to load student data');
      }
    };

    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (currentStudent) {
      setFormData({
        name: currentStudent.name || '',
        email: currentStudent.email || '',
        phoneNumber: currentStudent.phoneNumber || '',
        learningGoal: currentStudent.learningGoal || '',
        status: currentStudent.status || 'active',
        notes: currentStudent.notes || ''
      });
    }
  }, [currentStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const updatedStudent = await updateStudent(id, formData);
      console.log('Updated student:', updatedStudent);
      toast.success('Student profile updated successfully');
      navigate(`/dashboard/admin/students/${id}`);
    } catch (err) {
      console.error('Error updating student:', err);
      toast.error('Failed to update student profile');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar active="Students" />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <AdminSidebar active="Students" />
        <div className="flex-1 p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading student data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStudent) {
    return (
      <div className="flex">
        <AdminSidebar active="Students" />
        <div className="flex-1 p-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Student not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar active="Students" />
      <div className="flex-1 p-4 lg:p-8 bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/dashboard/admin/students/${id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Student Profile
          </button>
          <h1 className="text-3xl font-bold mt-4 text-blue-600">Edit Student</h1>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center mr-4">
                {currentStudent.photoUrl ? (
                  <img
                    src={currentStudent.photoUrl}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-500 text-2xl font-bold">
                    {currentStudent.name?.charAt(0).toUpperCase() || 'S'}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                <p className="text-gray-500">Student ID: #{currentStudent._id?.substring(0, 8)}</p>
              </div>
            </div>

            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                formData.status === 'suspended' ? 'bg-red-500' :
                formData.status === 'pending' ? 'bg-yellow-400' :
                'bg-green-500'
              }`}></span>
              <span className={`font-medium ${
                formData.status === 'suspended' ? 'text-red-500' :
                formData.status === 'pending' ? 'text-yellow-400' :
                'text-green-500'
              }`}>
                {formData.status === 'suspended' ? 'Suspended' :
                 formData.status === 'pending' ? 'Pending' :
                 'Active'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  required
                  placeholder="Enter student's full name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="learningGoal">
                  Learning Goal
                </label>
                <select
                  id="learningGoal"
                  name="learningGoal"
                  value={formData.learningGoal}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg appearance-none bg-white"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"><path d=\"M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px" }}
                >
                  <option value="">Select a learning goal</option>
                  <option value="Casual">Casual</option>
                  <option value="Professional">Professional</option>
                  <option value="Exam Prep">Exam Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="status">
                  Account Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg appearance-none bg-white"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"><path d=\"M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px" }}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-bold mb-3 text-lg" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  rows="4"
                  placeholder="Add any additional notes about this student"
                ></textarea>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/admin/students/${id}`)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-bold text-lg"
              >
                <Save size={20} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
