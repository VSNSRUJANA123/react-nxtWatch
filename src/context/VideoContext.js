import React from 'react'

const VideoContext = React.createContext({
  activeTab: 'home',
  onClickTab: () => {},
  savedList: [],
  addSavedList: () => {},
  themChange: true,
  onChangeTheme: () => {},
})
export default VideoContext
