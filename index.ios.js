var ReactNative = require('react-native');
var React = require('react');

var {
    AppRegistry,
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS,
} = ReactNative;
 
var demo_jwt = null;

var AwesomeProject = React.createClass({
    componentDidMount() {
        demo_jwt = this._loadInitialState().done();
      },

    async _loadInitialState() {
        var value = await AsyncStorage.getItem('demo_jwt');
        if (value !== null){
            this.setState({'demo_jwt': value});
            return(value);
        } else {
            return(null);
        }
    },

    _getQuote: function() {
        fetch("http://localhost:3001/api/random-quote", {
            method: "GET",
        })
        .then((response) => response)
        .then((responseData) => { 
            AlertIOS.alert(
                "Chuck Norris Quote:", 
                responseData._bodyText) 
        })
        .done();
    },
 
    _getProtectedQuote: function() {
        fetch("http://localhost:3001/protected/random-quote", {
            method: "GET",
            Authorization: 'Bearer {jwt}'
        })
        .then((response) => response)
        .then((responseData) => { 
            AlertIOS.alert(
                "Chuck Norris Quote:", 
                responseData._bodyText) 
        })
        .done();
    },

    _userSignup: function() {
        fetch("http://localhost:3001/users", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "testuser3", 
                password: "testpassword3", 
                extra: "He's a test user"
            })
        })
        .then((response) => response)
        .then((responseData) => {
            AlertIOS.alert(
                "Successfully Signed Up! (Token):", 
                responseData.id_token)
        })
        .done();
        AsyncStorage.setItem('demo_jwt', responseData.id_token);
    },

    _userLogin: function() {
        fetch("http://localhost:3001/users", {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "testuser2", 
                password: "testpassword2", 
            })
        })
        .then((response) => response.json())
        .then((responseData) => {
            AlertIOS.alert(
                "POST Response",
                "Response Body -> " + JSON.stringify(responseData.body)
            )
        })
        .done();
    },
 
    render: function() {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.title}>Click below to get a Chuck Norris Quote!</Text>
                </View>
                
                <View style={styles.row}>
                    <TouchableHighlight onPress={this._getQuote} style={styles.button}>
                        <Text>Get a Chuck Norris Quote!</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.row}>
                    <Text style={styles.body}>Signup (or Login) to be even more satisfied with your Chuck Norris quotes!</Text>
                </View>
                <View style={styles.row}>    
                    <TouchableHighlight onPress={this._userSignup} style={styles.button}>
                        <Text>Signup</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this._userLogin} style={styles.button}>
                        <Text>Login</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.row}>    
                    <TouchableHighlight onPress={this._getProtectedQuote} style={styles.button}>
                        <Text>Get More Satisfying Quotes!</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
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
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
        marginRight: 5,
        marginLeft: 5,
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

