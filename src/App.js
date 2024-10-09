import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './login';
import Users from './users';
import UserDetail from './userdetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} /> {/* User detail route */}
      </Routes>
    </Router>
  );
}

export default App;
