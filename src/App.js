import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './login';
import Users from './users';
import UserDetail from './userdetails';
import 'antd/dist/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  );
}


export default App;
