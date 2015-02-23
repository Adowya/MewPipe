MewPipe
=======

You need to install "ffmpeg" on your computer before run the API, you can download it here: https://www.ffmpeg.org/download.html

### For Mac:
* copy "ffmpeg" and "ffprobe" to /usr/bin
* add "/usr/bin/ffmpeg" and "/usr/bin/ffprobe" to your .bash_profile in your home 
* source ~/.bash_profile
* 
### For Windows: 
* copy "ffmpeg" and "ffprobe" to C:/User/YOUR_USERNAME/ffmpeg
* add the path to Environment variable ( http://www.computerhope.com/issues/ch000549.htm )

## Running API
* Before run mongoDB with `mongod`
* In the directory Mewpipe/Api run `node server.js` or `nodemon server.js`

## Running Client
* In the directory Mewpipe/Client install dependencies with `npm install` and `bower install`
* Finaly run `gulp` and the projet start on port 3000 you will use the port 8080 for login
