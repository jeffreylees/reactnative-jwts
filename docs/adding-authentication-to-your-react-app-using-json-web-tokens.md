![React Native Logo][reactnative_logo]
![JWT.io Logo][jwt_io_logo]

# Adding Authentication to Your React Native App Using JSON Web Tokens

You have many, many choices out there that can help you get user authentication into your React Native application. The advantages to using JWTs over other, more traditional authentication methods are many. The app will be stateless, and we don’t have to worry about issues like load balancing with sessions or cookie problems. We can authenticate users across multiple domains, integrate easily with other authentication services, and reduce the load on our servers. Sounds great, right?

Here’s the thing. We, as developers, don’t need more complication in our apps, in our projects, or in our lives. User authentication is always a pain. _Someone_ always wants more SSO options. _Someone_ always wants better security. _Someone_ always finds vulnerabilities. And yes, there are vulnerabilities in any system. But mitigating the _chances_ of problems of all kinds - technical problems, server problems, cookie problems, hacking problems - is what we’re all trying to do all the time, isn’t it? An easy-to-implement token based authentication system provides just that. If we’re building a React Native app, we are probably intending to cover multiple platforms with minimal changes. Let’s take it one step further and have the same stateless authentication procedures for all versions of our app, too. 

## What We’re Building

This tutorial will demonstrate how to authenticate our users to a React Native app using [JSON Web Tokens][1]. We’ll go ahead and use [this Auth0 sample API][2] as our app’s backend. We’ll be building a little app that deals in the ever-ubiquitous Chuck Norris quotes (Who doesn’t love a good Chuck Norris joke?), and we’ll be authenticating our users with JWTs, which will be the primary purpose of this tutorial.

OK, let’s get started with our setup.

## Setup and Installations

First, let’s set up a React Native app. We can start with a brand new one, for the purposes of this tutorial, so just spin up a new project. For anyone who is unfamiliar with React Native, the [documentation][3] has an excellent Getting Started page to help get that set up. We also want to go ahead and clone [this Auth0 sample API][4] backend, which employs Node.js, and get it running locally. We can just leave that in a separate folder, and start it up before we begin work on our React Native app. We’ll also want to go ahead and grab [Tcomb’s Form Library][5] for easily adding forms to our app. We can do this most quickly with NPM ( `npm install tcomb-form-native` ).

## Integrating With Our Backend

OK, so we have our backend downloaded and running locally. Let’s  hit the URL associated with it - by default `http://localhost:3001/api/random-quote`. This will reassure us that our backend that provides fun-filled Chuck Norris quotes is indeed working. OK, and here we go:

![Test of the JWT API Sample][image-1]

## Laying Out Our App

Next up, let’s take a look at our starter React Native app, which, if following the tutorial linked above, should look something like this:

 
	/**
	 * Sample React Native App
	 * https://github.com/facebook/react-native
	 * @flow
	 */
	
	import React, { Component } from 'react';
	import {
	  AppRegistry,
	  StyleSheet,
	  Text,
	  View
	} from 'react-native';
	
	class AwesomeProject extends Component {
	  render() {
	    return (
	      <View style={styles.container}>
	        <Text style={styles.welcome}>
	          Welcome to React Native!
	        </Text>
	        <Text style={styles.instructions}>
	          To get started, edit index.ios.js
	        </Text>
	        <Text style={styles.instructions}>
	          Press Cmd+R to reload,{'\n'}
	          Cmd+D or shake for dev menu
	        </Text>
	      </View>
	    );
	  }
	}
	
	const styles = StyleSheet.create({
	  container: {
	    flex: 1,
	    justifyContent: 'center',
	    alignItems: 'center',
	    backgroundColor: '#F5FCFF',
	  },
	  welcome: {
	    fontSize: 20,
	    textAlign: 'center',
	    margin: 10,
	  },
	  instructions: {
	    textAlign: 'center',
	    color: '#333333',
	    marginBottom: 5,
	  },
	});
	
	AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
	

So let’s now modify this a bit. First, let’s go ahead and alter the way we’re grabbing `react-native` - we need to get both `react` and `react-native` (and let’s go ahead and pick up our tcomb library as well) as such:

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

Awesome. Also, let’s go ahead and swap out the original stylesheet with the one we’re going to use here: 

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
		,
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

## Getting Into It

So, we have the building blocks for our app all set up. What do we want to do with it?

We’re going to need a few parts. For simplicity’s sake, we’ll have one, very simple form, which has two inputs - username and password. The user can opt to either signup or login, depending on whether they already have an account. Once they do so, they’ll be able to click a button to get a Chuck Norris quote in an iOS popup message. 

### JSON Web Tokens and AsyncStorage

The crux of this demo app, of course, is authenticating our React Native app with JSON Web Tokens. When a user signs up, or logs in, the backend API’s response will be a JWT. Any request to the protected quotes endpoint will include the current user’s saved JWT - if there is one - and this will prove to the backend that the user is, in fact, a logged in, authenticated session and grant them access. So we’ll be using [AsyncStorage][6] for that.

### What We Need

We’ll need three major methods for this app, among other smaller helpers (and excluding `render`):

1. A method for `_userSignup`, which will `POST` request to the endpoint `/users`, providing a username and a password. If the user doesn’t already exist, it will be created, and a JWT will be returned for the current session. 
2. We will also need a method for `_userLogin`, which will `POST` request to `/sessions/create` with a username and password. Again, if successful, this will return a JWT for the session.
3. Lastly, we’ll need a method called `_getProtectedQuote`, which will `GET` request the endpoint `api/protected/random-quote` , including the session’s stored JWT, if there is one. The response, will, of course, be a Chuck Norris quote, if we are successful.

## The App Itself

Let’s take a look now at our completed demo app, and then walk through it piece by piece. Feel free to try it out and get an idea of what it does, to start with: [https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js][8]

		```
		var STORAGE_KEY = 'id_token';
	
		var Form = t.form.Form;
		
		var Person = t.struct({
		  username: t.String,
		  password: t.String
		});
		
		var options = {}; // optional rendering options (see documentation)
		```

First and foremost, we have a `STORAGE_KEY` variable that we’re stashing the key we’ll be using in - in this case, `id_token`. We then follow that with the setup for `tcombs` forms library. `Person` will be made up of `username` and `password`, both required fields, both strings. We aren’t adding any extra options, although we certainly could extend the form, or separate the login/signup forms, if we wanted to practice with the forms library we’re using.

### onValueChange

		```
		async _onValueChange(item, selectedValue) {
			try {
				await AsyncStorage.setItem(item, selectedValue);
			} catch (error) {
				console.log('AsyncStorage error: ' + error.message);
			}
		},
		```

`_onValueChange` is called when the value of a AsyncStorage item is changed. It is passed the item and the value, and it changes that value and `sets` it. 

### _getProtectedQuote

		```
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
		```

Getting a quote returns a simple string, which is displayed in a popup. In your real world application, what sort of data could you retrieve via the API for a user that is authenticated to your app via JWTs? The possibilities are endless.

![Chuck Norris Quote!][image-3]

`_getProtectedQuote` will first call up the stored JWT, `id_token`, if there is one, and will then proceed to issue a `GET` request to our backend API, using the `fetch()` method. This will include an `Authorization` header, which is required to then have the backend verify the signature of our JWT and confirm that it is, in fact, the current token being used by an authorized user of the app. The method response includes an alert popup that contains our Chuck Norris quote, with all it’s wittiness.

### _userSignup

		```
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
		```

`_userSignup` is called by pressing the Signup button, and collects the values of the form fields `username` and `password` before submitting those values via a `POST` request to the backend API. The backend will verify that we are, indeed, signing up a new user and will then return the JWT for the current session. It finally calls the `_onValueChange` method and uses it to set the new token.

### _userLogin

		```
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
		```

Logging in as a user returns a simple popup message, but could be harnessed to redirect the user. It also is saving their JWT behind the scenes.

![Logging In][image-2]

`_userLogin` is called by pressing the Login button. This does the same thing, essentially, as `_userSignup` - it checks for an existing user with these credentials, this time, of course, only accepting the request if there _is_ such a user, and responds with a JWT for us to store. 

### _render

		```
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
		```

`render`, last but not least, is what renders our app for the visitor to see. 

Again, take a look here [https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js][8] for the completed code.

## Conclusions

We have an extremely simple demo app here, a single two-field form, and a query that simply grabs a Chuck Norris quote from an API. But even this little dabble into JWT authentication makes us see how incredibly useful it could be for React Native app development. With React Native, developers are able to create applications that perform nearly identically across Android and iOS devices, and coupled with React development for the Web, a fiercely competitive, cross-platform suite emerges. With this amount of cross-device and cross-platform work available, the need for easy authentication emerges, and with JSON Web Tokens, the ease with which it can be implemented on diverse types of applications is incredible. 

Go ahead and implement JWT authentication in your own current React Native apps, or extend our demo app into something far greater, and get involved at [jwt.io][7]!





[1]:	https://jwt.io/introduction/ "What are JSON Web Tokens?"
[2]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[3]:	https://facebook.github.io/react-native/docs/getting-started.html#content "React Native - Getting Started"
[4]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[5]:	https://github.com/gcanti/tcomb-form-native "Tcomb's Forms Library"
[6]:	https://facebook.github.io/react-native/docs/asyncstorage.html "AsyncStorage - React Native"
[7]:	https://jwt.io/ "JWT.io"
[8]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/index.ios.js "reactnative-jwts - index.ios.js"

[image-1]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/docs/reactnative-jwts_api-test.png?raw=true "API Sample Test"
[image-2]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/docs/login.png?raw=true "Sign In Response"
[image-3]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/docs/quote.png?raw=true "Chuck Norris Quote"
[reactnative_logo]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/docs/react_native.png?raw=true "React Native Logo"
[jwt_io_logo]:	https://github.com/jeffreylees/reactnative-jwts/blob/master/docs/jwt_io.png?raw=true "JWT.io Logo"

