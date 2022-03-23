import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLoginInfo, handleErrors } from "../../../utitlties/Utility"
import Post from "../../posts/Post"
import './YourAccountView.css'
import '.././account.css'

function YourAccountView({accountInfo, setAccountInfo, setPostsList, userPostsList, setUserPostsList, loggedInUserInfo}) {

    const [update, setUpdate] = useState(true)

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if(!userPostsList) {
            const getUserPosts = async () => {
                const response = await fetch('/api/v1/posts/user/').catch(handleErrors);
                
                if(!response.ok) {
                    throw new Error('Response was not ok!');
                } else {
                    const data = await response.json();
                    let copyList = data
                    copyList.sort((a, b) => {
                        return b.id - a.id;
                    })
                    setUserPostsList(copyList);
                }
            }
            getUserPosts();
        }

        if(!accountInfo) {
            const getAccountInfo = async () => {
                const response = await fetch('/api/v1/accounts/user/')
          
                if(!response.ok) {
                    console.log('i made it here')
                  throw new Error('Response was not ok!')
                } else {
                  const data = await response.json()
                  setAccountInfo(data)
                }
          }
          getAccountInfo()
        }

    }, [])

    const handleEditClick = () => {
        navigate('/edit/')
    }

   if(!accountInfo) {
       return (
           <div className="account-view">
               <h1>Loading Account Info...</h1>
           </div>
       )
   }

   if(accountInfo.active === false) {
       console.log(accountInfo);
       return (
           <div className="account-view">
               <h1>Account is no longer active.</h1>
           </div>
       )
   }

    const accountHTML = (
        <div className="account">
            <div className="img-container">
                <img src={accountInfo.profile_img} alt="profile-picture"/>
            </div>
            <div className="account-info-container">
                <h1>{accountInfo.alias}</h1>
                <p>{accountInfo.bio}</p>
                <button type="button" className='edit-account-button' onClick={() => handleEditClick()}>Edit</button>
            </div>
        </div>
    )

    let postHTML;

    if(userPostsList && loggedInUserInfo) {
        postHTML = userPostsList.map(post => (
            <Post post={post} loggedInUserInfo={loggedInUserInfo} postsList={userPostsList} setPostsList={setPostsList} userPostsList={userPostsList} setUserPostsList={setUserPostsList} update={update} setUpdate={setUpdate} key={post.id}/>
        ))
    }

    if(userPostsList && userPostsList.length === 0) {
        postHTML = (
            <div className="no-posts-div">
                <h1>No posts yet...</h1>
            </div>
        )
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