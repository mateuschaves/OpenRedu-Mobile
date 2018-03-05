import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet } from 'react-native';

import axios from '../../lib/http';

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
    if(this.state.token){
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
    }
}

renderRow(connection){
    return(
      <TouchableOpacity style={styles.dadContatos}> 
          <View style={styles.viewContatos}>
              <Text style={styles.infoContato}>Nome: {connection.contact.first_name} </Text>
              <Text style={styles.infoContato}>Status: {connection.status}</Text>
          </View>
      </TouchableOpacity>
    )
  }
  render() {
    console.log(this.state.connection)
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
    backgroundColor: 'black',
  },
  infoContato: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  viewContatos: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 25,
  }
})