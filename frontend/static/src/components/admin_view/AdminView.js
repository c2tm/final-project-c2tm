import { useEffect, useState } from "react"
import AdminPost from "./AdminPost"
import './AdminView.css'

function AdminView({}) {

    const [submittedPostList, setSubmittedPostList] = useState(null)

    useEffect(() => {
        const getSubmittedPosts = async () => { 
            const response = await fetch('/api/v1/posts/admin/')
          
            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                setSubmittedPostList(data)
            }
          
        }
        getSubmittedPosts()
    })

    if(!submittedPostList) {
        return (
            <div>Loading</div>
        )
    }

    let postHTML;

    if(submittedPostList) {
        postHTML = submittedPostList.map(post => (
            <AdminPost post={post} postsList={submittedPostList} setPostsList={setSubmittedPostList} key={post.id}/>
        ))
    }
    


    return (
        <div className="admin-view-container">
            <ul>
                {postHTML}
            </ul>
        </div>
    )
}

export default AdminView