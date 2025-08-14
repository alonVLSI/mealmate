import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Search } from 'lucide-react';

// זה ידמה את קבלת המתכונים מהמשתמש
const getMyRecipes = async () => {
    // בעולם האמיתי, פה תקרא מהשרת. כרגע נשתמש בנתונים קבועים לדוגמה.
    return Promise.resolve([]); 
};

export default function RecipeSelector({ open, setOpen, onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      getMyRecipes().then(setRecipes);
    }
  }, [open]);

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader><DialogTitle>בחר מתכון</DialogTitle></DialogHeader>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" /><Input placeholder="חיפוש מתכון..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/></div>
        <ScrollArea className="h-72"><div className="p-1 space-y-2">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <div key={recipe.id} onClick={() => onSelectRecipe(recipe)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <img src={recipe.image_url || 'https://placehold.co/150x150'} alt={recipe.name} className="w-16 h-16 object-cover rounded-md" />
                  <span className="font-medium">{recipe.name}</span>
                </div>
              ))
            ) : ( <div className="text-center py-8 text-gray-500">{searchTerm ? 'לא נמצאו מתכונים' : 'עדיין אין מתכונים שמורים'}</div> )}
        </div></ScrollArea>
      </DialogContent>
    </Dialog>
  );
}