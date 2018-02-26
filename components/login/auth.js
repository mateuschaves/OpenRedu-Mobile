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
    // Variável que controla a função changeScrenn().
    control_redirect: 0,
  }
  // Muda para a tela InitAuth. 
  _changeScreen(params){
    this.props.navigation.navigate('InitAuth', {
        // Parâmetros para continuar a autenticação e obter o token de acesso.
        params: params
    });
  }
  // Executada toda vez em que a webview muda de estado.
   _onNavigationStateChange(webViewState) {
    // URL da webview
    let url = webViewState.url;
    // Encontrando a posição da palavra 'code' na url.
    let index_code = url.match("code");
    let code = '';
    // Verificando a posição da palavra 'oauth' na url.
    let check_url = url.match("oauth");
    /*
     * ----------TENTATIVA DE EXPLICAÇÃO DA GAMBIARRA----------
     * Quando a palavra 'oauth' não estiver mais contida na url,
     * o usuário foi redirecionado para a url desejada com o
     * 'code', que será utilizado para obter o token de acesso.
     */
    if(!check_url){
       // Cortando exatamente o parâmetro 'code' da url.
       code = url.substring(37,57);
       // Juntando todos os parâmetros.
       params = {
           app: app,
           code: code
       }
       // Verificando se a função já foi executada antes.
       if(this.state.control_redirect == 0){
         this.setState({control_redirect: 1});
         // Mudando de tela.
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
