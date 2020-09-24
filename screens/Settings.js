import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

let SQLite = require('react-native-sqlite-storage');
let db = SQLite.openDatabase({ name: 'database.db' });

export default ({ navigation }) => {

  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [server, setServer] = useState('');

  useEffect(() => {
    getServer();
    createTables();
    //downloadCatalogs();
  }, []);

  const onFocusChange = () => {
    setFocus(true);
  }

  const storeServer = async () => {
    try {
      await AsyncStorage.setItem('@server', server);
      Alert.alert('Exito', 'Se ha guardado la dirección del servidor.');
    } catch (e) {
      Alert.alert('Error', 'Ha ocurrido un error al guardar la dirección del servidor.');
    }
  }

  const getServer = async () => {
    try {
      const value = await AsyncStorage.getItem('@server');
      if (value !== null) {
        setServer(value);
      }
    } catch (e) {
      Alert.alert('Error', 'Ha ocurrido un error al obtener la dirección del servidor.');
    }
  }

  const createTables = () => {
    db.transaction((tx) => {

      /*tx.executeSql('DROP TABLE IF EXISTS estado', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla ESTADO');
      });

      tx.executeSql('DROP TABLE IF EXISTS municipio', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla MUNICIPIO');
      });

      tx.executeSql('DROP TABLE IF EXISTS nivel', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla NIVEL');
      });

      tx.executeSql('DROP TABLE IF EXISTS cat_sexo', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla SEXO');
      });

      tx.executeSql('DROP TABLE IF EXISTS cat_asentamiento', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla CAT ASENTAMIENTO');
      });

      tx.executeSql('DROP TABLE IF EXISTS asentamiento', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla ASENTAMIENTO');
      });

      tx.executeSql('DROP TABLE IF EXISTS escuela', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla ESCUELA');
      });

      tx.executeSql('DROP TABLE IF EXISTS lugar', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla LUGAR');
      });

      tx.executeSql('DROP TABLE IF EXISTS pregunta', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla PREGUNTA');
      });

      tx.executeSql('DROP TABLE IF EXISTS respuesta', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla RESPUESTA');
      });

      tx.executeSql('DROP TABLE IF EXISTS historial_respuesta', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla HISTORIAL RESPUESTA');
      });

      tx.executeSql('DROP TABLE IF EXISTS persona', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla PERSONA');
      });

      tx.executeSql('DROP TABLE IF EXISTS encuesta', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        console.log('Se elimino la tabla ENCUESTA');
      });*/

      tx.executeSql('CREATE TABLE IF NOT EXISTS estado(cve_estado CHARACTER(2) PRIMARY KEY, nom_estado VARCHAR(50))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS municipio(cve_municipio CHARACTER(3) PRIMARY KEY, cve_estado CHARACTER(2) ,nom_municipio VARCHAR(50))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS nivel(id_nivel INTEGER PRIMARY KEY, nombre_nivel VARCHAR(50))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS cat_sexo(id_sexo INTEGER PRIMARY KEY, nombre_sexo VARCHAR(50))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS persona(id_persona INTEGER PRIMARY KEY AUTOINCREMENT, id_sexo INTEGER, nombre VARCHAR(70), apellido1 VARCHAR(70), apellido2 VARCHAR(70), fecha_nacimiento DATE, curp VARCHAR(18), fecha_creacion timestamp with time zone)');

      tx.executeSql('CREATE TABLE IF NOT EXISTS encuesta(id_encuesta INTEGER PRIMARY KEY AUTOINCREMENT, id_lugar INTEGER, id_persona INTEGER, cve_asenta CHARACTER(4), cve_municipio CHARACTER(3), cve_estado CHARACTER(2), calle VARCHAR, num_ext VARCHAR, num_int VARCHAR, fecha_creacion timestamp with time zone, grado INTEGER, grupo VARCHAR(1))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS cat_asentamiento(cve_tipo_asenta CHARACTER(2) PRIMARY KEY, nom_tipo_asenta VARCHAR(50))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS asentamiento(cve_asenta CHARACTER(4) PRIMARY KEY, cve_municipio CHARACTER(3), cve_estado CHARACTER(2), cve_tipo_asenta CHARACTER(2), nom_asenta VARCHAR(70), cp CHARACTER(5))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS escuela(id_lugar INTEGER PRIMARY KEY, id_nivel INTEGER, id_centro_desarrollo INTEGER, cct CHARACTER VARYING, nom_escuela CHARACTER VARYING, telefono CHARACTER VARYING(10))');

      tx.executeSql('CREATE TABLE IF NOT EXISTS lugar(id_lugar INTEGER PRIMARY KEY AUTOINCREMENT, cve_asenta CHARACTER(4), cve_municipio CHARACTER(3), cve_estado CHARACTER(2), calle CHARACTER VARYING, num_ext CHARACTER VARYING, num_int CHARACTER VARYING(10), nombre_lugar CHARACTER VARYING, fecha_creacion timestamp with time zone)');

      tx.executeSql('CREATE TABLE IF NOT EXISTS pregunta(id_pregunta INTEGER PRIMARY KEY, numero INTEGER, pregunta CHARACTER VARYING, aseveracion_negativa BOOLEAN)');

      tx.executeSql('CREATE TABLE IF NOT EXISTS respuesta(id_encuesta INTEGER, id_pregunta INTEGER, respuesta BOOLEAN, cambios INTEGER, fecha_creacion timestamp with time zone)');

      tx.executeSql('CREATE TABLE IF NOT EXISTS historial_respuesta(id_encuesta INTEGER, id_pregunta INTEGER, respuesta BOOLEAN, fecha_creacion timestamp with time zone)');

    }, Error => { Alert.alert('Error', Error.message) });
  }

  const downloadCatalogs = async () => {

    setLoading(true);

    try {
      /* <-- CATÁLOGO DE SEXO */
      const response = await fetch(`${server}/consultar_catalogo_sexo`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json = await response.json();

      db.transaction((tx) => {
        json.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO cat_sexo(id_sexo,nombre_sexo) VALUES (?,?);', [element['id_sexo'], element['nombre_sexo']]);
        });

      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de sexo!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE SEXO --> */

      /* <-- CATÁLOGO DE MUNICIPIO */
      const response2 = await fetch(`${server}/consultar_catalogo_municipio`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json2 = await response2.json();
      db.transaction((tx) => {
        json2.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO municipio(cve_municipio,cve_estado,nom_municipio) VALUES (?,?,?);', [element['cve_municipio'], element['cve_estado'], element['nom_municipio']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de municipio!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE MUNICIPIO --> */

      /* <-- CATÁLOGO DE ESTADO */
      const response3 = await fetch(`${server}/consultar_catalogo_estado`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json3 = await response3.json();
      db.transaction((tx) => {
        json3.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO estado(cve_estado,nom_estado) VALUES (?,?);', [element['cve_estado'], element['nom_estado']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de estado!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE ESTADO --> */

      /* <-- CATÁLOGO DE NIVEL */
      const response4 = await fetch(`${server}/consultar_catalogo_nivel`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json4 = await response4.json();
      db.transaction((tx) => {
        json4.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO nivel(id_nivel,nombre_nivel) VALUES (?,?);', [element['id_nivel'], element['nombre_nivel']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de nivel!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE NIVEL --> */

      /* <-- CATÁLOGO DE TIPO ASENTAMIENTO */
      const response5 = await fetch(`${server}/consultar_catalogo_tipo_asenta`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json5 = await response5.json();
      db.transaction((tx) => {
        json5.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO cat_asentamiento(cve_tipo_asenta,nom_tipo_asenta) VALUES (?,?);', [element['cve_tipo_asenta'], element['nom_tipo_asenta']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de tipo de asentamiento!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE TIPO ASENTAMIENTO --> */

      /* <-- CATÁLOGO DE ASENTAMIENTO*/
      const response6 = await fetch(`${server}/consultar_catalogo_asenta`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json6 = await response6.json();
      db.transaction((tx) => {
        json6.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO asentamiento(cve_asenta,cve_municipio,cve_estado,cve_tipo_asenta,nom_asenta,cp) VALUES (?,?,?,?,?,?);', [element['cve_asenta'], element['cve_municipio'], element['cve_estado'], element['cve_tipo_asenta'], element['nom_asenta'], element['cp']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de asentamiento!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE ASENTAMIENTO --> */

      /* <-- CATÁLOGO DE ESCUELA*/
      const response7 = await fetch(`${server}/consultar_catalogo_escuela`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json7 = await response7.json();
      db.transaction((tx) => {
        json7.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO escuela(id_lugar,id_nivel,id_centro_desarrollo,cct,nom_escuela,telefono) VALUES (?,?,?,?,?,?);', [element['id_lugar'], element['id_nivel'], element['id_centro_desarrollo'], element['cct'], element['nom_escuela'], element['telefono']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de escuela!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE ESCUELA --> */

      /* <-- CATÁLOGO DE LUGAR*/
      const response8 = await fetch(`${server}/consultar_catalogo_lugar`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json8 = await response8.json();
      db.transaction((tx) => {
        json8.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO lugar(id_lugar,cve_asenta,cve_municipio,cve_estado,calle,num_ext,num_int,nombre_lugar,fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?);', [element['id_lugar'], element['cve_asenta'], element['cve_municipio'], element['cve_estado'], element['calle'], element['num_ext'], element['num_int'], element['nombre_lugar'], element['fecha_creacion']]);
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de lugar!'), console.log(Error), setLoading(false) });

      /* CATÁLOGO DE LUGAR --> */

      /* <-- CATÁLOGO DE PREGUNTAS*/
      const response9 = await fetch(`${server}/consultar_preguntas`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const json9 = await response9.json();
      db.transaction((tx) => {
        json9.data.forEach(element => {
          tx.executeSql('INSERT OR REPLACE INTO pregunta(id_pregunta,numero,pregunta,aseveracion_negativa) VALUES (?,?,?,?);', [element['id_pregunta'], element['numero'], element['pregunta'], element['aseveracion_negativa']], (tx, results) => {
            // Get rows with Web SQL Database spec compliance.
          });
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error al insertar el catálogo de preguntas!'), console.log(Error), setLoading(false) });


      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM pregunta;', [], (tx, results) => {
          // Get rows with Web SQL Database spec compliance.
          var len = results.rows.length;
          console.log('RESULTADO:   ' + len)
          for (let i = 0; i < len; i++) {
            var row = results.rows.item(i);
            console.log(row);
          }
          setLoading(false)
          Alert.alert('Exito', 'Se han descargado los catálogos!');
        });
      }, Error => { console.log(Error) });

      /* CATÁLOGO DE PREGUNTAS --> */
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', 'Ha ocurrido un error en el servidor!')
    }
  }

  const btnSyncAllClick = async () => {

    db.transaction((tx) => {
      tx.executeSql('SELECT id_encuesta FROM encuesta', [], (tx, results) => {
        // Get rows with Web SQL Database spec compliance.
        var len = results.rows.length;
        if (len >= 1) {
          for (let i = 0; i < len; i++) {
            var row = results.rows.item(i);
            //console.log(row)
            enviarEncuesta(row.id_encuesta);
          }
          setLoading2(true);
        } else {
          Alert.alert('Aviso', 'No se encontraron encuestas');
        }
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
  }

  const enviarEncuesta = async (id) => {

    var encuestas = {};

    encuestas.respuesta = [];
    encuestas.historial_respuesta = [];

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM encuesta WHERE id_encuesta = ?', [id], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          var row = results.rows.item(i);
          encuestas.encuesta = { 'id_encuesta': row.id_encuesta, 'id_lugar': row.id_lugar, 'id_persona': row.id_persona, 'grado': row.grado, 'grupo': row.grupo, 'cve_asenta': row.cve_asenta, 'cve_municipio': row.cve_municipio, 'cve_estado': row.cve_estado, 'calle': row.calle, 'num_ext': row.num_ext, 'num_int': row.num_int, 'fecha_creacion': row.fecha_creacion };
        }
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM lugar WHERE id_lugar = ?', [encuestas.encuesta.id_lugar], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          var row = results.rows.item(i);
          encuestas.lugar = { 'id_lugar': row.id_lugar, 'nombre_lugar': row.nombre_lugar, 'cve_asenta': row.cve_asenta, 'cve_municipio': row.cve_municipio, 'cve_estado': row.cve_estado, 'calle': row.calle, 'num_ext': row.num_ext, 'num_int': row.num_int, 'fecha_creacion': row.fecha_creacion };
        }
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM persona WHERE id_persona = ?', [encuestas.encuesta.id_persona], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          var row = results.rows.item(i);
          encuestas.persona = { 'nombre': row.nombre, 'apellido1': row.apellido1, 'apellido2': row.apellido2, 'id_sexo': row.id_sexo, 'curp': row.curp, 'fecha_nacimiento': row.fecha_nacimiento, 'fecha_creacion': row.fecha_creacion };
        }
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM respuesta WHERE id_encuesta = ?', [encuestas.encuesta.id_encuesta], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          var row = results.rows.item(i);
          encuestas.respuesta.push({ 'id_encuesta': row.id_encuesta, 'id_pregunta': row.id_pregunta, 'respuesta': row.respuesta, 'cambios': row.cambios, 'fecha_creacion': row.fecha_creacion });
        }
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM historial_respuesta WHERE id_encuesta = ?', [encuestas.encuesta.id_encuesta], (tx, results) => {
        var len = results.rows.length;
        for (let i = 0; i < len; i++) {
          var row = results.rows.item(i);
          encuestas.historial_respuesta.push({ 'id_encuesta': row.id_encuesta, 'id_pregunta': row.id_pregunta, 'respuesta': row.respuesta, 'fecha_creacion': row.fecha_creacion });
        }
        //console.log(encuestas)
        sendPetiton(encuestas);
      });
    }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });
  }

  const sendPetiton = async (encuestas) => {

    setLoading2(false);

    await fetch(`${server}/registrar_encuestas`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(encuestas)
    }).then(function (res) {

      db.transaction((tx) => {
        tx.executeSql('DELETE FROM encuesta WHERE id_encuesta = ?;', [encuestas.encuesta.id_encuesta], (tx, results) => {
          // Get rows with Web SQL Database spec compliance.
          //console.log(results.rows);

        });

        tx.executeSql('DELETE FROM persona WHERE id_persona = ?;', [encuestas.encuesta.id_persona], (tx, results) => {
          // Get rows with Web SQL Database spec compliance.
          //console.log(results.rows);
        });

        /*tx.executeSql('DELETE FROM lugar WHERE id_lugar = ?;', [encuestas.encuesta.id_lugar], (tx, results) => {
            // Get rows with Web SQL Database spec compliance.
            console.log(results.rows);
        });*/

        tx.executeSql('DELETE FROM respuesta WHERE id_encuesta = ?;', [encuestas.encuesta.id_encuesta], (tx, results) => {
          // Get rows with Web SQL Database spec compliance.
          //console.log(results.rows);
        });

        tx.executeSql('DELETE FROM historial_respuesta WHERE id_encuesta = ?;', [encuestas.encuesta.id_encuesta], (tx, results) => {
          // Get rows with Web SQL Database spec compliance.
          //console.log(results.rows);
          Alert.alert('Exito', 'Se han cargado correctamente las encuestas');
        });
      }, Error => { Alert.alert('Error', 'Ha ocurrido un error!'), console.log(Error) });

    }).catch(function (e) {

      console.log(e);
      Alert.alert('Error', 'Ha ocurrido un error en el servidor!');

    });

  }

  if (loading == true) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' color='#E67E22' />
        <Text>Sincronizando</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Antes de realizar la sincronización de la "descarga de catálogos" ó "carga de encuestas" asegurese de contar con conexión a internet.</Text>
        <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 30 }}>
          <TouchableOpacity style={styles.container_btn} onPress={downloadCatalogs}>
            <Image source={require('../assets/images/down1.png')} style={styles.image} />
            <Text style={styles.texto}>Descargar catálogos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.container_btn} onPress={btnSyncAllClick}>
            <Image source={require('../assets/images/up1.png')} style={styles.image} />
            <Text style={styles.texto}>Cargar encuestas</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text_2}>INGRESE LA DIRECCIÓN DEL SERVER:</Text>
        <TextInput
          onChangeText={text => setServer(text)}
          value={server}
          onFocus={onFocusChange}
          autoCapitalize='none'
          placeholder='http://localhost:8080'
          style={focus ? [styles.input, { borderColor: '#E67E22' }] : [styles.input, { borderColor: 'gray' }]}
        />
        <TouchableOpacity style={styles.button} onPress={storeServer}>
          <Text style={styles.textButton}>Guardar</Text>
        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  text: {
    marginTop: 55,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Quicksand-Light',
  },
  text_2: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Quicksand-Light',
  },
  container_btn: {
    height: 140,
    width: '49%',
    borderColor: 'gray',
    borderWidth: 0.7,
    borderRadius: 5,
    margin: 2,
    alignItems: 'center'
  },
  input: {
    borderBottomWidth: 0.7,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15
  },
  button: {
    marginTop: 10,
    padding: 10,
    width: '25%',
    backgroundColor: '#E67E22',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    textTransform: 'capitalize',
    fontFamily: 'Quicksand-Regular',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 110, 
    width: 110 
  }
});