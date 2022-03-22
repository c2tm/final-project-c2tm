import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from './components/home_page/HomePage';
import LoginRegis from './components/login_regis/LoginRegis';
import './App.css';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { handleLogout, handleErrors } from "./utitlties/Utility";
import YourAccountView from "./components/account_view/your_account_view/YourAccountView";
import EditAccountView from "./components/edit_account_view/EditAccountView";
import AccountDeletion from "./components/account_deletion/AccountDeletion";
import AccountReactivation from "./components/account_reactivation/AccountReactivation";
import NormalAccountView from "./components/account_view/normal_account_view/NormalAccountView";
import PostCreate from "./components/posts/PostCreate";
import PostEdit from "./components/posts/PostEdit";
import AdminView from "./components/admin_view/AdminView";
import Leaderboard from "./components/leaderboards/Leaderboards";


function App() {

  const [userPostsList, setUserPostsList] = useState(null);

  const [postsList, setPostsList] = useState(null);

  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);

  const [accountInfo, setAccountInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(async () => {

    const response = await fetch('/rest-auth/user/').catch(handleErrors);
    if(!response.ok) {
      Cookies.remove('Authorization');
      navigate('login');

    } else {
      const json = await response.json();
      setLoggedInUserInfo(json);
      console.log(json)
    }

  }, []); 

  
  useEffect(() => {

    if((loggedInUserInfo && !loggedInUserInfo.account_active) || (accountInfo && !accountInfo.active)) {
      navigate('/account-reactivation/')
    }

  }, [loggedInUserInfo, accountInfo])

  const displaySidebar = () => {
    
    if (location.pathname === '/' || location.pathname === '/current-user-account-view/' || location.pathname.includes('view') || location.pathname === '/admin/' || location.pathname === '/leaderboards/') {
      return true
    } else {
      return false
    }
  }

  const sidebarHTML = (
      <div className="sidebar">
          <div className="points">{(loggedInUserInfo && loggedInUserInfo.account_points) || (accountInfo && accountInfo.points)}</div>
          <div className="sidebar-button-group">
              {location.pathname !== '/' && <button onClick={() => navigate('/')}>Home</button>}
              <button type="button" onClick={() => navigate('/current-user-account-view/')}>View Profile</button>
              <button type="button" onClick={() => navigate('/leaderboards/')}>Leaderboards</button>
              <button type="button" onClick={() => navigate('/create-post/')}>Create Post</button>
              {loggedInUserInfo && (loggedInUserInfo.is_superuser && <button type="button" onClick={() => navigate('/admin/')}>Admin View</button>)}
              <button type="button" onClick={() => handleLogout(navigate, setUserPostsList)}>Logout</button>
          </div>
            
      </div>
  )

  console.log(loggedInUserInfo)

  return (
    <div className="App">
      {displaySidebar() && sidebarHTML}
      <Routes>
        <Route path='/' element={<HomePage postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo} setLoggedInUserInfo={setLoggedInUserInfo} accountInfo={accountInfo} setAccountInfo={setAccountInfo}/>}/>
        <Route path='login' element={<LoginRegis setLoggedInUserInfo={setLoggedInUserInfo} setAccountInfo={setAccountInfo} />}/>
        <Route path='current-user-account-view' element={<YourAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} setPostsList={setPostsList} userPostsList={userPostsList} setUserPostsList={setUserPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
        <Route path=':accountId/view' element={<NormalAccountView postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo} setLoggedInUserInfo={setLoggedInUserInfo} accountInfo={accountInfo}/>}/>
        <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} />}/>
        <Route path='delete-account' element={<AccountDeletion setUserPostsList={setUserPostsList}/>}/> 
        <Route path='account-reactivation' element={<AccountReactivation setAccountInfo={setAccountInfo} loggedInUserInfo={loggedInUserInfo}/>}/>
        <Route path='create-post' element={<PostCreate setUserPostsList={setUserPostsList} userPostsList={userPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
        <Route path='edit-post/:postId' element={<PostEdit setUserPostsList={setUserPostsList} userPostsList={userPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
        <Route path="admin" element={<AdminView postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
        <Route path='leaderboards' element={<Leaderboard />}/>
      </Routes>
    </div>
  );
}

export default App;




