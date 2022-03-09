import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './EditAccountView.css'
import { handleErrors } from '../../utitlties/Utility'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

function EditAccountView({accountInfo, setAccountInfo}) {

    const [edit, setEdit] = useState({
        alias: '',
        bio: '',

    })

    const navigate = useNavigate()

    useEffect(() => {
        if(!accountInfo) {
            const getAccount = async () => {
                const response = await fetch('/api/v1/accounts/user/').catch(handleErrors);

                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json()
                    
                    setAccountInfo(data[0]);
                }
            }
        getAccount()
        }
    },[])

    const handleEditChange = e => {
        const { name, value } = e.target;
        setEdit(edit => ({ ...edit, [name]: value }));
    }

    const handleCancelClick = () => {
        navigate('/account-view/');
    }

    const handleSubmit = e => {
        e.preventDefault();

        let editObject = new FormData();

        if (editObject.alias === '' && editObject.bio !== '') {
            editObject('bio', edit.bio)
        } else if (editObject.bio === '' && editObject.alias !== '') {
            editObject('alias', edit.alias)
        } 

        if (edit.hasOwnProperty('profile_img')) {
            editObject('profile_img', edit.profile_img);
        }

        const editAccount = async () => {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(editObject),

            }
            const response = await fetch(`/api/v1/accounts/user/${accountInfo.id}/`, options).catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json();
                setAccountInfo(data);
                navigate('/account-view/');
            }
        }
        editAccount();
    }

    if(!accountInfo) {
        return (
            <div>
                <h1>Loading</h1>
            </div>
        )
    }

    const editFormHTML = (
        <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="profile_img" value={edit.profile_img} onChange={handleEditChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Alias</Form.Label>
                    <Form.Control type="text" name="alias" placeholder={accountInfo.alias} value={edit.alias} onChange={handleEditChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} name="bio" placeholder={accountInfo.bio} value={edit.bio} onChange={handleEditChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <button type='button' onClick={handleCancelClick}>
                    Cancel
                </button>
        </Form>
    )

    return (
        <div className='edit-account-view-container'>
            <div className='form-container'>
                {editFormHTML}
            </div>
        </div>
        
    )
}

export default EditAccountView