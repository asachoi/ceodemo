/* jshint debug: true,  devel: true, browser: true, node: true, jquery: true */

/*
 *
 * Author: Aqeel
 * Copyright: Aleph Labs
 * DOC: 25th April 2015
 * LUP: 29th April 2015
 *
 */

'use-strict';

//once the page has been parsed and the DOM is ready to be manipulated
document.addEventListener("DOMContentLoaded", function () {

    window.Manulife = window.Manulife || {};
    window.Manulife.loadJSON = function (path, success, error) {
        var xhr = new XMLHttpRequest();
        /*
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                 if (xhr.status === 0){
                    //this is deployed in Ipad. assume always successful
                    setTimeout(function(){
                        success(JSON.parse(xhr.responseText));
                    }, 1000);
                }
                else if (xhr.status === 200) {
                    //successful and deployed in the web
                    if (success) {
                        success(JSON.parse(xhr.responseText));
                    }
                } else {
                    //error
                    if (error) {
                        error(xhr);
                    }
                }
            }
        };*/
        xhr.onreadystatechange = function () {
           if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 0){
                   //this is deployed in Ipad. assume always successful
                   setTimeout(function(){
                       success(JSON.parse(xhr.responseText));
                   }, 1000);
               }
               else if (xhr.status === 200) {
                   //successful and deployed in the web
                   if (success) {
                       success(JSON.parse(xhr.responseText));
                   }
               } else {
                   //error
                   if (error) {
                       error(xhr);
                   }
               }
           }
       };
        xhr.open("GET", path, true);
        xhr.send();
    };
    window.Manulife.shell = {};

    //show loader
    window.Manulife.loader = document.getElementsByClassName("loader-overlay")[0];
    window.Manulife.loader.style.display = 'block';

    //fetch app.json and parse
    window.Manulife.loadJSON("../script/app.json", function (data) {
        window.Manulife.shell = data;
        if (window.Manulife.shell.isDeveloperMode) {
            window.Manulife.loadScriptsSync(window.Manulife.shell.developerScripts, []);
        } else {
            var productionTag = document.createElement("script");
            productionTag.setAttribute("src", window.Manulife.shell.productionScript);
            document.body.appendChild(productionTag);
        }
    }, function (error) {
        console.log(error);
    });

    //load scripts synchronously, one after other
    window.Manulife.loadScriptsSync = function (_scripts, scripts) {
        var index = 0;
        var loopArray = function (_scripts, scripts) {
            // call itself
            window.Manulife.loadScript(_scripts[index], scripts[index], function () {
                // set index to next item
                index = index + 1;
                // any more items in array?
                if (index < _scripts.length) {
                    loopArray(_scripts, scripts);
                }
            });
        };
        loopArray(_scripts, scripts);
    };

    //create script tags
    window.Manulife.loadScript = function (source, script, callback) {
        script = document.createElement('script');
        script.onerror = function () {
            // handling error when loading script
            console.error('Network Error: Please try again...');
            //alert error on ipad
            alert('Network Error: Please try again...');
        };
        script.onload = function () {
            console.info(source + ' loaded ');
            callback();
        };
        script.src = source;
        document.body.appendChild(script);
    };

    // window.addEventListener("statusTap", function() {
    //     window.history.back();
    // });

});

//When the page is fully loaded including all the assets and stuff
window.addEventListener("load", function () {
    //simulate client-server comm and hide the loader
    setTimeout(function () {
        window.Manulife.loader.style.display = "none";
    }, 1500);
});
