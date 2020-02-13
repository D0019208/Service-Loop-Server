# Service Loop Server

This is the server used by the Service Loop app. I built the server architecture with a 3-tier achitecture design in mind. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
npm
NodeJS
Windows-Build-Tools (Optional if not getting 'gyp ERR!' when installing the modules)
```

### Installing

A step by step series of examples that tell you how to get a development env running

1.) Download or pull the repository

```
git pull origin master
```

2.) Install all node_modules by running the below command in the folder in which you pulled the repository

```
npm install
```

3.) In the node_modules folder, find the 'node-openssl-p12' module and in the lib folder open 'node-openssl-p12.js'. In this file, change the below code on line 14 to this.

Change this:
```
dirPath = '/home/d00192082/ServiceLoopServer'
```
To this:
```
dirPath = path.join( process.cwd(), 'ssl')
```

The reason for doing this is because 'path.join(process.cwd(), 'ssl')' gives the wrong path when trying to create a digital certificate through an Express path. The reason or even if my assumption as to what the error is might not be correct but this fixes the problem on the live server and in a production enviornment that fix will cause issues.

4.) In the node_modules folder, find the 'ringcaptcha-nodejs' module and in the lib folder open 'ringcaptcha.js'. In this file, change the below code on line 48 to this. 

Change this:
```
form: {app_key: this.app_key, phone: mobile, api_key: this.api_key, code: this.code, token: data.token}};
```
To this:
```
form: {app_key: this.app_key, phone: mobile, api_key: this.api_key, code: data.code, token: data.token}};
```

The reason for doing this is that module being used to implement the SMS verification code functionality has an error where when trying to verify a code, the module sets the code to undefined

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
