import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLoginInfo, handleErrors } from "../../utitlties/Utility"
import Post from "../home_page/Post";
import './AccountView.css'

function AccountView({accountInfo, setAccountInfo, postsList}) {

    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate('/edit/')
    }

   if(!accountInfo) {
       return (
           <div>
               <h1>Loading Account Info...</h1>
           </div>
       )
   }

   if(accountInfo.active === false) {
       console.log(accountInfo);
       return (
           <div>
               <h1>Account is no longer active.</h1>
           </div>
       )
   }

    const accountHTML = (
        <div className="account">
            <div>
                <img src={accountInfo.profile_img} alt="profile-picture"/>
            </div>
            <h1>{accountInfo.alias}</h1>
            <h2>{accountInfo.username}</h2>
            <p>{accountInfo.bio}</p>
            <button type="button" onClick={() => handleEditClick()}>Edit Account</button>
        </div>
    )

    let postHTML;

    if(postsList) {
        postHTML = postsList.filter(post => post.user === accountInfo.user).map(post => (
            <Post post={post} accountInfo={accountInfo} />
        ))
    }

    return (
        <div className="account-view">
            {accountInfo && accountHTML}
            <ul>
                {postsList && postHTML}
            </ul>  
        </div>
    )
}

export default AccountView