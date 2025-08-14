import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Trash2, Save, Loader2, Upload } from 'lucide-react';

// דמה של פונקציית העלאת קבצים
const UploadFile = async ({ file }) => {
    console.log("Uploading file:", file.name);
    await new Promise(res => setTimeout(res, 1000));
    return { file_url: URL.createObjectURL(file) };
};

const initialRecipeState = {
    name: "", description: "", image_url: "", prep_time: 0, cook_time: 0, servings: 1,
    category: "dinner", ingredients: [{ name: "", quantity: 1, unit: "יחידה" }], instructions: [""]
};

export default function RecipeForm({ open, setOpen, recipe, onSave }) {
  const [formData, setFormData] = useState(initialRecipeState);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (recipe) {
      setFormData({
          ...recipe,
          ingredients: recipe.ingredients && recipe.ingredients.length > 0 ? recipe.ingredients : initialRecipeState.ingredients,
          instructions: recipe.instructions && recipe.instructions.length > 0 ? recipe.instructions : initialRecipeState.instructions,
      });
    } else {
      setFormData(initialRecipeState);
    }
  }, [recipe, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };
  
  const addIngredient = () => setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: "", quantity: 1, unit: "יחידה" }] }));
  const removeIngredient = (index) => setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };
  
  const addInstruction = () => setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ""] }));
  const removeInstruction = (index) => setFormData(prev => ({ ...prev, instructions: prev.instructions.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader><DialogTitle>{recipe ? 'עריכת מתכון' : 'יצירת מתכון חדש'}</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">שם המתכון</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">תיאור</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">תמונה</Label>
                <div className="col-span-3 space-y-3"><Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" /><Label htmlFor="image-upload" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer">{isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}{isUploadingImage ? 'מעלה...' : 'העלה תמונה'}</Label>{formData.image_url && <img src={formData.image_url} alt="תצוגה מקדימה" className="w-32 h-32 object-cover rounded-md border"/>}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><Label>זמן הכנה (דקות)</Label><Input type="number" name="prep_time" value={formData.prep_time} onChange={handleChange} /></div>
                <div><Label>זמן בישול (דקות)</Label><Input type="number" name="cook_time" value={formData.cook_time} onChange={handleChange} /></div>
                <div><Label>מספר מנות</Label><Input type="number" name="servings" value={formData.servings} onChange={handleChange} /></div>
                <div><Label>קטגוריה</Label><Select name="category" value={formData.category} onValueChange={value => setFormData(p => ({...p, category: value}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="breakfast">ארוחת בוקר</SelectItem><SelectItem value="lunch">ארוחת צהריים</SelectItem><SelectItem value="dinner">ארוחת ערב</SelectItem><SelectItem value="snack">נשנוש</SelectItem><SelectItem value="dessert">קינוח</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label className="text-lg font-semibold">מצרכים</Label>{formData.ingredients.map((ing, index) => (<div key={index} className="flex items-center gap-2 mt-2"><Input placeholder="שם המצרך" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} /><Input type="number" placeholder="כמות" value={ing.quantity} onChange={e => handleIngredientChange(index, 'quantity', e.target.valueAsNumber)} className="w-24" /><Input placeholder="יחידה" value={ing.unit} onChange={e => handleIngredientChange(index, 'unit', e.target.value)} className="w-28" /><Button variant="ghost" size="icon" onClick={() => removeIngredient(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>))}<Button variant="outline" size="sm" onClick={addIngredient} className="mt-2"><Plus className="w-4 h-4 ml-2" />הוסף מצרך</Button></div>
            <div><Label className="text-lg font-semibold">הוראות הכנה</Label>{formData.instructions.map((inst, index) => (<div key={index} className="flex items-center gap-2 mt-2"><Textarea placeholder={`שלב ${index + 1}`} value={inst} onChange={e => handleInstructionChange(index, e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeInstruction(index)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>))}<Button variant="outline" size="sm" onClick={addInstruction} className="mt-2"><Plus className="w-4 h-4 ml-2" />הוסף שלב</Button></div>
        </div>
        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">ביטול</Button></DialogClose><Button type="button" onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}שמור מתכון</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}