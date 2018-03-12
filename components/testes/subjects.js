import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet, Image, AsyncStorage } from 'react-native';

import axios from '../../lib/http';
import { StackNavigator } from 'react-navigation';

export default class Subjects extends Component {
  static navigationOptions ={
      title: 'Aulas'
  };
  state = {
    // Token de autenticação.
    token:      this.props.navigation.state.params.params.token,
    // Id da disciplina.
    id:         this.props.navigation.state.params.params.id,
    // Lista de todos as aulas. 
    subjects:   new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
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
      // Buscando todos as aulas da disciplina.
      axios.get(`https://openredu.ufpe.br/api/spaces/${this.state.id}/subjects`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       console.log(response.data);
       this.setState({
            // Armazenando a resposta no state.
            subjects: this.state.subjects.cloneWithRows(response.data),
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
renderRow(subject){
    return(
      <TouchableOpacity> 
          <View style={styles.subject}>
              <Text   style={styles.name}>{subject.name}</Text>
              <Text   style={styles.description}>{subject.description}</Text>
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
                dataSource={this.state.subjects}
                renderRow={subject => this.renderRow(subject)}/>
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
  subject: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    margin: 10,
  }
})