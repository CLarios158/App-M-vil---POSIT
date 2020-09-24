import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import WelcomeScreen from './screens/Welcome';
import SettingsScreen from './screens/Settings';
import TypePersonScreen from './screens/TypePerson';
import CCTScreen from './screens/CCT';
import SchoolScreen from './screens/School';
import InformationScreen from './screens/Information';
import AddressScreen from './screens/Address';
import QuestionScreen from './screens/Question';
import PlaceScreen from './screens/Place';


const AppNavigator = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Sincronización',
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 20
        }
      }
    },
    TypePerson: {
      screen: TypePersonScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    CCT: {
      screen: CCTScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    School: {
      screen: SchoolScreen,
      navigationOptions: {
        title: 'Datos Generales de la Escuela',
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 18
        }
      }
    },
    Information: {
      screen: InformationScreen,
      navigationOptions: {
        title: 'Información Personal',
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 20
        }
      }
    },
    Address: {
      screen: AddressScreen,
      navigationOptions: {
        title: 'Domicilio',
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 20
        }
      }
    },
    Place: {
      screen: PlaceScreen,
      navigationOptions: {
        title: 'Datos del Lugar',
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 20
        }
      }
    },
    Question: {
      screen: QuestionScreen,
      navigationOptions: {
        title: 'Cuestionario',
        headerLeft: () => <View />,
        headerTitleAlign: 'center',
        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Quicksand-Bold',
          fontSize: 20
        }
      }
    }
  },
  { initialRouteName: 'Welcome' },
);

export default createAppContainer(AppNavigator);
