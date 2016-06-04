'use strict';
/* jshint undef: true, unused: true */
/* global angular */

/**
 * @ngdoc service
 * @name simceApp.MyDataService
 * @requires $q
 * @requires d3
 * @requires _
 * @requires $http
 *
 * @description
 * Demo
 *
 */
angular.module('tideApp')
.service('BlocklyService',['$rootScope','$q','$templateRequest','$log', 'd3', '_', '$http', '$timeout', 'SerialService', 'BoardService','VirtualBoardService', 'DeviceCommandService',
function($rootScope, $q, $templateRequest,$log, d3,_, $http, $timeout ,  SerialService, BoardService, VirtualBoardService, DeviceCommandService) {
  var myself = this;
 
  // Public functions
  myself.getOptions = getOptions;
  myself.runCode = runCode; 
  myself.stopCode = stopCode; 
  myself.setCodeXML = setCodeXML;

  // Local variables
  var workspace;
  var myInterpreter;
  var highlightPause = false;
  var physicalDevice = null;
  var virtualDevice = null;
  var paused = false;
  
  // Implementation of public functions (this.myfunction ...)
  // =========================================================
  
  /**
   * Runs code for a blockly workspace and ejecutes instructions in virtual and physica device (if available)
   * Code is run step by step by an interpreter and each block is higlighted
   */
  function runCode(_workspace) {
    workspace = _workspace;
    
    stop = false;
    
    // Configutarion of block higlighting functionality
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    
    // Gets javascript version of the code    
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    
    // Create the interpreter for our JS code
    myInterpreter = new Interpreter(code, initApi);
    
    highlightPause = false;
    workspace.traceOn(true);
    workspace.highlightBlock(null);
    
    // Start running the code!!
    stepCode();

  }
  
   /**
   * Pauses the currently running code
   */
  function stopCode() {
    stop = true;
  }

  
  
  // Executes each step of the code until there is now steps left
  function stepCode() {
    try {
      if (!stop) {
        var ok = myInterpreter.step();
      } else {
        var ok = false;
        stop = false;
      }
    } finally {
      if (!ok) {
        // Program complete or stopped, no more code to execute.
        //document.getElementById('stepButton').disabled = 'disabled';
        workspace.highlightBlock(null);
        $rootScope.$broadcast("blockly.codeCompleted");
        
        return;
      }
    }
    
    // No wait between each step (this can be increased for educational/monitoring purposes)
    $timeout(0).then(stepCode);

  }


  
  function getOptions(toolboxPath) {
    var deferred = $q.defer();
    
    toolboxPath = toolboxPath ? toolboxPath : "./blocks.xml";
    
    $templateRequest(toolboxPath)
    .then(function(toolboxXML) {
      // Build toolbok
      var options = {
        media: './media/', 
        toolbox: toolboxXML,
        zoom:
         {controls: true,
          wheel: false,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
        trashcan: true};
      
      deferred.resolve(options);
    });
    
    return deferred.promise;
  }
  
  /**
   * Sets a block definition in the respective workspace
   */
  function setCodeXML(workspace,codeXML) {
    
    // If no code is given, assume defaultt
    codeXML =  codeXML ? codeXML :
          '<xml>' +
          '  <block type="light_on" deletable="true" x="70" y="70">' +
          '  </block>' +
          '</xml>';

    loadBlocks(workspace, defaultXml);

  }
  
  // Implementation of private functions (not accesible fromoutside the service)
  // =========================================================

  /**
   * Definition of blockly interpreter API for firstmakers
   * 
   * The interpreter executes javascript code in a sandbox (it cannot call functions defined in the browser or nodejs).
   * In order to call the functions we need (for example to controll an arduino board), we
   * we need to define an API with teh definition of each 'external' function that is called from the
   * blockly blocks.
   * 
   * Functions can be sync functions (directly returns a value) or async functions (value is returned 
   * at a later time through a callback).
   * 
   * In the interpreter we set a property for each function name, and asign either a NativeFunction (sync) or AsyncFunction (async)
   * 
   * Example:  
   *  - interpreter.setProperty(scope, 'ligth', interpreter.createNativeFunction(wrapper)) 
   *  - interpreter.setProperty(scope, 'temperature', interpreter.createAsyncFunction(wrapper)) 
   * 
   * The wrapper is a function that has to be defined for each new function.  It receives the parameters in an internal format, and 
   * have to be converted to the right type.
   * It returns a Primitive with the result of the function.
   * 
   * Example for sync functions:
   *  wrapper = function(state) {
   *   state = state ? state.toBoolean() : true;
   *   return interpreter.createPrimitive(setLight(state));
   *  };
   * 
   * For the case of async functions, the wrapper receives a callback in the last argument
   * and the Primitive has to be created/called as the callback parameters
   * 
   * Example for async functions:
   *  wrapper = function(callback) {
   *    getTemperature(function(value) {
   *       callback(interpreter.createPrimitive(value));
   *     })
   *  };
   */
  function initApi(interpreter, scope) {
    var wrapper;
    
    // getXhr() block.
    var wrapper = function getXhr(href, callback) {
      
      href = href ? href.toString() : '';
      $log.debug(href)
      var req = new XMLHttpRequest();
      req.open('GET', href, true);
      req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
          $log.debug(req.reponseText)
          callback(interpreter.createPrimitive("req.responseText"));
        }
      };
      req.send(null);
    };
    interpreter.setProperty(scope, 'getXhr',
        interpreter.createAsyncFunction(wrapper));
    
    
    // alert() block.
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(wrapper));

    // prompt() block.
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));
    
    // potentiometer() block.
    wrapper = function(callback) {  
      DeviceCommandService.potentiometer()
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      })
    };
    
    interpreter.setProperty(scope, 'fm_potentiometer',
        interpreter.createAsyncFunction(wrapper));
    
    // temperatureSensor()
    wrapper = function() {  
      var value = DeviceCommandService.temperatureSensor();
      return interpreter.createPrimitive(value);
    };
    
    interpreter.setProperty(scope, 'fm_temperatureSensor',
        interpreter.createNativeFunction(wrapper));
        
    // lightSensor()
    wrapper = function() {  
      var value = DeviceCommandService.lightSensor();
      return interpreter.createPrimitive(value);
    };
    
    interpreter.setProperty(scope, 'fm_lightSensor',
        interpreter.createNativeFunction(wrapper));         
    
    // audioSensor()
    wrapper = function() {  
      var value = DeviceCommandService.audioSensor();
      return interpreter.createPrimitive(value);
    };
    
    interpreter.setProperty(scope, 'fm_audioSensor',
        interpreter.createNativeFunction(wrapper)); 
           
   // humiditySensor()
    wrapper = function() {  
      var value = DeviceCommandService.humiditySensor();
      return interpreter.createPrimitive(value);
    };
    
    interpreter.setProperty(scope, 'fm_humiditySensor',
        interpreter.createNativeFunction(wrapper)); 
              
    // infraredSensor()
    wrapper = function() {  
      var value = DeviceCommandService.infraredSensor();
      return interpreter.createPrimitive(value);
    };
    
    interpreter.setProperty(scope, 'fm_infraredSensor',
        interpreter.createNativeFunction(wrapper)); 
           

        
    // fm_button()
    wrapper = function(callback) {  
      DeviceCommandService.button()
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      })
    };
    
    interpreter.setProperty(scope, 'fm_button',
        interpreter.createAsyncFunction(wrapper));
        
    // light(state)
    wrapper = function(state) {
      state = state ? state.toBoolean() : true;
      return interpreter.createPrimitive(DeviceCommandService.light(state));
    };
    interpreter.setProperty(scope, 'fm_light',
        interpreter.createNativeFunction(wrapper));

    // digitalWrite(pin,state)
    wrapper = function(pin,value) {
      pin = pin ? pin.toNumber() : 13;
      value = value ? value.toBoolean() : false;

      return interpreter.createPrimitive(DeviceCommandService.digitalWrite(pin,value));
    };
    interpreter.setProperty(scope, 'fm_digitalWrite',
        interpreter.createNativeFunction(wrapper));

    // digitalRead(pin).
    wrapper = function(pin, callback) {  
      pin = pin ? pin.toNumber() : 2;
      DeviceCommandService.digitalRead(pin)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      })
    };
    
    interpreter.setProperty(scope, 'fm_digitalRead',
        interpreter.createAsyncFunction(wrapper));
        
    // analogRead(pin).
    wrapper = function(pin, callback) {  
      pin = pin ? pin.toNumber() : 0;
      DeviceCommandService.analogRead(pin)
      .then(function(value) {
        callback(interpreter.createPrimitive(value));
      })
    };
    
    interpreter.setProperty(scope, 'fm_analogRead',
        interpreter.createAsyncFunction(wrapper));


    // buzzer(state)
    wrapper = function(state) {
      state = state ? state.toBoolean() : true;
      return interpreter.createPrimitive(DeviceCommandService.buzzer(state));
    };
    interpreter.setProperty(scope, 'fm_buzzer',
        interpreter.createNativeFunction(wrapper));

    // say(text)
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(window.alert(text));
    };
    interpreter.setProperty(scope, 'fm_say',
        interpreter.createNativeFunction(wrapper));
      
    // wait(time)  
    wrapper = function(time, callback) {
      time = time ? time.toNumber() : 0;
      wait(time, function() {
        callback(interpreter.createPrimitive(null));
      })
    };
    interpreter.setProperty(scope, 'fm_wait',
        interpreter.createAsyncFunction(wrapper));
        
    // highlightBlock(id)
    wrapper = function(id) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));    
  }


  function loadBlocks(workspace, defaultXml) {
    try {
      var loadOnce = window.sessionStorage.loadOnceBlocks;
    } catch(e) {
      // Firefox sometimes throws a SecurityError when accessing sessionStorage.
      // Restarting Firefox fixes this, so it looks like a bug.
      var loadOnce = null;
    }
    if (loadOnce) {
      // Language switching stores the blocks during the reload.
      delete window.sessionStorage.loadOnceBlocks;
      var xml = Blockly.Xml.textToDom(loadOnce);
      Blockly.Xml.domToWorkspace(xml, Plane.workspace);
    } else if (defaultXml) {
      // Load the editor with default starting blocks.
      var xml = Blockly.Xml.textToDom(defaultXml);
      Blockly.Xml.domToWorkspace(xml, workspace);
    }
    workspace.clearUndo();
  };


  /**
   * Implementations of "external" functions that are not device related
   * Other - device related - functions are implemented in DeviceDommandService (deviceCommand.service.js)
   */
  function highlightBlock(id) {
    workspace.highlightBlock(id);
    highlightPause = true;
  }
        
  var wait = function(time, callback) {
    $timeout(time)
    .then(function() {
      callback()
    });
  };
        
}])




