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

## Getting Into It

So, we have our app all set up. 

[1]:	https://jwt.io/introduction/ "What are JSON Web Tokens?"
[2]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[3]:	https://facebook.github.io/react-native/docs/getting-started.html#content "React Native - Getting Started"
[4]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[5]:	https://github.com/gcanti/tcomb-form-native "Tcomb's Forms Library"

[image-1]:	http://i.imgur.com/7DJIdip.png "API Sample Test"