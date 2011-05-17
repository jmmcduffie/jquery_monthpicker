jQuery Monthpicker
==================

A (very simple) "monthpicker" plugin for jQuery.

My primary goal was to provide a more user-friendly way to populate an `input[type="month"]` (new in HTML5)
as the required YYYY-MM format is not very intuitive. This is very much a work-in-progress.

i18n
----

Localization of the month names can be accomplished by setting the names as an array on the monthpicker object.
For example, here is how you would use Spanish:

	$.fn.monthpicker.i18n = [
		'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
		'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
	];

a11y
----

Where appropriate (as best as I can tell), I have added ARIA roles and states to the DOM.
I welcome suggestions for improving this aspect of the plugin.

Though keyboard accessibility is not broken by this plugin, the dialog itself is not accessible naturally through tab order.
This mimics the behavior shown by the jQuery UI Datepicker, as far as I know.
If I can find a better way I will, but in the meantime keyboard-only users will still be able to manually enter a value.

### Copyright info

* Copyright &copy; 2011, Jeremy McDuffie, all rights reserved
* Dual-licensed under the BSD and MIT licenses.