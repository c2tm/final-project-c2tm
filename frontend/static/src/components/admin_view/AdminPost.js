import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { handleErrors } from '../../utitlties/Utility'
import { useNavigate } from 'react-router-dom'
import '../posts/Post.css'

function AdminPost({post, submittedPostList, setSubmittedPostList, postsList, setPostsList, loggedInUserInfo, update, setUpdate}) {

    const [phase, setPhase] = useState('Select an option...')

    const navigate = useNavigate()

    const handlePhaseChange = e => {
        e.preventDefault()

        let postChange;

        if(phase === 'Select an option...') {
            alert('Please select an option!')
            return
        }

        if(phase === 'Publish') {
            postChange = {
                phase: 'PB',
            }
        } else {
            postChange = {
                phase: 'RJ',
            }
        }

        const changePhase = async () => {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(postChange)
            }

            const response = await fetch(`/api/v1/posts/admin/${post.id}/`, options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                let copyList = submittedPostList;
                console.log(submittedPostList)
                const postIndex = copyList.findIndex(thisPost => thisPost.id == post.id);
                copyList.splice(postIndex, 1);

                if(postsList && postChange.phase === 'PB') {
                    let copyList2 = postsList;
                    const postIndex2 = copyList2.findIndex(thisPost => thisPost.id == post.id);
                    copyList2[postIndex2].phase = postChange.phase
                    setPostsList(copyList2);
                }

                setSubmittedPostList(copyList);
                setUpdate(!update);
            }
        }
        changePhase()

        setPhase('Select an option...');

    }

    const handleNameClick = () => {
        console.log('iran')
        if(loggedInUserInfo.pk !== post.user){
            navigate(`/${post.user}/view/`)
        } else {
            navigate('/current-user-account-view/')
        }
    }

    const dropdownHTML = (
        <DropdownButton className='custom-dropdown' id="dropdown-basic-button" title={phase}>
            <Dropdown.Item onClick={() => setPhase('Publish')}>Publish</Dropdown.Item>
            <Dropdown.Item onClick={() => setPhase('Reject')}>Reject</Dropdown.Item>
        </DropdownButton>
    )
    const adminPostHTML = (
        <div className="post">
            <h1 onClick={handleNameClick}>{post.account_alias}</h1>
            <div className="video">
                <video controls>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            <h3>{post.question}</h3>
            <div className="post-answers">
                <div className={`answer-post-guess`}>
                    <p>{post.answer1}</p>
                </div>
                <div className={`answer-post-guess`}>
                    <p>{post.answer2}</p>
                </div>   
            </div>
            <form className='admin-form' onSubmit={handlePhaseChange}>
                {dropdownHTML}
                <button type='submit' className='admin-post-submit-button'>Submit</button>
            </form>
            
        </div>
    )

    return adminPostHTML
}

export default AdminPost