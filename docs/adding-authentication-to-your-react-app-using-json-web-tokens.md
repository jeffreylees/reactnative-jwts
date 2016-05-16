[https://www.npmjs.com/package/react-native-simple-router][1]

[https://www.npmjs.com/package/react-native-form-generator][2]


# Adding Authentication to Your React Native App Using JSON Web Tokens
You have many, many choices out there that can help you get user authentication into your React Native application. The advantages to using JWTs over other, more traditional authentication methods are many. The app will be stateless, and we don’t have to worry about issues like load balancing with sessions or cookie problems. We can authenticate users across multiple domains, integrate easily with other authentication services, and reduce the load on our servers. Sounds great, right?

Here’s the thing. We, as developers, don’t need more complication in our apps, in our projects, or in our lives. User authentication is always a pain. _Someone_ always wants more SSO options. _Someone_ always wants better security. _Someone_ always finds vulnerabilities. And yes, there are vulnerabilities in any system. But mitigating the _chances_ of problems of all kinds - technical problems, server problems, cookie problems, hacking problems - is what we’re all trying to do all the time, isn’t it? An easy-to-implement token based authentication system provides just that. If we’re building a React Native app, we are probably intending to cover multiple platforms with minimal changes. Let’s take it one step further and have the same stateless authentication procedures for all versions of our app, too. 

## What We’re Building
This tutorial will demonstrate how to authenticate our users to a React Native app using [JSON Web Tokens][3]. We’ll go ahead and use [this Auth0 sample API][4] as our app’s backend. We’ll be building a little app that deals in the ever-ubiquitous Chuck Norris quotes (Who doesn’t love a good Chuck Norris joke?), and we’ll be authenticating our users with JWTs, which will be the primary purpose of this tutorial.

OK, let’s get started with our setup.

## Setup and Installations
First, let’s set up a React Native app. We can start with a brand new one, for the purposes of this tutorial, so just spin up a new project. If you’re not familiar with React Native, the [documentation][5] has an excellent Getting Started page to help you get that set up. You’ll also want to go ahead and clone [this Auth0 sample API][6] backend, which employs Node.js, and get it running locally.

## Integrating With Our Backend
OK, so we have our backend downloaded and running locally. Let’s  hit the URL associated with it - by default `http://localhost:3001/api/random-quote`. This will reassure us that our backend that provides fun-filled Chuck Norris quotes is indeed working. OK, and here we go:

![Test of the JWT API Sample][image-1]

Next up, let’s take a look at our starter React Native app, which, if following the tutorial linked above, should look something like this:

 
	Paste of original React Native getting started app

So let’s now modify this to deal with our API, before we add in our authentication. In this case, our needs are rather simple. We just need to send our request to the above URL, and then collect the returned quote and display it.

[1]:	https://www.npmjs.com/package/react-native-simple-router
[2]:	https://www.npmjs.com/package/react-native-form-generator
[3]:	https://jwt.io/introduction/ "What are JSON Web Tokens?"
[4]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"
[5]:	https://facebook.github.io/react-native/docs/getting-started.html#content "React Native - Getting Started"
[6]:	https://github.com/auth0-blog/nodejs-jwt-authentication-sample "Auth0 JWT Sample Authentication API"

[image-1]:	http://i.imgur.com/7DJIdip.png "API Sample Test"