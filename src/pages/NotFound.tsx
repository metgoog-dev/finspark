import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="h-full w-full flex flex-col items-center justify-center p-8">
    <h2 className="text-5xl font-bold text-slate-900 mb-4">404</h2>
    <p className="text-xl text-slate-600 mb-6">Oops! The page you are looking for does not exist.</p>
    <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 underline text-lg">Go to Dashboard</Link>
  </div>
);

export default NotFound;
