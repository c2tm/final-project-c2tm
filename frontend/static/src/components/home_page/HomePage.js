import Cookies from 'js-cookie';
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { getLoginInfo } from "../../utitlties/Utility";

function HomePage({setAccountInfo, accountInfo}) {

    const navigate = useNavigate()

    useEffect(() => {
        if(!accountInfo && Cookies.get('authorization')) {
            getLoginInfo(setAccountInfo)
        }
    }, [])

    return (
        <div>
            
        </div>
    )
}
        
export default HomePage