import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from './components/home_page/HomePage';
import LoginRegis from './components/login_regis/LoginRegis';
import './App.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AccountView from "./components/account_view/AccountView";
import EditAccountView from "./components/edit_account_view/EditAccountView";


function App() {

  const [auth, setAuth] = useState(null)
  const [accountInfo, setAccountInfo] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {

    if(!Cookies.get('authorization')) {
      navigate('login');
    } else {
      if(!auth) {
        const getLoginInfo = async () => {
          const response = await fetch('/rest-auth/user/')
  
          if(!response.ok) {
            throw new Error('Response was not ok!')
          } else {
            const data = await response.json()
            setAuth(data)
          }
        }
        getLoginInfo()
      }
    }
  }, []);

  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<HomePage setAuth={setAuth}/>}/>
        <Route path='login' element={<LoginRegis />}/>
        <Route path='account-view' element={<AccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
      </Routes>

    </div>
  );
}

export default App;
