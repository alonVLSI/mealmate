import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import RecipesPage from './pages/Recipes';
import MealPlannerPage from './pages/MealPlanner';
import ShoppingListPage from './pages/ShoppingList';
import ProfilePage from './pages/Profile';
import PaymentPage from './pages/Payment';

// פה נצטרך לייבא את שאר העמודים כשהם יהיו מוכנים

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MealPlannerPage />} />
          <Route path="/MealPlanner" element={<MealPlannerPage />} />
          <Route path="/Recipes" element={<RecipesPage />} />
          <Route path="/ShoppingList" element={<ShoppingListPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Payment" element={<PaymentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;