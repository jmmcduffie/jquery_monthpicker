/**
 * jQuery MonthPicker
 * @author Jeremy McDuffie (jeremy.mcduffie)
 * @copyright 2011 Jeremy McDuffie
 * @license Modified BSD License
 * @version 0.1
 * @param {Number} pastYears The number of years in the past to provide as options
 * @param {Number} futureYears The number of years in the future to provide as options
 * @param {String} defaultValue The default date to use (in the format 'YYYY-MM')
 */

(function($){
	
	var pad = function(str, len, ch, right) {
		var str = String(str)
			, len = parseInt(len,10) || 2
			, ch = ch || 0;
		while (str.length < len) {
			if (right) str += ch;
			else str = ch + str;
			// Trim the string if it's too long
			if (str.length > len) {
				if (right) str = str.slice(0, len);
				else str = str.slice(str.length - len);
			}
		}
		return str;
	};

	$.fn.monthpicker = function(settings){
		var args = $.extend($.fn.monthpicker.defaults, settings);
		
		// Create a monthpicker for each input and attach a focus handler
		return this.each(function(){
			var _this = $(this);
			_this._monthpicker = new MonthPicker(_this, args);
			_this.focus(function(e){
				_this._monthpicker.open();
			}).click(function(e) { e.stopPropagation(); });
		});
	};
		
	$.fn.monthpicker.defaults = {
		'pastYears': 5
		, 'futureYears': 5
		, 'defaultValue': null
	};
	
	$.fn.monthpicker.i18n = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	
	var MonthPicker = (function() {
		
		/* All instance methods are cached in a closure */
		
		// Constructs the instance
		var _init = function(input, args) {
			
			var _this = this
				, currentDate = new Date()
				, defaultValue, defaultMonth, defaultYear;
			
			// Attach the settings
			this.input = input;
			this.args = args;
			this.status = 'closed';
			
			// Attach cached instance methods
			this.open = _open;
			this.close = _close;
			this.update = _update;
			
			// Figure out the default value
			if (this.input.val() != "") {
				defaultValue = this.input.val();
				defaultMonth = parseInt(defaultValue.slice(-2),10)-1;
				defaultYear = defaultValue.slice(0,4);
			} else if (this.args.defaultValue != null) {
				defaultValue = this.args.defaultValue;
				defaultMonth = parseInt(defaultValue.slice(-2),10)-1;
				defaultYear = defaultValue.slice(0,4);
			} else {
				defaultMonth = currentDate.getMonth();
				defaultYear = currentDate.getFullYear();
			}
			
			// Create the month drop-down menu
			var currentMonth = currentDate.getMonth();
			this.month = $('<select/>', {
				'class': 'monthpicker_month'
				, 'change': function() { _this.update() }
			});
			for (var i = 0, l = 12; i < l; i++) {
				var option = $('<option/>', { 'value': i, 'text': $.fn.monthpicker.i18n[i] }).appendTo(this.month);
				if (i == defaultMonth) option.attr('selected', 'selected');
			}
			
			// Create the year drop-down menu
			var currentYear = currentDate.getFullYear();
			var firstYear = currentYear - this.args.pastYears;
			var lastYear = currentYear + this.args.futureYears;
			this.year = $('<select/>', {
				'class': 'monthpicker_year'
				, 'change': function() { _this.update() }
				});
			for (var i = firstYear; i <= lastYear; i++) {
				var option = $('<option/>', { 'value': i, 'text': i }).appendTo(this.year);
				if (i == defaultYear) option.attr('selected', 'selected');
			}
			
			// Create and attach the container
			this.dialog = $('<div/>', {
				'class': 'monthpicker'
				, 'role': 'dialog'
			})
				.data('input', this.input)
				.append(this.month, this.year)
				.hide().appendTo(document.body);
				
			this.dialog.keyup(function(e) {
				if (e.which == 27) _this.close();
				e.preventDefault();
			});
			
			this.year.keydown(function(e) {
				if (e.which == 9) _this.close();
			});
			
			$('body').click(function(event) {
			    if (!$(event.target).closest('.monthpicker').length) {
			        if (_this.status == 'open') _this.close();
			    };
			});
		};
		
		// Handles display of the monthpicker
		var _open = function() {
			if (this.input.val() == "") this.update();
			this.dialog.css({
				'position': 'absolute'
				, 'top': this.input.offset().top+this.input.outerHeight()
				, 'left': this.input.offset().left
			});
			this.dialog.fadeIn('fast');
			this.month.focus();
			this.status = 'open';
		};
		
		// Handles hiding of the monthpicker
		var _close = function() {
			this.dialog.fadeOut('fast');
			this.status = 'closed';
			this.update();
		};
		
		// Updates the value of the associated form field
		var _update = function(month, year) {
			if (typeof(month) != "undefined" && typeof(year) != "undefined") {
				this.month.find('option[value=' + year + ']').attr('selected', 'selected');
				this.year.find('option[value=' + year + ']').attr('selected', 'selected');
				this.input.val(year + "-" + pad(parseInt(month, 10) + 1));
			} else {
				this.input.val(this.year.val() + "-" + pad(parseInt(this.month.val(), 10) + 1));
			}
		};
		
		// Send back a constructor function
		return function(input, args) {
			_init.apply(this, [input, args]);
		}
	})();
			
})(jQuery);
