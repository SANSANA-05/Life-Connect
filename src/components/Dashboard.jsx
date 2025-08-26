import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  FileText, 
  AlertTriangle, 
  User, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Users,
  Target,
  Award
} from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Heart },
    { id: 'find-donors', label: 'Find Donors', icon: Search },
    { id: 'my-requests', label: 'My Requests', icon: FileText },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Lives Saved', value: '12', icon: Heart, color: 'bg-red-500' },
    { label: 'Active Matches', value: '3', icon: Users, color: 'bg-blue-500' },
    { label: 'Donations', value: '8', icon: Target, color: 'bg-green-500' },
    { label: 'Achievement Points', value: '245', icon: Award, color: 'bg-purple-500' }
  ];

  const recentActivity = [
    { id: 1, type: 'match', message: 'New donor match found nearby', time: '2 hours ago', urgent: false },
    { id: 2, type: 'request', message: 'Blood request updated: O+ needed urgently', time: '4 hours ago', urgent: true },
    { id: 3, type: 'donation', message: 'Successful donation completed at City Hospital', time: '1 day ago', urgent: false },
    { id: 4, type: 'achievement', message: 'Milestone reached: 10 lives saved!', time: '2 days ago', urgent: false }
  ];

  const quickActions = [
    { label: 'Request Blood', icon: AlertTriangle, color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Find Donors', icon: Search, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Emergency Alert', icon: Phone, color: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'Update Profile', icon: User, color: 'bg-green-500 hover:bg-green-600' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || "John"}!</h2>
              <p className="text-red-100">Your next donation eligibility: March 15, 2024</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.urgent ? 'bg-red-100' : 'bg-blue-100'} p-2 rounded-lg`}>
                      <Activity className={`h-4 w-4 ${activity.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{activity.message}</p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 capitalize">
              {activeSection.replace('-', ' ')} Section
            </h2>
            <p className="text-gray-600">
              This is the {activeSection.replace('-', ' ')} section. Content for this section will be implemented based on your specific requirements.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-gray-800">LifeConnect</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-red-50 text-red-600 border-r-2 border-red-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={onLogout}
            className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.name || "John Smith"}</p>
                  <p className="text-xs text-gray-500">Blood Type: {user?.bloodType || "O+"}</p>
                </div>
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "JS"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;