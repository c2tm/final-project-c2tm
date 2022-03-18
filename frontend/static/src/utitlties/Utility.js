import Cookies from "js-cookie";

export const handleErrors = (err) => {
    console.warn(err);
}

export const handleLogout = (setAccountInfo, navigate, setLoggedIn, setUserInfo, setUserPostsList) => {
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
          setAccountInfo(null);
          setUserInfo(null);
          setUserPostsList(null);
          setLoggedIn(false);
          navigate('/login/');
        }
    }
    logout();
}

export const getLoginInfo = async (setAccountInfo) => {
      const response = await fetch('/api/v1/accounts/user/')

      if(!response.ok) {
        throw new Error('Response was not ok!')
      } else {
        const data = await response.json()
        setAccountInfo(data)
      }
}