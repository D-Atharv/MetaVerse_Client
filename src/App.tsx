import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "../@context/AuthProvider";
import Login from "./auth/Login";
import SignIn from "./auth/SignIn";
import ProtectedRoute from "./auth/ProtectedRoute";
import Logout from "./auth/Logout";
import Game from "./components/Game";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider >
  );
};

