import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  Alert,
  Image,
  ListView,
  TouchableOpacity,
} from 'react-native';

import axios from '../../lib/http';

import { StackNavigator } from 'react-navigation';
import Headerenvironment from '../testes/headerenvironment';


export default class ShowEnvironment extends Component<Props> {
    state = {
        // Id do AVA.
        id: this.props.navigation.state.params.params.id,
        // Token de acesso.
        token: this.props.navigation.state.params.params.token,
        // INFORMAÇÕES DO AVA.
        courses_count: 0,
        description: '',
        name: '',
        initials: '',
        thumbnail: '',
        link_courses: '',
        courses: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    }
    // Busca o token do storage.
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
        // Buscando informações do AVA selecionado.
        axios.get(`https://openredu.ufpe.br/api/environments/${this.state.id}`, {
        headers: {
          // Token 
          'Authorization': 'Bearer ' + this.state.token,
        }
      })
      .then((response) => {
       let data = response.data;
       // Salvando os resultados no estado do componente.
       this.setState({
            courses_count: data.courses_count,
            description: data.description,
            name: data.name,
            initials: data.initials,
            thumbnail: 'https://openredu.ufpe.br' + data.thumbnails[2].href,
            link_courses: data.links[1].href,
       });
      })
      .catch((error) => {
        console.log(error);
      });
      // Buscando os cursos da AVA selecionado.
      axios.get(`https://openredu.ufpe.br/api/environments/${this.state.id}/courses`, {
        headers: {
            // Token 
            'Authorization': 'Bearer ' + this.state.token,
          }
       }).then((response) => {
           let data = response.data;
           // Salvando o resultado no estado do componente.
           this.setState({
               courses: this.state.courses.cloneWithRows(data),
           });
       }).catch((error) => {
           console.log(error);
       });
    }
    // Renderiza cada item da lista.
    renderRow(course){
        return(
          <TouchableOpacity> 
              <View style={styles.course}>
                  <Text style={styles.course_name}>{course.name}</Text>
              </View>
          </TouchableOpacity>
        )
      }
    
    static navigationOptions = {
        title: 'Ambiente',
      };
  render() {
    return (
      <ListView
      dataSource={this.state.courses}
      renderRow={courses => this.renderRow(courses)}
      renderHeader={() => <Headerenvironment name={this.state.name} thumbnail={this.state.thumbnail} initials={this.state.initials} description={this.state.description} courses_count={this.state.courses_count} />}/>
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
  image: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 100,
  },
  name: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  description: {
      fontSize: 15,
      fontWeight: 'normal',
      textAlign: 'center',
  },
  courses_count: {
      textAlign: 'center',
  },
  course_name: {
      textAlign: 'center',
      justifyContent: 'center'
  },
  course_description: {
      textAlign: 'center',
      justifyContent: 'center'
  },
  course: {
      justifyContent: 'center',
  }
});
