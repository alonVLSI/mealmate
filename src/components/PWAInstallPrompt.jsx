import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.log('Installation failed:', error);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg animate-slide-down" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Download className="w-5 h-5 ml-2" />
          <div>
            <p className="font-semibold">התקן את MealMate</p>
            <p className="text-sm opacity-90">קבל גישה מהירה ונוחה לאפליקציה</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={handleInstall}>התקן</Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}><X className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}