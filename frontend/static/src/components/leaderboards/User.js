import { useNavigate } from "react-router-dom";

function User({user}) {

    const navigate = useNavigate();
    
    return (
        <div>
            <h1 onClick={() => navigate(`/${user.user}/view/`)}>{user.alias}</h1>
            <h2>Current Points: {user.points}</h2>
        </div>
    )
}

export default User;