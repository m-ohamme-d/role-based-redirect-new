
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  links: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }[];
  role: string;
  userName: string;
  onLogout?: () => void;
}

const Sidebar = ({ links, role, userName, onLogout }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-white shadow-lg h-screen relative transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex flex-col h-full">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-8`}>
          <div className={collapsed ? 'hidden' : 'block'}>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {role}
            </h2>
            <p className="text-sm text-gray-600">Welcome, {userName}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <div className="flex-1">
          <nav className="space-y-2">
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className="mr-3">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <Button
            onClick={onLogout}
            variant="outline"
            className={`flex items-center gap-2 w-full ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
