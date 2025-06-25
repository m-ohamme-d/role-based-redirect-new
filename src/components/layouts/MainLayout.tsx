
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
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';

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
  const { signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear localStorage and redirect
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Get stored avatar from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const storedAvatar = localStorage.getItem('userAvatar');

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={links} role={role} userName={userName} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex justify-between items-center px-6 py-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {role} Dashboard
              </h1>
              {user && (
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time Notifications */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 animate-pulse"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[80vh]">
                  <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <DrawerTitle className="flex items-center gap-2">
                        Notifications
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          Live
                        </Badge>
                      </DrawerTitle>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllAsRead}
                            className="text-xs"
                          >
                            Mark all read
                          </Button>
                        )}
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
                        {notifications.slice(0, 10).map((notification) => (
                          <li 
                            key={notification.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-sm">{notification.title}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      notification.type === 'performance' ? 'bg-green-100 text-green-700' :
                                      notification.type === 'rating' ? 'bg-blue-100 text-blue-700' :
                                      notification.type === 'team' ? 'bg-purple-100 text-purple-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {notification.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                              </div>
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs ml-2"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark read
                                </Button>
                              )}
                            </div>
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
                      <AvatarImage src={storedAvatar || ""} alt={userName} />
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
