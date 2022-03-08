import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from './components/home_page/HomePage';
import LoginRegis from './components/login_regis/LoginRegis';
import './App.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function App() {

  const [auth, setAuth] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {

    if(!Cookies.get('authorization')) {
      navigate('login');
    } else {
      navigate('home');
      if(!auth) {
        const getLoginInfo = async () => {
          const response = await fetch('/rest-auth/user/')
  
          if(!response.ok) {
            throw new Error('Response was not ok!')
          } else {
            const data = await response.json()
            setAuth(data)
            console.log(auth);
          }
        }
        getLoginInfo()
      }
    }
  }, []);

  return (
    <div className="App">

      <Routes>
        <Route path='home' element={<HomePage setAuth={setAuth}/>}/>
        <Route path='login' element={<LoginRegis />}/>
      </Routes>

    </div>
  );
}

export default App;
