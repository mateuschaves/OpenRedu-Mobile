/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  WebView,
  AsyncStorage,
} from 'react-native';

import axios from 'axios';
import { StackNavigator } from 'react-navigation';

type Props = {};
const app = {
  // Configurações do aplicativo.
  client_id:      'qHnf1X6EXNnx5Z9DeyAvPRO72ndV8xPsSvbv4uLe',
  grant_type:     'authorization_code',
  client_secret:  'wFlRombfhPcYm96cDHrgOd80udgEAM3Dq8CgrOk1',
  redirect_uri:   'https://github.com/mateuschaves'
}
export default class Auth extends Component<Props> {
  state = {
    control_redirect: 0,
  }
  _changeScreen(params){
    this.props.navigation.navigate('InitAuth', {
        params: params
    });
  }
   _onNavigationStateChange(webViewState) {
    let url = webViewState.url;
    let index_code = url.match("code");
    let code = '';
    let check_url = url.match("oauth");
    if(!check_url){
       code = url.substring(37,57);
       params = {
           app: app,
           code: code
       }
       if(this.state.control_redirect == 0){
         this.setState({control_redirect: 1});
          this._changeScreen(params);
       }
    }
  }
  render() {
    return (
      <WebView
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        javaScriptEnabled = {true}
        domStorageEnabled = {true}
        source={{uri: 'https://openredu.ufpe.br/oauth/authorize?response_type=code&client_id=qHnf1X6EXNnx5Z9DeyAvPRO72ndV8xPsSvbv4uLe&redirect_uri=https://github.com/mateuschaves&client_secret=wFlRombfhPcYm96cDHrgOd80udgEAM3Dq8CgrOk1'}}
        style={{marginTop: 20}}
      />
    );
  }
}
