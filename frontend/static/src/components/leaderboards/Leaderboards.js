import { useEffect, useState } from 'react';
import { handleErrors } from '../../utitlties/Utility';
import './Leaderboards.css'
import User from './User';
import AllTimeUser from './AllTimeUser'

function Leaderboard() {

    const [userList, setUserList] = useState(null)

    useEffect(() => {
        if(!userList) {
            const getUsers = async () => {
                const response = await fetch('/api/v1/accounts/').catch(handleErrors);

                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json()
                    setUserList(data);
                }
            }
            getUsers()
        }
    }, [])

    if(!userList) {
        return (
            <div className="leaderboards-container">
                <h1>Loading...</h1>
            </div>
        )
    }

    const leaderboardHTML = userList.sort((a, b) => {return b.points - a.points}).map(user => (
        <User user={user} key={user.id}/>
    ))

    const alltimeLeaderboardHTML = userList.sort((a, b) => {return b.alltime_points - a.alltime_points}).map(user => (
        <AllTimeUser user={user} key={user.id}/>
    ))

    return (
        <div className="leaderboards-container">
            <div>
                <h1>Most Points Held Currently Leaderboard</h1>
                {leaderboardHTML}
            </div>
            <div>
            <h1>Most Points Earned All-time Leaderboard</h1>
                {alltimeLeaderboardHTML}
            </div>
        </div>
    )
}

export default Leaderboard;