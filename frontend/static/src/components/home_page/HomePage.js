import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { handleErrors } from "../../utitlties/Utility";

function HomePage({setAuth}) {

    const navigate = useNavigate()

    const handleLogout = () => {
        const logout = async () => {
            const options = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                },
            }
            const response = await fetch('/rest-auth/logout/', options).catch(handleErrors);
  
            if(!response.ok) {
                throw new Error('Response was not ok!')
            } else {
              Cookies.remove('authorization')
              setAuth(null);
              navigate('/login/');
            }
        }
        logout();
    }

    return (
        <div>
            <button type="button" onClick={handleLogout}>Logout</button>
            <button type="button" onClick={() => navigate('/account-view/')}>View Profile</button>
        </div>
    )
}
        
export default HomePage