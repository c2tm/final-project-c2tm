import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './EditAccountView.css'
import { handleErrors } from '../../utitlties/Utility'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'


function EditAccountView({accountInfo, setAccountInfo}) {

    const [edit, setEdit] = useState({
        alias: '',
        bio: '',

    })

    const [picture, setPicture] = useState(null);

    const [show, setShow] = useState(false);
    const [modalText, setModalText] = useState('');

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

    const modalTextSetter = text => {
        setModalText(text);
        setShow(true);
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleEditChange = e => {
        const { name, value } = e.target;
        setEdit(edit => ({ ...edit, [name]: value }));
    }

    const handleCancelClick = () => {
        navigate('/current-user-account-view/');
    }

    const handleSubmit = e => {
        e.preventDefault();

        if(edit.bio.length > 20) {
            modalTextSetter('Bio is too long!')
            return
        }

        let editObject = new FormData();

        if (edit.alias !== '' && edit.bio !== '') {
            editObject.append('bio', edit.bio);
            editObject.append('alias', edit.alias);
        } else if (edit.alias === '' && edit.bio !== '') {
            editObject.append('bio', edit.bio);
        } else if (edit.bio === '' && edit.alias !== '') {
            editObject.append('alias', edit.alias);
        }

        if (picture) {
            editObject.append('profile_img', picture);
        }

        editObject.append('active', true);


        const editAccount = async () => {
            const options = {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: editObject,

            }
            const response = await fetch(`/api/v1/accounts/user/detail/`, options).catch(handleErrors);

            if(!response.ok) {
                throw new Error('Response was not ok!');
            } else {
                const data = await response.json();
                setAccountInfo(data);
                navigate('/current-user-account-view/');
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
                <Form.Group className="group mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" name="profile_img" onChange={(e) => setPicture(e.target.files[0])}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Alias</Form.Label>
                    <Form.Control type="text" name="alias" placeholder={accountInfo.alias} value={edit.alias} onChange={handleEditChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} name="bio" placeholder={accountInfo.bio} value={edit.bio} onChange={handleEditChange}/>
                </Form.Group>
                <div className='edit-view-button-group'>
                    <Button className='custom-button' type="submit">
                        Submit
                    </Button>
                    <Button className='custom-button' type="button" onClick={handleCancelClick}>
                        Cancel
                    </Button>
                    <Button className='custom-button' type="button" onClick={() => navigate('/delete-account/')}>
                        Deactivate
                    </Button>
                </div>
        </Form>
    )

    return (
        <div className='edit-account-view-container'>
            <Modal show={show} onHide={handleClose} className='login-view-modal'>
                <h1 className='login-modal-h1'>{modalText}</h1>
                <Button variant="secondary" className='custom-button login-modal-button' onClick={handleClose}>
                    Close
                </Button>
            </Modal>
            <div className='form-container'>
                {editFormHTML}
            </div>
        </div>
        
    )
}

export default EditAccountView