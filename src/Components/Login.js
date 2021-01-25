import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "../firebase";
import "./Login.css";
import { useStateValue } from "./../StateProvider";
import { actionType } from "../reducer";

function Login() {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionType.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error));
  };
  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://image.winudf.com/v2/image1/Y29tLmNpcC5teWNoYXQubXlhbm1hcl9pY29uXzE1NTc3MTIwNDZfMDE2/icon.png?w=170&fakeurl=1"
          alt="login MychatApp"
        />
        <div className="login_text">
          <h2>Sign In to MyChat</h2>
        </div>
        <Button onClick={signIn}>Sign In with Google</Button>
      </div>
    </div>
  );
}

export default Login;
