import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';


export default ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title_1}>¡Bienvenido!</Text>
        <Text style={styles.title_2}>Cuestionario de Tamizaje</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>
          • El próposito de estas preguntas es ayudarnos a conocer la mejor
          forma en la cual podemos ayudarte.
        </Text>
        <Text style={styles.text}>
          • Esto no es un examen, no hay respuestas correctas o incorrectos,
          pero por favor trabaja con cuidado.
        </Text>
        <Text style={styles.text}>
          • Todas las respuesta son confidenciales.
        </Text>
        <Text style={styles.text}>
          • Constesta todas las preguntas. Si alguna de ella no aplica
          exactamente para ti, escoge la respuesta que más se acerque a la
          verdad.
        </Text>
        <Text style={styles.text}>
          • Es posible que encuentres las misma pregunta o preguntas semejantes
          más de una vez.
        </Text>
        <Text style={styles.text}>
          • Si no comprendes alguna palabra, pide ayuda a la persona encargada.
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.button_1} onPress={() => navigation.navigate('TypePerson')}>
          <Text style={styles.textButton_1}>Comenzar</Text>
        </TouchableOpacity>
      </View>
      <View style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}>
        <TouchableOpacity style={styles.button_2}  onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.textButton_2}>Versión 1.0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F9',
  },
  header: {
    marginTop: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title_1:{
    fontSize: 16, 
    fontFamily:'Quicksand-Light'
  },
  title_2:{
    fontSize: 27, 
    fontFamily:'PatuaOne-Regular', 
    marginTop: 20, 
    color:'#E67E22'
  },
  body: {
    height: '50%',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    fontFamily: 'Quicksand-Light',
  },
  button_1: {
    padding: 10,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    borderRadius: 50,
  },
  textButton_1: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'Quicksand-Regular',
  },
  button_2: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginBottom: 5
  },
  textButton_2: {
    fontSize: 13,
    textTransform: 'capitalize',
    fontFamily: 'Quicksand-Bold',
  },
});
