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
  WebView,
} from 'react-native';

import axios from 'axios';


type Props = {};
const app = {
  client_id:      'qHnf1X6EXNnx5Z9DeyAvPRO72ndV8xPsSvbv4uLe',
  grant_type:     'authorization_code',
  client_secret:  'wFlRombfhPcYm96cDHrgOd80udgEAM3Dq8CgrOk1',
  redirect_uri:   'https://github.com/mateuschaves'
}
import { StackNavigator } from 'react-navigation';
import Auth  from './components/login/auth';
import Init  from './components/login/init';
import Matricula from './components/testes/matricula';

export default StackNavigator({
  InitAuth: {
    screen: Init,
  },
  Auth: {
    screen: Auth,
  },
  MatriculaTeste: {
    screen: Matricula,
  },
});

