import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { CalendarDays, BookHeart, ShoppingCart, User, Gem } from 'lucide-react';
import AdPlaceholder from './components/AdPlaceholder';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { Button } from './components/ui/button';

// דמה של API
const UserAPI = {
    me: async () => ({ id: 'user123', is_premium: false })
};

const navItems = [
  { name: 'תכנון שבועי', page: 'MealPlanner', icon: CalendarDays },
  { name: 'המתכונים שלי', page: 'Recipes', icon: BookHeart },
  { name: 'רשימת קניות', page: 'ShoppingList', icon: ShoppingCart },
  { name: 'פרופיל', page: 'Profile', icon: User },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    UserAPI.me().then(setUser);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans" dir="rtl">
      <PWAInstallPrompt />
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">MealMate</h1>
        {user && !user.is_premium && (
          <Link to={createPageUrl("Profile")}>
            <Button variant="outline" className="border-yellow-400 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600 animate-pulse">
              <Gem className="w-4 h-4 ml-2"/>שדרג לפרימיום
            </Button>
          </Link>
        )}
      </header>
      <main className={`flex-1 overflow-y-auto ${!user?.is_premium ? 'pb-32' : 'pb-20'}`}>{children}</main>
      {!user?.is_premium && (<div className="fixed bottom-[57px] left-0 right-0 z-10"><AdPlaceholder type="banner" /></div>)}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-20">
        <div className="flex justify-around max-w-lg mx-auto">
          {navItems.map((item) => {
            const url = createPageUrl(item.page);
            const isActive = location.pathname === url;
            return (
              <Link key={item.name} to={url} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-center transition-colors duration-200 ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-green-500'}`}>
                <item.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}