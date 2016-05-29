'use strict';
/**
* @ngdoc object
* @description
*/
angular.module('tideApp')
.run(function() {
  
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
      this.setColour(260);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SAY_HI_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['say_hi'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_say("Hola!");\n';
    return code;
  };
    
  Blockly.Blocks['light_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_on'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_light(true);\n';
    return code;
  };
  
  Blockly.Blocks['light_off'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_LIGHT_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['light_off'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_light(false);\n';
    return code;
  };
  
  Blockly.Blocks['wait'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_WAIT_1_SEC_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(260);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_WAIT_1_SEC_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['wait'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_wait(1000);\n';
    return code;
  };
  
});