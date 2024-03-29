import {FaMoon, FaSun} from 'react-icons/fa'
import './index.css'
import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'
import VideoContext from '../../context/VideoContext'

const Navbar = props => {
  const logout = () => {
    const jwtToken = Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <VideoContext.Consumer>
      {value => {
        const {themChange, onChangeTheme} = value
        const darkTheme = () => {
          onChangeTheme(true)
        }
        const lightTheme = () => {
          onChangeTheme(false)
        }
        return (
          <div
            className={`${
              themChange
                ? `horiz-active horiz-navbar-container`
                : `horiz-navbar-container`
            }`}
          >
            <Link to="/">
              <img
                className="logo"
                src={
                  themChange
                    ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
                    : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
                }
                alt="website logo"
              />
            </Link>
            <div className="horiz-navbar">
              <button data-testid="theme" className="icon-style">
                {themChange ? (
                  <FaSun alt="theme" className="sun-icon" onClick={darkTheme} />
                ) : (
                  <FaMoon alt="theme" onClick={lightTheme} />
                )}
              </button>
              <img
                className="profile"
                src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
                alt="profile"
              />

              <Popup
                modal
                trigger={
                  <button className="logout" onClick={logout}>
                    Logout
                  </button>
                }
              >
                {close => (
                  <div
                    className={`${
                      themChange ? `pop-active popup-logout` : `popup-logout`
                    }`}
                  >
                    <div className="popup-logout">
                      <p>Are you sure, you want to logout</p>
                    </div>
                    <button
                      type="button"
                      className="close-button"
                      onClick={() => close()}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="retry"
                      onClick={() => logout()}
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </Popup>
            </div>
          </div>
        )
      }}
    </VideoContext.Consumer>
  )
}

export default withRouter(Navbar)
