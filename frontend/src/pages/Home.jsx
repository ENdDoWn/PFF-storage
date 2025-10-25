import "../index.css"
import Header from "../components/user/Header"
import Content from "../components/user/ContentHome"
import Footer from "../components/user/Footer"
import { useEffect, useState } from "react"
import { getCurrentUser } from 'aws-amplify/auth'
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      setIsAuthenticated(true);
      // Redirect to main page if already logged in
      navigate('/main');
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <Content isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  )
}

export default Home;