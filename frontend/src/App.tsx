import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const LocationAwareNavbar = () => {
    const location = useLocation();
    return <Home_Navbar pathname={location.pathname} />;
  };

  return (
    <div className="flex flex-col h-screen">
        <Router>
          <LocationAwareNavbar />
          <div className="content">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Routes>
            </AnimatePresence>
            <DrawerNavigation />
          </div>
          <Toaster />
        </Router>
    </div>
  );
}

export default App;