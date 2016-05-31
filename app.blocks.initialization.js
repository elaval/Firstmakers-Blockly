'use strict';
/**
* @ngdoc object
* @description
*/
angular.module('tideApp')
.run(function() {
  var COLOR_Lists = 20;
  var COLOR_Control = 120;
  var COLOR_Text = 160;
  var COLOR_Firstmakers = 245;
  var COLOR_Logic = 210;
  var COLOR_Math = 230;
  var COLOR_Color = 260;
  var COLOR_Functions = 290;
  var COLOR_Variables = 330;
    

  
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
      this.setColour(COLOR_Text);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_SAY_HI_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['say_hi'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_say(getXhr("https://raw.githubusercontent.com/Caged/d3-tip/master/.gitignore"));\n';
    return code;
  };
  
  
  Blockly.Blocks['say'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_SAY_TITLE);
      this.appendValueInput("CONTENT")
          .setCheck(null)
          .appendField(Blockly.Msg.FIRSTMAKERS_MESSAGE);
      this.setColour(65);
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
      this.setColour(COLOR_Control);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_WAIT_1_SEC_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['wait'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_wait(1000);\n';
    return code;
  };
  
  
  Blockly.Blocks['potentiometer'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TITLE, 'title');
      this.setOutput(true, 'Number');      
      this.setColour(COLOR_Firstmakers);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    },
    customUpdate: function(updateScope) {
      var value = updateScope &&  updateScope.potentiometer;
      this.setFieldValue(Blockly.Msg.FIRSTMAKERS_POTENTIOMETER_TITLE +" (" + value +")", 'title');
    }
  };
  
  Blockly.JavaScript['potentiometer'] = function(block) {
    var code = 'fm_potentiometer()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  
  Blockly.Blocks['dummy'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField(this.newQuote_(false));
    this.setOutput(true, 'String');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    // Text block is trivial.  Use tooltip of parent block if it exists.
    this.setTooltip(function() {
      var parent = thisBlock.getParent();
      return (parent && parent.getInputsInline() && parent.tooltip) ||
          Blockly.Msg.TEXT_TEXT_TOOLTIP;
    });
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @this Blockly.Block
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};
    
  
  Blockly.JavaScript['dummy'] = function(block) {
    var code = Blockly.JavaScript.quote_(block.getFieldValue('TEXT'));
    code = 'fm_dummy()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };
  
  Blockly.Blocks['math_random_float2'] = {
  /**
   * Block for random fraction between 0 and 1.
   * @this Blockly.Block
   */
  init: function() {
      this.jsonInit({
        "message0": Blockly.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM,
        "output": "Number",
        "colour": Blockly.Blocks.math.HUE,
        "tooltip": Blockly.Msg.MATH_RANDOM_FLOAT_TOOLTIP,
        "helpUrl": Blockly.Msg.MATH_RANDOM_FLOAT_HELPURL
      });
    }
  };
  
  Blockly.JavaScript['math_random_float2'] = function(block) {
    // Random fraction between 0 and 1.
    return ['Math_random(4)', Blockly.JavaScript.ORDER_FUNCTION_CALL];
  };
    
  Blockly.Blocks['light_on'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(Blockly.Msg.FIRSTMAKERS_LIGHT_ON_TITLE);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(COLOR_Firstmakers);
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
      this.setColour(COLOR_Firstmakers);
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
      this.setColour(COLOR_Firstmakers);
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
      this.setColour(COLOR_Firstmakers);
      this.setTooltip(Blockly.Msg.FIRSTMAKERS_BUZZER_OFF_TOOLTIP);
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  Blockly.JavaScript['buzzer_off'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'fm_buzzer(false);\n';
    return code;
  };
 
 
 Blockly.Blocks['getXhr'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("getXhr");
      this.setOutput(true, 'Text');
      this.setColour(COLOR_Firstmakers);
      this.setTooltip("getXhr");
      this.setHelpUrl('http://www.firstmakers.com/');
    }
  };
  
  
  Blockly.JavaScript['getXhr'] = function(block) {
    // TODO: Assemble JavaScript into code variable.
    var code = 'getXhr("https://raw.githubusercontent.com/Caged/d3-tip/master/.gitignore")';
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  };


  
  /**
   * Color codes
   * 
      20 - LISTS
      80 - Firstmakers
      120 - Loops
      160 - Text
      210 - Logic
      230 - Math
      260 - COLOR
      290 - FUNCTIONS
      330 - VARIABLES

   */
});