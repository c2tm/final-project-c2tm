import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleErrors, handleLogout } from "../../utitlties/Utility"
import './AccountReactivation.css'

function AccountReactivation({setAccountInfo, accountInfo, loggedInUserInfo}) {

    const navigate = useNavigate();

    useEffect(() => {
        if((loggedInUserInfo && loggedInUserInfo.account_active) || (accountInfo && accountInfo.active)) {
            navigate('/')
        }
    },[loggedInUserInfo, accountInfo])

    const handleActivateClick = () => {
        const reactivate = async () => {
            const response = await fetch('/api/v1/accounts/user/activate/').catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                setAccountInfo(data)
                const copyData = loggedInUserInfo
                copyData.account_active = true
                navigate('/')
            }
        }
        reactivate();
    }

    return (
    <div className="account-reactivation-view">
        <div>
            <h1>This account is deactivated. Would you like to reactivate your account?</h1>
            <div>
                <button type="button" className='reactivation-button' onClick={handleActivateClick}>Yes</button>
                <button type="button" className='reactivation-button' onClick={() => handleLogout(navigate)}>No</button>
            </div>
        </div>  
    </div>
    )
}

export default AccountReactivation