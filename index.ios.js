var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

var {
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
} = ReactNative;
 
var STORAGE_KEY = 'id_token';

var Form = t.form.Form;

var Person = t.struct({
  username: t.String,
  password: t.String
});

var options = {}; // optional rendering options (see documentation)

var AwesomeProject = React.createClass({

    async _onValueChange(item, selectedValue) {
        try {
            await AsyncStorage.setItem(item, selectedValue);
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    },
 
    async _getProtectedQuote() {
        var DEMO_TOKEN = await AsyncStorage.getItem(STORAGE_KEY);
        fetch("http://localhost:3001/api/protected/random-quote", {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + DEMO_TOKEN
            }
        })
        .then((response) => response.text())
        .then((quote) => { 
            AlertIOS.alert(
                "Chuck Norris Quote:", quote)
        })
        .done();
    },

    _userSignup() {
        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            fetch("http://localhost:3001/users", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: value.username, 
                password: value.password, 
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
            this._onValueChange(STORAGE_KEY, responseData.id_token),
            AlertIOS.alert(
                "Signup Success!",
                "Click the button to get a Chuck Norris quote!"
            )
        })
        .done();
        }
    },

    _userLogin() {
        var value = this.refs.form.getValue();
        if (value) { // if validation fails, value will be null
            fetch("http://localhost:3001/sessions/create", {
                method: "POST", 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: value.username, 
                    password: value.password, 
                })
            })
            .then((response) => response.json())
            .then((responseData) => {
                AlertIOS.alert(
                    "Login Success!",
                    "Click the button to get a Chuck Norris quote!"
                ),
                this._onValueChange(STORAGE_KEY, responseData.id_token)
            })
            .done();
        }
    },
 
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.title}>Signup/Login below for Chuck Norris Quotes!</Text>
                </View>
                <View style={styles.row}>
                    <Form
                        ref="form"
                        type={Person}
                        options={options}
                        style={styles.form}
                    />
                </View>    
                <View style={styles.row}>
                    <TouchableHighlight style={styles.button} onPress={this._userSignup} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={this._userLogin} underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.row}>    
                    <TouchableHighlight onPress={this._getProtectedQuote} style={styles.button}>
                        <Text>Get a Chuck Norris Quote!</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
});
 
var styles = StyleSheet.create({
    container: {
        padding:20,
        flex: 1,  
    },
    row: { 
        flexDirection: 'row', 
        margin: 10, 
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#B7B7B7',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    form: {
        width:200
    },
    title: {
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    body: {
        justifyContent: 'center',
        fontSize: 12,
        flexWrap: 'wrap',
        flex: 1,
    }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

