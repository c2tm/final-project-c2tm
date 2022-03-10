import { useNavigate } from "react-router-dom"

function AccountDeletion() {

    const navigate = useNavigate();

    const handleDeactivateClick = () => {
        const deactivate = async () => {

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