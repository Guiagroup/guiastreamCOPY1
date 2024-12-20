import { useLocation, Routes, Route, useNavigate } from "react-router-dom";
import Index from "@/pages/Index";
import VideoPlayer from "@/pages/VideoPlayer";
import Upload from "@/pages/Upload";
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";

interface AppRoutesProps {
  isAuthenticated: boolean | null;
}

export const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/pricing'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect to auth if trying to access protected route while not authenticated
  if (!isAuthenticated && !isPublicRoute) {
    return <Auth />;
  }

  // Redirect to home if trying to access auth while authenticated
  if (isAuthenticated && location.pathname === '/auth') {
    navigate('/home');
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Index />} />
      <Route path="/video/:id" element={<VideoPlayer />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* Add a catch-all route for 404s */}
      <Route path="*" element={<Landing />} />
    </Routes>
  );
};