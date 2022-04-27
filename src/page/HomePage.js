import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  BackHandler,
  Alert,
  ActivityIndicator,
  TextInput,
  Linking,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import PushNotification from 'react-native-push-notification';

const App = props => {
  const {navigation} = props;
  React.useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);

    // async function requestUserPermission() {
    //   const authStatus = await messaging().requestPermission();
    //   const enabled =
    //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //   console.log('Authorization status:', authStatus);

    //   if (enabled) {
    //     console.log('Authorization status:', authStatus);
    //     await get_token();
    //   }
    // }

    //기기토큰 가져오기
    // async function get_token() {
    //   await messaging()
    //     .getToken()
    //     .then(token => {
    //       console.log('token', token);

    //       if (token) {
    //         set_tt(token);

    //         return true;
    //       } else {
    //         return false;
    //       }
    //     });
    // }
    set_tt('123123123');
    // requestUserPermission();

    set_is_loading(true);

    // return messaging().onTokenRefresh(token => {
    //   set_tt(token);
    // });
  }, []);
  let {height, width} = Dimensions.get('window');
  //웹작업 토큰이 회원테이블에 있으면 자동로그인 없으면 로그인 페이지로 작업
  const app_domain = 'https://dmonster1756.cafe24.com/';
  const url = app_domain + 'auth.php?chk_app=Y&app_token=';
  const [urls, set_urls] = React.useState('ss');
  const [tt, set_tt] = React.useState();
  const webViews = React.useRef();
  const toast_msg = React.useRef();
  const [is_loading, set_is_loading] = React.useState(false);
  const onWebViewMessage = async webViews => {
    console.log(webViews.nativeEvent.data);
    let jsonData = JSON.parse(webViews.nativeEvent.data);
    if (jsonData?.type === 'Payment') {
      navigation.navigate('PaymentPage', {
        ...jsonData.data,
        usercode: jsonData.usercode,
      });
    }
  };
  const onNavigationStateChange = webViewState => {
    //console.log('webViewState.url ' + webViewState.url);

    if (!webViewState.url.includes('dmonster1756.cafe24.com')) {
      //console.log('11')
      Linking.openURL(webViewState.url).catch(err => {
        console.log('onNavigationStateChange Linking.openURL');
      });
      webViews.current.stopLoading();
    }

    set_urls(webViewState.url);
    //안드로이드 뒤로가기 버튼 처리

    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
  };

  const handleBackButton = () => {
    //제일 첫페이지에서 뒤로가기시 어플 종료
    if (navigation.isFocused() === true) {
      //다른 화면갔을경우 뒤로가기 막기 위한 요소
      if (urls == app_domain) {
        Alert.alert('어플을 종료할까요?', '', [
          {text: '네', onPress: () => BackHandler.exitApp()},
          {text: '아니요'},
        ]);
      } else {
        webViews.current.goBack();
      }
      return true;
    } else {
      return false;
    }
  };

  const onShouldStartLoadWithRequest = event => {
    const {url, lockIdentifier} = event;
    var URI = require('urijs');
    var uri = new URI(url);

    console.log('event.url', uri);

    if (
      event.lockIdentifier ===
      0 /* && react-native-webview 버전이 v10.8.3 이상 */
    ) {
      /**
       * [feature/react-native-webview] 웹뷰 첫 렌더링시 lockIdentifier === 0
       * 이때 무조건 onShouldStartLoadWithRequest를 true 처리하기 때문에
       * Error Loading Page 에러가 발생하므로
       * 강제로 lockIdentifier를 1로 변환시키도록 아래 네이티브 코드 호출
       */
      RNCWebView.onShouldStartLoadWithRequestCallback(
        false,
        event.lockIdentifier,
      );
    }

    if (
      event.url.startsWith('http://') ||
      event.url.startsWith('https://') ||
      event.url.startsWith('about:blank')
    ) {
      if (uri.hostname() != '') {
        var chk_uri = 'Y';

        if (uri.hostname() != 'dmonster1756.cafe24.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'postcode.map.daum.net') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'kauth.kakao.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'appleid.apple.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'nid.naver.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'm.facebook.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'mobile.inicis.com') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'service.iamport.kr') {
          chk_uri = 'N';
        }
        if (uri.hostname() != 'ksmobile.inicis.com') {
          chk_uri = 'N';
        }
        chk_uri = 'N';
        if (chk_uri == 'Y') {
          Linking.openURL(event.url).catch(err => {
            console.log('onShouldStartLoadWithRequest Linking.openURL');
          });
          return false;
        }
      }

      return true;
    }
    if (
      event.url.startsWith('tel:') ||
      event.url.startsWith('mailto:') ||
      event.url.startsWith('maps:') ||
      event.url.startsWith('geo:') ||
      event.url.startsWith('sms:')
    ) {
      Linking.openURL(event.url).catch(er => {
        Alert.alert('Failed to open Link: ' + er.message);
      });
      return false;
    }
  };

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      {is_loading ? (
        <View style={{flex: 1, height: height}}>
          <WebView
            ref={webViews}
            source={{
              uri: url + tt,
            }}
            useWebKit={false}
            sharedCookiesEnabled
            onMessage={webViews => onWebViewMessage(webViews)}
            onNavigationStateChange={webViews =>
              onNavigationStateChange(webViews)
            }
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            javaScriptEnabledAndroid={true}
            allowFileAccess={true}
            renderLoading={true}
            mediaPlaybackRequiresUserAction={false}
            setJavaScriptEnabled={false}
            scalesPageToFit={true}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            originWhitelist={['*']}
            javaScriptEnabled={true}
          />
        </View>
      ) : (
        <View style={{marginTop: '49%'}}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
