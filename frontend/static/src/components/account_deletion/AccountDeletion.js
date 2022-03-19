import { useNavigate } from "react-router-dom"
import { handleErrors, handleLogout } from "../../utitlties/Utility";

function AccountDeletion({setAccountInfo}) {

    const navigate = useNavigate();

    const handleDeactivateClick = () => {
        const deactivate = async () => {
            const response = await fetch('/api/v1/accounts/user/deactivate/').catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                console.log(data)
                handleLogout(navigate)
            }
        }
        deactivate();
    }

    return (
        <div>
            <h1>Are you sure you want to deactivate your account?</h1>
            <div>
                <button type="button" onClick={handleDeactivateClick}>Yes</button>
                <button type="button" onClick={() => navigate('/account-view/')}>No</button>
            </div>
        </div>
    )
}

export default AccountDeletion