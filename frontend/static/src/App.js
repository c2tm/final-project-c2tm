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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';


function App() {

  const [userPostsList, setUserPostsList] = useState(null);

  const [postsList, setPostsList] = useState(null);

  const [loggedInUserInfo, setLoggedInUserInfo] = useState(null);

  const [accountInfo, setAccountInfo] = useState(null);

  const [points, setPoints] = useState(null);

  const [mobileView, setMobileView] = useState(true)

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
      setPoints(json.account_points);
    }

  }, []); 
  
  useEffect(() => {

    console.log(loggedInUserInfo)
    console.log(accountInfo)

      if(accountInfo && !loggedInUserInfo) {
        if(!accountInfo.active) {
          console.log('hi1')
          navigate('/account-reactivation/')
        }
      }

      if(loggedInUserInfo) {
        if(loggedInUserInfo.account_active !== null && !loggedInUserInfo.account_active) {
          console.log('hi')
          navigate('/account-reactivation/')
        }
      }

  }, [loggedInUserInfo, accountInfo])

  const handleLogoutClick = () => {
    setUserPostsList(null)
    setPostsList(null)
    setLoggedInUserInfo(null)
    setAccountInfo(null)
    handleLogout(navigate, setUserPostsList)
    setMobileView(!mobileView)
   
  }

  const displaySidebar = () => {
    
    if (location.pathname === '/' || location.pathname === '/me/' || location.pathname.includes('view') || location.pathname === '/admin/' || location.pathname === '/leaderboards/') {
      return true
    } else {
      return false
    }
  }

  const displaySidebarMobile = () => {
    if (location.pathname === '/' || location.pathname === '/me/' || location.pathname.includes('view') || location.pathname === '/admin/' || location.pathname === '/leaderboards/') {
      return true
    } else {
      return false
    }
  }

  

  const mobileViewSetter1 = () => {
    if(mobileView) {
      return 'hidden'
    } else {
      return 'visible'
    }
  }

  const mobileViewSetter2 = () => {
    if(mobileView) {
      return 'visible'
    } else {
      console.log('hidden')
      return 'hidden'
    }
  }

  const mobileSidebarHandler = e => {

    if(e.target.name === 'home') {
      navigate('/')
    }

    if(e.target.name === 'me') {
      navigate('/me/')
    }

    if(e.target.name === 'leaderboards') {
      navigate('/leaderboards/')
    }

    if(e.target.name === 'create-post') {
      navigate('/create-post/')
    }

    if(e.target.name === 'admin') {
      navigate('/admin/')
    }

    setMobileView(!mobileView)
  }

  const sidebarHTML = (
      <div className={`sidebar ${mobileViewSetter1()}`}>
          <button className="mobile-button" onClick={() => setMobileView(!mobileView)}>
           <FontAwesomeIcon icon={faAlignJustify} />
          </button>
          <div className="points">{points}</div>
          <div className="sidebar-button-group">
              {location.pathname !== '/' && <button name='home' onClick={(e) => mobileSidebarHandler(e)}>Home</button>}
              <button type="button" name='me' onClick={(e) => mobileSidebarHandler(e)}>View Profile</button>
              <button type="button" name='leaderboards' onClick={(e) => mobileSidebarHandler(e)}>Leaderboards</button>
              <button type="button" name='create-post' onClick={(e) => mobileSidebarHandler(e)}>Create Post</button>
              {loggedInUserInfo && (loggedInUserInfo.is_superuser && <button type="button" name='admin' onClick={(e) => mobileSidebarHandler(e)}>Admin View</button>)}
              <button type="button" onClick={() => handleLogoutClick()}>Logout</button>
              <h1><span className="this">This</span>Or<span className="that">That</span></h1>
          </div>
            
      </div>
  )
  
  return (
    <div className="App">
      {displaySidebar() && sidebarHTML}
      <div className={`routes ${mobileViewSetter2()}`}>
        {displaySidebarMobile() ? <button className="mobile-button-2" onClick={() => setMobileView(!mobileView)}><FontAwesomeIcon icon={faAlignJustify} /></button> : null}
        
        <Routes>
          <Route path='/' element={<HomePage postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo} setLoggedInUserInfo={setLoggedInUserInfo} accountInfo={accountInfo} setAccountInfo={setAccountInfo} setPoints={setPoints} points={points}/>}/>
          <Route path='login' element={<LoginRegis setLoggedInUserInfo={setLoggedInUserInfo} setAccountInfo={setAccountInfo} setPoints={setPoints}/>}/>
          <Route path='me' element={<YourAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} setPostsList={setPostsList} userPostsList={userPostsList} setUserPostsList={setUserPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
          <Route path=':accountId/view' element={<NormalAccountView postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo} setLoggedInUserInfo={setLoggedInUserInfo} accountInfo={accountInfo} setPoints={setPoints} points={points}/>}/>
          <Route path='edit' element={<EditAccountView accountInfo={accountInfo} setAccountInfo={setAccountInfo} />}/>
          <Route path='delete-account' element={<AccountDeletion setUserPostsList={setUserPostsList} setAccountInfo={setAccountInfo}/>}/> 
          <Route path='account-reactivation' element={<AccountReactivation setAccountInfo={setAccountInfo} loggedInUserInfo={loggedInUserInfo}/>}/>
          <Route path='create-post' element={<PostCreate setUserPostsList={setUserPostsList} userPostsList={userPostsList} loggedInUserInfo={loggedInUserInfo} accountInfo={accountInfo}/>}/>
          <Route path='edit-post/:postId' element={<PostEdit setUserPostsList={setUserPostsList} userPostsList={userPostsList} loggedInUserInfo={loggedInUserInfo} accountInfo={accountInfo}/>}/>
          <Route path="admin" element={<AdminView points={points} setPoints={setPoints} postsList={postsList} setPostsList={setPostsList} loggedInUserInfo={loggedInUserInfo}/>}/>
          <Route path='leaderboards' element={<Leaderboard />}/>
          {/* <Route element={404}/> */}
        </Routes>
      </div>
      
    </div>
  );
}

export default App;




