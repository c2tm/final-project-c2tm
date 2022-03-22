import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './LoginRegis.css'
import Cookies from 'js-cookie'
import { handleErrors } from '../../utitlties/Utility'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

function LoginRegis({setAccountInfo, setLoggedIn, setLoggedInUserInfo}) {

    const [html, setHtml] = useState(true);
    const [show, setShow] = useState(false);
    const [modalText, setModaltext] = useState('');

    const navigate = useNavigate()

    const [login, setLogin] = useState({
        username: '',
        password: '',
    })

    const [regis, setRegis] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
        active: true,
    })

    const initialLoginState = {
        username: '',
        password: '',
    }

    const initialRegisState = {
        username: '',
        email: '',
        password1: '',
        password2: '',
    }

    const modalTextSetter = text => {
        setModaltext(text);
        setShow(true);
    }

    const createAccount = async () => {
        const newAccount = new FormData()
        newAccount.append('alias', regis.username)
        newAccount.append('active', true)
        const options = {
            method: 'POST',
            headers: {
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: newAccount
        }

        const response = await fetch('/api/v1/accounts/create/', options).catch(handleErrors);

        if(!response.ok) {
            throw new Error('Response was not ok!')
        } else {
            const data = await response.json()
            setAccountInfo(data);
        }
    }

    const handleLogin = () => {
        const _login = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(login)
            }

            const response = await fetch('/rest-auth/login/', options).catch(handleErrors);

            if(!response) {
                throw new Error('response was not ok!')
            } else {
                const data = await response.json()
                if (data.hasOwnProperty('key')) {
                    Cookies.set('authorization', `Token ${data.key}`)
                    setLoggedInUserInfo(data);
                    navigate('/');
                    
                } else {
                    modalTextSetter('Incorrect username or password')
                }
                
            }
        }
        _login()
    }

    const handleRegister = () => {

        if (regis.password1 !== regis.password2) {
            modalTextSetter('Passwords do not match!');
            return
        }

        const register = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
                body: JSON.stringify(regis),
            }
            const response = await fetch('/rest-auth/registration/', options).catch(handleErrors);

            if(!response.ok) {
                modalTextSetter('Please check that all fields are filled in. If they are, a user with this username or email already exist!')
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                Cookies.set('authorization', `Token ${data.key}`);
                setLoggedInUserInfo(data);
                createAccount();
                navigate('/');
            }
        }
        register();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (html) {
            handleLogin()
        } else {
            handleRegister()
        }
    }

    const handleClick = (e) => {
        e.stopPropagation();
        if(html) {
            setLogin(initialLoginState);
        } else {
            setRegis(initialRegisState);
        }
        setHtml(!html);
    }

    const handleLoginChange = e => {
        const { name, value } = e.target;
        setLogin(login => ({ ...login, [name]: value }));
      };

    const handleRegisChange = e => {
        const { name, value } = e.target;
        setRegis(regis => ({ ...regis, [name]: value }));
      };

    const handleClose = () => {
        setShow(false);
    }

    const loginHTML = (
        <Form onSubmit={handleSubmit} className='login-form'>
                <Form.Group className="group mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="JohnnyAppleseed1" value={login.username} onChange={handleLoginChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder='password123' value={login.password} onChange={handleLoginChange}/>
                </Form.Group>
                <div className='button-group'>
                    <Button className='custom-button' type="submit">
                        Login
                    </Button>
                    <Button className='custom-button' type="button" onClick={handleClick}>
                        Register
                    </Button>
                </div>   
        </Form>
    )

    const regisHTML = (
        <Form className='regis-form' onSubmit={handleSubmit}>
                <Form.Group className="group mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="JohnnyAppleseed1" value={regis.username} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="email@example.com" value={regis.email} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password1" placeholder='password123' value={regis.password1} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="group mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password2" placeholder='password123' value={regis.password2} onChange={handleRegisChange}/>
                </Form.Group>
                <div className='button-group'>
                    <Button className='custom-button' type="submit" >
                        Submit
                    </Button>
                    <Button type="button" className='custom-button' onClick={handleClick} >
                        Back
                    </Button>
                </div>
                
        </Form>
    )
    return (
        <div className='login-regis-container'>
            <Modal show={show} onHide={handleClose} className='login-view-modal'>
                <h1 className='login-modal-h1'>{modalText}</h1>
                <Button variant="secondary" className='custom-button login-modal-button' onClick={handleClose}>
                    Close
                </Button>
            </Modal>
            <div className='form-container'>
            
                {html ? loginHTML : regisHTML}
            </div>
        </div>
    )
}

export default LoginRegis