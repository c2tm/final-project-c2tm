import { useNavigate } from "react-router-dom"

function AllTimeUser({user}) {

    const navigate = useNavigate()

    return (
        <div>
            <h1 onClick={() => navigate(`/${user.user}/view/`)}>{user.alias}</h1>
            <h2>{user.alltime_points}</h2>
        </div>
    )
}

export default AllTimeUser