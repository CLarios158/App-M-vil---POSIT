import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, TouchableOpacity, View, Alert} from 'react-native';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

    const type = navigation.getParam('type');
    const [clave, setClave] = useState('');

    const onSubmit = () => {
        if(clave.trim() === ''){
            Alert.alert('CCT requerido', 'Por favor, ingrese el CCT')
        }
        else{
            db.transaction((tx) => {

                tx.executeSql('SELECT id_lugar FROM escuela WHERE UPPER(cct) like UPPER(?);', [clave], (tx, results) => {

                    var len = results.rows.length;
                    if(len >= 1){
                        for (let i = 0; i < len; i++) {
                            var row = results.rows.item(i);
                            navigation.navigate('School',{type: type, id_lugar: row.id_lugar});
                        }
                    }else{
                        Alert.alert('Incorrecto', 'No se ha encontrado el CCT')
                    }
                    
                });

            }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
        }
    }

    return(
        <View style={styles.container}>
            <Text style={[styles.title]}>Clave de Centro de Trabajo</Text>
            <TextInput 
                autoCapitalize='characters' 
                placeholder='Ingrese CCT' 
                placeholderTextColor='gray' 
                style={styles.input}
                onChangeText={ text => setClave(text) }
                value={clave}
            />
            <TouchableOpacity onPress={onSubmit} style={styles.button} >
                <Text style={styles.textButton}>Siguiente</Text>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
        marginLeft: 15,
        marginBottom: 10,
        fontFamily: 'Quicksand-Bold'
    },
    color1: {
        color: 'black',
        fontFamily: 'Quicksand-Normal'
    },
    input: {
        width: '50%',
        borderColor: '#D8D6D6',
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 18,
        marginTop: 15,
        textAlign:'center'
    },
    button: {
        padding: 10,
        width: 110,
        backgroundColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginTop: 10
    },
    textButton: {
        fontSize: 18,
        color: 'white',
        textTransform: 'capitalize',
        fontFamily: 'Quicksand-Regular',
    },
    textError: {
        color: 'red',
        fontSize: 12,
        flexDirection: 'row-reverse'
    },
});
