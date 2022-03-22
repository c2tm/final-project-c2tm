import Cookies from "js-cookie";

export const handleErrors = (err) => {
    console.warn(err);
}

export const handleLogout = (navigate, setUserPostsList) => {
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
          setUserPostsList(null)
          navigate('/login/');
        }
    }
    logout();
}

export const getUser = async (setLoggedInUserInfo, setAccountInfo, navigate, setLoggedIn, setUserAccountInfo, setUserPostsList, loggedInUserInfo) => {
    const response = await fetch('/rest-auth/user/');

    if(!response.ok) {
       
    handleLogout(setAccountInfo, navigate, setLoggedIn, setUserAccountInfo, setUserPostsList)   
        
    //   throw new Error('Response was not ok!');
    } else {
      const data = await response.json();
      setLoggedInUserInfo(data);
    }
}