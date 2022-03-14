import Cookies from "js-cookie";
import { useState } from "react";

function Post({post, accountInfo, setPostsList, postsList}) {

    const [answer1State, setAnswer1State] = useState(false);
    const [answer2State, setAnswer2State] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(true);
    
    const handleAnswer1 = () => {
        for(let i = 0; i < post.answers.length; i++) {
            if(post.answers[i].profile === accountInfo.id) {
                if(post.answers[i].user_answer === 'answer1' && post.correct_answer === 'answer1') {
                    return 'correct-answer'
                } else if(post.answers[i].user_answer === 'answer1' && post.correct_answer === 'answer2') {
                    return 'incorrect-answer'
                }
            }
        }
    }

    const handleAnswer2 = () => {
        for(let i = 0; i < post.answers.length; i++) {
            if(post.answers[i].profile === accountInfo.id) {
                if(post.answers[i].user_answer === 'answer2' && post.correct_answer === 'answer2') {
                    return 'correct-answer'
                } else if(post.answers[i].user_answer === 'answer2' && post.correct_answer === 'answer1') {
                    return 'incorrect-answer'
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

    const handleAnswerSubmit = (e) => {
        e.preventDefault()

        if(!answer1State && !answer2State) {
            alert('One guess must be selected!')
            return
        }
        
        let newAnswer = {
            user_answer: answer1State ? 'answer1' : 'answer2', 
            profile: accountInfo.id,
            post: post.id,
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

            const response = await fetch('/api/v1/posts/answers/', options)

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
                setPostsList(copyList);
                setForceUpdate(!forceUpdate);
            }
        }
        submitAnswer()
    }


    const postGuessHTML = (
        <div className="post">
            <h1>{post.account_alias}</h1>
            <h2>{post.username}</h2>
            <div className="video">
                <video controls>
                    <source src={post.video} type='video/mp4'/>               
                </video>
            </div>
            <div>
                <p>{`${post.likes.length} Likes`}</p>
                {post.user !== accountInfo.user ? <button type="button">Like</button> : null}
            </div>
            <div className="post-answers">
                <div className={`answer-post-guess ${handleAnswer1()}`}>
                    <p>{post.answer1}</p>
                </div>
                <div className={`answer-post-guess ${handleAnswer2()}`}>
                    <p>{post.answer2}</p>
                </div>   
            </div>
        </div>
    )

    const preGuessHTML = (
        <div className="post" >
            <h1>{post.account_alias}</h1>
            <h2>{post.username}</h2>
            <div className="thumbnail">
                <img src={post.thumbnail} alt='video-thumbnail'/>
            </div>
            
            <p>{`${post.likes.length} Likes`}</p>
            <h3>{post.question}</h3>
            <form className="post-answers-form" onSubmit={handleAnswerSubmit}>
                <div className="post-answers">
                    <button type='button' name='1' className={`answer ${answer1State ? 'selected-answer' : null}`} onClick={handleAnswer1Click}>
                        <p>{post.answer1}</p>
                    </button>
                    <button type='button' name='2' className={`answer ${answer2State ? 'selected-answer' : null}`} onClick={handleAnswer2Click}>
                        <p>{post.answer2}</p>
                    </button>
                </div>
                <button type="submit" className="answer-submit-button">
                    Submit!
                </button>
            </form>
        </div>
    )

    if (post.user === accountInfo.user) {
        return postGuessHTML
    }

    if(post.answers !== []) {
        let answered = false;
        for(let i = 0; i < post.answers.length; i++) {
            if(post.answers[i].profile === accountInfo.id) {
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