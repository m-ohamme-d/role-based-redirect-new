
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { 
  Bell, 
  User, 
  LogOut, 
  FileText, 
  HelpCircle, 
  X
} from 'lucide-react';
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  links: {
    to: string;
    icon: React.ReactNode;
    label: string;
  }[];
  role: string;
  userName: string;
}

const MainLayout = ({ links, role, userName }: MainLayoutProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Report Due',
      message: 'Monthly report is due today',
      time: '1 hour ago',
      read: false
    },
    {
      id: 2,
      title: 'New Task Assigned',
      message: 'You have been assigned a new task',
      time: '3 hours ago',
      read: false
    },
    {
      id: 3,
      title: 'Meeting Reminder',
      message: 'Team meeting in 30 minutes',
      time: '1 day ago',
      read: true
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={links} role={role} userName={userName} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center px-6 py-3">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {role} Dashboard
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                  <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <DrawerTitle>Notifications</DrawerTitle>
                      <div className="flex gap-2">
                        <Link to="/notifications" className="text-sm text-blue-600 hover:underline">
                          View all
                        </Link>
                        <DrawerClose>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </DrawerClose>
                      </div>
                    </div>
                  </DrawerHeader>
                  <div className="p-4 overflow-auto">
                    {notifications.length > 0 ? (
                      <ul className="space-y-3">
                        {notifications.map((notification) => (
                          <li 
                            key={notification.id}
                            className={`p-3 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                          >
                            <div className="flex justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs mt-2"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-6 text-gray-500">No notifications</p>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="bg-primary text-white">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${role === 'admin' ? 'admin' : role}/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${role === 'admin' ? 'admin' : role}/settings`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-purple-50 via-white to-red-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
