import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashbord from './pages/AdminDashbord';
import AdminAddMovie from './pages/AdminAddMovie';
import AdminMoviesList from './pages/Movies';
import AdminEditMovie from './pages/AdminEditMovie';
import AllMovies from './pages/AllMovies';
import MovieDetails from "./pages/MovieDetails";

const App = () => {
  return (
    <Routes>
      {/* 👇 redirect root (/) to /admin/login */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin-dashboard' element={
        <ProtectedRoute>
          <AdminDashbord />
        </ProtectedRoute>
      } />
      <Route path='/admin/add-movie' element={
        <ProtectedRoute>
          <AdminAddMovie />
        </ProtectedRoute>
      } />
      <Route path='/admin/movies' element={
        <ProtectedRoute>
          <AdminMoviesList />
        </ProtectedRoute>
      } />
      <Route path='/admin/edit/:id' element={
        <ProtectedRoute>
          <AdminEditMovie />
        </ProtectedRoute>
      } />
      <Route path="/movies" element={<AllMovies />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
};

export default App;

