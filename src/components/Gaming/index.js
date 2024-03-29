import {SiYoutubegaming} from 'react-icons/si'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Cookies from 'js-cookie'
import './index.css'
import {Component} from 'react'
import Navbar from '../Navbar'
import SideNav from '../SideNav'

const getAllViews = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Gaming extends Component {
  state = {
    activeView: 'initial',
    gamingVideos: [],
  }

  componentDidMount() {
    this.getGamingVideos()
  }

  getGamingVideos = async () => {
    this.setState({activeView: getAllViews.loading})
    const url = 'https://apis.ccbp.in/videos/gaming'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const formatData = data.videos.map(items => ({
        id: items.id,
        title: items.title,
        thumbnailUrl: items.thumbnail_url,
        viewCount: items.view_count,
      }))
      this.setState({
        activeView: getAllViews.success,
        gamingVideos: formatData,
      })
    } else {
      this.setState({activeView: getAllViews.failure})
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  renderSuccess = () => {
    const {gamingVideos} = this.state
    return (
      <ul className="gaming-videos-container" data-testid="gaming">
        {gamingVideos.map(items => (
          <li src={items.thumbnailUrl} key={items.id}>
            <Link to={`/videos/${items.id}`} className="link-style">
              <div className="gaming-videos-list">
                <img src={items.thumbnailUrl} alt="" className="gaming-img" />
                <p>{items.title}</p>
                <p>{items.viewCount} World Wide Views</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  Retry = () => {
    this.setState({activeView: getAllViews.success})
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble</p>
      <button onClick={this.Retry} className="retry">
        Retry
      </button>
    </div>
  )

  renderSwitch = () => {
    const {activeView} = this.state
    switch (activeView) {
      case getAllViews.success:
        return this.renderSuccess()
      case getAllViews.failure:
        return this.renderFailure()
      case getAllViews.loading:
        return this.renderLoading()
      default:
        return ''
    }
  }

  render() {
    return (
      <div className="trending-container" data-testid="gaming">
        <Navbar />
        <div className="sidenav-home-container" data-testid="gaming">
          <SideNav />
          <div className="trending-container" data-testid="gaming">
            <div className="trending-logo">
              <SiYoutubegaming className="navbar-icon-style" />
              <h1>Gaming</h1>
            </div>
            {this.renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

export default Gaming
