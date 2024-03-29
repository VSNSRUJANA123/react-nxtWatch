import Loader from 'react-loader-spinner'
import 'date-fns'
import {RiMenuAddFill} from 'react-icons/ri'
import {AiOutlineLike, AiOutlineDislike} from 'react-icons/ai'

import ReactPlayer from 'react-player'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Cookies from 'js-cookie'
import './index.css'
import {Component} from 'react'
import Navbar from '../Navbar'
import SideNav from '../SideNav'
import VideoContext from '../../context/VideoContext'

const getAllViews = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class VideoItemDetails extends Component {
  state = {
    activeView: 'initial',
    videoItem: [],
    likecolorstatus: false,
    dislikecolorstatus: false,
    isSaveStatus: false,
  }

  componentDidMount() {
    this.getGamingVideos()
  }

  getGamingVideos = async () => {
    this.setState({activeView: getAllViews.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/videos/${id}`
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
      const items = data.video_details
      const formatData = {
        id: items.id,
        title: items.title,
        thumbnailUrl: items.thumbnail_url,
        videoUrl: items.video_url,
        yearsago: formatDate(items.published_at),
        viewCount: items.view_count,
        description: items.description,
        publishedAt: items.published_at,
        channel: {
          name: items.channel.name,
          profileImageUrl: items.channel.profile_image_url,
          subscriberCount: items.channel.subscriber_count,
        },
      }
      this.setState({
        activeView: getAllViews.success,
        videoItem: formatData,
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

  likeColorChange = () => {
    const {dislikecolorstatus, likecolorstatus} = this.state
    if (dislikecolorstatus)
      this.setState({likecolorstatus: true, dislikecolorstatus: false})
    else this.setState({likecolorstatus: !likecolorstatus})
  }

  disklikeColorChange = () => {
    const {dislikecolorstatus, likecolorstatus} = this.state
    if (likecolorstatus)
      this.setState({dislikecolorstatus: true, likecolorstatus: false})
    else this.setState({dislikecolorstatus: !dislikecolorstatus})
  }

  renderSuccess = () => {
    const {
      videoItem,
      isSaveStatus,
      likecolorstatus,
      dislikecolorstatus,
    } = this.state
    const {
      title,
      thumbnailUrl,
      videoUrl,
      viewCount,
      yearsago,
      description,
      publishedAt,
      channel,
    } = videoItem

    return (
      <VideoContext.Consumer>
        {value => {
          const {addSavedList, themChange} = value
          const saveVideo = () => {
            this.setState({isSaveStatus: !isSaveStatus})
            addSavedList(videoItem)
          }
          return (
            <div
              className={`${
                themChange
                  ? 'videoItem-active video-item-container'
                  : 'video-item-container'
              }`}
              data-testid="videoItemDetails"
            >
              <ReactPlayer url={videoUrl} className="video-url" />
              <p>{title}</p>
              <div className="views-list-container">
                <div className="views-count">
                  <p key={publishedAt}>{publishedAt}</p>
                  <p>{viewCount}Views</p>
                  <p>{yearsago}</p>
                </div>
                <div className="like-container">
                  <button className={`${likecolorstatus && 'like'}`}>
                    <AiOutlineLike
                      className="icon-style"
                      alt="like"
                      onClick={this.likeColorChange}
                    />
                    Like
                  </button>
                  <button className={`${dislikecolorstatus && 'dislike'}`}>
                    <AiOutlineDislike
                      alt="unlike"
                      className="icon-style"
                      onClick={this.disklikeColorChange}
                    />
                    Dislike
                  </button>
                  <button className={`${isSaveStatus && 'save'}`}>
                    <RiMenuAddFill
                      alt="save"
                      className="icon-style"
                      onClick={saveVideo}
                    />
                    {isSaveStatus ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
              <hr className="hr-line" />
              <div className="thumbnail-profile-container">
                <img
                  src={thumbnailUrl}
                  className="thumbnail-profile"
                  alt="channel logo"
                  key={channel.profileImageUrl}
                />
                <div>
                  <p>{channel.name}</p>
                  <p className="channel-para">
                    {channel.subscriberCount} subscribers
                  </p>
                  <p className="channel-para">{description}</p>
                </div>
              </div>
            </div>
          )
        }}
      </VideoContext.Consumer>
    )
  }

  retry = () => {
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
      <button onClick={this.retry} className="retry">
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
      <div className="trending-container" data-testid="videoItemDetails">
        <Navbar />
        <div className="sidenav-home-container" data-testid="videoItemDetails">
          <SideNav />
          {this.renderSwitch()}
        </div>
      </div>
    )
  }
}
export default VideoItemDetails
