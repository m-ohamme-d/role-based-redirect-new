
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and redirect based on role
    const user = localStorage.getItem('user');
    const authToken = localStorage.getItem('authToken');
    
    if (user && authToken) {
      const userData = JSON.parse(user);
      switch (userData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'manager':
          navigate('/manager/dashboard');
          break;
        case 'teamlead':
          navigate('/teamlead/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
