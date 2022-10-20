import { useAuth0 } from '@auth0/auth0-react';

const Auth = () => {
  const { loginWithPopup, logout, isAuthenticated } = useAuth0();
  return (
    <>
      {isAuthenticated ? (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      ) : (
        <>
          To get access to admin panel <button onClick={() => loginWithPopup()}>Log In</button>{' '}          
        </>
      )}
    </>
  );
};

export default Auth;
