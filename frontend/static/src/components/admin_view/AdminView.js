import AdminPost from "./AdminPost"
import './AdminView.css'

function AdminView({submittedPostList, setSubmittedPostList}) {

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