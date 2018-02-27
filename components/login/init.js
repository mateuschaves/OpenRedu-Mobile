import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import axios from 'axios';

export default class Init extends Component<Props> {
    static navigationOptions = {
        headerTitle: <Text>Login</Text>
    };
    state = {
        // Evita que o código seja executado duas vezes.
        // Gambiarra de um bug desconhecido.
        control_request: 0,
        // Parâmetros passados pelo auth.js.
        params: this.props.navigation.state.params,
        // Token.
        token: '',
        // Mensagem de erro mostrada quando o usuário nega o acesso do aplicativo.
        msg_token_not_provided: '',
    }
      // Função executada após a montagem do componente.
      componentDidMount() {
        /* Verificando se os parametros foram passados.
         * Verificando se a função já foi executada antes.
         */ 
        if(this.state.params && this.state.control_request == 0){
            // Setando o valor 1, informando a execução da função.
            this.setState({control_request: 1});
            // Atribuição por desestruturação.
            let { params:{code},
                  params:{app:{client_id}},
                  params:{app:{client_secret}},
                  params:{app:{grant_type}},
                  params:{app:{redirect_uri}}
                  } = this.state.params;
            // Verificando se o parâmetro 'code' foi passado. 
            if(code){
                // Requisitando o token a API.
                axios.post('https://openredu.ufpe.br/oauth/token?',{
                  client_id:      client_id,
                  client_secret:  client_secret,
                  grant_type:     grant_type,
                  redirect_uri:   redirect_uri,
                  code:           code,
                }).then((response) => {
                // Usar o storage para armazenar o token.
                  this.setState({token: response.data.access_token});
                })
                .catch(function(error){
                // Tratar o erro.
                console.log(error);
                });
            }else{
              this.setState({msg_token_not_provided: 'É necessário permitir o acesso a sua conta para continuar.'})
            }
        }
    }
  render() {
    return (
      <View>
          <Text style={styles.textLogin}> Login </Text>
          <Button
          title="Login"
          onPress={() => this.props.navigation.navigate('Auth')}
            />
          { !!this.state.token && <Text style={styles.tokenText}>Token de acesso : {this.state.token}</Text> }
          { !!this.state.msg_token_not_provided && <Text style={styles.tokenText}>{this.state.msg_token_not_provided}</Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textLogin: {
      textAlign: 'center',
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
  },
  tokenText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textHeader: {
    fontSize: 10,
    fontWeight: 'normal',
    textAlign: 'center',
  }
});
