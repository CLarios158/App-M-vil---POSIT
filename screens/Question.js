import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Alert, SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import { set } from 'react-native-reanimated';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

    const id_encuesta = navigation.getParam('id_encuesta');

    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [question, setQuestion] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [answerLog, setAnswerLog] = useState([]);
    const [itemIndex, setItemIndex] = useState([]);

    useEffect(() => {
        getQuestions();
    }, []);

    const getQuestions = () => {

        setLoading(true);

        db.transaction((tx) => {

            tx.executeSql('SELECT pregunta, numero FROM pregunta ORDER BY random() LIMIT 81;', [], (tx, results) => {

                var len = results.rows.length;
                var contador = 0;
                for (let i = 0; i < len; i++) {
                    var row = results.rows.item(i);
                    contador = contador + 1;
                    question.push({ 'contador': contador, 'pregunta': row.pregunta, 'numero': row.numero, 'positive': null, 'negative': null });
                }

                setQuestion(question);
                setLoading(false);

            });

        }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
    }

    const survey = (id, res, index) => {

        var day = new Date().getDate();
        var month = ("0" + (new Date().getMonth() + 1)).slice(-2);
        var year = new Date().getFullYear();
        var time = new Date().toLocaleTimeString();
        var fecha_registro = day + '/' + month + '/' + year + ' ' + time;

        if (res == true) {
            question.find(e => e.numero == id).positive = true;
            question.find(e => e.numero == id).negative = false;
        } else {
            question.find(e => e.numero == id).positive = false;
            question.find(e => e.numero == id).negative = true;
        }

        // Encuentra si una pregunta ya fue contestada
        const found1 = answer.some(e => e.id_pregunta == id);

        if (found1) {
            answer.find(e => e.id_pregunta == id).respuesta = res;
            var cambios = answer.find(e => e.id_pregunta == id).cambios;
            answer.find(e => e.id_pregunta == id).cambios = cambios + 1;
            answerLog.push({ 'id_encuesta': id_encuesta, 'id_pregunta': id, 'respuesta': res, 'fecha_creacion': fecha_registro });
            setAnswer(answer);
            setAnswerLog(answerLog);
        } else {
            answer.push({ 'id_encuesta': id_encuesta, 'id_pregunta': id, 'respuesta': res, 'cambios': 0, 'fecha_creacion': fecha_registro });
            answerLog.push({ 'id_encuesta': id_encuesta, 'id_pregunta': id, 'respuesta': res, 'fecha_creacion': fecha_registro });
        }
    }

    const validate = () => {

        const found = question.some(e => e.positive == null || e.negative == null || e.positive == -1 || e.negative == -1);

        if (found) {
            
            const array = question.map(e => {
                (e.positive == null || e.negative == null || e.positive == -1 || e.negative == -1) ? e.positive = -1 : e.positive,
                (e.positive == null || e.negative == null || e.positive == -1 || e.negative == -1) ? e.negative = -1 : e.negative
                return  e;
            });

            setQuestion(array);

            Alert.alert('Alerta', 'Faltan preguntas por responder');
        } else{
            db.transaction((tx) => {

                answer.forEach(element => {
                    tx.executeSql('INSERT INTO respuesta(id_encuesta,id_pregunta,respuesta,cambios,fecha_creacion) VALUES (?,?,?,?,?);', [element.id_encuesta, element.id_pregunta, element.respuesta, element.cambios, element.fecha_creacion], (tx, results) => {
                        // Get rows with Web SQL Database spec compliance.
                    })
                })

                answerLog.forEach(element =>
                    tx.executeSql('INSERT INTO historial_respuesta(id_encuesta,id_pregunta,respuesta,fecha_creacion) VALUES (?,?,?,?);', [element.id_encuesta, element.id_pregunta, element.respuesta, element.fecha_creacion], (tx, results) => {
                        // Get rows with Web SQL Database spec compliance.
                    })
                )
                
                Alert.alert('Felicidades', 'Has terminado de completar el cuestionario exitosamente!',[{text: 'OK', onPress: () => navigation.navigate('Welcome')}]);
            
            }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
            
        }
    }


    const renderItem = ({ item, index }) => (
        <View style={styles.container}>
            <Text style={styles.textoPregunta}><Text style={styles.negrita}>{item.contador/*item.numero*/}.-</Text>{item.pregunta}</Text>
            <View style={styles.container2}>
                <TouchableOpacity activeOpacity={2} onPress={() => (survey(item.numero, true, index), setRefresh(!refresh))} style={[styles.espaciado, item.positive == true ? { borderColor: '#E67E22', borderWidth: 2.5 } : item.positive == -1 ? { borderColor: '#D50000', borderWidth: 2.5} : { borderColor: 'gray' }]}>
                    <Text>Si</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={2} onPress={() => (survey(item.numero, false, index), setRefresh(!refresh))} style={[styles.espaciado, item.negative == true ? { borderColor: '#E67E22', borderWidth: 2.5 } : item.positive == -1 ? { borderColor: '#D50000', borderWidth: 2.5} : { borderColor: 'gray' }]}>
                    <Text>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const getItemLayout = (data, index) => ({
        length: data.length,
        offset: 100 * index,
        index,
    });

    if (loading == true) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size='large' color='#E67E22' />
                <Text>Cargando</Text>
            </View>
        );
    } else {
        return (
            <SafeAreaView style={styles.cont}>
                {/*<Text style={{ marginLeft: 10, fontFamily: 'Quicksand-Bold' }}>Lea cuidadosamente cada pregunta y responda.</Text>*/}
                <FlatList
                    data={question}
                    renderItem={renderItem}
                    extraData={refresh}
                    maxToRenderPerBatch={5}
                    getItemLayout={getItemLayout}
                    initialNumToRender={6}
                    keyExtractor={(item) => item.numero.toString()}
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={1} style={styles.button} onPress={validate}>
                        <Text style={styles.textButton}>Terminar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cont: {
        flex: 1,
        marginTop: 50
    },
    container2: {
        flexDirection: 'row'
    },
    textoPregunta: {
        fontSize: 17,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        fontFamily: 'Quicksand-Light'
    },
    negrita: {
        fontFamily: 'Quicksand-Bold'
    },
    espaciado: {
        width: '45%',
        height: 30,
        marginLeft: 10,
        fontFamily: 'Quicksand-Bold',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 0.5,
        //backgroundColor: '#ABB2B9',
        //backgroundColor:'#27AE60',
        //backgroundColor:'#C0392B',
        borderRadius: 50
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        textTransform: 'capitalize',
        fontFamily: 'Quicksand-Light'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
