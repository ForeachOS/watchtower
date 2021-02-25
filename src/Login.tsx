import * as React from 'react';

const Login = () => (
  <div>
    <div className="page__wrapper">
      <div className="login__wrapper">
        <h2>please sign in</h2>

        <p>Username</p>
        <input className="input" type="text" />
        <p>Password</p>
        <input className="input" type="text" />
        <button className="button">Log in</button>
      </div>
    </div>
  </div>
);

export default Login;
