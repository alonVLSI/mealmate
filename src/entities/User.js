// ../entities/User.js
export const User = {
    name: "User",
    type: "object",
    properties: {
        is_premium: { type: "boolean", default: false, description: "האם המשתמש הוא משתמש פרימיום" },
        premium_expiry_date: { type: "string", format: "date-time", description: "תאריך תפוגת מנוי הפרימיום" },
        subscription_type: { type: "string", enum: ["monthly", "yearly"], description: "סוג המנוי - חודשי או שנתי" },
        meal_plans: {
            type: "object",
            description: "תכנון הארוחות השבועי של המשתמש",
            additionalProperties: {
                type: "object",
                additionalProperties: {
                    type: "object",
                    properties: {
                        recipe_id: { type: "string" },
                        recipe_name: { type: "string" },
                        recipe_image_url: { type: "string" }
                    }
                }
            }
        }
    },
    required: []
};
