import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../entities/User';
import RecipeSelector from '../components/planner/RecipeSelector';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { he } from 'date-fns/locale';

const mealTypes = [
    { key: 'breakfast', label: 'בוקר' },
    { key: 'lunch', label: 'צהריים' },
    { key: 'dinner', label: 'ערב' },
];

export default function MealPlannerPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState([]);
    const [mealPlan, setMealPlan] = useState({});
    const [isSelectorOpen, setSelectorOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [user, setUser] = useState(null);

    const loadMealPlan = useCallback(async (start, end) => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
            
            if (currentUser.meal_plans) {
                const planMap = {};
                Object.keys(currentUser.meal_plans).forEach(dateKey => {
                    const planDate = new Date(dateKey);
                    if (planDate >= start && planDate <= end) {
                        planMap[dateKey] = currentUser.meal_plans[dateKey];
                    }
                });
                setMealPlan(planMap);
            } else {
                setMealPlan({});
            }
        } catch (error) {
            console.error('Error loading meal plan:', error);
            setMealPlan({});
        }
    }, []);
    
    useEffect(() => {
        const start = startOfWeek(currentDate, { locale: he });
        const end = endOfWeek(currentDate, { locale: he });
        setWeekDates(eachDayOfInterval({ start, end }));
        loadMealPlan(start, end);
    }, [currentDate, loadMealPlan]);

    const changeWeek = (amount) => {
        setCurrentDate(prev => addDays(prev, amount * 7));
    };

    const handleAddClick = (date, meal_type) => {
        setSelectedSlot({ date, meal_type });
        setSelectorOpen(true);
    };

    const handleRecipeSelect = async (recipe) => {
        if (!selectedSlot || !user) return;
        const { date, meal_type } = selectedSlot;
        
        const dateKey = format(date, 'yyyy-MM-dd');
        
        try {
            const currentPlans = user.meal_plans || {};
            if (!currentPlans[dateKey]) {
                currentPlans[dateKey] = {};
            }
            
            currentPlans[dateKey][meal_type] = {
                recipe_id: recipe.id,
                recipe_name: recipe.name,
                recipe_image_url: recipe.image_url
            };
            
            await User.updateMyUserData({ meal_plans: currentPlans });
            
            setSelectorOpen(false);
            setSelectedSlot(null);
            const start = startOfWeek(currentDate, { locale: he });
            const end = endOfWeek(currentDate, { locale: he });
            loadMealPlan(start, end);
        } catch (error) {
            console.error('Error saving meal plan:', error);
            alert('שגיאה בשמירת התכנון');
        }
    };
    
    const handleRemovePlan = async (dateKey, mealType) => {
        if (!user) return;
        
        try {
            const currentPlans = user.meal_plans || {};
            if (currentPlans[dateKey] && currentPlans[dateKey][mealType]) {
                delete currentPlans[dateKey][mealType];
                
                // אם אין יותר ארוחות ביום הזה, מוחק את היום
                if (Object.keys(currentPlans[dateKey]).length === 0) {
                    delete currentPlans[dateKey];
                }
                
                await User.updateMyUserData({ meal_plans: currentPlans });
                
                const start = startOfWeek(currentDate, { locale: he });
                const end = endOfWeek(currentDate, { locale: he });
                loadMealPlan(start, end);
            }
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            alert('שגיאה במחיקת התכנון');
        }
    }

    return (
        <div className="p-4 md:p-6" dir="rtl">
            <RecipeSelector 
                open={isSelectorOpen}
                setOpen={setSelectorOpen}
                onSelectRecipe={handleRecipeSelect}
            />

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <CalendarDays className="w-7 h-7 ml-3 text-green-600"/>
                    <h2 className="text-2xl font-bold text-gray-800">תכנון שבועי</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => changeWeek(-1)}><ChevronRight className="w-4 h-4" /></Button>
                    <span className="font-semibold text-lg">{format(startOfWeek(currentDate, { locale: he }), 'dd MMM', { locale: he })} - {format(endOfWeek(currentDate, { locale: he }), 'dd MMM yyyy', { locale: he })}</span>
                    <Button variant="outline" size="icon" onClick={() => changeWeek(1)}><ChevronLeft className="w-4 h-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {weekDates.map(day => (
                    <div key={day.toString()} className={`rounded-lg p-3 ${isSameDay(day, new Date()) ? 'bg-green-50 border-2 border-green-200' : 'bg-white'}`}>
                        <p className="font-bold text-center">{format(day, 'E', { locale: he })}</p>
                        <p className="text-sm text-gray-500 text-center mb-3">{format(day, 'd')}</p>
                        <div className="space-y-2">
                            {mealTypes.map(meal => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const plan = mealPlan[dateKey]?.[meal.key];
                                return (
                                <div key={meal.key}>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">{meal.label}</p>
                                    {plan ? (
                                        <div className="relative group bg-gray-100 rounded-md p-1 text-xs">
                                            {plan.recipe_image_url && <img src={plan.recipe_image_url} alt={plan.recipe_name || "תמונה של מתכון"}  className="w-full h-12 object-cover rounded-md mb-1"/>}
                                            <p className="truncate font-medium">{plan.recipe_name}</p>
                                            <Button variant="ghost" size="icon" className="absolute top-0 left-0 h-5 w-5 opacity-0 group-hover:opacity-100 bg-red-500/50 hover:bg-red-500/80" onClick={() => handleRemovePlan(dateKey, meal.key)}>
                                                <Trash2 className="h-3 w-3 text-white"/>
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full h-10 border-dashed" onClick={() => handleAddClick(day, meal.key)}>
                                            <Plus className="w-4 h-4"/>
                                        </Button>
                                    )}
                                </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}