import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../entities/User';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CreditCard, Lock, Loader2, AlertCircle, Check } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function PaymentPage() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // זהו הקוד שתחליף אחרי שתקבל את פרטי Grow
    const handleGrowPayment = async () => {
        try {
            // *** החלף את זה בקישור התשלום שלך מ-Grow ***
            // window.location.href = `https://your-grow-payment-link-for-120`;

            // עד שלא תחליף בקוד האמיתי - זה ידמה תשלום מוצלח
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            
            await User.updateMyUserData({
                is_premium: true,
                premium_expiry_date: expiryDate.toISOString(),
                subscription_type: 'yearly' // קובע שהמנוי הוא שנתי
            });

            alert(`השדרוג למנוי שנתי בוצע בהצלחה! 🎉`);
            navigate(createPageUrl('Profile'));

        } catch (error) {
            console.error("Payment failed:", error);
            setError('שגיאה בעיבוד התשלום. אנא נסה שוב.');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');
        await handleGrowPayment();
        setIsProcessing(false);
    };

    return (
        <div className="p-4 md:p-8 max-w-lg mx-auto" dir="rtl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">שדרג ל-MealMate פרימיום</h1>
                <p className="text-gray-600">גישה מלאה לכל האפשרויות למשך שנה שלמה.</p>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 mb-6">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                <h3 className="font-bold text-green-800 mb-4 text-center">מה תקבל בפרימיום:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-700">הסרת כל הפרסומות</span></div>
                    <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-700">הדפסת רשימות קניות</span></div>
                    <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-700">גיבוי מתכונים בענן</span></div>
                    <div className="flex items-center gap-3"><Check className="w-5 h-5 text-green-600 flex-shrink-0" /> <span className="text-green-700">תמיכה מועדפת</span></div>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">סה"כ לתשלום (מנוי שנתי)</span>
                            <span className="font-bold text-2xl text-green-600">₪120</span>
                        </div>
                    </div>

                    <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6" disabled={isProcessing}>
                        {isProcessing ? (
                            <><Loader2 className="w-5 h-5 ml-2 animate-spin" /> מעבד תשלום...</>
                        ) : (
                            <><CreditCard className="w-5 h-5 ml-2" /> שלם ₪120 באמצעות Grow</>
                        )}
                    </Button>
                    
                    <div className="text-center space-y-2 mt-4">
                        <p className="text-xs text-gray-500 flex items-center justify-center"><Lock className="w-3 h-3 ml-1" /> תשלום מאובטח באמצעות Grow</p>
                        <p className="text-xs text-gray-400">תשלום שנתי חד פעמי. ללא חידוש אוטומטי.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}