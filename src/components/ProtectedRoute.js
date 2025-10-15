// import React from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner-large"></div>
//         <p>در حال بررسی هویت...</p>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large"></div>
        <p>در حال بررسی هویت...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;