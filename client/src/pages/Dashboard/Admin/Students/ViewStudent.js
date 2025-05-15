import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import StudentContext from '../../../../context/student/studentContext';
import { ArrowLeft, Mail, Phone, Calendar, Book, DollarSign, Award, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ViewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentContext = useContext(StudentContext);
  const { getStudentById, suspendStudent, updateStudent, currentStudent, loading, error } = studentContext;
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const student = await getStudentById(id);
        console.log('Fetched student data:', student);
      } catch (err) {
        console.error('Error fetching student:', err);
        toast.error('Failed to load student data');
      }
    };

    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    // This would normally fetch the student's enrolled courses
    // For now, we'll use dummy data
    if (currentStudent) {
      console.log('Current student in ViewStudent:', currentStudent);
      setEnrolledCourses([
        {
          id: '1',
          name: 'German A1 Level',
          progress: 75,
          startDate: '2023-10-15',
          completionDate: '2024-01-15',
          status: 'In Progress'
        },
        {
          id: '2',
          name: 'Spanish Basics',
          progress: 100,
          startDate: '2023-08-01',
          completionDate: '2023-10-01',
          status: 'Completed'
        }
      ]);
    }
  }, [currentStudent]);

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

  // Handle suspend or reactivate account
  const handleSuspendAccount = async () => {
    try {
      if (currentStudent.status === 'suspended') {
        // Reactivate the account
        await updateStudent(id, { status: 'active' });
        setShowSuspendModal(false);
        toast.success('Student account has been reactivated');
      } else {
        // Suspend the account
        await suspendStudent(id);
        setShowSuspendModal(false);
        toast.success('Student account has been suspended');
      }
    } catch (err) {
      toast.error(`Failed to ${currentStudent.status === 'suspended' ? 'reactivate' : 'suspend'} student account`);
    }
  };

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
            onClick={() => navigate('/dashboard/admin/students')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Students
          </button>
          <h1 className="text-3xl font-bold mt-4 text-blue-600">Student Profile</h1>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {currentStudent.photoUrl ? (
                  <img
                    src={currentStudent.photoUrl}
                    alt={currentStudent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-4xl font-bold">
                    {currentStudent.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Link
                  to={`/dashboard/admin/students/edit/${currentStudent._id}`}
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition text-center font-bold"
                >
                  Edit Profile
                </Link>
                {currentStudent.status === 'suspended' ? (
                  <button
                    className="border-2 border-green-500 text-green-500 px-5 py-3 rounded-lg hover:bg-green-50 transition font-bold"
                    onClick={() => setShowSuspendModal(true)}
                  >
                    Reactivate Account
                  </button>
                ) : (
                  <button
                    className="border-2 border-red-500 text-red-500 px-5 py-3 rounded-lg hover:bg-red-50 transition font-bold"
                    onClick={() => setShowSuspendModal(true)}
                  >
                    Suspend Account
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold">{currentStudent.name}</h2>
                  <p className="text-gray-500 text-lg">Student ID: #{currentStudent._id?.substring(0, 8)}</p>
                </div>

                <div className="flex items-center mt-2 sm:mt-0">
                  <span className={`inline-block w-4 h-4 rounded-full mr-2 ${
                    currentStudent.status === 'suspended' ? 'bg-red-500' :
                    currentStudent.status === 'pending' ? 'bg-yellow-400' :
                    'bg-green-500'
                  }`}></span>
                  <span className={`font-bold text-lg ${
                    currentStudent.status === 'suspended' ? 'text-red-500' :
                    currentStudent.status === 'pending' ? 'text-yellow-400' :
                    'text-green-500'
                  }`}>
                    {currentStudent.status === 'suspended' ? 'Suspended' :
                     currentStudent.status === 'pending' ? 'Pending' :
                     'Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 font-medium mb-1">Email</p>
                  <div className="flex items-center">
                    <Mail size={20} className="text-blue-500 mr-3" />
                    <span className="text-lg font-bold">{currentStudent.email}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 font-medium mb-1">Phone</p>
                  <div className="flex items-center">
                    <Phone size={20} className="text-blue-500 mr-3" />
                    <span className="text-lg font-bold">{currentStudent.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 font-medium mb-1">Join Date</p>
                  <div className="flex items-center">
                    <Calendar size={20} className="text-blue-500 mr-3" />
                    <span className="text-lg font-bold">{new Date(currentStudent.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 font-medium mb-1">Learning Goal</p>
                  <div className="flex items-center">
                    <Award size={20} className="text-blue-500 mr-3" />
                    <span className="text-lg font-bold">{currentStudent.learningGoal || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {currentStudent.notes && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-500 font-medium mb-1">Notes</p>
                  <p className="text-gray-800">{currentStudent.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Enrolled Courses</h2>

          {enrolledCourses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-500 text-lg">No courses enrolled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-gray-600 font-bold">Course Name</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-bold">Progress</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-bold">Start Date</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-bold">Completion Date</th>
                    <th className="px-6 py-3 text-left text-gray-600 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledCourses.map(course => (
                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{course.name}</td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 mt-1">{course.progress}%</span>
                      </td>
                      <td className="px-6 py-4">{new Date(course.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(course.completionDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          course.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Account Status Confirmation Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className={`flex items-center ${currentStudent.status === 'suspended' ? 'text-green-500' : 'text-red-500'} mb-6`}>
              <AlertTriangle className="mr-3" size={28} />
              <h3 className="text-2xl font-bold">
                {currentStudent.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </h3>
            </div>
            <p className="mb-8 text-gray-600 text-lg leading-relaxed">
              {currentStudent.status === 'suspended'
                ? `Are you sure you want to reactivate ${currentStudent.name}'s account? This will restore their access to the platform.`
                : `Are you sure you want to suspend ${currentStudent.name}'s account? This will prevent them from accessing the platform until their account is reactivated.`
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold text-lg"
                onClick={() => setShowSuspendModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-6 py-3 ${currentStudent.status === 'suspended' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg font-bold text-lg`}
                onClick={handleSuspendAccount}
              >
                {currentStudent.status === 'suspended' ? 'Reactivate Account' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
