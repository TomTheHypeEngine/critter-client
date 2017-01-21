# Critter 
A simple Twitter Clone - available @ https://tomthehypeengine.github.io/critter-client/

## Development tools
Critter is developed with [Aurelia](https://www.aurelia.io), a next generation JavaScript framework that 
uses the latest JavaScript standards like ECMAScript 2016. 

Aurelia uses the [NodeJS](https://www.nodejs.org) Java Script Runtime.

Development was done with [JetBrains Webstorm](https://www.jetbrains.com/webstorm/)

## Requirements and Setup
NodeJs and npm must be installed on your PC. With npm you can install the aurelia cli tools to start development 

`npm install aurelia-cli -g`

Clone this repository and 

`npm install`

from the project root directory.

Start and run the aurelia app with

`au run --watch`

In order to actually register, log in and use features of the app you will also need my api found 
[here](https://github.com/TomTheHypeEngine/tweet-api)
along with its mongodb database. The path to the api is defined under `/src/services/fixtures.js`

## Features

In critter you can:
* Log in and register
* Make a tweet of a maximum length of 140 characters
* See the tweets of all users in a global timeline
* Follow certain users and find them quickly in a list of all users you ae following
* See the tweet timeline of only one user
* Delete your own tweets and edit your account data (password, name and email)

There is also a functionality for administrators (users with "admin": true attribute in the db) that allows them to:
* Delete any tweet from any user
* Reset the password of any user in case they lose it
* Mass delete all tweets of a single user
* Completely remove one user from Critter

## Developer
Thomas Hettrich aka [TomTheHypeEngine](https://github.com/TomTheHypeEngine) Student ID: 2830555

## Acknowledgment
This project was created as an assignment for the course Building Modern Web Applications 
using Node JS at the OTH Regensburg.

Special thanks to Professor [Eamonn de Leastar](https://github.com/edeleastar/) for creating and leading the course.
