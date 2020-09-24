import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-community/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

    const type = navigation.getParam('type');

    /* DATOS ESCUELA */
    const id_lugar = navigation.getParam('id_lugar');
    const grado = navigation.getParam('grado');
    const grupo = navigation.getParam('grupo');

    /* DATOS DEL LUGAR */
    const cve_estadoL = navigation.getParam('cve_estado');
    const cve_municipioL = navigation.getParam('cve_municipio');
    const cve_asentaL = navigation.getParam('cve_asenta');
    const nombreL = navigation.getParam('lugar');
    const calleL = navigation.getParam('calle');
    const num_extL = navigation.getParam('num_ext');
    const num_intL = navigation.getParam('num_int');

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [surname1, setSurname1] = useState('');
    const [surname2, setSurname2] = useState('');
    const [curp, setCurp] = useState('');
    const [birthday, setBirthday] = useState('');
    const [id_gender, setGender] = useState(-1);
    const [showDatePicker, setshowDatePicker] = useState(false);
    const [arrayGender, setarrayGender] = useState([]);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorApellido1, setErrorApellido1] = useState(false);
    const [errorApellido2, setErrorApellido2] = useState(false);
    const [errorCURP, setErrorCURP] = useState(false);

    useEffect(() => {
        getCatGender();
    }, []);

    const getCatGender = () => {
        
        setLoading(true);

        db.transaction((tx) => {
            tx.executeSql('SELECT id_sexo, nombre_sexo FROM cat_sexo  WHERE id_sexo != ?;', [9], (tx, results) => {

                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    arrayGender.push({ 'id': row.id_sexo, 'nombre': row.nombre_sexo })
                }
                
                setarrayGender(arrayGender);
                setLoading(false);
            });
        }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
    }

    const onSubmit = () => {
        let validateNombres = /^[a-zA-Z\sñáéíóú]+$/;
        let validateCURP = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
        
        if(name == '' || surname1 == '' || surname2 == '' || birthday == '' || id_gender == -1){
            Alert.alert('Datos requeridos', 'Asegurate de llenar todos los campos marcados con un *.')
        }  else if (!validateNombres.test(name)){
            setErrorNombre(true);
            Alert.alert('Nombre', 'Formato Incorrecto.');
        } else if (!validateNombres.test(surname1)){
            setErrorApellido1(true);
            Alert.alert('Primer Apellido', 'Formato Incorrecto.');
        } else if (!validateNombres.test(surname2)){
            setErrorApellido2(true);
            Alert.alert('Segundo Apellido', 'Formato Incorrecto.');
        } else if (curp != '' && !validateCURP.test(curp)){
            setErrorCURP(true);
            Alert.alert('CURP', 'Formato Incorrecto.');
        } else {
            setErrorNombre(false);
            setErrorApellido1(false);
            setErrorApellido2(false);
            setErrorCURP(false);

            if(type == 1){
                navigation.navigate('Address',{
                    type: type,
                    id_lugar: id_lugar,
                    grado: grado,
                    grupo: grupo,
                    nombre: name,
                    apellido1: surname1,
                    apellido2: surname2,
                    curp: curp,
                    date: birthday,
                    sexo: id_gender
                });
            } else {
                navigation.navigate('Address',{
                    type: type,
                    cve_estado: cve_estadoL,
                    cve_municipio: cve_municipioL,
                    cve_asenta: cve_asentaL,
                    lugar: nombreL,
                    calle: calleL,
                    num_ext: num_extL,
                    num_int: num_intL,
                    nombre: name,
                    apellido1: surname1,
                    apellido2: surname2,
                    curp: curp,
                    date: birthday,
                    sexo: id_gender
                });
            }
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
                <Text style={styles.text}>Por favor ingresa tu información personal para continuar con tu registro.</Text>
                <TextInput
                    placeholder='Nombre(s) *'
                    placeholderTextColor='gray'
                    value={name}
                    onChangeText={text => setName(text)}
                    style={[styles.input, errorNombre == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' }]}
                />
                <TextInput
                    placeholder='Primer Apellido *'
                    placeholderTextColor='gray'
                    value={surname1}
                    onChangeText={text => setSurname1(text)}
                    style={[styles.input, errorApellido1 == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' }]}
                />
                <TextInput
                    placeholder='Segundo Apellido *'
                    placeholderTextColor='gray'
                    value={surname2}
                    onChangeText={text => setSurname2(text)}
                    style={[styles.input, errorApellido2 == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' }]}
                />
                <TextInput
                    autoCapitalize='characters'
                    placeholder='CURP'
                    placeholderTextColor='gray'
                    value={curp}
                    onChangeText={text => setCurp(text)}
                    style={[styles.input, errorCURP == true ? { borderColor: 'red' } : { borderColor: '#D8D6D6' }]} 
                />
                <View style={styles.containerPicker}>
                    <Picker
                        mode='dialog'
                        selectedValue={id_gender}
                        style={styles.picker}
                        onValueChange={(itemValue) => setGender(itemValue)} >
                        < Picker.Item label='Seleccione sexo *' value={-1} color='gray' />
                        {arrayGender.map((item) => {
                            return (< Picker.Item label={item.nombre} key={item.id} value={item.id} />);
                        })}
                    </Picker>
                </View>
                {/*<View style={styles.container_error}>
                    {!!this.state.errorSexo && (<Text style={styles.textError}>{this.state.errorSexo}</Text>)}
                </View>*/}
                <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                    <View style={{ width: '87%' }}>
                        <TextInput
                            placeholder='Fecha Nacimiento *'
                            editable={false}
                            value={birthday}
                            placeholderTextColor='gray'
                            style={styles.input2} />
                    </View>
                    <View style={{ marginTop: 18 }}>
                        <TouchableOpacity onPress={() => setshowDatePicker(true)}><Icon name='calendar' size={25} color='#E67E22' /></TouchableOpacity>
                    </View>
                </View>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={new Date()}
                        mode='date'
                        is24Hour={true}
                        display="spinner"
                        onChange={(event, date) => date == null ? ( setshowDatePicker(false), setBirthday('')) : (setshowDatePicker(false), setBirthday(date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate()))}
                    />
                )}
                {/*<View style={styles.container_error}>
                    {!!this.state.errorFecha && (<Text style={styles.textError}>{this.state.errorFecha}</Text>)}
                </View>*/}
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
        borderColor: '#D8D6D6',
        color: 'black',
        marginLeft: 20,
        marginRight: 10,
        marginTop: 13,
        borderWidth: 1,
        borderRadius: 15,
        paddingLeft: 15,
        fontSize: 16,
    },
    containerPicker:{
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
        color: "red",
        fontSize: 12,
        flexDirection: 'row-reverse'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
