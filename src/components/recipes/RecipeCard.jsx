import React from 'react';
import { Clock, Users, Tag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from '../ui/button';

export default function RecipeCard({ recipe, onEdit, onDelete }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col" dir="rtl">
      <div className="relative">
        <img className="w-full h-40 object-cover" src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800'} alt={recipe.name} />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-gray-700 flex items-center">
            <Tag className="w-3 h-3 mr-1" />
            {recipe.category}
        </div>
        <div className="absolute top-2 left-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/70 hover:bg-white">
                        <MoreVertical className="w-4 h-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onEdit(recipe)}>
                        <Pencil className="w-4 h-4 ml-2" />
                        עריכה
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(recipe.id)} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                        <Trash2 className="w-4 h-4 ml-2" />
                        מחיקה
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 truncate">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden flex-grow">{recipe.description}</p>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-green-500" />
            <span>{totalTime} דקות</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            <span>{recipe.servings} מנות</span>
          </div>
        </div>
      </div>
    </div>
  );
}