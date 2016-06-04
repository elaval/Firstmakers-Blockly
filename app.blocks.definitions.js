'use strict';

goog.provide('Blockly.Blocks.firstmakers');
goog.provide('Blockly.Blocks.internet');

goog.require('Blockly.Blocks');

/**
* @ngdoc object
* @description
*/
angular.module('tideApp')
.run(function() {
  var COLOR_Lists = 20;
  var COLOR_Control = 120;
  var COLOR_Text = 160;
  //var Blockly.Blocks.firstmakers.HUE = 245;
  var COLOR_Logic = 65;
  var COLOR_Math = 230;
  var COLOR_Color = 260;
  var COLOR_Functions = 290;
  var COLOR_Variables = 330;
  
  Blockly.HSV_SATURATION = 0.8;
  Blockly.HSV_VALUE = 0.8;
  
  // Original colours:
  // Blockly.Blocks.colour.HUE = 20;
  // Blockly.Blocks.lists.HUE = 260;
  // Blockly.Blocks.logic.HUE = 210;
  // Blockly.Blocks.loops.HUE = 120;
  // Blockly.Blocks.math.HUE = 230;
  // Blockly.Blocks.procedures.HUE = 290;
  // Blockly.Blocks.texts.HUE = 160;
  
  Blockly.Blocks.variables.HUE = 330;
  Blockly.Blocks.colour.HUE = 20;
  Blockly.Blocks.lists.HUE = 260;
  Blockly.Blocks.logic.HUE = 185;
  Blockly.Blocks.loops.HUE = 120;
  Blockly.Blocks.math.HUE = 230;
  Blockly.Blocks.procedures.HUE = 290;
  Blockly.Blocks.texts.HUE = 160;
  Blockly.Blocks.variables.HUE = 330;
  
  Blockly.Blocks.firstmakers.HUE = 210
  Blockly.Blocks.internet.HUE = 100


  
  /**
   * Definition of firstmakers blocks
   * - say_hi (for testing purposes)
   * - light_on : turns light on
   * - light_off : turns light off
   * - wait : waits 1 sec
   */
  
  Blockly.Blocks['say_hi'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_SAY_HI_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.texts.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SAY_HI_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['say_hi'] = function(block) {
    var code = 'fm_say("'+ Blockly.Msg.FIRSTMAKERS_HI +'");\n';
    return code;
  };
  
  
  Blockly.Blocks['say'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_SAY_TITLE);
      this.appendValueInput("CONTENT")
          .setCheck(null)
          .appendField(Blockly.Msg.FIRSTMAKERS_MESSAGE);
      this.setColour(Blockly.Blocks.texts.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SAY_HI_TOOLTIP);
      this.setHelpUrl('http://www.example.com/');
    }
  };
  
  Blockly.JavaScript['say'] = function(block) {
    // Prompt function.
    if (block.getField('CONTENT')) {
      // Internal message.
      var value_content = Blockly.JavaScript.quote_(block.getFieldValue('CONTENT'));
    } else {
      // External message.
      var value_content = Blockly.JavaScript.valueToCode(block, 'CONTENT',
          Blockly.JavaScript.ORDER_NONE) || '\'\'';
    }

    var code = 'fm_say('+value_content+');\n';
    
    return code;
  };
  
  
  
  
  Blockly.Blocks['wait'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_WAIT_1_SEC_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.loops.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_WAIT_1_SEC_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['wait'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_wait(1000);\n';
    return code;
  };
  
  // -----------
  // Potentiometer
  // -----------
  Blockly.Blocks['potentiometer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.potentiometer;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['potentiometer'] = function(block) {
    var code = 'fm_potentiometer()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
      
  // -----------    
  // Temperature
  // -----------
  Blockly.Blocks['temperature_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_TEMPERATURE_SENSOR_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_TEMPERATURE_SENSOR_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.temperature;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_TEMPERATURE_SENSOR_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['temperature_sensor'] = function(block) {
    var code = 'fm_temperatureSensor()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  // -----------    
  // Light sensor
  // -----------
  Blockly.Blocks['light_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_SENSOR_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_SENSOR_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.light;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_LIGHT_SENSOR_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['light_sensor'] = function(block) {
    var code = 'fm_lightSensor()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
    
    
  // -----------    
  // Audio sensor
  // -----------
  Blockly.Blocks['audio_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_AUDIO_SENSOR_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_AUDIO_SENSOR_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.audio;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_AUDIO_SENSOR_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['audio_sensor'] = function(block) {
    var code = 'fm_audioSensor()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };    
  
  // -----------    
  // Humidity sensor
  // -----------
  Blockly.Blocks['humidity_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_HUMIDITY_SENSOR_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_HUMIDITY_SENSOR_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.humidity;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_HUMIDITY_SENSOR_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['humidity_sensor'] = function(block) {
    var code = 'fm_humiditySensor()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
    
  // ------    
  // button
  // ------
  Blockly.Blocks['button'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_BUTTON_TITLE, 'title');
      this.setOutput(true, 'Boolean');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_BUTTON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.button;
      var stateMsg = value ? Blockly.Msg.FIRSTMAKERS_BUTTON_ON : Blockly.Msg.FIRSTMAKERS_BUTTON_OFF;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_BUTTON_TITLE +" (" + stateMsg +")", 'title');
    }
  };
  
  Blockly.JavaScript['button'] = function(block) {
    var code = 'fm_button()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  // -----------
  // light_on
  // -----------
  Blockly.Blocks['light_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_on'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_light(true);\n';
    return code;
  };
  
  // -----------
  // light_off
  // -----------
  Blockly.Blocks['light_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_off'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_light(false);\n';
    return code;
  };
  
    Blockly.Blocks['buzzer_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_BUZZER_ON_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_BUZZER_ON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['buzzer_on'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_buzzer(true);\n';
    return code;
  };
  
  Blockly.Blocks['buzzer_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_BUZZER_OFF_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_BUZZER_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['buzzer_off'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_buzzer(false);\n';
    return code;
  };
 
  Blockly.Blocks['digital_pin_on'] = {
    init: function() {
      
      var pins = [];
      for (var i=0; i<=13; i++) {
        pins.push([i+'',i+'']);
      }     
      var dropdownPin = new Blockly.FieldDropdown(pins);

      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_DIGITAL_PIN_ON_TITLE)
          //.appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"]]), "PIN")

          .appendField(dropdownPin, 'PIN')
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_DIGITAL_PIN_ON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    }
  };
  
  Blockly.JavaScript['digital_pin_on'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var code = 'fm_digitalWrite('+pin+',true);\n';
    return code;
  };
  
  Blockly.Blocks['digital_pin_off'] = {
    init: function() {
      
      var pins = [];
      for (var i=0; i<=13; i++) {
        pins.push([i+'',i+'']);
      }     
      var dropdownPin = new Blockly.FieldDropdown(pins);

      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_DIGITAL_PIN_OFF_TITLE)
          .appendField(dropdownPin, 'PIN')
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_DIGITAL_PIN_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    }
  };
  
  Blockly.JavaScript['digital_pin_off'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var code = 'fm_digitalWrite('+pin+',false);\n';
    return code;
  };
  
  Blockly.Blocks['read_digital_pin'] = {
    init: function() {
      
      var pins = [];
      for (var i=0; i<=13; i++) {
        pins.push([i+'',i+'']);
      }     
      var dropdownPin = new Blockly.FieldDropdown(pins);

      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_READ_DIGITAL_PIN_TITLE, 'title')
          .appendField(dropdownPin, 'PIN')
          .appendField("", 'valueFeedback')

      this.setOutput(true, 'Boolean');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_READ_DIGITAL_PIN_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    },
    updateSensor: function(sensorValues) {
      var pin = this.getFieldValue('PIN');
      var value = sensorValues &&  sensorValues.pins[pin].value;
      this.setFieldValue(" (" + value +")", 'valueFeedback');
    }
  };
  
  Blockly.JavaScript['read_digital_pin'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var code = 'fm_digitalRead('+pin+')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];;
  };
  
  Blockly.Blocks['read_analog_pin'] = {
    init: function() {
      
      var pins = [];
      for (var i=0; i<=5; i++) {
        pins.push([i+'',i+'']);
      }     
      var dropdownPin = new Blockly.FieldDropdown(pins);

      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_READ_ANALOG_PIN_TITLE, 'title')
          .appendField(dropdownPin, 'PIN')
          .appendField("", 'valueFeedback')

      this.setOutput(true, 'Boolean');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_READ_ANALOG_PIN_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    },
    updateSensor: function(sensorValues) {
      var pin = this.getFieldValue('PIN');
      var value = sensorValues &&  sensorValues.pins[sensorValues.analogPins[pin]].value;
      this.setFieldValue(" (" + value +")", 'valueFeedback');
    }
  };
  
  Blockly.JavaScript['read_analog_pin'] = function(block) {
    var pin = block.getFieldValue('PIN');
    var code = 'fm_analogRead('+pin+')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];;
  };
 
 Blockly.Blocks['getXhr'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("getXhr");
      this.setOutput(true, 'Text');
      this.setColour(Blockly.Blocks.internet.HUE);
      this.setTooltip("getXhr");
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  
  Blockly.JavaScript['getXhr'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'getXhr("https://raw.githubusercontent.com/Caged/d3-tip/master/.gitignore")';
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };

});