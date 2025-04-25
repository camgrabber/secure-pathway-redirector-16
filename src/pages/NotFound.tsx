
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-lg text-center">
        <div className="bg-gradient-to-r from-redirector-primary to-redirector-secondary p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="opacity-90">Page Not Found</p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <p className="text-lg text-gray-600">
            Oops! The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/" className="inline-block bg-redirector-primary hover:bg-redirector-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
