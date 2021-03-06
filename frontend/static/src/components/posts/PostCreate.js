import { useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

import './PostCreate.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { handleErrors } from '../../utitlties/Utility';

function PostCreate({loggedInUserInfo, userPostsList, setUserPostsList, accountInfo}) {

    const [video, setVideo] = useState(undefined);
    const [answerButton, setAnswerButton] = useState(true);
    const [show, setShow] = useState(false);

    const [newPost, setNewPost] = useState({
        question: '',
        answer1: '',
        answer2: '',
    })

    const navigate = useNavigate();

    const handlePostChange = e => {
        const { name, value } = e.target;
        setNewPost(newPost => ({ ...newPost, [name]: value }));
      };

    const handleClose = () => {
        setShow(false);
    }

    const handleSubmit = e => {

        e.preventDefault();

        const postFormData = new FormData();
        postFormData.append('question', newPost.question);
        postFormData.append('answer1', newPost.answer1);
        postFormData.append('answer2', newPost.answer2);
        postFormData.append('video', video);

        if(loggedInUserInfo.account_id) {
            postFormData.append('account', Number(loggedInUserInfo.account_id));
        } else if(accountInfo.id) {
            postFormData.append('account', Number(accountInfo.id));
        }
        

        if(answerButton) {
            postFormData.append('correct_answer', 'answer1');
        } else {
            postFormData.append('correct_answer', 'answer2');
        }

        setShow(true);

        const createPost = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: postFormData,
            }

            const response = await fetch('/api/v1/posts/user/', options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!');
            } else {
                const data = await response.json();
                if(userPostsList) {
                    let copyList = userPostsList;
                    copyList.unshift(data);
                    setUserPostsList(copyList);
                }
                navigate('/me/');
            }
        }
        createPost()
    }

    const postCreateFormHTML = (
        <div className='create-form-container' onSubmit={handleSubmit}>
            <Form className='create-form'>
                <Form.Group className="group mb-3">
                    <Form.Label>Video</Form.Label>
                    <Form.Control type="file" placeholder="JohnnyAppleseed1" onChange={(e) => setVideo(e.target.files[0])}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control type="text" name="question" placeholder='In this video, does...?' value={newPost.question} onChange={handlePostChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Answer1</Form.Label>
                    <Form.Control type="text" name="answer1" placeholder='This?' value={newPost.answer1} onChange={handlePostChange}/>
                    <Form.Label>Answer2</Form.Label>
                    <Form.Control type="text" name="answer2" placeholder='That?' value={newPost.answer2} onChange={handlePostChange}/>
                </Form.Group>
                <Form.Group className="correct-answer-group mb-3">
                    <Form.Label>Which answer is correct?</Form.Label>
                    <Form.Check type="radio" label='Answer 1' aria-label="radio 1" checked={answerButton === true} onChange={e => setAnswerButton(!answerButton)}/>
                    <Form.Check type="radio" label='Answer 2' aria-label="radio 1" checked={answerButton === false} onChange={e => setAnswerButton(!answerButton)}/>
                </Form.Group>
                <div className='button-group'>
                    <Button variant="primary" className='custom-button' type="submit">
                        Post
                    </Button>
                    <Button className='custom-button' onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </div>
            </Form>
        </div>
    )

    return (
        <div className='post-create-container'>
            <Modal backdrop='static' show={show} onHide={handleClose} className='create-post-loading-modal'>
            <Spinner animation="border" role="status" className='custom-spinner'>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            </Modal>
            {postCreateFormHTML}
        </div>
    )
}

export default PostCreate