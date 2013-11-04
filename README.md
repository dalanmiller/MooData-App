MooData-App
===========

This is the front-end application for MooData which we will develop using Yeoman and deploy via PhoneGap


##Requirements
* Install Nodejs/NPM (they come together) 
* `npm install -g phonegap` to install PhoneGap
* `npm install -g yo` to install Yeoman
* On Linux/Mac need to install `sudo gem install compass` - not sure how to do this on Windows or if it is possible. 

###Installing Ruby & Compass on Windows

* [First install Ruby](http://rubyinstaller.org/)
* [Then follow these instructions here to install compass](http://thesassway.com/beginner/getting-started-with-sass-and-compass)

##Running a local server

Just run `grunt server` in the root of the repository and your default web browser will be opened with the app running with `app/index.html` as the root of your application.

When using Yeoman previously, `grunt server` should automatically instantaneously reload based on any file changes it detects that you make to files in the `app` folder. 

##How this works

All the source files for the application exist in the `app` folder. All modifications should be made or added here for different source files. When you type `grunt server` or `grunt build` the application will be packaged and then put into the `phonegap` folder ready for distribution into your Android phone or the PhoneGap build service. 

If you have an android device or want to run the app on your emulator, change your current shell directory into phonegap (`cd phonegap`). You can now run `phonegap run` or `phonegap run android --emulator` to get the application to compile and go onto your device or emulator which will start if it isn't already open. 

##Handling issues 
Refer to the [issues page](https://github.com/dalanmiller/MooData-App/issues) where we will tackle and talk about issues transparently.

