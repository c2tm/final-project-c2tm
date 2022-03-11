import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from './components/home_page/HomePage';
import LoginRegis from './components/login_regis/LoginRegis';
import './App.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleLogout, getLoginInfo } from "./utitlties/Utility";
import AccountView from "./components/account_view/AccountView";
import EditAccountView from "./components/edit_account_view/EditAccountView";
import AccountDeletion from "./components/account_deletion/AccountDeletion";
import AccountReactivation from "./components/account_reactivation/AccountReactivation";


function App() {

  const [accountInfo, setAccountInfo] = useState(null)
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {

    if(!Cookies.get('authorization')) {
      navigate('login');
    } 
  }, []); 

  useEffect(() => {
    if(accountInfo && !accountInfo.active) {
      navigate('/account-reactivation/')
    }
  }, [accountInfo])


  const displaySidebar = () => {
    
    if (location.pathname !== '/edit/' && location.pathname !== '/delete-account/' && location.pathname !== '/account-reactivation/' && location.pathname !== '/login' && location.pathname !== '/login/') {
      return true
    } else {
      return false
    }
  }

  const sidebarHTML = (
      <div className="sidebar">
            <button type="button" onClick={() => handleLogout(setAccountInfo, navigate)}>Logout</button>
            <button type="button" onClick={() => navigate('/account-view/')}>View Profile</button>
            {location.pathname !== '/' && <button onClick={() => navigate('/')}>Home</button>}
      </div>
  )



  return (
    <div className="App">
      {displaySidebar() && sidebarHTML}
      <Routes>
        <Route path='/' element={<HomePage setAccountInfo={setAccountInfo} accountInfo={accountInfo}/>}/>
        <Route path='login' element={<LoginRegis setAccountInfo={setAccountInfo} />}/>
        <Route path='account-view' element={<AccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='delete-account' element={<AccountDeletion setAccountInfo={setAccountInfo}/>}/>
        <Route path='account-reactivation' element={<AccountReactivation setAccountInfo={setAccountInfo}/>}/>
      </Routes>

    </div>
  );
}

export default App;
