import { GraduationCap, Users, BookOpen, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      title: 'Admin',
      subtitle: 'System Administrator',
      icon: Shield,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      route: '/admin-dashboard'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      subtitle: 'Educator',
      icon: GraduationCap,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      route: '/tools'
    },
    {
      id: 'student',
      title: 'Student',
      subtitle: 'Learner',
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      route: '/student-dashboard'
    },
    {
      id: 'parent',
      title: 'Parent',
      subtitle: 'Guardian',
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      route: '/parent-dashboard'
    }
  ];

  const handleRoleSelect = (role: string, route: string) => {
    if (role === 'teacher') {
      navigate('/login');
    } else {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            EXCEL
          </h1>
          <h2 className="text-3xl text-blue-600 font-medium mb-8">
            SCHOOL AI
          </h2>
          <div className="flex justify-center gap-2 mb-16">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <p className="text-2xl text-gray-700 font-medium">
            I will be using Excel School AI as:
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id, role.route)}
                className="bg-white rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl group border-2 border-gray-100 hover:border-blue-200 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500 rounded-3xl"></div>
                
                <div className="text-center relative z-10">
                  <div className={`${role.color} w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {role.title}
                  </h3>
                  <p className="text-gray-500 text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {role.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          By continuing, you consent to the{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">privacy policy</span>
          {' '}and{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">terms of service</span>.
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;