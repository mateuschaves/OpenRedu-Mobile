import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Alert,
  Image
} from 'react-native';

import axios from '../../lib/http';

import { StackNavigator } from 'react-navigation';


export default class Profile extends Component<Props> {
    
    state = {
        id: this.props.navigation.state.params.params.id,
        token: this.props.navigation.state.params.params.token,
        // Profile.
            first_name: '',
            last_name: '',
            thumbnail: '',
            status: '',
            
    }

    getToken = async () => {
      try{
        const token = await AsyncStorage.getItem('token');
        this.setState({token : token});
      }catch(error){
        console.log(error);
      }
    }

    componentDidMount  = () => {
        this.getToken();
        axios.get(`https://openredu.ufpe.br/api/connections/${this.state.id}`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       let data = response.data.contact;
       this.setState({
           first_name:  data.first_name,
           last_name:   data.last_name,
           thumbnail:  'https://openredu.ufpe.br' + data.thumbnails[5].href,
           status: response.data.status,
       });
      })
      .catch((error) => {
        console.log(error);
      });
      
    }
    
    static navigationOptions = {
        title: 'Profile',
      };
  render() {
    return (
      <View>
         <Text style={styles.name}> Nome completo : {this.state.first_name} {this.state.last_name} </Text>
         <Image style={styles.image} source={{uri: this.state.thumbnail}} />
         <Text style={styles.status}> Status da conexão: {this.state.status} </Text>
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
  name: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
  },
  image: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 100,
  },
  status: {
      textAlign: 'center',
      fontSize: 15,
      fontWeight: 'normal',
  }
});
