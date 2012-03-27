/**
 * jQuery Monthpicker
 * @author Jeremy McDuffie (http://jmmcduffie.com)
 * @copyright 2011-2012 Jeremy McDuffie
 * @license Dual-licensed with the BSD and MIT licenses
 * @param {Number} pastYears The number of years in the past to provide as options
 * @param {Number} futureYears The number of years in the future to provide as options
 * @param {String} defaultValue The default date to use (in the format 'YYYY-MM')
 * @param {Boolean} showButtons Whether or not to show the next/prev buttons
 */

(function($){
  
  /* Utilities */
  
  // String padding
  var pad = function(str, len) {
    var str = String(str), len = parseInt(len,10) || 2;
    while (str.length < len) str = '0' + str;
    return str;
  };
  
  /* Plugin code */
  
  // Setup
  $.fn.monthpicker = function(settings){
    var args = $.extend($.fn.monthpicker.defaults, settings);
    
    // Create a monthpicker for each input and attach a focus handler
    return this.each(function(){
      var _this = $(this);
      _this.data('_monthpicker', new Monthpicker(_this, args));
    });
  };
  
  // Establish default settings
  $.fn.monthpicker.defaults = {
    'pastYears': 5
    , 'futureYears': 5
    , 'defaultValue': null
    , 'showButtons': true
  };
  
  // i18n
  $.fn.monthpicker.i18n = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Set up a container for all of the monthpickers
  window._monthpickers = [];
  
  // Capture all clicks and hide monthpickers which are open
  $(document).mousedown(function(e) {
    var target = $(e.target);
    for (var i = 0, l = window._monthpickers.length; i < l; i++) {
      var monthpicker = window._monthpickers[i];
      if (!(target.data('_monthpicker') && target.data('_monthpicker') == monthpicker)
        && target.closest('.monthpicker').length === 0 && monthpicker.status == 'open') monthpicker.close();
    }
  });
  
  // Monthpicker object
  var Monthpicker = (function() {
    
    var _pattern = /\d{4}-(?:0\d|1[012])/;
    
    /* All instance methods are cached in a closure */
    
    // Constructs the instance
    var _init = function(input, args) {
      
      var _this = this;
      
      // Attach properties
      this.input = input.attr('autocomplete', 'off');
      this.args = args;
      this.status = 'closed';
      
      // Attach cached instance methods
      this.open = _open;
      this.close = _close;
      this.update = _update;
      this.prev = _prev;
      this.next = _next;

      // Create and attach the container
      this.dialog = $('<div/>', { 'class': 'monthpicker', 'role': 'dialog' })
        .data('_input', this.input)
        .hide().css({ 'position': 'absolute' })
        .appendTo(document.body);
      
      // Create the month drop-down menu
      this.month = $('<select/>', {
        'class': 'monthpicker_month'
        , 'change': function() { _this.update() }
      }).appendTo(this.dialog);
      for (var i = 0, l = 12; i < l; i++) {
        var option = $('<option/>', { 'value': i, 'text': $.fn.monthpicker.i18n[i] }).appendTo(this.month);
      }
      
      // Create the year drop-down menu
      var currentYear = new Date().getFullYear();
      var firstYear = currentYear - this.args.pastYears;
      var lastYear = currentYear + this.args.futureYears;
      this.year = $('<select/>', {
        'class': 'monthpicker_year'
        , 'change': function() { _this.update() }
      }).appendTo(this.dialog);
      for (var i = firstYear; i <= lastYear; i++) {
        var option = $('<option/>', { 'value': i, 'text': i }).appendTo(this.year);
      }
      
      // Set the drop-downs to the right values
      _reset.call(this);

      if (this.args.showButtons) {
        // Create the move backward button
        this.back = $('<button/>', {
          'class': 'monthpicker_back'
          , 'text': '<'
          , 'click': function() { _this.prev() }
        }).prependTo(this.dialog);
        
        // Create the move forward button
        this.forward = $('<button/>', {
          'class': 'monthpicker_forward'
          , 'text': '>'
          , 'click': function() { _this.next() }
        }).appendTo(this.dialog);
      }
      
      /* Event handlers */
      
      this.input
        .focus(function(e) { _this.open(); }) // Open on focus
        .keydown(function(e) {
          var stop = false;
          switch (e.which) {
            case 27: // Close on escape
              _this.close();
              stop = true;
              break;
            case 9: // Close on tab away
              _this.close();
              break;
            case 38: // Increment with up arrow
              _this.next();
              stop = true;
              break;
            case 40: // Decrement with down arrow
              _this.prev();
              stop = true;
              break;
          }
          if (stop) e.preventDefault();
        })
        // Update the drop-downs if a new value has been typed in
        .keyup(function(e) { if (_pattern.test(_this.input.val())) _reset.call(_this); });
      
      window._monthpickers.push(this);
    };
    
    // Handles display of the monthpicker
    var _open = function() {
      if (this.input.val() === "") this.update();
      this.dialog.css({
        'top': this.input.offset().top+this.input.outerHeight()
        , 'left': this.input.offset().left
      })
        .fadeIn('fast').attr('aria-hidden', false);
      this.status = 'open';
    };
    
    // Handles hiding of the monthpicker
    var _close = function() {
      this.dialog.fadeOut('fast').attr('aria-hidden', true);
      this.status = 'closed';
      this.update();
    };
    
    // Updates the value of the associated form field
    var _update = function(month, year) {
      if (typeof(month) != "undefined" && typeof(year) != "undefined") {
        _reset.call(this, month, year);
        this.input.val(year + "-" + pad(parseInt(month, 10) + 1));
      } else {
        this.input.val(this.year.val() + "-" + pad(parseInt(this.month.val(), 10) + 1));
      }
    };
    
    // Updates the drop-down boxes
    var _reset = function(month, year) {
      
      // Figure out the default values if none were passed in
      if (arguments.length < 2) {
        var currentValue = this.input.val()
          , defaultValue = this.args.defaultValue
          , currentDate = new Date();
        if (currentValue != "") {
          month = parseInt(currentValue.slice(-2),10)-1;
          year = currentValue.slice(0,4);
        } else if (defaultValue != null) {
          month = parseInt(defaultValue.slice(-2),10)-1;
          year = defaultValue.slice(0,4);
        } else {
          month = currentDate.getMonth();
          year = currentDate.getFullYear();
        }
      }
      
      this.dialog.find('option:selected').removeAttr('selected');
      this.month.find('option[value="' + month + '"]').attr('selected', 'selected');
      this.year.find('option[value="' + year + '"]').attr('selected', 'selected');
    };
    
    // Utility to get the month as an int
    var getMonthVal = function getMonthVal() {
      return parseInt(this.input.val().slice(-2), 10)-1;
    };
    
    // Utility to get the year as an int
    var getYearVal = function getYearVal() {
      return parseInt(this.input.val().slice(0,4), 10);
    };
    
    // Moves the value back by one month
    var _prev = function() {
      var month = getMonthVal.call(this), year = getYearVal.call(this);
      if (month === 0) {
        month = 11;
        year--;
      } else month--;
      _update.call(this, month, year);
    };
    
    // Moves the value forward by one month
    var _next = function() {
      var month = getMonthVal.call(this), year = getYearVal.call(this);
      if (month === 11) {
        month = 0;
        year++;
      } else month++;
      _update.call(this, month, year);
    };
    
    // Send back a constructor function
    return function(input, args) {
      _init.call(this, input, args);
    };
  })();
      
})(jQuery);
