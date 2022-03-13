import Cookies from 'js-cookie';
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getLoginInfo, handleErrors } from "../../utitlties/Utility";
import './HomePage.css'
import Post from './Post';

function HomePage({setAccountInfo, accountInfo, setPostsList, postsList}) {

    const [update, forceUpdate] = useState(true)
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

    useEffect(() => {
        if(accountInfo) {
            forceUpdate(!update)
        }
    }, [accountInfo])

    let postsListHTML;

    if(postsList && accountInfo) {
        postsListHTML = postsList.map(post => (
            <Post post={post} accountInfo={accountInfo}/>
        ))
    } else {
        postsListHTML = null
    }

    

    return (
        <div className='homepage'>
            <ul>
                {postsListHTML}
            </ul>
        </div>
    )
}
        
export default HomePage