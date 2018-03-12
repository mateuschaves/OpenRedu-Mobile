import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet, Image, AsyncStorage } from 'react-native';

import axios from '../../lib/http';
import { StackNavigator } from 'react-navigation';

export default class Connection extends Component {
  state = {
    // Token de autenticação
    token:      this.props.navigation.state.params.token,
    // Id do usuário logado
    id:         this.props.navigation.state.params.id,
    // Lista de todos os contaos do usuário
    connection:   new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    // Variável de controle do loading view.
    loading:    true,
    // Variável de controle para o refresh das conexões do storage.
    reload_connections: true,
  }
  // Inicializado assim que o componente acaba de montar.
  componentDidMount = async () =>  {
    const data = await this.getConnectionsFromStorage();
    let check_time = (new Date().getTime() - data.time) / 3600;
    if(check_time >= 60){
      this.setState({
        reload_connections: true,
      });
    }
    if(data.connections && check_time < 60){
      this.setState({
          connection: this.state.connection.cloneWithRows(JSON.parse(data.connections)),
          loading: false,
          reload_connections: false,
      });
    }
    // Verificando se existe o token.
    if(this.state.token && this.state.id && this.state.reload_connections == true){
      // Buscando todos os contatos do usuário.
      axios.get(`https://openredu.ufpe.br/api/users/${this.state.id}/connections`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       this.setState({
            // Armazenando a resposta no state contatos.
            connection: this.state.connection.cloneWithRows(response.data),
            // Informando que o carregamento terminou.
            loading:  false,
       });
       this.storageConnections(response.data);
       this.getConnectionsFromStorage();
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(this.state.loading != false){
      // Id ou token não informado, redirecionando para a tela anterior.
      this.props.navigation.navigate('InitAuth');
    }
}
storageConnections = async (connections) => {
  try{
    await AsyncStorage.setItem('connections', JSON.stringify(connections));
    await AsyncStorage.setItem('connections:time', JSON.stringify(new Date().getTime()));
  }catch(error){
    console.log(error);
  }
}
getConnectionsFromStorage = async () => {
  try{
    let connection = await AsyncStorage.getItem('connections');
    let time = await AsyncStorage.getItem('connections:time');
    data = {
      connections: connection,
      time: time,
    }
    return data;
  }catch(error){
    console.log(error);
  }
}

renderRow(connection){
    return(
      <TouchableOpacity style={styles.dadContatos} onPress={
        () => {
          this.props.navigation.navigate('ProfileTest', {
             params: {
               id: connection.id,
               token: this.state.token,
             }
          });
        }
      }> 
          <View style={styles.viewContatos}>
              <Image  style={styles.image} source={{uri: 'https://openredu.ufpe.br' + connection.contact.thumbnails[2].href}} />
              <Text   style={styles.infoContato}>  Nome:     {connection.contact.first_name} </Text>
              <Text   style={styles.infoContato}>  Status:   {connection.status}             </Text>
          </View>
      </TouchableOpacity>
    )
  }
  render() {
    if(this.state.loading){
      return (
        <View>
          <Text>
          Carregando...
          </Text>
        </View>
      );
    }else{
      return <ListView
                dataSource={this.state.connection}
                renderRow={connection => this.renderRow(connection)}/>
    }
  }
}

const styles = StyleSheet.create({
  dadContatos: {
    alignItems: 'center',
    paddingTop: 20,
  },
  infoContato: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  viewContatos: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: 'black',
  }, 
  image: {
    width: 50,
    height: 50,
    alignItems: 'center',
    paddingBottom: 10,
  }
})