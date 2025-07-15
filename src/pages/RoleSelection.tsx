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

  const handleRoleSelect = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            EXCEL
          </h1>
          <h2 className="text-2xl text-blue-600 font-medium mb-8">
            SCHOOL AI
          </h2>
          <div className="flex justify-center gap-2 mb-12">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-700 font-medium">
            I will be using Excel School AI as:
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.route)}
                className={`${role.bgColor} rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
              >
                <div className="text-center">
                  <div className={`${role.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
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