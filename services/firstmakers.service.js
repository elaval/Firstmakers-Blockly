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
.service('FirstmakersService',['$rootScope','$q','$templateRequest', 'd3', '_', '$http', '$timeout', 'SerialService', 'BoardService','VirtualBoardService', function($rootScope, $q, $templateRequest, d3,_, $http, $timeout ,  SerialService, BoardService, VirtualBoardService) {
  var myself = this;
 
  myself.setWorkSpace = setWorkSpace;
  myself.getOptions = getOptions;
  myself.runCode = runCode; 
  myself.runCode2 = runCode2;  
  myself.showCode = showCode;
  myself.init = init;

  var workspace;
  var myInterpreter;
  var highlightPause = false;
  var physicalDevice = null;
  var virtualDevice = null;
  

  function setWorkSpace(_workspace) {
    workspace = _workspace;
  }
  
  function getOptions() {
    var deferred = $q.defer();
    
    $templateRequest("./blocks.xml")
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
  
  // Constructor
  function init() {
    
      // Load Blockly toolbox definition from blocks.xml
      $templateRequest("./blocks.xml")
      .then(function(toolboxXML) {
        // Build toolbok
        /*
        workspace = Blockly.inject('blocklyDiv',
        {media: './media/',
        toolbox: toolboxXML});
        */
        
        // Load default code
        var defaultXml =
          '<xml>' +
          '  <block type="light_on" deletable="true" x="70" y="70">' +
          '  </block>' +
          '</xml>';
        //loadBlocks(defaultXml);

        // Start port detection;
        //detectPort();
      });

  }
  
  function getBoardState() {
    return arduino;
  }

      
  Blockly.Blocks['say_hi'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("decir hola");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip('');
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['say_hi'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'say("Hola!");\n';
    return code;
  };
    
  Blockly.Blocks['light_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("prender luz");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip('');
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_on'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'light(true);\n';
    return code;
  };
  
  Blockly.Blocks['light_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("apagar luz");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip('');
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_off'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'light(false);\n';
    return code;
  };
  
  Blockly.Blocks['wait'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("esperar 1 seg");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip('');
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['wait'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'wait(1000);\n';
    return code;
  };

  Blockly.Blocks['elm1'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Hola");
      this.setColour(260);
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    }
  };
  
  Blockly.JavaScript['elm1'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'test();\n';
    return code;
  };
  
  

  function runCode2(_workspace, _virtualDevice, _physicalDevice) {
    workspace = _workspace;
    virtualDevice = _virtualDevice;
    physicalDevice = _physicalDevice;
    
    // Configutarion of block higlighting functionality
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    myInterpreter = new Interpreter(code, initApi);
    
    highlightPause = false;
    workspace.traceOn(true);
    workspace.highlightBlock(null);
    
    
    function stepCode() {
      try {
        var ok = myInterpreter.step();
      } finally {
        if (!ok) {
          // Program complete, no more code to execute.
          //document.getElementById('stepButton').disabled = 'disabled';
          workspace.highlightBlock(null);
          return;
        }
      }
      
      $timeout(0).then(stepCode);

    }

    stepCode();

  }
  

  function runCode() {
    // Configutarion of block higlighting functionality
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    myInterpreter = new Interpreter(code, initApi);
    
    highlightPause = false;
    workspace.traceOn(true);
    workspace.highlightBlock(null);
    
    
    function stepCode() {
      try {
        var ok = myInterpreter.step();
      } finally {
        if (!ok) {
          // Program complete, no more code to execute.
          //document.getElementById('stepButton').disabled = 'disabled';
          workspace.highlightBlock(null);
          return;
        }
      }
      
      $timeout(0).then(stepCode);

    }

    stepCode();

  }
  
  function showCode() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      alert(code);
  }
  
  function loadBlocks(defaultXml) {
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

  function initApi(interpreter, scope) {
    // light(state)
    var wrapper = function(state) {
      state = state ? state.toBoolean() : true;
      return interpreter.createPrimitive(light(state));
    };
    interpreter.setProperty(scope, 'light',
        interpreter.createNativeFunction(wrapper));

    // window.alert(text)
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(window.alert(text));
    };
    interpreter.setProperty(scope, 'window.alert',
        interpreter.createNativeFunction(wrapper));

    // say(text)
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(window.alert(text));
    };
    interpreter.setProperty(scope, 'say',
        interpreter.createNativeFunction(wrapper));

    // prompt()
    wrapper = function(text) {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(prompt(text));
    };
    interpreter.setProperty(scope, 'prompt',
        interpreter.createNativeFunction(wrapper));
      
    // wait(time)  
    wrapper = function(time, callback) {
      time = time ? time.toNumber() : 0;
      wait(time, function() {
        callback(interpreter.createPrimitive(null));
        //myInterpreter.run();
      })
    };
    interpreter.setProperty(scope, 'wait',
        interpreter.createAsyncFunction(wrapper));
        
    // getXhr(url)
    wrapper = function getXhr(href, callback) {
      href = href ? href.toString() : '';
      var req = new XMLHttpRequest();
      req.open('GET', href, true);
      req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
          callback(interpreter.createPrimitive(req.responseText));
        }
      };
      req.send(null);
    };
    interpreter.setProperty(scope, 'getXhr',
        interpreter.createAsyncFunction(wrapper));
        
    // highlightBlock(id)
    wrapper = function(id) {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
        interpreter.createNativeFunction(wrapper));    
  }

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
        
  var light = function(state) {
    
    if (virtualDevice) {
      virtualDevice.light(state);
    }
    
    if (physicalDevice) {
      physicalDevice.light(state);
    }
    
    /*
    if (BoardService.isBoardReady()) {
      BoardService.light(state);
    }
    
    VirtualBoardService.digitalWrite(13,state);
    */
    
  }


}])




