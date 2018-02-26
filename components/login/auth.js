
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
// Lista de URL'S permitidas.
const urls_permitidas = [
  'https://openredu.ufpe.br/oauth/authorize?response_type=code&client_id=qHnf1X6EXNnx5Z9DeyAvPRO72ndV8xPsSvbv4uLe&redirect_uri=https://github.com/mateuschaves&client_secret=wFlRombfhPcYm96cDHrgOd80udgEAM3Dq8CgrOk1',
  'https://openredu.ufpe.br/oauth/authorize?response_type=code&client_id=qHnf1X6EXNnx5Z9DeyAvPRO72ndV8xPsSvbv4uLe&redirect_uri=https://github.com/mateuschaves&client_secret=wFlRombfhPcYm96cDHrgOd80udgEAM3Dq8CgrOk1#',
  'https://openredu.ufpe.br/entrar',
  'https://openredu.ufpe.br/oauth/authorize',
  'https://github.com/mateuschaves?code=&state='
];
    

export default class Auth extends Component<Props> {
  state = {
    // Variável que controla a função changeScrenn().
    control_redirect: 0,
    code:'',
  }
  // Executada toda vez em que a webview muda de estado.
   _onNavigationStateChange(webViewState){
    // URL da webview
    let url = webViewState.url;
    // Validando a url.
    this.validate_url(url);
    // Encontrando a posição da palavra 'code' na url.
    let index_code = url.match("code");
    // Verificando a posição da palavra 'openredu' na url.
    let check_url = url.match("openredu");
    /*
     * ----------TENTATIVA DE EXPLICAÇÃO DA GAMBIARRA----------
     * Quando a palavra 'openredu' não estiver mais contida na url,
     * o usuário foi redirecionado para a url desejada com o
     * 'code', que será utilizado para obter o token de acesso.
     */
    if(!check_url){
       // Cortando exatamente o parâmetro 'code' da url.
       this.setState({code:url.substring(37,57)});
       //console.log('code auth.js : ' + this.state.code);
       //Juntando todos os parâmetros.
       params = {
           app: app,
           code: this.state.code,
       }
       // Verificando se a função já foi executada antes.
       if(this.state.code && this.state.control_redirect == 0){
         this.setState({control_redirect: 1});
         // Mudando de tela.
          this._changeScreen(params);
       }
    }
  }
  // Muda para a tela InitAuth. 
  _changeScreen(params){
    this.props.navigation.navigate('InitAuth', {
        // Parâmetros para continuar a autenticação e obter o token de acesso.
        params: params
    });
  }
  // Executada toda vez que a webview inicia o carregamento de uma nova URL.
  validate_url(url){
    let i = urls_permitidas.map(c => {
      return c == url;
    });
    let url_code = app.redirect_uri + '?code=' + this.state.code + '&state=';
    if(url_code === url){
      i.push(true);
    }else if (url.match('github')){
      i.push(true);
    }else{
      i.push(false);
    }
    let f = [];
    let t = [];
    i.forEach(element => {
       if(element)
         t.push(1);
       else
         f.push(1);
    });
    if(t.length == 0)
       console.log('URL INVÁLIDA.')
       return false;
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
