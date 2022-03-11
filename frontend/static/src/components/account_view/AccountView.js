import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLoginInfo, handleErrors } from "../../utitlties/Utility"

function AccountView({accountInfo, setAccountInfo}) {

    const navigate = useNavigate();

    useEffect(() => {
        if(!accountInfo) {
            getLoginInfo(setAccountInfo)
        }
    }, [])

    const initialAccountInfoState = {
        profile_img: '',
        alias: '',
        user: '',
        username: '',
        bio: '',
        points: '',
        alltime_points: '',
    }

    const handleEditClick = () => {
        navigate('/edit/')
    }

   if(!accountInfo) {
       return (
           <div>
               <h1>Loading Account Info...</h1>
           </div>
       )
   }

   if(!accountInfo.active) {
       console.log(accountInfo);
       return (
           <div>
               <h1>Account is no longer active.</h1>
           </div>
       )
   }

    const accountHTML = (
        <div className="account">
            <div>
                <img src={accountInfo.profile_img} alt="profile-picture"/>
            </div>
            <h1>{accountInfo.alias}</h1>
            <h2>{accountInfo.username}</h2>
            <p>{accountInfo.bio}</p>
            <button type="button" onClick={() => handleEditClick()}>Edit Account</button>
        </div>
    )

    return (
        <div>
            
            {accountInfo && accountHTML}
        </div>
    )
}

export default AccountView