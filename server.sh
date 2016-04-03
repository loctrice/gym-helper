#!/usr/bin/env bash

#this is a script for running a test server with python to ease development woes. 

#check to see if python is installed
command -v php >/dev/null 2>&1 || { 
    echo >&2 "You need to have php installed for this to work."; 
    exit 1; 
    }

#start the webserver in the current directory  on port 8000    
#python -m SimpleHTTPServer 8000
php -S 127.0.0.1:8000