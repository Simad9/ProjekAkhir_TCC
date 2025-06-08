import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
// import ProtectedRoute from "./ProtectedRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import { useAuthContext } from "../auth/AuthProvider";
import HomePage from "../pages/HomePage.jsx";

const RouterApp = () => {
  const { isAuthenticated } = useAuthContext();
  // console.log('Router render, authenticated:', isAuthenticated());

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* <Route
          path="/tourpage"
          element={
            <ProtectedRoute>
              <TourPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <BookmarkPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailtour/:id_wisata"
          element={
            <ProtectedRoute>
              <DetailTour />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inputtour"
          element={
            <ProtectedRoute>
              <InputTourPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edittour/:id_wisata"
          element={
            <ProtectedRoute>
              <EditTourPages />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;