import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <Text style={[styles.title, styles.color1]}>CUESTIONARIO</Text>
                <Text style={[styles.title, styles.color2]}>DE<Text style={[styles.title, styles.color3]}> TAMIZAJE</Text></Text>
                <Text style={[styles.title, styles.color1]}>POSIT</Text>
                <Text style={styles.text_question}>¿Pertences a una Primaria, Secundaria o Nivel Media Superior?</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.centerButton}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CCT',{ type: 1})}>
                            <Text style={styles.textButton}>SI</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centerButton}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Place',{ type: 2})}>
                            <Text style={styles.textButton}>NO</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body:{
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '95%'
    },
    title: {
        fontSize: 40,
        textAlign: 'center'
    },
    color1: {
        color: '#808B96',
        fontFamily: 'Quicksand-Bold'
    },
    color2: {
        color: '#6d6e71',
        fontFamily: 'Quicksand-Light'
    },
    color3: {
        color: '#E67E22',
        fontFamily: 'Quicksand-Bold'
    },
    col: {
        marginLeft: 25,
        marginRight: 25
    },
    text_question:{
        fontSize: 17, 
        textAlign: 'center', 
        margin: 20, 
        fontFamily: 'Quicksand-Bold'
    },
    centerButton: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    button: {
        height: 120,
        width: 120,
        backgroundColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60
    },
    textButton: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'Quicksand-Bold'
    }
});