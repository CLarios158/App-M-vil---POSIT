import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { set } from 'react-native-reanimated';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

    const type = navigation.getParam('type');

    const [loading, setLoading] = useState(false);
    const [loadingAsenta, setLoadingAsenta] = useState(false);
    const [arrayEstado, setarrayEstado] = useState([]);
    const [arrayMunicipio, setarrayMunicipio] = useState([]);
    const [arrayAsenta, setarrayAsenta] = useState([]);
    const [cve_estado, setEstado] = useState('');
    const [cve_municipio, setMunicipio] = useState('');
    const [cve_asenta, setAsenta] = useState('');
    const [lugar, setLugar] = useState('');
    const [errorLugar, setErrorLugar] = useState(false);
    const [calle, setCalle] = useState('');
    const [errorCalle, setErrorCalle] = useState(false);
    const [num_int, setNumInt] = useState('');
    const [num_ext, setNumExt] = useState('');

    useEffect(() => {
        getCatalogs();
    }, []);

    const getCatalogs = () => {

        setLoading(true);

        db.transaction((tx) => {

            tx.executeSql('SELECT cve_estado, nom_estado FROM estado;', [], (tx, results) => {

                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    arrayEstado.push({ 'cve_estado': row.cve_estado, 'nombre': row.nom_estado });
                }

                setarrayEstado(arrayEstado);
            });

            tx.executeSql(`SELECT cve_municipio, nom_municipio FROM municipio;`, [], (tx, results) => {

                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    arrayMunicipio.push({ 'cve': row.cve_municipio, 'nombre': row.nom_municipio });
                }

                setarrayMunicipio(arrayMunicipio);
                setLoading(false);
            });

        }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
    }

    const getAsentamiento = (valor) => {

        db.transaction((tx) => {

            tx.executeSql(`SELECT cve_asenta, nom_asenta FROM asentamiento WHERE cve_municipio = ?`, [valor], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    arrayAsenta.push({ 'cve': row.cve_asenta, 'nombre': row.nom_asenta });
                }
                setarrayAsenta(arrayAsenta);
                setLoadingAsenta(true);
            });

        }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    }

    const onSubmit = () => {
        let validateNombres = /^[a-zA-Z\sñáéíóú]+$/;
        
        if(cve_estado == '' || cve_municipio == '' || cve_asenta == '' || lugar == '' || calle == ''){
            Alert.alert('Datos requeridos', 'Asegurate de llenar todos los campos marcados con un *.');
        } else if (!validateNombres.test(lugar)){
            setErrorLugar(true);
            Alert.alert('Nombre Lugar', 'Formato Incorrecto.');
        } else if(!validateNombres.test(calle)){
            setErrorCalle(true);
            Alert.alert('Calle', 'Formato Incorrecto.');
        } else {
            
            setErrorLugar(false);
            setErrorCalle(false);

            navigation.navigate('Information',{
                type: type,
                cve_estado: cve_estado,
                cve_municipio: cve_municipio,
                cve_asenta: cve_asenta,
                lugar: lugar,
                calle: calle,
                num_ext: num_ext,
                num_int: num_int
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
                <Text style={{ marginLeft: 25, marginRight: 25, marginTop: 20, }}>Por favor ingresa los datos del lugar para continuar con tu registro.</Text>
                <View style={styles.containerPicker}>
                    <Picker
                        mode='dialog'
                        selectedValue={cve_estado}
                        style={styles.picker}
                        onValueChange={(itemValue) => setEstado(itemValue)}>
                        < Picker.Item label='Seleccione estado *' color='gray' />
                        {arrayEstado.map((item) => {
                            return (< Picker.Item label={item.nombre} key={item.cve_estado} value={item.cve_estado} />);
                        })}
                    </Picker>
                </View>
                <View style={styles.containerPicker}>
                    <Picker
                        mode='dialog'
                        selectedValue={cve_municipio}
                        style={styles.picker}
                        onValueChange={(itemValue) => (setMunicipio(itemValue), getAsentamiento(itemValue))}>
                        < Picker.Item label='Seleccione municipio *' color='gray' />
                        {arrayMunicipio.map((item) => {
                            return (< Picker.Item label={item.nombre} key={item.cve} value={item.cve} />);
                        })}
                    </Picker>
                </View>
                <View style={styles.containerPicker}>
                    <Picker
                        mode='dialog'
                        selectedValue={cve_asenta}
                        style={styles.picker}
                        onValueChange={(itemValue) => setAsenta(itemValue)}>
                        < Picker.Item label='Seleccione colonia *' value={-1} color='gray' />
                        {arrayAsenta.map((item, key) => {
                            return (< Picker.Item label={item.nombre} value={item.cve} key={key} />);
                        })}
                    </Picker>
                </View>
                <TextInput
                    placeholder='Nombre Lugar *'
                    placeholderTextColor='gray'
                    onChangeText={text => setLugar(text)}
                    style={[styles.input, errorLugar == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' } ]}
                />
                <TextInput
                    placeholder='Calle *'
                    placeholderTextColor='gray'
                    onChangeText={text => setCalle(text)}
                    style={[styles.input, errorCalle == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' }]}
                />
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <TextInput
                            placeholder='Número Ext'
                            placeholderTextColor='gray'
                            keyboardType='numeric'
                            onChangeText={text => setNumExt(text)}
                            style={styles.input2}
                        />
                    </View>
                    <View >
                        <TextInput
                            placeholder='Número Int'
                            placeholderTextColor='gray'
                            onChangeText={text => setNumInt(text)}
                            style={styles.input2}
                        />
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
        alignItems: 'center',
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
        width: '90%',
        borderColor: '#D8D6D6',
        borderWidth: 1,
        borderRadius: 15,
        fontSize: 16,
        paddingLeft: 15,
        marginTop: 15
    },
    input2: {
        marginLeft: 15,
        marginRight: 15,
        borderColor: '#D8D6D6',
        marginTop: 18,
        width: 170,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 15,
        fontSize: 16
    },
    containerPicker: {
        marginTop: 13,
        borderWidth: 1,
        borderRadius: 15,
        width: '90%',
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
