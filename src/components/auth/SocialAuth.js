import "./SocialAuth.css";
import AuthContext from "../../context/AuthProvider";
import { useContext } from "react";

export const SocialAuth = () => {
  const user = useContext(AuthContext);

  const GoogleSignIn = (e) => {
    e.preventDefault();
    user.signInWithGoogle();
  };

  const TwitterSignIn = (e) => {
    e.preventDefault();
    user.signInWithTwitter();
  };

  const FacebookSignIn = (e) => {
    e.preventDefault();
    user.signInWithFacebook();
  };

  return (
    <div className="provider-group d-flex justify-content-between gap-2">
      <button className="provider-button" onClick={GoogleSignIn}>
        <img
          className="provider"
          src="/assets/images/google.png"
          alt="Log in with Google"
        ></img>
      </button>
      <button className="provider-button" onClick={TwitterSignIn}>
        <img
          className="provider"
          src="/assets/images/twitter.png"
          alt="Log in with Twitter"
        ></img>
      </button>
      <button className="provider-button" onClick={FacebookSignIn}>
        <img
          className="provider"
          src="/assets/images/facebook.png"
          alt="Log in with Facebook"
        ></img>
      </button>
    </div>
  );
};
