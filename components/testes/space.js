import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet, Image, AsyncStorage } from 'react-native';

import axios from '../../lib/http';
import { StackNavigator } from 'react-navigation';

export default class Space extends Component {
  state = {
    // Token de autenticação.
    token:      this.props.navigation.state.params.params.token,
    // Id do curso.
    id:         this.props.navigation.state.params.params.id,
    // Lista de todos as disciplinas. 
    spaces:   new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    // Variável de controle do loading view.
    loading:    true,
    // Variável de controle para o refresh das conexões do storage.
    reload_connections: true,
  }
  // Inicializado assim que o componente acaba de montar.
  componentDidMount = async () =>  {
    // Verificando se existe o token.
    console.log(this.state.token);
    console.log(this.state.id);
    if(this.state.token && this.state.id){
      // Buscando todos os contatos do usuário.
      axios.get(`https://openredu.ufpe.br/api/courses/${this.state.id}/spaces`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       console.log(response.data);
       this.setState({
            // Armazenando a resposta no state contatos.
            spaces: this.state.spaces.cloneWithRows(response.data),
            // Informando que o carregamento terminou.
            loading:  false,
       });
      })
      .catch((error) => {
        console.log(error);
      });
    }else if(this.state.loading != false){
      // Id ou token não informado, redirecionando para a tela anterior.
      //this.props.navigation.navigate('InitAuth');
    }
}
renderRow(space){
    return(
      <TouchableOpacity> 
          <View style={styles.space}>
              <Text   style={styles.name}>{space.name}</Text>
              <Text   style={styles.description}>{space.description}</Text>
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
                dataSource={this.state.spaces}
                renderRow={space => this.renderRow(space)}/>
    }
  }
}

const styles = StyleSheet.create({
  name: {
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 3,
  },
  description: {
    textAlign: 'center',
    fontWeight: 'normal',
    margin: 3,
  },
  space: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    margin: 10,
  }
})