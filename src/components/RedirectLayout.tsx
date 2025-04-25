
import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RedirectLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const RedirectLayout: React.FC<RedirectLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="card-container">
        <div className="card-header">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="opacity-90">{subtitle}</p>}
        </div>
        
        <div className="card-content">
          {children}
        </div>
        
        <div className="px-6 pb-6">
          <div className="security-badge">
            <ShieldCheck className="text-redirector-success" />
            <span>100% Secure Redirection Service</span>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By continuing, you agree to our <a href="#" className="text-redirector-primary hover:underline">Terms of Service</a> and <a href="#" className="text-redirector-primary hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Secure Pathway Redirector. All rights reserved.
      </div>
    </div>
  );
};

export default RedirectLayout;
