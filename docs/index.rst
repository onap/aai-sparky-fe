.. This work is licensed under a Creative Commons Attribution 4.0 International License.

Sparky - Inventory UI Service
==============================

***************
Overview
***************

_Sparky_ is a service that interacts with AAI and provides users a UI to view and analyze AAI data. The main goal behind _Sparky_ is providing a more user friendly and clear view of AAI data.

This document covers cloning, installing, and running the front end (FE) portion of _Sparky_.

================
Getting Started
================


Building _Sparky_
------------------

Clone the _Sparky_ FE repository
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Repository name is sparky-fe

Install required tools
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Install node.js, including the Node Package Manager (NPM). Installing latest should be fun, but if that is causing issues then v6.10.1 will work.

Install python, v2.7.13

Install required packages
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Navigate to the top level project directory and run:

    > npm install

Run or Build the Project
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To run the project:

    > npm start

By default the local instance of the UI will be served to "https://localhost:8001/aai/#/viewInspect".

This can be configured in the file "webpack.devConfig.js".

To build the project (generates a .war file):

    > gulp build
    
The build will create a directory called "dist" and add the "aai.war" file into said dist directory.

If changes to the build flow are required, updating "webpack.config.js" and "gulpfile.js" will likely provide any build tuning required.

================
Dependencies
================

_Sparky_ UI requires:

- _Sparky_ instance that will serve the UI