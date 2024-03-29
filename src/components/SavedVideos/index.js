import {Link} from 'react-router-dom'
import {RiMenuAddFill} from 'react-icons/ri'
import VideoContext from '../../context/VideoContext'

import './index.css'

import Navbar from '../Navbar'
import SideNav from '../SideNav'

const SavedVideos = () => (
  <VideoContext.Consumer>
    {value => {
      const {savedList} = value
      return (
        <div className="trending-container">
          <Navbar />
          <div className="sidenav-home-container">
            <SideNav />
            <div className="trending-container" data-testid="savedVideos">
              <div className="trending-logo">
                <RiMenuAddFill className="navbar-icon-style" />
                <h1>Saved Videos</h1>
              </div>
              {savedList.length > 0 ? (
                <ul
                  data-testid="savedVideos"
                  className="trending-videos-container"
                >
                  {savedList.map(items => (
                    <li key={items.id}>
                      <Link to={`/videos/${items.id}`} className="link-style">
                        <div className="trending-videos-list">
                          <img
                            src={items.thumbnailUrl}
                            alt={items.thumbnailUrl}
                            className="trending-img"
                          />
                          <div className="trending-para">
                            <p key={items.title}>{items.title}</p>
                            <p key={items.channel.name}>{items.channel.name}</p>
                            <div>
                              <p key={items.viewCount}>
                                {items.viewCount}views
                              </p>
                              <p key={items.publishedAt}>
                                .{items.publishedAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-saved-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                    alt=" no saved videos"
                  />
                  <h1>No Saved Videos Found</h1>
                  <p>You can save your videos while watching them</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }}
  </VideoContext.Consumer>
)
export default SavedVideos
