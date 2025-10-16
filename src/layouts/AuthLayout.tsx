import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const AuthLayout: React.FC = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
    {/* Top Left - Coins Stack */}
    <svg
      className="absolute top-10 left-10 w-24 h-24 opacity-20"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="30" r="20" fill="#3B82F6" opacity="0.6" />
      <circle cx="50" cy="40" r="20" fill="#3B82F6" opacity="0.7" />
      <circle cx="50" cy="50" r="20" fill="#3B82F6" opacity="0.8" />
      <text
        x="50"
        y="53"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
      >
        $
      </text>
    </svg>

    {/* Top Right - Growth Chart */}
    <svg
      className="absolute top-20 right-16 w-32 h-32 opacity-15"
      viewBox="0 0 120 120"
      fill="none"
    >
      <path
        d="M20 100 L35 85 L50 90 L65 70 L80 75 L95 50"
        stroke="#10B981"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="20" cy="100" r="4" fill="#10B981" />
      <circle cx="35" cy="85" r="4" fill="#10B981" />
      <circle cx="50" cy="90" r="4" fill="#10B981" />
      <circle cx="65" cy="70" r="4" fill="#10B981" />
      <circle cx="80" cy="75" r="4" fill="#10B981" />
      <circle cx="95" cy="50" r="4" fill="#10B981" />
      <path d="M85 50 L95 50 L95 60 Z" fill="#10B981" />
    </svg>

    {/* Bottom Left - Handshake */}
    <svg
      className="absolute bottom-16 left-16 w-28 h-28 opacity-15"
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M25 50 L35 40 L45 50 L55 40 L65 50 L75 40"
        stroke="#6366F1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="20"
        y="35"
        width="15"
        height="25"
        rx="2"
        fill="#6366F1"
        opacity="0.6"
      />
      <rect
        x="65"
        y="35"
        width="15"
        height="25"
        rx="2"
        fill="#6366F1"
        opacity="0.6"
      />
    </svg>

    {/* Bottom Right - Shield with Check */}
    <svg
      className="absolute bottom-24 right-10 w-24 h-24 opacity-20"
      viewBox="0 0 100 100"
      fill="none"
    >
      <path
        d="M50 10 L80 25 L80 50 C80 70 50 90 50 90 C50 90 20 70 20 50 L20 25 Z"
        fill="#3B82F6"
        opacity="0.5"
      />
      <path
        d="M35 50 L45 60 L65 40"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    {/* Center Top - Money Flow */}
    <svg
      className="absolute top-5 left-1/2 transform -translate-x-1/2 w-40 h-20 opacity-10"
      viewBox="0 0 160 80"
      fill="none"
    >
      <circle cx="30" cy="40" r="15" fill="#10B981" opacity="0.6" />
      <text
        x="30"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        $
      </text>
      <path
        d="M45 40 L75 40"
        stroke="#10B981"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <circle cx="90" cy="40" r="15" fill="#3B82F6" opacity="0.6" />
      <text
        x="90"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        $
      </text>
      <path
        d="M105 40 L135 40"
        stroke="#3B82F6"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#10B981" />
        </marker>
      </defs>
    </svg>

    {/* Bottom Center - Percentage Symbol */}
    <svg
      className="absolute bottom-8 left-1/3 w-20 h-20 opacity-15"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="30" cy="30" r="10" fill="#8B5CF6" opacity="0.6" />
      <circle cx="70" cy="70" r="10" fill="#8B5CF6" opacity="0.6" />
      <line
        x1="25"
        y1="75"
        x2="75"
        y2="25"
        stroke="#8B5CF6"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>

    {/* Main Auth Card */}
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 relative z-10 border border-gray-100">
      {/* Logo/branding */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1 shadow-lg">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <img
              src="/finspark-logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  </div>
  );
};

export default AuthLayout;
