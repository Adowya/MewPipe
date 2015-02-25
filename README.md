# MewPipe

***

## Stack

* Persistence store: [MongoDB](http://www.mongodb.org/)
* Backend: [Node.js](http://nodejs.org/)
* Awesome [AngularJS](http://www.angularjs.org/) on the client

### Build

It is a complete project with a build system focused on AngularJS apps and tightly integrated with other tools commonly used in the AngularJS community:
* powered by [Gulp.js](http://gulpjs.com/)
* build supporting JS, CSS and AngularJS templates minification
* Css custom with SCSS templates processing integrated into the build


## Installation

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* I recommend to install nodemon, utility that will monitor for any changes in your source and automatically restart your server.

    ```
    npm install -g nodemon
    ```

### Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

```
git clone https://github.com/Adowya/MewPipe.git
cd MewPipe
```

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages. You need to install these:

* Install local dependencies (from the project root folder):

    ```
    cd API
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the API/package.json file)

* You need to install "ffmpeg" on your computer before run the API, you can download it here: [ffmpeg](https://www.ffmpeg.org/download.html)

### For Mac:
* copy `ffmpeg` and `ffprobe` to `/usr/bin`
* add `/usr/bin/ffmpeg` and `/usr/bin/ffprobe` to your `.bash_profile` in your home 
* Finaly run this command for reload the bash `source ~/.bash_profile`

### For Windows: 
* copy `ffmpeg` and `ffprobe` to `C:/User/YOUR_USERNAME/ffmpeg`
* add the full path to Environment variable ( http://www.computerhope.com/issues/ch000549.htm )


### Client App

Our client application is a straight HTML/Javascript application. Gulp relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies (from the project root folder):

    ```
    cd Client
    npm install
    ```

  (This will install the dependencies declared in the Client/package.json file)


* Install Javascript libraries essential for the projet ([AngularJS](http://www.angularjs.org/), [Moment](http://www.momentjs.com/), [jquery](http://www.jquery.com/) etc..). During the install if a question about the version of angular display, always choose the last version `1.3.6`.

    ```
    bower install
    cd ..
    ```

  (This will install the dependencies declared in the Client/bower.json file)



## Running

### Start the Server

* Run mongoDB 
    
   ```
   mongod
   ```

  (If you want application for represented all databases you can install [Genghis](http://www.genghisapp.com/))

* Run the server

    ```
    cd API
    node server.js
    cd ..
    ```

* Start the server at [http://localhost:8080]


### Start the Client

The default gulp task will compile all the files `scss` in directory styles in `style.css` and run the application at [http://localhost:3000] with a `refresh on change` to help on the devlopment.


    ```
    cd client
    gulp
    ```
    
* Open one browser and point them to [http://localhost:3000/]. But for login with OpenId you will connect to the port `8080`.



## Development

### Folders structure
At the top level, the repository is split into a Client folder and a API folder.  The client folder contains all the client-side AngularJS application. 

Within the client folder you have the following structure:
* `node_modules` contains build tasks for Gulp along with other, user-installed, Node packages
* `bower_components` contains Javascript libraries essential for the development 
* `scripts` contains application's sources
* `style` contains the css compile by the sass files
* `views` contains the views html of application
