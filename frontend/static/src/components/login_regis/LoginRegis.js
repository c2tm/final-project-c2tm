import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './LoginRegis.css'
import Cookies from 'js-cookie'
import { handleErrors } from '../../utitlties/Utility'
import { useNavigate } from 'react-router-dom'

function LoginRegis() {

    const [html, setHtml] = useState(true);

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
                    Cookies.set('authorization', `Token ${data}`)
                    navigate('/');
                    
                } else {
                    alert('Incorrect username or password')
                }
                
            }
        }
        _login()
    }

    const handleRegister = () => {

        if (regis.password1 !== regis.password2) {
            alert('Passwords do not match!');
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
            const response = await fetch('/rest-auth/registraion/', options).catch(handleErrors);

            if(!response.ok) {
                alert('A user with this username or email already exist!')
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                Cookies.set('authorization', `Token ${data}`)
                navigate('/')
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

    const loginHTML = (
        <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="JohnnyAppleseed1" value={login.username} onChange={handleLoginChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder='password123' value={login.password} onChange={handleLoginChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Button type="button" onClick={handleClick}>
                    Register
                </Button>
        </Form>
    )

    const regisHTML = (
        <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="JohnnyAppleseed1" value={regis.username} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="email@example.com" value={regis.email} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password1" placeholder='password123' value={regis.password1} onChange={handleRegisChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password2" placeholder='password123' value={regis.password2} onChange={handleRegisChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Button type="button" onClick={handleClick}>
                    Back
                </Button>
        </Form>
    )
    return (
        <div className='login-regis-container'>
            <div className='form-container'>
                {html ? loginHTML : regisHTML}
            </div>
        </div>
    )
}

export default LoginRegis