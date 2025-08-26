import { useState } from 'react';
import DonorAuthSystem from './components/DonorAuthSystem';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Handle successful login/signup
  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    console.log('User authenticated:', userData);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    console.log('User logged out');
  };

  // If user is authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  // If not authenticated, show login/signup
  return (
    <div className="App">
      <DonorAuthSystem onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;