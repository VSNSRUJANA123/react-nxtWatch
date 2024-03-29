import {HiFire} from 'react-icons/hi'
import 'date-fns'
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

class Trending extends Component {
  state = {
    activeView: 'initial',
    trendingVideos: [],
  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getTrendingVideos = async () => {
    this.setState({activeView: getAllViews.loading})
    const url = 'https://apis.ccbp.in/videos/trending'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    function formatDate(dateString) {
      const date = new Date(dateString)
      const currentDate = new Date()
      const yearsDiff = currentDate.getFullYear() - date.getFullYear()
      return `${yearsDiff} years ago`
    }
    if (response.ok) {
      const data = await response.json()
      const formatData = data.videos.map(items => ({
        id: items.id,
        title: items.title,
        publishedAt: formatDate(items.published_at),
        thumbnailUrl: items.thumbnail_url,
        viewCount: items.view_count,
        channel: {
          name: items.channel.name,
          profileImageUrl: items.channel.profile_image_url,
        },
      }))
      this.setState({
        activeView: getAllViews.success,
        trendingVideos: formatData,
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
    const {trendingVideos} = this.state
    return (
      <ul className="trending-videos-container" data-testid="trending">
        {trendingVideos.map(items => (
          <li key={items.id}>
            <Link to={`/videos/${items.id}`} className="link-style">
              <div className="trending-videos-list">
                <img src={items.thumbnailUrl} alt="" className="trending-img" />
                <div className="trending-para">
                  <p>{items.title}</p>
                  <p>{items.channel.name}</p>
                  <div>
                    <p>{items.viewCount}views</p>
                    <p>.{items.publishedAt}</p>
                  </div>
                </div>
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
      <div className="trending-container" data-testid="trending">
        <Navbar />
        <div className="sidenav-home-container">
          <SideNav />
          <div className="trending-container" data-testid="trending">
            <div className="trending-logo">
              <HiFire className="navbar-icon-style" />
              <h1>Trending</h1>
            </div>
            {this.renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

export default Trending
