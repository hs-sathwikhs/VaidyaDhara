// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Bot } from 'lucide-react';

function Sidebar() {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-cyan-500 text-white shadow-lg'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-64 bg-gray-800 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-2 mb-4">
        <Bot className="w-10 h-10 text-cyan-400" />
        <div>
          <h1 className="text-xl font-bold text-white">Vaidya Dhara</h1>
          <p className="text-xs text-cyan-300">v1.0 Complex UI</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <NavLink to="/" className={navLinkClasses}>
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </NavLink>
        <NavLink to="/dashboard" className={navLinkClasses}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
      </nav>

      {/* Footer Info (Optional) */}
      <div className="mt-auto p-2 text-center text-xs text-gray-500">
        <p>Smart India Hackathon</p>
        <p>&copy; 2025</p>
      </div>
    </div>
  );
}

export default Sidebar;