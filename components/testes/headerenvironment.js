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

export default class Headerenvironment extends Component<Props> {
  render() {
    return (
        <View>
            <Text style={styles.name}> {this.props.name} </Text>
            <Image  style={styles.image} source={{uri:this.props.thumbnail}} />
            <Text style={styles.description}> {this.props.initials} </Text>
            <Text style={styles.description}> {this.props.description} </Text>
            <Text style={styles.courses_count}> {this.props.courses_count} cursos </Text>
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
  }
});
