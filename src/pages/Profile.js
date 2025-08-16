
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../entities/User';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Gem, CheckCircle, ShieldCheck, CreditCard, User as UserIcon } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { createPageUrl } from '../utils';


export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        User.me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setIsLoading(false));
    }, []);

    const handleLogout = async () => {
        await User.logout();
        window.location.reload();
    };

    const handleLogin = async () => {
        await User.login();
    };
    
    if (isLoading) {
        return (
             <div className="p-4 md:p-8 max-w-2xl mx-auto" dir="rtl">
                <Skeleton className="h-8 w-1/3 mb-6"/>
                <Card><CardContent className="p-6"><Skeleton className="h-20 w-full"/></CardContent></Card>
                <Card className="mt-8"><CardContent className="p-6"><Skeleton className="h-40 w-full"/></CardContent></Card>
             </div>
        )
    }

    if (!user) {
        return (
            <div className="p-4 md:p-8 max-w-2xl mx-auto text-center" dir="rtl">
                <h2 className="text-3xl font-bold mb-6">ברוך הבא ל-MealMate</h2>
                <p className="text-gray-600 mb-4">התחבר כדי לנהל את המתכונים והתכנונים שלך.</p>
                <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700">
                    התחבר / הירשם
                </Button>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto" dir="rtl">
            <h2 className="text-3xl font-bold mb-6">שלום, {user.full_name}!</h2>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5"/>
                        פרטי החשבון
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4"><strong>אימייל:</strong> {user.email}</p>
                    {user.is_premium ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-green-600"/>
                            <div>
                                <p className="font-bold text-green-800">משתמש פרימיום פעיל! 🎉</p>
                                <p className="text-sm text-green-600">
                                    המנוי שלך בתוקף עד: {format(new Date(user.premium_expiry_date), 'dd/MM/yyyy', { locale: he })}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600">סטטוס: משתמש חינמי</p>
                    )}
                </CardContent>
            </Card>

            {!user.is_premium && (
                <Card className="mb-8 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-yellow-700">
                            <Gem className="w-5 h-5"/>
                            שדרג לפרימיום
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600"/><span>הסרת כל הפרסומות</span></div>
                            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600"/><span>הדפסת רשימות קניות</span></div>
                            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600"/><span>שמירת מתכונים בלתי מוגבלת</span></div>
                            <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-green-600"/><span>תמיכה מועדפת</span></div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-2xl text-green-600">₪120</p>
                                    <p className="text-sm text-gray-600">לשנה שלמה</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-green-600 font-semibold">הצעה מיוחדת!</p>
                                </div>
                            </div>
                        </div>

                        <Link to={createPageUrl("Payment")} className="w-full">
                            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3">
                                <CreditCard className="w-4 h-4 ml-2" />
                                שדרג עכשיו
                            </Button>
                        </Link>
                        
                        <p className="text-xs text-center text-gray-500 mt-2">
                            תשלום שנתי חד פעמי. ללא חידוש אוטומטי.
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>אפשרויות נוספות</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="w-full"
                    >
                        התנתק מהחשבון
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
