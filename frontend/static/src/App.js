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
  const [loggedIn, setLoggedIn] = useState(false)
  const [postsList, setPostsList] = useState(null)
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {

    if(!Cookies.get('authorization')) {
      navigate('login');
    } 
  }, []); 

  useEffect(() => {
    if(!accountInfo && Cookies.get('authorization')) {
        getLoginInfo(setAccountInfo, setLoggedIn)
    }
  }, [loggedIn])
  
  useEffect(() => {
    if(accountInfo && accountInfo.active === false) {
      navigate('/account-reactivation/')
    }
  }, [accountInfo])

  const displaySidebar = () => {
    
    if (location.pathname === '/' || location.pathname === '/account-view/') {
      return true
    } else {
      return false
    }
  }

  const sidebarHTML = (
      <div className="sidebar">
            <button type="button" onClick={() => handleLogout(setAccountInfo, navigate, setLoggedIn)}>Logout</button>
            <button type="button" onClick={() => navigate('/account-view/')}>View Profile</button>
            {location.pathname !== '/' && <button onClick={() => navigate('/')}>Home</button>}
      </div>
  )


  console.log(accountInfo)
  return (
    <div className="App">
      {displaySidebar() && sidebarHTML}
      <Routes>
        <Route path='/' element={<HomePage setAccountInfo={setAccountInfo} accountInfo={accountInfo} postsList={postsList} setPostsList={setPostsList}/>}/>
        <Route path='login' element={<LoginRegis setAccountInfo={setAccountInfo} setLoggedIn={setLoggedIn}/>}/>
        <Route path='account-view' element={<AccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} postsList={postsList} />}/>
        <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='delete-account' element={<AccountDeletion setAccountInfo={setAccountInfo}/>}/>
        <Route path='account-reactivation' element={<AccountReactivation setAccountInfo={setAccountInfo}/>}/>
      </Routes>

    </div>
  );
}

export default App;
