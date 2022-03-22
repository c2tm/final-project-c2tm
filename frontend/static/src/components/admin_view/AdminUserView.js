import {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Cookies from 'js-cookie';
import { handleErrors } from '../../utitlties/Utility';
import { useNavigate } from 'react-router-dom';
import CloseButton from 'react-bootstrap/CloseButton'


function AdminUserView({account, flaggedAccounts, setFlaggedAccounts, update, setUpdate, loggedInUserInfo}) {

    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);

    const handleOptionsClick = () => setShow(true);

    const handleRemoveFlag = async () => {

        const accObj = {
            flagged: false,
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(accObj)
        }

        const response = await fetch(`/api/v1/accounts/${account.id}/`, options).catch(handleErrors);

        if(!response.ok) {
            throw new Error('Response was not ok')
        } else {
            let copyList = flaggedAccounts;
            const accountIndex = copyList.findIndex(acc => acc.id === account.id);
            copyList.splice(accountIndex, 1);
            setFlaggedAccounts(copyList);
            setShow(false)
        }
        
        setUpdate(!update);
    }

    const handleBanAccount = async () => {
        const accObj = {
            flagged: false,
            banned: true,
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify(accObj)
        }

        const response = await fetch(`/api/v1/accounts/${account.id}/`, options).catch(handleErrors);

        if(!response.ok) {
            throw new Error('Response was not ok')
        } else {
            let copyList = flaggedAccounts;
            const accountIndex = copyList.findIndex(acc => acc.id === account.id);
            copyList.splice(accountIndex, 1);
            setFlaggedAccounts(copyList);
            setShow(false)
        }

        setUpdate(!update);
    }

    const handleNameClick = () => {
        console.log('iran')
        if(loggedInUserInfo.pk !== account.user){
            navigate(`/${account.user}/view/`)
        } else {
            navigate('/current-user-account-view/')
        }
    }

    return (

        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                <Modal.Title>Options</Modal.Title>
                <CloseButton variant="white" onClick={() => setShow(!show)}/>
                </Modal.Header>
                <Modal.Body>What would you like to do to {account.alias}'s account?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" className='custom-button' onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="secondary" className='custom-button' onClick={handleBanAccount}>
                    Ban Account
                </Button>
                <Button variant="primary" className='custom-button' onClick={handleRemoveFlag}>
                    Remove Flag
                </Button>
                </Modal.Footer>
            </Modal>

            <div className="admin-view-account">
           
                <div className='img-container'>
                    <img src={account.profile_img} alt="profile image"/>
                </div>
                <h1 onClick={handleNameClick}>{account.alias}</h1>
                <h3>{account.points}</h3>
                <h4>{account.alltime_points}</h4>
                <button onClick={handleOptionsClick}>Options</button>
            
            </div>
        </div>

        
    )
}

export default AdminUserView;