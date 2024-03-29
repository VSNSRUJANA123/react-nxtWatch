import {Component} from 'react'
import {FaSearch} from 'react-icons/fa'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {formatDistanceToNow} from 'date-fns'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {IoIosClose} from 'react-icons/io'
import Cookies from 'js-cookie'
import Navbar from '../Navbar'
import SideNav from '../SideNav'
import VideoContext from '../../context/VideoContext'
import './index.css'

const getAllViews = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class Home extends Component {
  state = {
    activeView: 'initial',
    videos: [],
    bannerStatus: true,
    searchValue: '',
  }

  componentDidMount() {
    this.getAllVideos()
  }

  getAllVideos = async () => {
    this.setState({activeView: getAllViews.loading})
    const url = 'https://apis.ccbp.in/videos/all'
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
        publishedAt: items.published_at,
        thumbnailUrl: items.thumbnail_url,
        viewCount: items.view_count,
        years: formatDate(items.published_at),
        channel: {
          name: items.channel.name,
          profileImageUrl: items.channel.profile_image_url,
        },
      }))
      this.setState({activeView: getAllViews.success, getAllVideos: formatData})
    } else {
      this.setState({activeView: getAllViews.failure})
    }
  }

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#4f46e5" height="50" width="50" />
    </div>
  )

  //   VideosDisplay = (filterVideos, themChange) => {
  //     return (
  //       <>
  //         {filterVideos.length === 0 ? (
  //           <div
  //             className={`${
  //               themChange
  //                 ? `no-videos-active-active no-videos-container`
  //                 : `no-videos-container`
  //             }`}
  //           >
  //             <img
  //               className="no-videos"
  //               src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
  //               alt="no videos"
  //             />
  //             <h1>No Search Result</h1>
  //             <p>Try different</p>
  //             <button onClick={searchRetry} className="retry">
  //               Retry
  //             </button>
  //           </div>
  //         ) : (
  //           <ul className="video-ul-container">
  //             {filterVideos.map(items => (
  //               <Link
  //                 to={`/videos/${items.id}`}
  //                 className="link-style"
  //                 key={items.id}
  //               >
  //                 <li
  //                   key={items.id}
  //                   className={`${
  //                     themChange
  //                       ? `li-videos-thumbnails-active li-videos-thumbnails`
  //                       : `li-videos-thumbnails`
  //                   }`}
  //                 >
  //                   <img
  //                     className="thumbnail"
  //                     src={items.thumbnailUrl}
  //                     alt="video thumbnail"
  //                   />
  //                   <div className="thumbnail-profile-container">
  //                     <img
  //                       src={items.channel.profileImageUrl}
  //                       className="thumbnail-profile"
  //                       alt="channel logo"
  //                       key={items.profileImageUrl}
  //                     />
  //                     <div>
  //                       <p>{items.title}</p>
  //                       <p className="channel-para">{items.channel.name}</p>
  //                       <p className="channel-para">{items.publishedAt}</p>
  //                       <div className="channel-div">
  //                         <p className="channel-para">{items.viewCount}Views</p>
  //                         <p className="channel-para">{items.years}</p>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </li>
  //               </Link>
  //             ))}
  //           </ul>
  //         )}
  //         })}
  //       </>
  //     )
  //   }

  Retry = () => {
    this.setState({searchValue: ''})
  }

  searchResult = () => {
    const {searchValue, getAllVideos} = this.state
    const searchItems = getAllVideos.filter(items =>
      items.title.toLowerCase().includes(searchValue),
    )
    return searchItems
  }

  search = e => {
    console.log(e.target.value)
    this.setState({searchValue: e.target.value})
  }

  searchSubmit = e => {
    e.preventDefault()
  }

  searchClick = () => {
    const {searchValue} = this.state
  }

  renderSuccess = () => {
    const {searchValue} = this.state
    const filterVideos = this.searchResult()
    return (
      <VideoContext.Consumer>
        {value => {
          const {themChange} = value
          return (
            <div
              className={`${
                themChange
                  ? `videos-active videos-container`
                  : `videos-container`
              }`}
            >
              <form
                className="search-container"
                onSubmit={this.searchSubmit}
                data-testid="searchButton"
              >
                <input
                  type="search"
                  placeholder="search"
                  onChange={this.search}
                  value={searchValue}
                />
                <button data-testid="searchButton" onClick={this.searchClick}>
                  <FaSearch alt="search" />
                </button>
              </form>
              {filterVideos.length === 0 ? (
                <div
                  className={`${
                    themChange
                      ? `no-videos-active-active no-videos-container`
                      : `no-videos-container`
                  }`}
                >
                  <img
                    className="no-videos"
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
                    alt="no videos"
                  />
                  <h1>No Search results found</h1>
                  <p>Try different key words or remove search filter</p>
                  <button onClick={this.Retry} className="retry">
                    Retry
                  </button>
                </div>
              ) : (
                <ul className="video-ul-container" data-testid="home">
                  {filterVideos.map(items => (
                    <Link
                      to={`/videos/${items.id}`}
                      className="link-style"
                      key={items.id}
                    >
                      <li
                        key={items.id}
                        className={`${
                          themChange
                            ? `li-videos-thumbnails-active li-videos-thumbnails`
                            : `li-videos-thumbnails`
                        }`}
                      >
                        <img
                          className="thumbnail"
                          src={items.thumbnailUrl}
                          alt="video thumbnail"
                        />
                        <div className="thumbnail-profile-container">
                          <img
                            src={items.channel.profileImageUrl}
                            className="thumbnail-profile"
                            alt="channel logo"
                            key={items.profileImageUrl}
                          />
                          <div>
                            <p>{items.title}</p>
                            <p className="channel-para">{items.channel.name}</p>
                            <p className="channel-para">{items.publishedAt}</p>
                            <div className="channel-div">
                              <p className="channel-para">
                                {items.viewCount}Views
                              </p>
                              <p className="channel-para">{items.years}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
              })}
            </div>
          )
        }}
      </VideoContext.Consumer>
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
      case getAllViews.loading:
        return this.renderLoading()
      case getAllViews.failure:
        return this.renderFailure()
      default:
        return ''
    }
  }

  closeIcon = () => {
    this.setState({bannerStatus: false})
  }

  render() {
    const {bannerStatus} = this.state
    return (
      <div className="home-container" data-testid="home">
        <Navbar />
        <div className="sidenav-home-container">
          <SideNav />
          <div className="home-container">
            {bannerStatus && (
              <div className="bannerImg" data-testid="banner">
                <div>
                  <img
                    data-testid="banner"
                    className="logo"
                    alt="nxt watch logo"
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                  />
                  <p>Buy Nxt Watch Premium Prepaid with UPI</p>
                  <button className="get-now">GET IT NOW</button>
                </div>
                <div>
                  <button
                    data-testid="close"
                    className="icon-btn"
                    onClick={this.closeIcon}
                  >
                    <IoIosClose alt="close" />
                  </button>
                </div>
              </div>
            )}
            {this.renderSwitch()}
          </div>
        </div>
      </div>
    )
  }
}
export default Home
