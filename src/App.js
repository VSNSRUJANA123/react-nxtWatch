import './App.css'
import {Route, Switch} from 'react-router-dom'
import {Component} from 'react'
import Login from './components/Login'
import Home from './components/Home'
import Trending from './components/Trending'
import Gaming from './components/Gaming'
import SavedVideos from './components/SavedVideos'
import VideoItemDetails from './components/VideoItemDetails'
import NotFound from './components/NotFound'
import VideoContext from './context/VideoContext'
import ProtectedRoute from './components/ProtectedRoute'

class App extends Component {
  state = {themChange: false, savedList: []}

  onChangeTheme = () => {
    const {themChange} = this.state
    this.setState({themChange: !themChange})
  }

  addSavedList = videoitem => {
    const {savedList} = this.state
    const findSaveVideo = savedList.findIndex(
      items => items.id === videoitem.id,
    )
    if (findSaveVideo < 0) {
      this.setState({savedList: [...savedList, videoitem]})
    } else {
      const filterSavedVideo = savedList.filter(
        items => items.id !== videoitem.id,
      )
      this.setState({savedList: filterSavedVideo})
    }
  }

  render() {
    const {themChange, savedList} = this.state
    return (
      <VideoContext.Provider
        value={{
          themChange,
          savedList,
          onChangeTheme: this.onChangeTheme,
          addSavedList: this.addSavedList,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <ProtectedRoute
            exact
            path="/videos/:id/"
            component={VideoItemDetails}
          />
          <ProtectedRoute component={NotFound} />
        </Switch>
      </VideoContext.Provider>
    )
  }
}

export default App
