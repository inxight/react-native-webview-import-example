import React from 'react';
import {Text, TextInput} from 'react-native';
import {BackHandler, ToastAndroid} from 'react-native';
import Router from './src/router/Router';
import SplashScreen from 'react-native-splash-screen';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;
class App extends React.Component {
  render() {
    return <Router />;
  }
}

export default App;
