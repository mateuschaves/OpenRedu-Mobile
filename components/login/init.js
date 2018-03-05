import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Alert
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import axios from '../../lib/http';

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
        // Armazena informações do aluno.
        first_name: '',
        last_name: '',
        email: '',
        login: '',
        friends: 0,
        id: 0,
    }
      // Função executada após a montagem do componente.
        componentDidMount = async () =>  {
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
                }).then( async (response) => {
                  // Usar o storage para armazenar o token.
                  try {
                   this.storageToken(response.data.access_token);
                   const token = await this.getToken();
                   console.log(token);
                   this.setState({
                     token: token
                    });
                  }catch(error){
                    console.log(error);
                  }
                })
                .catch(function(error){
                // Tratar o erro.
                console.log(error);
                });
            }else{
              this.setState({msg_token_not_provided: 'É necessário permitir o acesso a sua conta para continuar.'});
            }
        }
    }
     // Retorna informações do usuário 
      me = async () => {
      if(this.state.token != ''){
        axios.get('https://openredu.ufpe.br/api/me', {
          headers: {
            'Authorization': 'Bearer ' + this.state.token,
          }
        })
        .then((response) => {
          this.setState({
            first_name:   response.data.first_name,
            email:        response.data.email,
            login:        response.data.login,
            friends:      response.data.friends_count,
            last_name:    response.data.last_name,
            id:           response.data.id,
          })
        })
        .catch((error) => {
          console.log(error);
        })
     }
    }

    storageToken = async (token) => {
      try{
        await AsyncStorage.setItem('token', token);
      }catch(error){
        console.log(error);
      }
    }

    getToken = async () => {
      try{
        const token = await AsyncStorage.getItem('token');
        return token;
      }catch(error){
        console.log(error);
      }
    }

   
  render() {
    return (
      <View>
          { !this.state.token && <Text style={styles.textLogin}> Login </Text> } 
          { !this.state.token && <Button title="Login" onPress={() => this.props.navigation.navigate('Auth')} />}
          { !!this.state.token && <Text style={styles.tokenText}>Token de acesso : {this.state.token}</Text>}
          { !!this.state.token && <Button style={styles.getMeButton} title="Get me" onPress={() => this.me()}/>}
          { !!this.state.msg_token_not_provided && <Text style={styles.tokenText}>{this.state.msg_token_not_provided}</Text>}
          { !!this.state.token && <Button title="Ver conexões" style={styles.buttonMatricula} onPress={() => this.props.navigation.navigate('MatriculaTeste', {
            token: this.state.token,
            id:    this.state.id,
          })} />}

          {!!this.state.first_name    && !!this.state.last_name   && <Text style={styles.tokenText}>Nome completo:   {this.state.first_name}  {this.state.last_name}  </Text>}
          {!!this.state.email         && <Text style={styles.tokenText}>Email:    {this.state.email}      </Text>}
          {!!this.state.login         && <Text style={styles.tokenText}>Login:    {this.state.login}      </Text>}
          {!!this.state.friends       && <Text style={styles.tokenText}>Amigos:   {this.state.friends}    </Text>}
          {!!this.state.id            && <Text style={styles.tokenText}>Id:       {this.state.id}         </Text>}
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
  },
  getMeButton: {
    paddingTop: 20,
  },
  getTokenButton: {
    paddingTop: 60,
    width: 90,
  },
  buttonMatricula: {
    paddingTop: 60,
  }
});
