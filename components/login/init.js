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
    state = {
        // Evita que o código seja executado duas vezes.
        // Gambiarra de um bug desconhecido.
        control_request: 0,
        // Parâmetros passados pelo auth.js.
        params: this.props.navigation.state.params,
    }
      componentDidMount(){
        if(this.state.params && this.state.control_request == 0){
            this.setState({control_request: 1});
            let { params:{ code },
                  params:{app:{client_id}},
                  params:{app:{client_secret}},
                  params:{app:{grant_type}},
                  params:{app:{redirect_uri}}
                  } = this.state.params;
            axios.post('https://openredu.ufpe.br/oauth/token?', {
                client_id:      client_id,
                client_secret:  client_secret,
                grant_type:     grant_type,
                redirect_uri:   redirect_uri,
                code:           code,
            }).then(function(response){
            })
            .catch(function(error){
            });
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
  }
});
