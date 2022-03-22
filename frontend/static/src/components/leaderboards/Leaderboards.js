import { useEffect, useState } from 'react';
import { handleErrors } from '../../utitlties/Utility';
import './Leaderboards.css'
import User from './User';
import AllTimeUser from './AllTimeUser'

function Leaderboard() {

    const [userListByPoints, setUserListByPoints] = useState(null)
    const [userListByAllTimePoints, setUserListByAllTimePoints] = useState(null)

    useEffect(() => {
        if(!userListByPoints) {
            const getUsersByPoints = async () => {
                const response = await fetch('/api/v1/accounts/accounts-by-points/').catch(handleErrors);

                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json()
                    setUserListByPoints(data);
                }
            }
            getUsersByPoints()
        }

        if(!userListByAllTimePoints) {
            const getUsersByAllTimePoints = async () => {
                const response = await fetch('/api/v1/accounts/accounts-by-alltime-points/').catch(handleErrors);

                if(!response.ok) {
                    throw new Error('Response was not ok!')
                } else {
                    const data = await response.json()
                    setUserListByAllTimePoints(data);
                }
            }
            getUsersByAllTimePoints()
        }
    }, [])

    if(!userListByPoints || !userListByAllTimePoints) {
        return (
            <div className="leaderboards-view-container">
                <h1>Loading...</h1>
            </div>
        )
    }

    const leaderboardHTML = userListByPoints.sort((a, b) => {return b.points - a.points}).map(user => (
        <User user={user} key={user.id}/>
    ))

    const alltimeLeaderboardHTML = userListByAllTimePoints.sort((a, b) => {return b.alltime_points - a.alltime_points}).map(user => (
        <AllTimeUser user={user} key={user.id}/>
    ))

    return (
        <div className="leaderboards-view-container">
            <div className='leaderboards-container'>
                <div className='points-leaderboard'>
                    <h1>Current Points Leaderboard</h1>
                    <div>
                        {leaderboardHTML} 
                    </div>
                </div>
                <div className='divider-container'><div className='divider'></div></div>
                <div className='alltime-points-leaderboard'>
                    <h1>All-Time Earnings Leaderboard</h1>
                    <div>
                        {alltimeLeaderboardHTML}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;