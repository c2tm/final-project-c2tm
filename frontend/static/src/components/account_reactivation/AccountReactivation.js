import { useNavigate } from "react-router-dom";
import { handleErrors, handleLogout } from "../../utitlties/Utility"

function AccountReactivation({setAccountInfo}) {

    const navigate = useNavigate();

    const handleActivateClick = () => {
        const reactivate = async () => {
            const response = await fetch('/api/v1/accounts/user/activate/').catch(handleErrors)

            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
                const data = await response.json()
                console.log(data)
                setAccountInfo(data[0])
                navigate('/')
            }
        }
        reactivate();
    }

    return (
        <div>
        <h1>This account is deactivated. Would you like to reactivate your account?</h1>
        <div>
            <button type="button" onClick={handleActivateClick}>Yes</button>
            <button type="button" onClick={() => handleLogout(setAccountInfo, navigate)}>No</button>
        </div>
    </div>
    )
}

export default AccountReactivation