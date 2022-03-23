import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleErrors } from "../../utitlties/Utility";
import './Post.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function Post({post, loggedInUserInfo, setLoggedInUserInfo, setPostsList, postsList, userPostsList, setUserPostsList, update, setUpdate, accountInfo, setAccountInfo, points, setPoints}) {

    const [answer1State, setAnswer1State] = useState(false);
    const [answer2State, setAnswer2State] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(true);
    const [wager, setWager] = useState('');
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [modalText, setModalText] = useState('');

    const navigate = useNavigate()

    console.log(accountInfo)
    
    const handleAnswer1 = () => {
        for(let i = 0; i < post.answers.length; i++) {
            if(loggedInUserInfo || accountInfo) {
                if((loggedInUserInfo.account_id && post.answers[i].profile === loggedInUserInfo.account_id) || (accountInfo && post.answers[i].profile === accountInfo.id)) {
                    if(post.answers[i].user_answer === 'answer1' && post.correct_answer === 'answer1') {
                        return 'correct-answer'
                    } else if(post.answers[i].user_answer === 'answer1' && post.correct_answer === 'answer2') {
                        return 'incorrect-answer'
                    }
                }
            }
        }
    }

    const handleAnswer2 = () => {
        for(let i = 0; i < post.answers.length; i++) {
            if(loggedInUserInfo || accountInfo) {
                if((loggedInUserInfo.account_id && post.answers[i].profile === loggedInUserInfo.account_id) || (accountInfo && post.answers[i].profile === accountInfo.id)) {
                    if(post.answers[i].user_answer === 'answer2' && post.correct_answer === 'answer2') {
                        return 'correct-answer'
                    } else if(post.answers[i].user_answer === 'answer2' && post.correct_answer === 'answer1') {
                        return 'incorrect-answer'
                    }
                }
            }
        }
    }

    const handleAnswer1Click = () => {
        if(answer1State) {
            setAnswer1State(!answer1State);
        } else {
            setAnswer1State(!answer1State);
            setAnswer2State(answer1State);
        }
    }

    const handleAnswer2Click = () => {
        if(answer2State) {
            setAnswer2State(!answer2State)
        } else {
            setAnswer2State(!answer2State);
            setAnswer1State(answer2State);
        }
    }

    const modalTextSetter = text => {
        setModalText(text);
        setShow2(true);
    }

    const handleAnswerSubmit = (e) => {
        e.preventDefault()

        if(!answer1State && !answer2State) {
            modalTextSetter('One guess must be selected!')
            return
        }

        if(Number(wager) > points) {
            modalTextSetter('Not enough points!')
            return
        }
        
        let newAnswer = {
            user_answer: answer1State ? 'answer1' : 'answer2', 
            post: post.id,
            points_wagered: Number(wager),
        }

        if(loggedInUserInfo.account_id) {
            newAnswer.profile = loggedInUserInfo.account_id
        } else if (accountInfo.id) {
            newAnswer.profile = accountInfo.id
        }

        if(!loggedInUserInfo.account_id && !accountInfo.id) {
            alert('ERROR!')
            return
        }

        const submitAnswer = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                body: JSON.stringify(newAnswer)
            }

            const response = await fetch('/api/v1/posts/answers/', options).catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok');
            } else {
                const data = await response.json()
                console.log(data);

                let copyList = postsList;
                let currentPostIndex = copyList.findIndex(e => e.id === post.id);
                let newAnswerArray = copyList[currentPostIndex].answers;

                newAnswerArray.push(data);
                copyList[currentPostIndex].answers = newAnswerArray;

                console.log()

                setPoints(data.user_points);
                
                setPostsList(copyList);
                setForceUpdate(!forceUpdate);
            }
        }
        submitAnswer()
    }

    const handleLikeClick = e => {
        const likeObj = {
            post_id: post.id
        }

        const likeOrUnlike = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                body: JSON.stringify(likeObj),
            }

            const response = await fetch(`/api/v1/posts/like/`, options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!');
            } else {
                const data = await response.json();
                console.log(data);
                const currentPostIndex = postsList.findIndex(e => e.id === post.id);
                if(postsList[currentPostIndex].likes.includes(loggedInUserInfo.pk)) {
                    let copyList = postsList;
                    let likeArray = copyList[currentPostIndex].likes;
                    const newLikeArray = likeArray.filter(user => user !== loggedInUserInfo.pk)
                    copyList[currentPostIndex].likes = newLikeArray;
                    setPostsList(copyList);
                    setForceUpdate(!forceUpdate);
                } else {
                    let copyList = postsList;
                    let newLikeArray = copyList[currentPostIndex].likes;
                    newLikeArray.push(loggedInUserInfo.pk);
                    copyList[currentPostIndex].likes = newLikeArray;
                    setPostsList(copyList);
                    setForceUpdate(!forceUpdate);
                }
                
            }
        }
        likeOrUnlike();
    }

    const handleLikeAndUnlikeButtonHTML = () => {
        const currentPostIndex = postsList.findIndex(e => e.id === post.id);
        if(postsList[currentPostIndex].likes.includes(loggedInUserInfo.pk)) {
            return <button type="button" className='like-button unliked' onClick={handleLikeClick}><span>&#9829;</span> {post.likes.length}</button>
        } else {
            return <button type="button" className='like-button liked' onClick={handleLikeClick}><span>&#9825;</span> {post.likes.length}</button>
        }
    }

    const handleNameClick = () => {
        console.log('iran')
        if(loggedInUserInfo.pk !== post.user){
            navigate(`/${post.user}/view/`)
        } else {
            navigate('/me/')
        }
    }

    const handleDelete = () => {
        const deletePost = async () => {
            const options = {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            }
            const response = await fetch(`/api/v1/posts/user/${post.id}/`, options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                let copyList = userPostsList;
                const postIndex = copyList.findIndex(p => p.id === post.id);
                copyList.splice(postIndex, 1);
                setUserPostsList(copyList);
                setUpdate(!update);
            }
        }
        deletePost();
        setShow(false);
    }

    const translatePhase = (obj) => {
        if (obj.phase === 'SB') {
            return 'Submitted';
        } else {
            return 'Rejected';
        }
    }

    const postGuessHTML = (
        <div className="post">
            <Modal show={show} onHide={() => setShow(false)} centered>
                <div>
                    <div>
                        <h1 className="modal-h1">Are you sure you want to delete this post?</h1>
                    </div>              
                    <div className="modal-buttons">
                        <Button className="custom-button" onClick={() => setShow(false)}>
                            Close
                        </Button>
                        <Button className="custom-button delete" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
            <h1 onClick={handleNameClick}>{post.account_alias}</h1>
            <div className="video">
                <video controls>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            <div className="likes-container">
                {post.user !== loggedInUserInfo.pk ? handleLikeAndUnlikeButtonHTML() : <p className="like-amount"><span>&#9829;</span>{post.likes.length} </p>}
            </div>
            {(post.phase === 'SB' || post.phase === 'RJ') && translatePhase(post)}
            <h3>{post.question}</h3>
            <div className="post-answers">
                <div className={`answer-post-guess ${handleAnswer1()}`}>
                    <p>{post.answer1}</p>
                </div>
                <div className={`answer-post-guess ${handleAnswer2()}`}>
                    <p>{post.answer2}</p>
                </div>   
            </div>
            <div>
                
            </div>
            <div className="edit-delete-button-group">
                {post.phase === 'SB' && <button type="type" className='delete-button' onClick={() => navigate(`/edit-post/${post.id}`)}>Edit</button>}
                {post.user === loggedInUserInfo.pk ? <button type="button" className='delete-button' onClick={() => setShow(true)}>Delete</button> : null}
            </div>
        </div>
    )

    const preGuessHTML = (
        <div className="post" >
            <Modal show={show2} onHide={() => setShow2(false)} className='preguesspost-modal'>
                <h1 className='preguesspost-modal-h1'>{modalText}</h1>
                <Button variant="secondary" className='custom-button preguesspost-modal-button' onClick={() => setShow2(false)}>
                    Close
                </Button>
            </Modal>
            <h1 onClick={handleNameClick}>{post.account_alias}</h1>
            {/* <div className="thumbnail">
                <img src={post.thumbnail} alt='video-thumbnail'/>
            </div> */}
            <div className="video">
                <video>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            {/* <div className="likes-container">
                <p>{`${post.likes.length} Likes`}</p>
            </div> */}
            <h3 className="preguess-question">{post.question}</h3>
            <form className="post-answers-form" onSubmit={handleAnswerSubmit}>
                <div className="post-answers">
                    <button type='button' name='1' className={`answer ${answer1State ? 'selected-answer' : null}`} onClick={handleAnswer1Click}>
                        <p>{post.answer1}</p>
                    </button>
                    <button type='button' name='2' className={`answer ${answer2State ? 'selected-answer' : null}`} onClick={handleAnswer2Click}>
                        <p>{post.answer2}</p>
                    </button>
                </div>
                <label>Points to wager:</label>
                <input type='number' value={wager} onChange={e => setWager(e.target.value)}/>
                <button type="submit" className="answer-submit-button">
                    Submit!
                </button>
            </form>
        </div>
    )

    if (post.user === loggedInUserInfo.pk) {
        return postGuessHTML
    }

    if(post.answers !== []) {
        let answered = false;
            for(let i = 0; i < post.answers.length; i++) {
                if((loggedInUserInfo && post.answers[i].profile === loggedInUserInfo.account_id) || (accountInfo && post.answers[i].profile === accountInfo.id)) {
                    answered = true
                }
            }
        if(answered) {
            return postGuessHTML
        }
    }
    return preGuessHTML
}

export default Post