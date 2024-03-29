import './index.css'
import {NavLink} from 'react-router-dom'
import {IoMdHome} from 'react-icons/io'
import {HiFire} from 'react-icons/hi'
import {SiYoutubegaming} from 'react-icons/si'
import {RiMenuAddFill} from 'react-icons/ri'
import VideoContext from '../../context/VideoContext'

const SideNav = () => (
  <VideoContext.Consumer>
    {value => {
      const {themChange, activeTab} = value
      return (
        <div
          className={`${
            themChange
              ? `sidenav-active sidenav-container`
              : `sidenav-container`
          }`}
        >
          <nav>
            <ul className="side-nav-list">
              <NavLink className="nav-link" to="/">
                <li
                  data-testid="home"
                  className={`${themChange && 'tab-active'}`}
                >
                  <IoMdHome className="icon-color" /> Home
                </li>
              </NavLink>
              <NavLink className="nav-link" to="/trending">
                <li
                  data-testid="trending"
                  className={`${themChange && 'tab-active'}`}
                >
                  <HiFire className="icon-color" />
                  Trending
                </li>
              </NavLink>
              <NavLink className="nav-link" to="/gaming">
                <li
                  data-testid="gaming"
                  className={`${themChange && 'tab-active'}`}
                >
                  <SiYoutubegaming /> Gaming
                </li>
              </NavLink>
              <NavLink className="nav-link" to="/saved-videos">
                <li
                  data-testid="savedVideos"
                  className={`${themChange && 'tab-active'}`}
                >
                  <RiMenuAddFill /> Saved Videos
                </li>
              </NavLink>
            </ul>
          </nav>
          <div className="contactus">
            <p>contact us</p>
            <img
              className="social-icon"
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
              alt="facebook logo"
            />
            <img
              className="social-icon"
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
              alt="twitter logo"
            />
            <img
              className="social-icon"
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
              alt="linked in logo"
            />
            <p>Enjoy! Now to see your channels and recommendations!</p>
          </div>
        </div>
      )
    }}
  </VideoContext.Consumer>
)
export default SideNav
