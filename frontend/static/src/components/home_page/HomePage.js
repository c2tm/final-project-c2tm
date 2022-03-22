import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getLoginInfo, handleErrors } from "../../utitlties/Utility";
import './HomePage.css'
import Post from '../posts/Post';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function HomePage({loggedInUserInfo, setLoggedInUserInfo, setPostsList, postsList, setAccountInfo, accountInfo}) {

    const [update, forceUpdate] = useState(true)
    const [show, setShow] = useState(false)
    const [modalText, setModaltext] = useState(false)
    const navigate = useNavigate()

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

    let postsListHTML;

    console.log(postsList)

    const handleClose = () => {
        setShow(false);
    }

    if(postsList && loggedInUserInfo) {
        postsListHTML = postsList.filter(post => post.account_active).map(post => (
            <Post post={post} loggedInUserInfo={loggedInUserInfo} setLoggedInUserInfo={setLoggedInUserInfo} setPostsList={setPostsList} postsList={postsList} accountInfo={accountInfo} setAccountInfo={setAccountInfo} key={post.id}/>
        ))
    } else {
        postsListHTML = null
    }

    

    return (
        <div className='homepage'>
            
            <ul>
                {postsListHTML}
            </ul>
            <h1>You've reached the end...</h1>
        </div>
    )
}
        
export default HomePage