import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
} from "./context/AuthContext";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Simulator from "./pages/Simulator";
import Profile from "./pages/Profile";


function App() {
  return (
    <AuthProvider>

      <Routes>

        <Route
          path="/"
          element={
            <Login />
          }
        />

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Simulator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </AuthProvider>
  );
}


export default App;