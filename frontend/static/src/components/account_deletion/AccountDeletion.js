import { useNavigate } from "react-router-dom"
import { handleErrors, handleLogout } from "../../utitlties/Utility";
import './AccountDeletion.css'

function AccountDeletion({setAccountInfo, setUserPostsList}) {

    const navigate = useNavigate();

    const handleDeactivateClick = () => {
        const deactivate = async () => {
            const response = await fetch('/api/v1/accounts/user/deactivate/').catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                console.log(data)
                handleLogout(navigate, setUserPostsList)
            }
        }
        deactivate();
    }

    return (
        <div className="account-deletion-view">
            <div>
                <h1>Are you sure you want to deactivate your account?</h1>
                <div>
                    <button type="button" className="deactivate-button" onClick={handleDeactivateClick}>Yes</button>
                    <button type="button" className="deactivate-button" onClick={() => navigate('/current-user-account-view/')}>No</button>
                </div>
            </div>
        </div>
    )
}

export default AccountDeletion