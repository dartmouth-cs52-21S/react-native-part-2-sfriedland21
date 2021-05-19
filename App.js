import React from 'react';
import { LogBox } from 'react-native';
import MainTabBar from './navigation/main_tab_bar';

// disable really annoying in app warnings
LogBox.ignoreAllLogs();// Ignore all log notifications

const App = (props) => {
  return <MainTabBar />;
};

export default App;
