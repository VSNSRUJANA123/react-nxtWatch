import './index.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    errorStatus: false,
    errorMsg: '',
  }

  successfully = () => {
    this.setState({errorStatus: false, errorMsg: ''})
    const {history} = this.props
    history.replace('/')
  }

  failure = error => {
    this.setState({errorStatus: true, errorMsg: error})
  }

  submit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      this.successfully()
    } else {
      this.failure(data.error_msg)
    }
  }

  userChange = e => {
    this.setState({username: e.target.value})
  }

  passwordChange = e => {
    this.setState({password: e.target.value})
  }

  checked = () => {
    this.setState(prev => ({showPassword: !prev.showPassword}))
  }

  render() {
    const {showPassword, username, password, errorMsg, errorStatus} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submit}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
          />
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            placeholder="Username"
            value={username}
            onChange={this.userChange}
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            id="password"
            value={password}
            onChange={this.passwordChange}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
          />
          <div className="showPsd-container">
            <input
              id="show-psw"
              type="checkbox"
              checked={showPassword}
              onChange={this.checked}
            />
            <label htmlFor="show-psw">Show Password</label>
          </div>
          <button>Login</button>
          {errorStatus && <p>{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
