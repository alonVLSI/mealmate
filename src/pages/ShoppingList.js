
import React, { useState, useEffect } from 'react';
import { User } from '../entities/User';
import { Recipe } from '../entities/Recipe';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ShoppingCart, Printer, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { he } from 'date-fns/locale';
import AdPlaceholder from '../components/AdPlaceholder';

// --- פונקציות עזר משופרות ---
const normalizeName = (name) => {
    if (!name) return '';
    
    // תחילה מנקה רווחים מיותרים
    let normalized = name.trim().toLowerCase();
    
    // אם זה מוצר מעובד (רסק, משחה, וכו') - לא מנרמל
    if (normalized.includes('רסק') || normalized.includes('משחה') || 
        normalized.includes('עיסה') || normalized.includes('קמח') ||
        normalized.includes('שמן') || normalized.includes('חומץ') ||
        normalized.includes('מיץ') || normalized.includes('רוטב')) {
        return name.trim(); // Keep original casing and full name for processed items
    }
    
    // מסיר תיאורים נפוצים רק אם זה לא משנה את המוצר
    normalized = normalized
        .replace(/ קצוץ$| קצוצה$| קצוצים$| קצוצות$/g, '')
        .replace(/ טרי$| טרייה$| טריים$| טריות$/g, '')
        .replace(/ גדול$| גדולה$| גדולים$| גדולות$/g, '')
        .replace(/ קטן$| קטנה$| קטנים$| קטנות$/g, '')
        .replace(/ בינוני$| בינונית$| בינוניים$| בינוניות$/g, '');
    
    // מנרמל יחיד/רבים רק לירקות ופירות בסיסיים
    const pluralRules = [
        { singular: 'עגבנייה', plural: ['עגבניות', 'עגבנייה'] },
        { singular: 'בצל', plural: ['בצלים'] },
        { singular: 'גזר', plural: ['גזרים'] },
        { singular: 'תפוח', plural: ['תפוחים'] },
        { singular: 'בננה', plural: ['בננות'] },
        { singular: 'פלפל', plural: ['פלפלים'] }
    ];
    
    for (const rule of pluralRules) {
        if (rule.plural.includes(normalized)) {
            return rule.singular;
        }
    }
    
    return normalized;
};

const formatQuantity = (quantity, unit) => {
    // עיגול לכמות נוחה
    const roundedQuantity = Math.ceil(quantity * 10) / 10;
    
    if ((unit === 'גרם' || unit === 'ג' || unit === 'גר') && roundedQuantity >= 1000) {
        return `${(roundedQuantity / 1000).toFixed(1)} ק"ג`;
    }
    if ((unit === 'מיליליטר' || unit === 'מ"ל') && roundedQuantity >= 1000) {
        return `${(roundedQuantity / 1000).toFixed(1)} ליטר`;
    }
    return `${roundedQuantity} ${unit}`;
};
// -----------------------------

export default function ShoppingListPage() {
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [user, setUser] = useState(null);

    useEffect(() => {
        User.me().then(setUser).catch(() => setUser(null));
    }, []);

    const generateList = async (targetDate) => {
        setIsLoading(true);
        
        try {
            const start = startOfWeek(targetDate, { locale: he });
            const end = endOfWeek(targetDate, { locale: he });

            const currentUser = await User.me();
            const mealPlans = currentUser.meal_plans || {};
            
            const recipeIds = new Set();
            Object.keys(mealPlans).forEach(dateKey => {
                const planDate = new Date(dateKey);
                // Ensure date comparison is correct for the week range
                if (planDate >= start && planDate <= end) {
                    Object.values(mealPlans[dateKey]).forEach(meal => {
                        if (meal.recipe_id) recipeIds.add(meal.recipe_id);
                    });
                }
            });

            if (recipeIds.size === 0) {
                setList([]);
                setIsLoading(false);
                return;
            }

            const allRecipes = await Recipe.list();
            const weekRecipes = allRecipes.filter(recipe => recipeIds.has(recipe.id));

            const ingredientsMap = new Map();

            weekRecipes.forEach(recipe => {
                if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return;
                
                recipe.ingredients.forEach(ing => {
                    const normalizedName = normalizeName(ing.name);
                    const unit = ing.unit?.trim() || ''; // Use nullish coalescing for safety
                    const quantity = Number(ing.quantity) || 0;

                    if (!normalizedName || !unit || quantity === 0) return;

                    // משתמש בשם המנורמל + יחידה כמפתח
                    const key = `${normalizedName}_${unit}`;
                    if (ingredientsMap.has(key)) {
                        const existingItem = ingredientsMap.get(key);
                        existingItem.quantity += quantity;
                        // שומר את השם המקורי אם הוא יותר מפורט
                        // Check if the current ingredient's original name is more descriptive
                        // (e.g., "עגבנייה קצוצה" vs "עגבנייה")
                        if (ing.name.length > existingItem.originalName.length) {
                            existingItem.originalName = ing.name;
                        }
                    } else {
                        ingredientsMap.set(key, { 
                            name: normalizedName, 
                            originalName: ing.name, // Store original name for display
                            unit, 
                            quantity, 
                            checked: false 
                        });
                    }
                });
            });
            
            const sortedList = Array.from(ingredientsMap.values())
                .map(item => ({
                    ...item,
                    // Use originalName for display if available, otherwise the normalized name
                    displayName: item.originalName || item.name
                }))
                .sort((a, b) => a.displayName.localeCompare(b.displayName, 'he'));
            setList(sortedList);

        } catch (error) {
            console.error('Error generating shopping list:', error);
            setList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        generateList(currentDate);
    }, [currentDate]);

    const handleCheck = (key) => {
        setList(prev => prev.map(item => 
            // The item.name in the state is already the normalized name used for the key
            `${item.name}_${item.unit?.trim()}` === key ? { ...item, checked: !item.checked } : item
        ));
    };
    
    const changeWeek = (amount) => {
        setCurrentDate(prev => addDays(prev, amount * 7));
    };

    const handlePrint = () => {
        if (user?.is_premium) {
            window.print();
        } else {
            alert("שדרג לפרימיום כדי להדפיס ולייצא את הרשימה!");
        }
    };
    
    return (
        <div className="p-4 md:p-6" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <ShoppingCart className="w-7 h-7 ml-3 text-green-600"/>
                    <h2 className="text-2xl font-bold text-gray-800">רשימת קניות</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => changeWeek(-1)}><ChevronRight className="w-4 h-4" /></Button>
                    <span className="font-semibold text-lg">{format(startOfWeek(currentDate, { locale: he }), 'dd MMM', { locale: he })} - {format(endOfWeek(currentDate, { locale: he }), 'dd MMM yyyy', { locale: he })}</span>
                    <Button variant="outline" size="icon" onClick={() => changeWeek(1)}><ChevronLeft className="w-4 h-4" /></Button>
                </div>
            </div>
            <div className="flex gap-2 mb-6">
                <Button onClick={() => generateList(currentDate)} disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'טוען...' : 'רענן רשימה'}
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 ml-2" />
                    הדפסה { !user?.is_premium && '(פרימיום)' }
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    {isLoading && <p>טוען רשימת קניות...</p>}
                    {!isLoading && list.length === 0 && (
                        <div className="text-center py-10">
                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">רשימת הקניות ריקה</h3>
                            <p className="mt-1 text-sm text-gray-500">תכנן ארוחות כדי ליצור רשימת קניות אוטומטית.</p>
                        </div>
                    )}
                    {!isLoading && list.length > 0 && (
                        <ul className="space-y-3">
                            {list.map(item => {
                                // The key for each item should use the normalized name stored in item.name
                                const key = `${item.name}_${item.unit?.trim()}`; 
                                return (
                                <li key={key} onClick={() => handleCheck(key)} className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${item.checked ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                                    <Checkbox checked={item.checked} className="ml-4" />
                                    <span className={`font-medium ${item.checked ? 'line-through text-gray-500' : ''}`}>
                                        {formatQuantity(item.quantity, item.unit)} {item.displayName}
                                    </span>
                                </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
                {!user?.is_premium && (
                    <div className="space-y-6">
                        <AdPlaceholder />
                    </div>
                )}
            </div>
        </div>
    );
}
