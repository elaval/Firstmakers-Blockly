'use strict';
/* jshint undef: true, unused: true */
/* global angular */




/**
 * @ngdoc controller
 * @description
 *
 * Main Controller
 *
 */
angular.module('tideApp')
.controller('AppController', ['$scope','$http','$timeout','$log','$q','$window',
        '$interval','$uibModal','$translate','_','d3', 'BlocklyService', 
        'BoardService','SerialService','VirtualBoardService',
        'DeviceService','DeviceCommandService', 'authService','dataService', 'nameGeneratorService',
        'mqttService',
    function ($scope,$http,$timeout,$log,$q,$window,
        $interval,$uibModal,$translate,_,d3, BlocklyService, 
        BoardService,SerialService, VirtualBoardService,
        DeviceService, DeviceCommandService, authService, dataService, nameGeneratorService,
        mqttService) 
    {
	var myself = this;


    /**
     * Warning
     * 
     * app.config.js defines an http interceptor that injects an access_toke to any http request
     * based on stored access_token
     * 
     * For some requests (local templates, svg, json files) the token is not needed and
     * an excemption must explicitly defined in the code.
     * 
     * The first time the code is run no access_tokes has been created and this interceptor could generate an error
     * if the excemtion has not been placed
     */
    
    // Public functions (accesible from the view)
    myself.runCode = runCode
    myself.stopCode = stopCode
    myself.disconnectBoard = disconnectBoard
    myself.scanPorts = scanPorts;
    myself.softReset = softReset;
    myself.changeLanguage = onChangeLanguage;
    myself.onInjected = onInjected;
    myself.clearBlocks = clearBlocks;
    myself.updateBlocks = updateBlocks;
    myself.openFile = openFile;
    myself.saveAsFile = saveAsFile;
    myself.onKeyDown = onKeyDown;    
    myself.onKeyUp = onKeyUp;
    myself.manageSketches = manageSketches;
    myself.saveSketch = saveSketch;
    myself.signOut = signOut;
    myself.signIn = signIn;


    // Public attributes
    this.username = null;
    this.sketchTitle = null;

    const spawn = require('child_process').spawn;
    /*
    const ls = spawn('/Users/elaval/Downloads/Arduino-2.app/Contents/MacOS/Arduino', ['--upload', '/Users/elaval/Documents/TIDE\ Proyectos/FirstmakersBlockly/New\ Firstmakers\ Blockly/dev/firstmakers\ blockly.app/Contents/Resources/app.nw/sketches/StandardFirmata/StandardFirmata.ino']);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    */


    // Public properties (accesible from the view)
    myself.workspace = null; // Blockly workspace generated by <blockly> directive
    myself.statusMessageText; // Message to be displayed to the user
    myself.boardState = {
        connected: false,
        connecting: false,
        port:null,
    }
    
    myself.blocklyOptions = null;
    myself.virtualBoard = null;
    myself.physicalBoard = null;
    myself.running = false; // The code is running

    // Platform/Architecture - used to identify win 32 architecture (it has some issues detecting disconnections)
    myself.platform = process.platform;
    myself.arch = process.arch;
    
    // Local variables/properties
    var physicalDevice = null;
    var virtualDevice = null;
    var pinState = {};
    var recentClick = false;
   
    // Init controller
    activate()
    
    // Controler's 'constructor'
    function activate() {
        // Attempt to Sign In using stored tokens
        // If succesful, a signIn event will be received
        authService.signInWithToken();        
        
        // Retreive stored language definition
        var langKey = $translate.storage().get($translate.storageKey());
        if (!langKey) langKey = "es";
        
        setLanguage(langKey)
        .then(function() {
            initBlockly();
        })
        
        myself.virtualBoard = VirtualBoardService.createVirtualBoard();

        virtualDevice = DeviceService.createDevice(myself.virtualBoard);
        DeviceCommandService.setVirtualDevice(virtualDevice);

        configureDeviceName();
        
        scanPorts();
    }
 
    // Implementation of public methods
    // ==================================
    
    $interval(function() {
        updateBlocks();
        publishBoardValues();
    }, 100);
    
    $scope.connect = function(port){
        //alert('connecting port'+ port);
        var ports = [port];
        connectBoard(ports);
    }  
    
    /**
     * updates customValues in blocks
     */
    function updateBlocks() {
        if (physicalDevice) {

            var blocks = myself.workspace.getAllBlocks();
            for (var i = 0, block; block = blocks[i]; i++) {
                block.updateSensor && block.updateSensor(physicalDevice.sensorValues());
            }
        }
    }

    /**
     * Update board values publications through mqtt
     */
    function publishBoardValues() {
        if (physicalDevice) { 
            mqttService.publishPinValues(myself.deviceName,physicalDevice.sensorValues().pins)
        } else if (virtualDevice) {
            mqttService.publishPinValues(myself.deviceName,virtualDevice.sensorValues().pins)
        }
    
    }

    /**
     * Runs the Blockly code
     */
    function runCode() {
        BlocklyService.runCode(myself.workspace);
        myself.running = true;
    }
    
     /**
     * Pauses the Blockly code
     */
    function stopCode() {
        BlocklyService.stopCode(myself.workspace);
        myself.running = false;
    }
    
    /**
     * Disconnects a physical board
     */
    function disconnectBoard() {
        BoardService.disconnect(true);
    }
    
    /**
     * Resets the program 
     */
    function softReset() {
        disconnectBoard();
        window.location.reload();
    }
    
    /**
     * Scans for available ports and if found, attempts to open a new board
     */
    function scanPorts() {
        SerialService.Serial.detect(function(ports) {
            $scope.devices = ports;
            connectBoard(ports);
        });
    }
    
    /**
     * Function to be called when a change language action (ie menu selection) is triggered
     */
    function onChangeLanguage(langKey) {
        setLanguage(langKey)
        .then(function() {
            initBlockly();
        })
    }
    
    
    /**
     * Sets the interface language
     */
    function setLanguage(langKey) {
        var deferred = $q.defer();
        
        myself.selectedLanguage = langKey;
        $translate.use(langKey);
      
         // Load Blockly's language strings.

        // Load msg definitions for the specified language (Ex msg/js/en.js)
        $http.get('./bower_components/google-blockly/msg/js/'+langKey+'.js')
        .then(function(res) {
            var blocklyMainMsgCode = res.data;
            eval(blocklyMainMsgCode);
            
            // Load firstmakers msg definitions for the specified language (Ex msg/js/en.js)
            return $http.get('./translations/firstmakersBlocks/'+langKey+'.js')
        })
        .then(function(res) {
            var blocklyFirstmakersMsgCode = res.data;
            eval(blocklyFirstmakersMsgCode);
            deferred.resolve();
        })
        .catch(function(err) {
            deferred.reject(err);
        }) 
        
        return deferred.promise;
    }


    // Implementation of private methods
    // ==================================
   

    function statusMessage() {
        var msg = "";
        
        if (myself.boardState.connected) {
            msg = "STATUS_MESSAGE_CONNECTED";
        } else if (!myself.boardState.connected && myself.boardState.connecting) {
            msg = "STATUS_MESSAGE_CONNECTING";
        } else {
            msg = "STATUS_MESSAGE_NOT_CONNECTED";
        }
        
        return msg;
    }
    
    /**
     * Creates Blockly options and initiates Blockly workspace/stage
     */
    function initBlockly() {
        var options
        
        BlocklyService.getOptions("./toolbox.xml")
        .then(function(_options){
            options = _options;
            
            return translateToolboxCategories(options.toolbox);
        })
        .then(function(translatedToolbox) {
            
            options.toolbox = translatedToolbox;
            
            myself.blocklyOptions = options;
            //$log.debug(myself.blocklyOptions);
        })
    }
    
    /**
     * Load blocks into the worplspace
     * 
     * If an valid sketch is given (for example retreived form the cloud), that sketch will be loaded.
     * 
     * If not, and there is a valid sketch previously stored in localstorage, that sketch will be laoded.
     * 
     * If none of the above, a default skecth will be loaded.
     * 
     * @param {string} sketch.
     * 
     * sketcj is an object with the following attributes:
     * {
     *  id: unique id for this user,
     *  title: sketcth title,
     *  blocks: string representation of blocks xml
     * }
     * 
     * If 
     */
    function loadBlocks(sketch) {
        //$log.debug(sketch);

        var id, title, blocks;

        if (sketch && sketch.id) {
            blocks = sketch.blocks;
            $window.localStorage.sketchTitle = sketch.title;
            $window.localStorage.sketchId = sketch.id;
            myself.sketchTitle = sketch.title;
        } else {
            try {
                blocks = $window.localStorage.savedBlocks;
                title = $window.localStorage.sketchTitle;
                myself.sketchTitle = title;
            } catch(e) {
                // Assume default sketch
                blocks = '<xml>' +
                '  <block type="light_on" deletable="true" x="70" y="70">' +
                '  </block>' +
                '</xml>';

                $translate('UNTITLED').then(function (title) {
                    $window.localStorage.sketchTitle = title;
                });
                $window.localStorage.sketchId = "";
            }
        }

        var xml = Blockly.Xml.textToDom(blocks);
        myself.workspace.clear();
        Blockly.Xml.domToWorkspace(xml, myself.workspace);
    };
    
    /**
     * Save the current blocks - in the workspace - in the browsers localStorage.
     */
    function saveBlocks() {
        if (typeof Blockly != 'undefined' && myself.workspace) {
            var xml = Blockly.Xml.workspaceToDom(myself.workspace);
            var text = Blockly.Xml.domToText(xml);
            $window.localStorage.savedBlocks = text;
        }
    }
    
    /**
     * Clears blocks from the workspace
     */
    function clearBlocks() {
        $translate('CONFIRM_CLEAR_MSG').then(function (messageTxt) {
            if (myself.workspace && confirm(messageTxt)) {
                myself.workspace.clear();
                $window.localStorage.removeItem('savedBlocks');

            }
        });

    }
    
    /**
     * Called each time the workspace changes assignec to change listener in onInjected
     */
    function onWorkspaceChange(e) {
        if (e.element=="click") {
            if (recentClick) {
                //This is a double click;
                BlocklyService.runCode(myself.workspace, e.blockId)
            }
            
            // Remember this click for 300 ms
            recentClick = true;
            $timeout(300)
            .then(function() {
                recentClick = false;
            })
        }
        
        saveBlocks();
    }
    
    /**
     * Function called (from blockly directive) when a new blockly definition & workspace is created
     */
    function onInjected(workspace) {
        myself.workspace = workspace;
        
        // Listen to changes in the workspace & call onChangeWorkspace 
        myself.workspace.addChangeListener(onWorkspaceChange);
   
    
        loadBlocks();
    }
    
    /**
     * Attempts to connect available ports
     */
    function connectBoard(ports) {
        var firstPort = ports[0];
        myself.boardState.connecting = true;
        myself.boardState.port = firstPort;
        
        BoardService.connect(firstPort)
        .then(function(board) {
            // Successful connection with first port!! (Yeah)
            myself.physicalBoard = board;
             
            physicalDevice = DeviceService.createDevice(myself.physicalBoard);
            connectionSignal(physicalDevice);
            physicalDevice.activatePinMonitor();
            
            DeviceCommandService.setPhysicalDevice(physicalDevice);
            
            myself.boardState.connecting = false;
            myself.boardState.connected = true;
        })
        .catch(function(err) {
            // Unsuccesful connection to first port
            // Let's 'lock' it and try with the rest of the ports
            myself.boardState.connecting = false;
            myself.boardState.connected = false;
            
            // TODO: Check if error seems to correspond to a non-firmata valid board or a "hanged" port and send a message
            SerialService.Serial.lock(firstPort);
            if (ports.length > 1) {  
                // Removes first port from the list of ports and tries again
                ports = _.rest(ports);
                connectBoard(ports);
            } else {
                // We tried - unsuccessfully with all ports, let's scan again 
                scanPorts();
            }
            $log.error(err);
        });
    }
    
    /**
     * Connection signal
     * Visible/audible signal to indicate a successful board connection
     */
    function connectionSignal(device) {
        device.buzzer(true);
        device.light(true);
        $timeout(10)
        .then(function() {
            device.buzzer(false);
            device.light(false); 
        })

        
    }
    
    /**
     * Translates names of toolbox categories
     * Returns a promise to the translated xml text
     */
    function translateToolboxCategories(toolboxText) {
        var deferred = $q.defer();
        
        var xml = Blockly.Xml.textToDom(toolboxText);
        //$log.debug(xml);
        
        var translationPromises = [];
        
        // Transtale name attributes in toolbox definition
        // Ej <category name="CAT_TEXT">
        _.each(xml.getElementsByTagName("category"), function(node) {
            translationPromises.push(translateNodeName(node));
        })
        
        // Transtale TEXT field content in toolbox definition
        // Ej <field name="TEXT">MY_CONTENT</field>
        _.each($(xml).find("field[name='TEXT']"), function(node) {
            translationPromises.push(translateNodeText(node));
        })
        
        $q.all(translationPromises)
        .then(function(res) {
            //$log.debug(res);
        })
        .catch(function(err) {
            $log.error(err);
        })
        .finally(function(d) {
            //$log.debug(d);
            //$log.debug(xml);
            var toolboxText = Blockly.Xml.domToText(xml);
            //$log.debug(toolboxText);
            deferred.resolve(toolboxText);
        })
        
        return deferred.promise;
        
    }
    
    /**
     * Translate the name attribute of an xml node 
     * Returns a promise to the translated node
     */
    function translateNodeName(node) {
        var deferred = $q.defer();
        
        var originalName = node.getAttribute("name");
        $translate(originalName)
        .then(function(translatedName) {
            node.setAttribute("name", translatedName);
            deferred.resolve(node);
        })
        .catch(function(err) {
            deferred.reject(err);
        })
        
        return deferred.promise;
    }
    
    /**
     * Translate the name attribute of an xml node 
     * Returns a promise to the translated node
     */
    function translateNodeText(node) {
        var deferred = $q.defer();
        
        var originalText = $(node).text();
        $translate(originalText)
        .then(function(translatedText) {
            $(node).text(translatedText);
            deferred.resolve(node);
        })
        .catch(function(err) {
            deferred.reject(err);
        })
        
        return deferred.promise;
    }
    
    
    /**
     * Open file
     */
    function openFile() {
        //alert(myself.file);
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            var xml = Blockly.Xml.textToDom(reader.result);
            Blockly.Xml.domToWorkspace(xml, myself.workspace);
        }, false);
        reader.readAsText(myself.file);
    }
    
    /**
     * Save as 
     */
    function saveAsFile() {  
        var xml = Blockly.Xml.workspaceToDom(myself.workspace);
        var text = Blockly.Xml.domToText(xml);
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob);
    }
    
    /**
     * Handles board.closed event 
     * Triggered when board is disconnected (cable pulled)
     * or when the board is automatically closed (for example due to an errror)
     */
    $scope.$on("board.closed", function(e,a) {
        myself.boardState.connected = false;
        
        physicalDevice = null;
        DeviceCommandService.setPhysicalDevice(physicalDevice);
        myself.physicalBoard = null;
        
        scanPorts();
        //$log.debug(a);
    })
    
    /**
     * Handles blockly.codeCompleted
     * Triggered when the code has finished its execution by the javascript interpreter
     */
    $scope.$on("blockly.codeCompleted", function() {
        myself.running = false;
    });
    

    /**
     * Firstmakers sensor
     */
    function firstmakersSensor() {
        var board;
        var sensors = {};
        
        sensors.setBoard = function(_board) {
            board = _board;
            
            return sensors
        }
        
        sensors.potentiometer = function() {
            var pinValue = board && board.pins ? board && board.pins[19].value : 0;
            var value = Math.floor(100*pinValue/1023);
            
            return value; 
        }
        
        return sensors
    }
    
    function onKeyDown(e) {
        var rootBlock = null;
        var blocks = myself.workspace.getTopBlocks(false);
        for (var i = 0, block; block = blocks[i]; i++) {
            if (block.type == 'on_key' && block.getFieldValue("KEY").toLowerCase() == String.fromCharCode(e.which).toLowerCase()) {
            rootBlock = block;
            }
        }
        
        if (rootBlock) {
            BlocklyService.runCode(myself.workspace, rootBlock.id)
        }
        
        
        myself.pressedKey = String.fromCharCode(e.which)
        //$log.debug(e);
    }
        
    function onKeyUp(e) {
        myself.pressedKey = null;
        //$log.debug(e);
    }
    
    
    /**
     * Modal window (for future use)
     */
    var open = function (size, ports) {

        var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/modal.html',
        controller: 'ModalInstanceCtrl',
        size: size ? size : 'sm',
        resolve: {
            items: function () {
                return ports;
            }
        }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    
    $scope.$watch(statusMessage,
        function handleStatusChange( newValue, oldValue ) {
            myself.statusMessageText = newValue;
            //$log.debug( "statusMessage", newValue );
        }
    );
    

    /*********************************
     * Sing In / Out / Up functionality
     *********************************/
    
        // Public methods


    $scope.$on('signIn', function(evt, username) {
        myself.username = username;

        mqttService.notifySignin();
    })

    $scope.$on('signOut', function() {
        myself.username = null
    })

    /**
     * Initiates signout procedure
     */
    function signOut() {
        authService.signOut();
    }

    /**
     * Triggers signIn modal window
     */
    function signIn(size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modals/login/login.html',
            controller: 'LoginController as controller',
            size: size,
            resolve: {
            }
        });

        modalInstance.result.then(function (credentials) {
            if (credentials.registration) {
                alert("Reg "+ credentials.email + credentials.username + credentials.password)
            } else {
                authService.signIn(credentials.email, credentials.password)
            }
            
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    /**
     * manageSketches
     */
    function manageSketches(size) {

        // Check if user is signed In 
        if (myself.username) {

            dataService.getSketches()
            .then(function(sketches) {
                myself.sketches = sketches;
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modals/open/open.html',
                    controller: 'OpenController as controller',
                    size: size,
                    resolve: {
                        sketches: function () {
                            return myself.sketches;
                        }
                    }
                });

                modalInstance.result.then(function (sketch) {
                    // Load the editor with previously saved blocks.
                    loadBlocks(sketch);;                
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            })
        
        } else {
            $translate("MUST_SIGN_IN_WARNING")
            .then(function(text) {
                alert(text);
            })
        }
        
    }

    /**
     * saveSketch
     */
    function saveSketch() {

        // Check if user is signed In 
        if (myself.username) {

            var xml = Blockly.Xml.workspaceToDom(myself.workspace);
            var blocks = Blockly.Xml.domToText(xml);
            var id = $window.localStorage.sketchId ? $window.localStorage.sketchId : null;
            var title = $window.localStorage.sketchTitle ? $window.localStorage.sketchTitle : null ;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'modals/save/save.html',
                controller: 'SaveController as controller',
                size: null,
                resolve: {
                    sketch: function () {
                        return {
                            id : id,
                            title: title,
                            blocks: blocks
                        };
                    }
                }
            });

            modalInstance.result.then(function (sketch) {
                $window.localStorage.sketchTitle = sketch.title;
                myself.sketchTitle = sketch.title;
                
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        } else {
            $translate("MUST_SIGN_IN_WARNING")
            .then(function(text) {
                alert(text);
            })
        }

    }

    /**
     * configure deviceName
     * If no name has been given to the device (connected board), we will generate a random
     * name and store it for next sessions
     * 
     */

    function configureDeviceName() {

        if ($window.localStorage.deviceName) {
            myself.deviceName = $window.localStorage.deviceName;
        } else {
            myself.deviceName = nameGeneratorService.createName();
            $window.localStorage.deviceName = myself.deviceName;
        }
        
    }
                
                
}]);

angular.module('tideApp')
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
