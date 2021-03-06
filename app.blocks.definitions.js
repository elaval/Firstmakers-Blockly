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
  Blockly.BlockSvg.START_HAT = true;


  
  /**
   * Definition of firstmakers blocks
   */
  
  Blockly.Blocks['controls_repeat_forever'] = {
    /**
     * Block for repeat indefintively.
     */
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_REPEAT_FOREVER_TITLE);
      this.appendStatementInput('DO')
          .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.loops.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_REPEAT_FOREVER_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['controls_repeat_forever'] = function(block) {
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    var code =  'while (true) {\n' + branch + '}\n';
    return code;
  };
    
  Blockly.Blocks['on_key'] = {
    /**
     * Block for repeat indefintively.
     */
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_ON_KEY_TITLE)
          .appendField(new Blockly.FieldTextInput("p"), "KEY");
      this.appendStatementInput('DO')
          .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.loops.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_ON_KEY_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['on_key'] = function(block) {
    var branch = Blockly.JavaScript.statementToCode(block, 'DO');
    branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
    var code =  branch;
    return code;
  };
  
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
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
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
    /**
     * Block for string length.
     * @this Blockly.Block
     */
    init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.FIRSTMAKERS_WAIT_TITLE,
        "args0": [
          {
            "type": "field_input",
            "name": "VALUE",
            "text": 1,
            "check": ['Number']
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": Blockly.Blocks.loops.HUE,
        "tooltip": Blockly.Msg.FIRSTMAKERS_WAIT_TOOLTIP,
        "helpUrl": Blockly.Msg.TEXT_LENGTH_HELPURL
      });
      this.getField('VALUE').setValidator(
          Blockly.FieldTextInput.nonnegativeIntegerValidator);
    }
  };  
  
  Blockly.JavaScript['wait'] = function(block) {
    var value = block.getFieldValue('VALUE');
    var code = 'fm_wait('+value*1000+');\n';
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
  
  // -----------    
  // Infrared sensor
  // -----------
  Blockly.Blocks['infrared_sensor'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_INFRARED_SENSOR_TITLE, 'title');
      this.setOutput(true, 'Boolean');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_INFRARED_SENSOR_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.infrared;
      var stateMsg = value ? Blockly.Msg.FIRSTMAKERS_ON : Blockly.Msg.FIRSTMAKERS_OFF;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_INFRARED_SENSOR_TITLE +" (" + stateMsg +")", 'title');
    }
  };
  
  Blockly.JavaScript['infrared_sensor'] = function(block) {
    var code = 'fm_infraredSensor()';
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
      var stateMsg = value ? Blockly.Msg.FIRSTMAKERS_ON : Blockly.Msg.FIRSTMAKERS_OFF;
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
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TITLE)
          .appendField(new Blockly.FieldDropdown([[Blockly.Msg.FIRSTMAKERS_WHITE, "13"], [Blockly.Msg.FIRSTMAKERS_RED, "7"], [Blockly.Msg.FIRSTMAKERS_YELLOW, "5"], [Blockly.Msg.FIRSTMAKERS_GREEN, "4"]]), "COLOR_PIN");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_on'] = function(block) {
    var pin = block.getFieldValue('COLOR_PIN');
    var code = 'fm_digitalWrite('+parseInt(pin)+', true);\n';
    return code;
  };
  
  // -----------
  // light_off
  // -----------
  Blockly.Blocks['light_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TITLE)
          .appendField(new Blockly.FieldDropdown([[Blockly.Msg.FIRSTMAKERS_WHITE, "13"], [Blockly.Msg.FIRSTMAKERS_RED, "7"], [Blockly.Msg.FIRSTMAKERS_YELLOW, "5"], [Blockly.Msg.FIRSTMAKERS_GREEN, "4"]]), "COLOR_PIN");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
    
  Blockly.JavaScript['light_off'] = function(block) {
    var pin = block.getFieldValue('COLOR_PIN');
    var code = 'fm_digitalWrite('+parseInt(pin)+', false);\n';
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

  // -----------
  // analog_write
  // -----------
  Blockly.Blocks['analog_write'] = {
    init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.FIRSTMAKERS_ANALOG_WRITE_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "PIN",
            "options": [["3", "3"], ["5", "5"],["6", "6"],["9", "9"], ["10", "10"], ["11", "11"]]
          },
          {
            "type": "input_value",
            "name": "VALUE",
            "check": "Number"
          }
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_ANALOG_WRITE_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
 
  Blockly.JavaScript['analog_write'] = function(block) {
    var pin = block.getFieldValue('PIN');
    if (block.getField('VALUE')) {
      // Internal number.
      var value = String(Number(block.getFieldValue('VALUE')));
    } else {
      // External number.
      var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var code = 'fm_analogWrite('+pin+','+value+');\n';
    return code;
  };



  // -----------
  // servo
  // -----------
  Blockly.Blocks['servo'] = {
    init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.FIRSTMAKERS_SET_SERVO_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "PIN",
            "options": [["3", "3"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"]]
          },
          {
            "type": "input_value",
            "name": "ANGLE",
            "check": "Number"
          }
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SET_SERVO_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
 
  Blockly.JavaScript['servo'] = function(block) {
    var pin = block.getFieldValue('PIN');
    if (block.getField('ANGLE')) {
      // Internal number.
      var angle = String(Number(block.getFieldValue('ANGLE')));
    } else {
      // External number.
      var angle = Blockly.JavaScript.valueToCode(block, 'ANGLE',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var code = 'fm_servo('+pin+','+angle+');\n';
    return code;
  };




  //-----------
  // CONFIGURATION MOTOR 
  //-----------
  Blockly.Blocks['motor_config'] = {
    init: function() {
      this.jsonInit({
        "type": "motor_config",
        "message0": Blockly.Msg.FIRSTMAKERS_MOTOR_CONFIG_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "MOTOR_ID",
            "options": [["A","A"],["B","B"]]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "POWER_PIN_A",
            "options": [["3","3"],["9","9"],["10","10"],["11","11"]]
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "field_dropdown",
            "name": "DIR_PIN_A",
            "options": [["3","3"],["8","8"],["9","9"],["10","10"],["11","11"],["12","12"]]
          }
        ],
      });
      this.getField("DIR_PIN_A").setValue("8");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_MOTOR_CONFIG_TOOLTIP);
      this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.JavaScript['motor_config'] = function(block) {
    var motorId = block.getFieldValue('MOTOR_ID');
    var powerPin = block.getFieldValue('POWER_PIN_A');
    var dirPin = block.getFieldValue('DIR_PIN_A');
    var code = 'fm_motor_config("'+motorId+'",'+powerPin+','+dirPin+');\n';
    return code;
  };


  //-----------
  // MOTOR DC SPEED
  //-----------
  Blockly.Blocks['motor_speed'] = {
    init: function() {
      this.jsonInit({
        "message0":Blockly.Msg.FIRSTMAKERS_MOTOR_SPEED_TITLE,
        //"message0": "MOTOR_SPEED  %1 TO %2",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "MOTOR_ID",
            "options": [["A","A"],["B","B"]]
          },
          {
            "type": "input_value",
            "name": "SPEED",
            "check": "Number"
          }
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_MOTOR_SPEED_TOOLTIP);
      this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.JavaScript['motor_speed'] = function(block) {
    var motorId = block.getFieldValue('MOTOR_ID');
    if (block.getField('ANGLE')) {
      // Internal number.
      var speed = String(Number(block.getFieldValue('SPEED')));
    } else {
      // External number.
      var speed = Blockly.JavaScript.valueToCode(block, 'SPEED',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }    
    var code = 'fm_motor_speed("'+motorId+'",'+speed+');\n';
    return code;
  };



  //-----------
  // MOTOR DC DIRECTION
  //-----------
  Blockly.Blocks['motor_direction'] = {
    init: function() {
      this.jsonInit({
        
        //"message0": "MOTOR_CLOCKWISE  %1 TO %2",
        "message0": Blockly.Msg.FIRSTMAKERS_MOTOR_DIRECTION_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "MOTOR_ID",
            "options": [["A","A"],["B","B"]]
          },
          {
            "type": "field_dropdown",
            "name": "DIRECTION",
            "options": [
              [
                Blockly.Msg.FIRSTMAKERS_MOTOR_DIRECTION_FORWARD,
                "0"
              ],
              [
                Blockly.Msg.FIRSTMAKERS_MOTOR_DIRECTION_BACKWARD,
                "1"
              ]
            ]
          },
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_MOTOR_DIRECTION_TOOLTIP);
      this.setHelpUrl('http://www.example.com/');
    }
  };


  Blockly.JavaScript['motor_direction'] = function(block) {
    var motorId = block.getFieldValue('MOTOR_ID');
    var direction = block.getFieldValue('DIRECTION');
    var code = 'fm_motor_direction("'+motorId+'",'+direction+');\n';
    return code;
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
 
    
/*********************************************************
* Blocks for FMK 2
**********************************************************/
    
 Blockly.Blocks['fmk2_digital_pin_on'] = {
     init: function () {
         var pins = [["10", "0"], ["11", "1"], ["12", "2"]];
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

 Blockly.JavaScript['fmk2_digital_pin_on'] = function (block) {
     var pin = block.getFieldValue('PIN');
     var code = 'fm_digitalWrite(' + pin + ',true);\n';
     return code;
 };
 Blockly.Blocks['fmk2_digital_pin_off'] = {
     init: function () {
         var pins = [["10", "0"], ["11", "1"], ["12", "2"]];
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
 Blockly.JavaScript['fmk2_digital_pin_off'] = function (block) {
     var pin = block.getFieldValue('PIN');
     var code = 'fm_digitalWrite(' + pin + ',false);\n';
     return code;
 };
    
     
 Blockly.Blocks['fmk2_analog_write'] = {
    init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.FIRSTMAKERS_ANALOG_WRITE_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "PIN",
            "options": [["0", "10"], ["1", "11"]]
          },
          {
            "type": "input_value",
            "name": "VALUE",
            "check": "Number"
          }
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_ANALOG_WRITE_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
 
  Blockly.JavaScript['fmk2_analog_write'] = function(block) {
    var pin = block.getFieldValue('PIN');
    if (block.getField('VALUE')) {
      // Internal number.
      var value = String(Number(block.getFieldValue('VALUE')));
    } else {
      // External number.
      var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var code = 'fm_analogWrite('+pin+','+value+');\n';
    return code;
  };
    
  Blockly.Blocks['fmk2_servo'] = {
    init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.FIRSTMAKERS_SET_SERVO_TITLE,
        "args0": [
          {
            "type": "field_dropdown",
            "name": "PIN",
            "options": [["PRIMARY", "3"], ["0", "10"], ["1", "11"], ["2", "12"]]
          },
          {
            "type": "input_value",
            "name": "ANGLE",
            "check": "Number"
          }
        ],
      });
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SET_SERVO_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
 
  Blockly.JavaScript['fmk2_servo'] = function(block) {
    var pin = block.getFieldValue('PIN');
    if (block.getField('ANGLE')) {
      // Internal number.
      var angle = String(Number(block.getFieldValue('ANGLE')));
    } else {
      // External number.
      var angle = Blockly.JavaScript.valueToCode(block, 'ANGLE',
          Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    }
    var code = 'fm_servo('+pin+','+angle+');\n';
    return code;
  };
    
   Blockly.Blocks['fmk2_battery'] = {
      init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_BATTERY_LEVEL_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(Blockly.Blocks.firstmakers.HUE);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_BATTERY_LEVEL_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
      
    },
    updateSensor: function(sensorValues) {
      var value = sensorValues &&  sensorValues.battery;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_BATTERY_LEVEL_TITLE +" (" + value +")", 'title');
    }
   }
   
   Blockly.JavaScript['fmk2_battery'] = function(block) {
    var code = 'fm_batteryLevel()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  }; 
});