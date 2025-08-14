import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeForm from '../components/recipes/RecipeForm';
import AdPlaceholder from '../components/AdPlaceholder';
import { Button } from '../components/ui/button';
import { Plus, BookHeart } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

const AD_INTERVAL = 4;

// דמה של API
const RecipeAPI = {
    list: async (userId) => { console.log(`Fetching recipes for ${userId}`); return []; },
    create: async (data) => { console.log('Creating recipe', data); return { ...data, id: Date.now() }; },
    update: async (id, data) => { console.log(`Updating recipe ${id}`, data); return { ...data, id }; },
    delete: async (id) => { console.log(`Deleting recipe ${id}`); return true; }
};

const UserAPI = {
    me: async () => ({ id: 'user123', email: 'test@example.com', is_premium: false })
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [user, setUser] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await UserAPI.me();
      setUser(currentUser);
      const userRecipes = await RecipeAPI.list(currentUser.id);
      setRecipes(userRecipes);
    } catch (error) {
      console.error('Error loading data:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddNew = () => { setEditingRecipe(null); setFormOpen(true); };
  const handleEdit = (recipe) => { setEditingRecipe(recipe); setFormOpen(true); };

  const handleDelete = async (recipeId) => {
    if (window.confirm('האם אתה בטוח?')) {
      await RecipeAPI.delete(recipeId);
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    }
  };

  const handleSaveRecipe = async (recipeData) => {
    if (editingRecipe) {
      await RecipeAPI.update(editingRecipe.id, recipeData);
    } else {
      await RecipeAPI.create(recipeData);
    }
    loadData();
  };
  
  const itemsWithAds = recipes.reduce((acc, recipe, index) => {
    acc.push(<RecipeCard key={recipe.id} recipe={recipe} onEdit={handleEdit} onDelete={handleDelete}/>);
    if (!user?.is_premium && (index + 1) % AD_INTERVAL === 0 && (index + 1) < recipes.length) {
      acc.push(<AdPlaceholder key={`ad-${index}`} />);
    }
    return acc;
  }, []);

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <RecipeForm open={isFormOpen} setOpen={setFormOpen} recipe={editingRecipe} onSave={handleSaveRecipe} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center"><BookHeart className="w-7 h-7 ml-3 text-green-600"/>המתכונים שלי</h2>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 rounded-full shadow-lg"><Plus className="w-5 h-5 ml-2" />מתכון חדש</Button>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="flex flex-col space-y-3"><Skeleton className="h-40 w-full rounded-xl" /><div className="space-y-2 p-4"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">{itemsWithAds}</div>
      ) : (
        <div className="text-center py-20"><BookHeart className="mx-auto h-12 w-12 text-gray-400" /><h3 className="mt-2 text-lg font-medium text-gray-900">עדיין אין מתכונים</h3><p className="mt-1 text-sm text-gray-500">התחל להוסיף את המתכונים האהובים עליך!</p><Button onClick={handleAddNew} className="mt-6 bg-green-600 hover:bg-green-700"><Plus className="w-5 h-5 ml-2" />הוסף מתכון ראשון</Button></div>
      )}
    </div>
  );
}