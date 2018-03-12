import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StyleSheet, Image } from 'react-native';

import axios from '../../lib/http';

import { StackNavigator } from 'react-navigation';

export default class Environment extends Component {
  state = {
    // Token de autenticação
    token:      this.props.navigation.state.params.token,
    // Id do usuário logado
    id:         this.props.navigation.state.params.id,
    // Lista de todos os contaos do usuário
    environment:   new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    // Variável de controle do loading view.
    loading:    true,
  }
  // Inicializado assim que o componente acaba de montar.
  componentDidMount = async () =>  {
    // Verificando se existe o token.
    if(this.state.token){
      // Buscando todos os contatos do usuário.
      axios.get(`https://openredu.ufpe.br/api/environments`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       this.setState({
            // Armazenando a resposta no state contatos.
            environment: this.state.environment.cloneWithRows(response.data),
            // Informando que o carregamento terminou.
            loading:  false,
       });
      })
      .catch((error) => {
        console.log(error);
      });
    }
}

renderRow(environment){
    return(
      <TouchableOpacity style={styles.dadContatos}>
          <View style={styles.viewContatos}>
              <Image style={styles.image} source={{uri: 'https://openredu.ufpe.br' + environment.thumbnails[1].href}} />
              <Text style={styles.infoContato}>Nome: {environment.name} </Text>
              <Text style={styles.infoContato}>Quantidade de cursos : {environment.courses_count}</Text>
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
                dataSource={this.state.environment}
                renderRow={environment => this.renderRow(environment)}/>
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
  },
  image: {
    width: 90,
    height: 90,
    alignItems: 'center',
    paddingBottom: 10,
  }
})