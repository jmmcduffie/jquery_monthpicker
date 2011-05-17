/**
 * jQuery Monthpicker
 * @author Jeremy McDuffie (jeremy.mcduffie)
 * @copyright 2011 Jeremy McDuffie
 * @license Dual-licensed with the BSD and MIT licenses
 * @version 0.2
 * @param {Number} pastYears The number of years in the past to provide as options
 * @param {Number} futureYears The number of years in the future to provide as options
 * @param {String} defaultValue The default date to use (in the format 'YYYY-MM')
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
	};
	
	// i18n
	$.fn.monthpicker.i18n = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	
	// Set up a container for all of the monthpickers
	window._monthpickers = [];
	
	// Capture all clicks and hide datepickers which are open
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
				.data('_input', this.input)
				.append(this.month, this.year)
				.hide().appendTo(document.body);
			this.input.addClass('hasMonthpicker');
			
			/* Event handlers */
			
			this.input.focus(function(e) {
				_this.open(); // Open on focus
			})
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
				}
				if (stop) e.preventDefault();
			});
			
			window._monthpickers.push(this);
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
			this.status = 'open';
			this.dialog.attr('aria-hidden', false);
		};
		
		// Handles hiding of the monthpicker
		var _close = function() {
			this.dialog.fadeOut('fast');
			this.status = 'closed';
			this.dialog.attr('aria-hidden', true);
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
