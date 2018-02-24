/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import axios from 'axios';

export default class Init extends Component<Props> {
    state = {
        control_request: 0,
    }
    _getToken(params){
        console.log('CONTROL REQUEST ANTES DE SER MUDADO : ' + this.state.control_request);
        if(params && this.state.control_request != 1){
            this.setState({control_request: 1});
        console.log('CONTROL REQUEST DEPOIS DE SER MUDADO : ' + this.state.control_request);
            
            console.log("código " + params.params.code);
            let code            = params.params.code;
            let client_secret   = params.params.app.client_secret;
            let client_id       = params.params.app.client_id;
            let redirect_uri    = params.params.app.redirect_uri;
            let grant_type      = params.params.app.grant_type;
            axios.post(`https://openredu.ufpe.br/oauth/token?code=${code}&client_id=${client_id}&grant_type=${grant_type}&client_secret=${client_secret}&redirect_uri=${redirect_uri}`).then(function(response){
              token = response.data.access_token;
              console.log(' token ' + token);
            })
            .catch(function(error){
            });
        }
    }
  render() {
    const {params} = this.props.navigation.state;
    this._getToken(params);
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
