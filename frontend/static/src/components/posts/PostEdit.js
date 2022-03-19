import { useState, useEffect } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useNavigate, useParams } from 'react-router-dom';
import './PostEdit.css'
import Cookies from 'js-cookie';
import { handleErrors } from '../../utitlties/Utility';

function PostEdit({loggedInUserInfo, setUserPostsList, userPostsList}) {

    const [video, setVideo] = useState(undefined);
    const [answerButton, setAnswerButton] = useState(true);

    const navigate = useNavigate();
    const params = useParams();

    const [editPost, setEditPost] = useState({
        question: '',
        answer1: '',
        answer2: '',
    })

    const [placeholder, setPlaceholder] = useState(null)

    useEffect(() => {
        if(!placeholder) {
            const postId = userPostsList.findIndex(post => post.id == params.postId);
            const thisPost = userPostsList[postId]
            setPlaceholder({
                question: thisPost.question,
                answer1: thisPost.answer1,
                answer2: thisPost.answer2,
            })
        }
    }, [])

    const handlePostChange = e => {
        const { name, value } = e.target;
        setEditPost(editPost => ({ ...editPost, [name]: value }));
    };

    const handleEditSubmit = e => {

        e.preventDefault();

        const editFormData = new FormData();

        if(editPost.question) {
            editFormData.append('question', editPost.question);
        }

        if(editPost.answer1) {
            editFormData.append('answer1', editPost.answer1);
        }
        
        if(editPost.answer2) {
            editFormData.append('answer2', editPost.answer2);
        }

        editFormData.append('account', loggedInUserInfo.account_id);

        if(video) {
            editFormData.append('video', video);
        }

        if(answerButton) {
            editFormData.append('correct_answer', 'answer1')
        } else {
            editFormData.append('correct_answer', 'answer2')
        }

        const editForm = async () => {
            const options = {
                method: 'PATCH',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: editFormData,
            }
            const response = await fetch(`/api/v1/posts/user/${params.postId}/`, options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!');
            } else {
                const data = await response.json();
                const copyList = userPostsList;
                const postId = copyList.findIndex(post => post.id == data.id);
                copyList.splice(postId, 1, data);
                setUserPostsList(copyList);
                navigate('/current-user-account-view/')
            }
        }
        editForm();
    }

    if(!placeholder) {
        return('Loading')
    }

    const postEditFormHTML = (
        <div className='edit-form-container' onSubmit={handleEditSubmit}>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>New Video File (If none added, current video will be used)</Form.Label>
                    <Form.Control type="file" placeholder="JohnnyAppleseed1" onChange={(e) => setVideo(e.target.files[0])}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Edit Question</Form.Label>
                    <Form.Control type="text" name="question" placeholder={placeholder.question} value={editPost.question} onChange={handlePostChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Edit Answer1</Form.Label>
                    <Form.Control type="text" name="answer1" placeholder={placeholder.answer1} value={editPost.answer1} onChange={handlePostChange}/>
                    <Form.Label>Edit Answer2</Form.Label>
                    <Form.Control type="text" name="answer2" placeholder={placeholder.answer2} value={editPost.answer2} onChange={handlePostChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Which answer is correct?</Form.Label>
                    <Form.Check type="radio" label='Answer 1' aria-label="radio 1" checked={answerButton === true} onChange={e => setAnswerButton(!answerButton)}/>
                    <Form.Check type="radio" label='Answer 2' aria-label="radio 1" checked={answerButton === false} onChange={e => setAnswerButton(!answerButton)}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Button onClick={() => navigate(-1)}>
                    Cancel
                </Button>
            </Form>
        </div>
    )

    return (
        <div className='post-edit-container' >
            {postEditFormHTML}
        </div>
    )
}

export default PostEdit;