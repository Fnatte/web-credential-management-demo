import React from "react";
import { browserHistory } from "react-router";
import Button from "react-toolbox/lib/button";
import Input from "react-toolbox/lib/input";
import ProgressBar from "react-toolbox/lib/progress_bar";
import Avatar from "react-toolbox/lib/avatar";
import style from "./style.css";
import cx from "classnames";

const avatarUrl = "http://lh3.googleusercontent.com/-heMaQyIL2c8/AAAAAAAAAAI/AAAAAAAABAw/uCberC0diwA/photo.jpg?sz=200";

function checkStatus(res) {
  if(res.status >= 200 && res.status < 300) {
    return res;
  } else {
    const error = new Error(res.statusText);
    error.response = res;
    throw error;
  }
}

export default class LoginPage extends React.Component {
  constructor() {
    super();
    
    this.state = {
      loggedInAs: null,
      loading: false,
      username: "",
      password: ""
    };
  }
  
  componentDidMount() {
    navigator.credentials.requireUserMediation().then(() => {
      navigator.credentials.get({ password: true }).then(credentials => {
        if(credentials) {
          this.login(credentials);
        }
      });
    });
  }
  
  login(credential) {
    this.setState({
      ...this.state,
      loading: true
    });
    
    return fetch("login", { method: "POST", body: credential })
    .then(checkStatus)
    .then(res => res.json())
    .then(res => {
      this.setState({
        ...this.state,
        loggedInAs: credential.id,
        loading: false
      });
    })
    .catch(() => {
      this.setState({...this.state, loading: false});
    });
  }
  
  onSubmit = (e) => {
    e.preventDefault();
    const c = new PasswordCredential(e.target);
    
    this.login(c).then(r => {
      navigator.credentials.store(c);
    });
  }
  
  onUsernameChange = (value) => {
    this.setState({
      ...this.state,
      username: value
    });
  }
  
  onPasswordChange = (value) => {
    this.setState({
      ...this.state,
      password: value
    });
  }
  
  renderLoginForm() {
    const { loading, username, password } = this.state;
    
    return (
      <form action="login" onSubmit={this.onSubmit}>
        <h1>Login</h1>
        <ProgressBar type="circular" />
        <Input type="text" name="username" label="Username" value={username} onChange={this.onUsernameChange} autoComplete="username" disabled={loading} />
        <Input type="password" name="password" label="Password" value={password} onChange={this.onPasswordChange} autoComplete="current-password" disabled={loading} />
        <Button type="submit" label="login" raised primary disabled={loading} />
      </form>
    );
  }
  
  renderLoggedIn() {
    return (
      <div>
        <Avatar image={avatarUrl} />
        <p>Logged in as {this.state.loggedInAs}.</p>
      </div>
    );
  }
  
  render() {
    const { loggedInAs, loading } = this.state;
    const classes = cx({
      [style.root]: true,
      [style.loading]: loading
    });
    return (
      <section className={classes}>
        { loggedInAs ? 
          this.renderLoggedIn() :
          this.renderLoginForm() }
      </section>
    );
  }
}
