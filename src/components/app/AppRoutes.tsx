import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import VideoPlayer from "@/pages/VideoPlayer";
import Upload from "@/pages/Upload";
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

interface AppRoutesProps {
  isAuthenticated: boolean | null;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const location = useLocation();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/pricing'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If authentication is still being determined, show loading or return null
  if (isAuthenticated === null) {
    return null;
  }

  // Redirect to auth if trying to access protected route while not authenticated
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to home if trying to access auth while authenticated
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/home" replace />;
  }

  // Redirect authenticated users from root to home
  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={isAuthenticated ? <Index /> : <Navigate to="/auth" />} />
      <Route path="/video/:id" element={isAuthenticated ? <VideoPlayer /> : <Navigate to="/auth" />} />
      <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/auth" />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};