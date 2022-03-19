import Cookies from "js-cookie"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLoginInfo, handleErrors } from "../../../utitlties/Utility"
import Post from "../../posts/Post"
import './NormalAccountView.css'
import Overlay from 'react-bootstrap/Overlay'

function NormalAccountView({postsList, accountInfo, setPostsList, loggedInUserInfo}) {

   const [userAccountInfo, setUserAccountInfo] = useState(null);
   const [show, setShow] = useState(false);
   const params = useParams();
   const target = useRef(null);

    useEffect(() => {

        if(!userAccountInfo) {
            const userInfo = {
                user: params.accountId
            }
    
            const getUserInfo = async () => {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': Cookies.get('csrftoken'),
                    },
                    body: JSON.stringify(userInfo),
                }
                const response = await fetch('/api/v1/accounts/user/user-by-id', options).catch(handleErrors);
    
                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json();
                    console.log(data);
                    setUserAccountInfo(data);
                }
            }
            getUserInfo();
        }
        
    },[])

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

   if(!userAccountInfo) {
       return (
           <div>
               <h1>Loading Account Info...</h1>
           </div>
       )
   }

   if(userAccountInfo.active === false) {
       return (
           <div>
               <h1>Account is no longer active.</h1>
           </div>
       )
   }

   const handleAddFlag = async () => {

        const accObj = {
            user: userAccountInfo.user,
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(accObj)
        }

        const response = await fetch(`/api/v1/accounts/flag/`, options).catch(handleErrors);

        if(!response.ok) {
            throw new Error('Response was not ok')
        } else {
           
        }
    
    }

    const accountHTML = (
        <div className="account">
            <div>
                <img src={userAccountInfo.profile_img} alt="profile-picture"/>
            </div>
            <h1>{userAccountInfo.alias}</h1>
            <h2>{userAccountInfo.username}</h2>
            <p>{userAccountInfo.bio}</p>
            <button type="button" onClick={handleAddFlag}>Report</button>

        </div>
    )

    let postHTML;

    console.log(params.accountId)

    if(postsList && loggedInUserInfo) {
        postHTML = postsList.filter(post => post.user==params.accountId).map(post => (
            <Post post={post} loggedInUserInfo={loggedInUserInfo} postsList={postsList} setPostsList={setPostsList} key={post.id}/>
        ))
    }

    return (
        <div className="account-view">
            {userAccountInfo && accountHTML}
            <ul>
                {postsList && postHTML}
            </ul>  
        </div>
    )
}

export default NormalAccountView