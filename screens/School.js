import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';

let SQLite = require('react-native-sqlite-storage');
let db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

    const type = navigation.getParam('type');
    const id_lugar = navigation.getParam('id_lugar');

    const [loading, setLoading] = useState(false);
    const [nameSchool, setnameSchool] = useState('');
    const [level, setlevel] = useState('');
    const [address, setAddress] = useState('');
    const [grado, setGrado] = useState('');
    const [grupo, setGrupo] = useState('');

    useEffect(() => {
        getDataSchool();
    }, []);

    const getDataSchool = () => {

        setLoading(true);

        db.transaction((tx) => {
            tx.executeSql('SELECT n.nombre_nivel, e.nom_escuela, e.cct, e.telefono, (l.calle||" #"||l.num_ext) as direccion FROM escuela e INNER JOIN nivel n on e.id_nivel = n.id_nivel INNER JOIN lugar l on e.id_lugar = l.id_lugar WHERE e.id_lugar = ?;', [id_lugar], (tx, results) => {

                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    setnameSchool(row.nom_escuela);
                    setlevel(row.nombre_nivel);
                    setAddress(row.direccion);
                }

                setLoading(false);

            });
        }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
    }

    const onSubmit = () => {
        if(grado == '' || grupo == ''){
            Alert.alert('Datos requeridos', 'Asegurate de llenar todos los campos marcados con un *.');
        } else{
            navigation.navigate('Information',{
                type: type,
                id_lugar: id_lugar,
                grado: grado,
                grupo: grupo,
            });
        }
    } 

    if (loading == true) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size='large' color='#E67E22' />
                <Text>Cargando</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.grupo} >
                    <Text style={{ color: 'gray' }}>Nombre Escuela</Text>
                    <TextInput
                        editable={false}
                        value={nameSchool}
                        placeholderTextColor='black'
                        style={styles.input}
                    />
                </View>
                <View style={styles.grupo} >
                    <Text style={{ color: 'gray' }}>Nivel</Text>
                    <TextInput
                        editable={false}
                        value={level}
                        placeholderTextColor='black'
                        style={styles.input}
                    />
                </View>
                <View style={styles.grupo} >
                    <Text style={{ color: 'gray' }}>Dirección</Text>
                    <TextInput
                        editable={false}
                        value={address}
                        placeholderTextColor='black'
                        style={styles.input}
                    />
                </View>
                <View style={styles.grupo} >
                    <Text style={{ color: 'gray' }}>Grado</Text>
                    <View style={styles.containerPicker}>
                        <Picker
                            mode='dialog'
                            selectedValue={grado}
                            style={styles.picker}
                            onValueChange={(itemValue) => setGrado(itemValue)}>
                            <Picker.Item label='Seleccione grado *' value={-1} color='gray' />
                            <Picker.Item label='1' value={1} />
                            <Picker.Item label='2' value={2} />
                            <Picker.Item label='3' value={3} />
                            <Picker.Item label='4' value={4} />
                            <Picker.Item label='5' value={5} />
                            <Picker.Item label='6' value={6} />
                        </Picker>
                    </View>
                </View>
                <View style={styles.grupo} >
                    <Text style={{ color: 'gray' }}>Grupo</Text>
                    <View style={styles.containerPicker}>
                        <Picker
                            mode='dialog'
                            selectedValue={grupo}
                            style={styles.picker}
                            onValueChange={(itemValue) => setGrupo(itemValue)}>
                            <Picker.Item label='Seleccione grupo *' value={-1} color='gray' />
                            <Picker.Item label='A' value='A' />
                            <Picker.Item label='B' value='B' />
                            <Picker.Item label='C' value='C' />
                            <Picker.Item label='D' value='D' />
                            <Picker.Item label='E' value='E' />
                            <Picker.Item label='F' value='F' />
                            <Picker.Item label='G' value='G' />
                            <Picker.Item label='H' value='H' />
                            <Picker.Item label='I' value='I' />
                        </Picker>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.textButton}>Siguiente</Text>
                </TouchableOpacity>
            </View>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 50
    },
    text: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        fontFamily: 'Quicksand-Bold'
    },
    grupo: {
        width: '90%',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15
    },
    input: {
        borderColor: '#D8D6D6',
        color: 'black',
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 15,
        marginTop: 4
    },
    containerPicker: {
        marginTop: 4,
        borderWidth: 1,
        borderRadius: 15,
        alignItems: 'center',
        borderColor: '#D6DBDF'
    },
    picker: {
        width: '90%',
        height: 50,
        marginRight: 20
    },
    button: {
        backgroundColor: '#E67E22',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '30%',
        marginTop: 20,
        borderRadius: 50,
        height: 45
    },
    textButton: {
        color: 'white',
        fontSize: 18,
        textTransform: 'capitalize',
        fontFamily: 'Quicksand-Light'
    },
    container_error: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 25
    },
    textError: {
        color: 'red',
        fontSize: 12,
        flexDirection: 'row-reverse'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
