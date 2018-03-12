import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet, Image } from 'react-native';

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
  }
  // Inicializado assim que o componente acaba de montar.
  componentDidMount = async () =>  {
    // Verificando se existe o token.
    if(this.state.token && this.state.id){
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
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      // Id ou token não informado, redirecionando para a tela anterior.
      this.props.navigation.navigate('InitAuth');
    }
}
renderRow(connection){
    return(
      <TouchableOpacity style={styles.dadContatos}> 
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