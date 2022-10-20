import { useAuth0 } from '@auth0/auth0-react';

const Auth = () => {
  const { loginWithPopup, logout, isAuthenticated } = useAuth0();
  return (
    <>
      {isAuthenticated ? (
        <button
          className="button is-link"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log Out
        </button>
      ) : (
        <>
          To get access to admin panel{' '}
          <button
            className="button is-link"
            onClick={() => loginWithPopup()}
          >
            Log In
          </button>{' '}
        </>
      )}
    </>
  );
};

export default Auth;
