import { useEffect, useState } from "react"
import AdminPost from "./AdminPost"
import './AdminView.css'
import Form from 'react-bootstrap/Form/'
import AdminUserView from "./AdminUserView"

function AdminView({setPostsList, postsList}) {

    const [submittedPostList, setSubmittedPostList] = useState(null)
    const [flaggedAccounts, setFlaggedAccounts] = useState(null);
    const [heading, setHeading] = useState('Submitted Posts')
    const [view, setView] = useState(true);
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        if(!submittedPostList) {
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
        }

        if(!flaggedAccounts) {
            console.log('iran')
            const getFlaggedUsers = async () => {
                const response = await fetch('/api/v1/accounts/flagged/')

                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json();
                    setFlaggedAccounts(data);
                    console.log(data);
                }
            }
            getFlaggedUsers();
        }

    }, [submittedPostList])

    if(!submittedPostList || !flaggedAccounts) {
        return (
            <div>Loading</div>
        )
    }

    const emptyPostListCheck = () => {
        if(submittedPostList.length === 0) {
            return true
        }
        return false
    }

    const emptyFlaggedAccountsListCheck = () => {
        if(flaggedAccounts.length === 0) {
            return true
        }
        return false
    }

    let postHTML;
    let userAccountsHTML;

    if(submittedPostList) {
        postHTML = submittedPostList.map(post => (
            <AdminPost post={post} submittedPostList={submittedPostList} setSubmittedPostList={setSubmittedPostList} postsList={postsList} setPostsList={setPostsList} update={update} setUpdate={setUpdate} key={post.id}/>
        ))
    }

    if(flaggedAccounts) {
        userAccountsHTML = flaggedAccounts.map(account => (
            <AdminUserView account={account} flaggedAccounts={flaggedAccounts} setFlaggedAccounts={setFlaggedAccounts} update={update} setUpdate={setUpdate} key={account.id}/>
        ))
    }

    const noMoreHTML = () => {
        if (view) {
            return (
            <div className="no-more-posts">
                <h1>No more submitted post.</h1>
            </div>
            )
        } else {
            return (
            <div className="no-more-posts">
                <h1>No more flagged accounts.</h1>
            </div>
            )
        }
    }

    const handleSwitchClick = e => {
        if(heading === 'Submitted Posts') {
            setHeading('Flagged Accounts')
            setView(!view)
        } else {
            setHeading('Submitted Posts')
            setView(!view)
        }
    }

    return (
        <div className="admin-view-container">
            <Form.Check 
                type="switch"
                id="custom-switch"
                label={heading}
                onClick={handleSwitchClick}
                className='switch'
            />
            {view ? emptyPostListCheck() ? noMoreHTML() : null : emptyFlaggedAccountsListCheck() ? noMoreHTML() : null}

            {view ? (
                <ul>
                    {postHTML}
                </ul>
            ) : (
                <ul>
                    {userAccountsHTML}
                </ul>
            )}

        </div>
    )
}

export default AdminView