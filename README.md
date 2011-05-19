jQuery Monthpicker
==================

A (very simple) "monthpicker" plugin for jQuery.

My primary goal was to provide a more user-friendly way to populate an `input[type="month"]` (new in HTML5)
as the required YYYY-MM format is not very intuitive. This is very much a work-in-progress.

Usage
-----

The simplest way to use the plugin is to call `.monthpicker()` on a jQuery collection of one or more `input` fields.
For example, `$('input[type="month"]').monthpicker()` would take care of all of your `input` fields with the new `type="month"`.

You can also pass in an object literal with any of the following configuration options:

* `pastYears` {`Number`} The number of years in the past to provide as options. Default is `5`.
* `futureYears` {`Number`} The number of years in the future to provide as options. Default is `5`.
* `defaultValue` {`String`} The default date used by the monthpicker when it first opens.
Defaults to `null`, which means the current date will be used.
Always uses what is set in the `input`'s `value` attribute first.

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

TODO
----

In addition to the items mentioned above, I would like to address these things as I have time:

* Support for min and max
* More configuration, including callbacks
* Flexibility for what date formats the plugin will accept/return
* ThemeRoller support

Copyright info
--------------

* Copyright &copy; 2011, Jeremy McDuffie, all rights reserved
* Dual-licensed under the BSD and MIT licenses.