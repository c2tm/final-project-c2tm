import { useNavigate } from "react-router-dom";

function User({user}) {

    const navigate = useNavigate();

    return (
        <div>
            {/* <div>
                <img src={user.profile_img}/>
            </div> */}
            <h1 onClick={() => navigate(`/${user.user}/view/`)}>{user.alias}</h1>
            <h2>{user.points}</h2>
        </div>
    )
}

export default User;