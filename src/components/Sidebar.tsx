import { User } from '../App';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Fuel, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'daily-operations', label: 'Daily Operations', icon: FileText },
  { id: 'tanks-meters', label: 'Tanks & Meters', icon: Fuel },
  { id: 'price-management', label: 'Price Management', icon: DollarSign },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, currentUser, onLogout, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className={`bg-[#001E2B] text-white flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`p-6 border-b border-gray-700 ${isCollapsed ? 'p-4' : ''}`}>
          <div className={`flex items-center mb-4 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-[#00796B] flex items-center justify-center flex-shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="text-white">Fuel Manager</div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="text-white">{currentUser.name}</div>
              <div className="text-gray-400 text-sm capitalize">{currentUser.role}</div>
            </div>
          )}
          {isCollapsed && (
            <div className="mt-2 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-sm">{currentUser.name.charAt(0)}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            const button = (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center rounded-lg transition-colors ${
                  isCollapsed ? 'justify-center px-4 py-3' : 'space-x-3 px-4 py-3'
                } ${
                  isActive
                    ? 'bg-[#00796B] text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    {button}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return button;
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Button
            onClick={onToggleCollapse}
            variant="outline"
            className={`w-full flex items-center border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white ${
              isCollapsed ? 'justify-center px-0' : 'justify-center space-x-2'
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
          
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="w-full flex items-center justify-center border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                Logout
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
