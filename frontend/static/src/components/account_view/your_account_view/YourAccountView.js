import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLoginInfo, handleErrors } from "../../../utitlties/Utility"
import Post from "../../posts/Post"
import './YourAccountView.css'

function YourAccountView({accountInfo, setAccountInfo, postsList, userPostsList, setUserPostsList}) {

    const navigate = useNavigate();

    useEffect(() => {
        if(!userPostsList) {
            const getUserPosts = async () => {
                const response = await fetch('/api/v1/posts/user/').catch(handleErrors);
                
                if(!response.ok) {
                    throw new Error('Response was not ok!');
                } else {
                    const data = await response.json();
                    setUserPostsList(data);
                }
            }
            getUserPosts();
        }
    }, [])

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

    if(userPostsList) {
        postHTML = userPostsList.map(post => (
            <Post post={post} accountInfo={accountInfo} postsList={userPostsList} key={post.id}/>
        ))
    }

    return (
        <div className="account-view">
            {accountInfo && accountHTML}
            <ul>
                {userPostsList && postHTML}
            </ul>  
        </div>
    )
}

export default YourAccountView