export const Recipe = {
    name: "Recipe",
    type: "object",
    properties: {
        name: { type: "string", description: "שם המתכון" },
        description: { type: "string", description: "תיאור קצר של המתכון" },
        image_url: { type: "string", description: "כתובת URL לתמונה של המנה" },
        prep_time: { type: "number", description: "זמן הכנה בדקות" },
        cook_time: { type: "number", description: "זמן בישול בדקות" },
        servings: { type: "number", description: "מספר מנות" },
        ingredients: {
            type: "array",
            description: "רשימת המצרכים",
            items: {
                type: "object",
                properties: {
                    name: { type: "string", description: "שם המצרך" },
                    quantity: { type: "number", description: "כמות" },
                    unit: { type: "string", description: "יחידת מידה (למשל, גרם, כוס, כף)" }
                },
                required: ["name", "quantity", "unit"]
            }
        },
        instructions: {
            type: "array",
            description: "שלבי ההכנה",
            items: { type: "string" }
        },
        category: {
            type: "string",
            enum: ["breakfast", "lunch", "dinner", "snack", "dessert"],
            description: "קטגוריית הארוחה"
        }
    },
    required: ["name", "ingredients", "instructions"]
};
