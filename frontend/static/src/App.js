import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import HomePage from './components/home_page/HomePage';
import LoginRegis from './components/login_regis/LoginRegis';
import './App.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleLogout, getLoginInfo, handleErrors } from "./utitlties/Utility";
import YourAccountView from "./components/account_view/your_account_view/YourAccountView";
import EditAccountView from "./components/edit_account_view/EditAccountView";
import AccountDeletion from "./components/account_deletion/AccountDeletion";
import AccountReactivation from "./components/account_reactivation/AccountReactivation";
import NormalAccountView from "./components/account_view/normal_account_view/NormalAccountView";
import PostCreate from "./components/posts/PostCreate";


function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const [accountInfo, setAccountInfo] = useState(null);
  const [userPostsList, setUserPostsList] = useState(null);

  const [postsList, setPostsList] = useState(null);
  
  const [userAccountInfo, setUserAccountInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

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

  useEffect(() => {
    if(!postsList) {
        const getPosts = async () => {
            const response = await fetch('/api/v1/posts/').catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                setPostsList(data);
            }
        }
        getPosts()
    }
}, [])

  const displaySidebar = () => {
    
    if (location.pathname === '/' || location.pathname === '/current-user-account-view/' || location.pathname.includes('view')) {
      return true
    } else {
      return false
    }
  }

  const sidebarHTML = (
      <div className="sidebar">
            {location.pathname !== '/' && <button onClick={() => navigate('/')}>Home</button>}
            <button type="button" onClick={() => handleLogout(setAccountInfo, navigate, setLoggedIn)}>Logout</button>
            <button type="button" onClick={() => navigate('/current-user-account-view/')}>View Profile</button>
            <button type="button" onClick={() => navigate('/create-post/')}>Create Post</button>
      </div>
  )


  console.log(accountInfo)
  console.log(postsList)
  return (
    <div className="App">
      {displaySidebar() && sidebarHTML}
      <Routes>
        <Route path='/' element={<HomePage setAccountInfo={setAccountInfo} accountInfo={accountInfo} postsList={postsList} setPostsList={setPostsList} />}/>
        <Route path='login' element={<LoginRegis setAccountInfo={setAccountInfo} setLoggedIn={setLoggedIn}/>}/>
        <Route path='current-user-account-view' element={<YourAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} postsList={postsList} userPostsList={userPostsList} setUserPostsList={setUserPostsList}/>}/>
        <Route path=':accountId/view' element={<NormalAccountView userAccountInfo={userAccountInfo} setUserAccountInfo={setUserAccountInfo} postsList={postsList} setPostsList={setPostsList} accountInfo={accountInfo}/>}/>
        <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='delete-account' element={<AccountDeletion setAccountInfo={setAccountInfo}/>}/> 
        <Route path='account-reactivation' element={<AccountReactivation setAccountInfo={setAccountInfo}/>}/>
        <Route path='create-post' element={<PostCreate postsList={postsList} setPostsList={setPostsList} accountInfo={accountInfo}/>}/>
      </Routes>

    </div>
  );
}

export default App;
