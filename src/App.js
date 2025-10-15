// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import { useAuth } from './hooks/useAuth';
// import './App.css';

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route 
//             path="/login" 
//             element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
//           />
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import './App.css';

// کامپوننت برای صفحاتی که نیاز به Layout دارند
const WithLayout = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <WithLayout>
                  <Dashboard />
                </WithLayout>
              </ProtectedRoute>
            } 
          />

          {/* صفحات دیگر با Layout */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <WithLayout>
                  <div className="page">
                    <h1>مدیریت کاربران</h1>
                    <p>این صفحه مدیریت کاربران است</p>
                  </div>
                </WithLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <WithLayout>
                  <div className="page">
                    <h1>محصولات</h1>
                    <p>این صفحه مدیریت محصولات است</p>
                  </div>
                </WithLayout>
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;