
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState('login');
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLogged(true);
    setPage('dashboard');
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    setPage('login');
  };

  return (
    <BrowserRouter>
      {isLogged ? (
        <Dashboard />
      ) : (
        <>
          {page === 'login' && <Login onLogin={handleLogin} goToRegister={() => setPage('register')} />}
          {page === 'register' && <Register onRegister={() => setPage('login')} />}
        </>
      )}
    </BrowserRouter>
  )
}

export default App
