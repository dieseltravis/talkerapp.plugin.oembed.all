var getScript = function (url, success) {
    var script = document.createElement('script');
    script.src = url;
    var head = document.getElementsByTagName('head')[0],
        done = false;
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState
           || this.readyState == 'loaded'
           || this.readyState == 'complete')) {
        done = true;
        success();
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);
      }
    };
    head.appendChild(script);
};

getScript('//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',function() {

/*!
 * jquery oembed plugin
 * custom branch: https://github.com/dieseltravis/jquery-oembed-all/tree/patch-1
 * Copyright (c) 2009 Richard Chamorro
 * Licensed under the MIT license
 *
 * Orignal Author: Richard Chamorro
 * Forked by Andrew Mee to Provide a slightly diffent kind of embedding
 * experience
 */
(function ($) {
	var $jqoembeddata = $('#jqoembeddata');
	$.fn.oembed = function (url, options, embedAction) {

		settings = $.extend(true, $.fn.oembed.defaults, options);

		$.fn.oembed.providers = [];
		$.each(settings.oembedProviders, function () {
			$.fn.oembed.providers.push(new $.fn.oembed.OEmbedProvider(this[0], this[1], this[2], this[3], this[4]));
		});

		if ($jqoembeddata.length === 0) {
			$jqoembeddata = $('<span id="jqoembeddata"></span>');
			$jqoembeddata.appendTo('body');
		}

		return this.each(function () {

			var container = $(this),
				resourceURL = (url && /^(https?\:)?\/\//.test(url)) ? url : container.attr("href"),
				provider;

			if (embedAction) {
				settings.onEmbed = embedAction;
			} else if (!settings.onEmbed) {
				settings.onEmbed = function (oembedData) {
					$.fn.oembed.insertCode(this, settings.embedMethod, oembedData);
				};
			}

			if (resourceURL !== null && resourceURL !== undefined) {
				//Check if shorten URL
				for (var j = 0, l = settings.shortURLList.length; j < l; j++) {
					var regExp = new RegExp('//' + settings.shortURLList[j] + '/', "i");
					if (resourceURL.match(regExp) !== null) {
						//AJAX to http://api.longurl.org/v2/expand?url=http://bit.ly/JATvIs&format=json&callback=hhh
						var ajaxopts = $.extend({
							url: "//api.longurl.org/v2/expand",
							dataType: 'jsonp',
							data: {
								url: resourceURL,
								format: "json"
								//callback: "?"
							},
							success: function (data) {
								//this = $.fn.oembed;
								resourceURL = data['long-url'];
								provider = $.fn.oembed.getOEmbedProvider(data['long-url']);

								if (provider !== null) {
									provider.params = getNormalizedParams(settings[provider.name]) || {};
									provider.maxWidth = settings.maxWidth;
									provider.maxHeight = settings.maxHeight;
									embedCode(container, resourceURL, provider);
								} else {
									settings.onProviderNotFound.call(container, resourceURL);
								}
							}
						}, settings.ajaxOptions || {}); // function only created once within loop then loop exits

						$.ajax(ajaxopts);

						return container;
					}
				}
				provider = $.fn.oembed.getOEmbedProvider(resourceURL);

				if (provider !== null) {
					provider.params = getNormalizedParams(settings[provider.name]) || {};
					provider.maxWidth = settings.maxWidth;
					provider.maxHeight = settings.maxHeight;
					embedCode(container, resourceURL, provider);
				} else {
					settings.onProviderNotFound.call(container, resourceURL);
				}
			}

			return container;
		});

	};

	var settings;

	// Plugin defaults
	$.fn.oembed.defaults = {
		maxWidth: null,
		maxHeight: null,
		includeHandle: true,

		// template for expand collapse customization
		toggler: '<span class="oembedall-closehide">&darr;</span>',
		togglerDown: "&darr;",
		togglerUp: "&uarr;",

		embedMethod: 'auto',
		// "auto", "append", "fill"		
		onProviderNotFound: function () {},
		beforeEmbed: function () {},
		afterEmbed: function () {},
		onEmbed: false,
		onError: function () {},
		ajaxOptions: {},

		// web service to get urls over HTTP and return them (through HTTPS), e.g. "https://someproxy.com/get?url="
		webProxyService: null,
		// only match specified short url provider regex fragments:
		shortURLList: [ /* "bit\\.ly" */ ],
		// only use the providers passed in
		oembedProviders: [
			//["youtube", "video", ["youtube\\.com/watch.+v=[\\w-]+&?", "youtu\\.be/[\\w-]+","youtube.com/embed"], 'http://www.youtube.com/embed/$1?wmode=transparent', {
			//	templateRegex: /.*(?:v\=|be\/|embed\/)([\w\-]+)&?.*/,
			//	embedtag: {tag: 'iframe',width: '425',height: '349'}
			//}]
		]
	};

	/* Private functions */
	//TODO: just use Math.random() instead?
	var rand = function (length, current) { //Found on http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
		current = current ? current : '';
		return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
	},

		getRequestUrl = function (provider, externalUrl) {
			var url = provider.apiendpoint,
				qs = "",
				i;

			url += (url.indexOf("?") <= 0) ? "?" : "&";
			url = url.replace('#', '%23');

			if (provider.maxWidth !== null && (typeof provider.params.maxwidth === 'undefined' || provider.params.maxwidth === null)) {
				provider.params.maxwidth = provider.maxWidth;
			}

			if (provider.maxHeight !== null && (typeof provider.params.maxheight === 'undefined' || provider.params.maxheight === null)) {
				provider.params.maxheight = provider.maxHeight;
			}

			//TODO: use $.each
			for (i in provider.params) {
				if (Object.prototype.hasOwnProperty.call(provider.params, i)) {
					// We don't want them to jack everything up by changing the callback parameter
					if (i === provider.callbackparameter) {
						continue;
					}

					// allows the options to be set to null, don't send null values to the server as parameters
					if (provider.params[i] !== null) {
						qs += "&" + window.encodeURIComponent(i) + "=" + provider.params[i];
					}
				}
			}

			url += "format=" + provider.format + "&url=" + window.encodeURIComponent(externalUrl) + qs;
			if (provider.dataType !== 'json') {
				url += "&" + provider.callbackparameter + "=?";
			}

			url = (settings.webProxyService) ? settings.webProxyService + window.encodeURIComponent(url) : url;

			return url;
		},

		success = function (oembedData, externalUrl, container) {
			$jqoembeddata.data(externalUrl, oembedData.code);
			settings.beforeEmbed.call(container, oembedData);
			settings.onEmbed.call(container, oembedData);
			settings.afterEmbed.call(container, oembedData);
		},

		embedCode = function (container, externalUrl, embedProvider) {
			if ($jqoembeddata.data(externalUrl) !== undefined && $jqoembeddata.data(externalUrl) !== null && embedProvider.embedtag.tag !== 'iframe') {
				var oembedData = {
					code: $jqoembeddata.data(externalUrl)
				};
				success(oembedData, externalUrl, container);
			} else if (embedProvider.yql) {
				var from = embedProvider.yql.from || 'htmlstring';
				var url = embedProvider.yql.url ? embedProvider.yql.url(externalUrl) : externalUrl;
				var query = 'SELECT * FROM ' + from + ' WHERE url="' + (url) + '"' + " and " + (/html/.test(from) ? 'xpath' : 'itemPath') + "='" + (embedProvider.yql.xpath || '/') + "'";
				if (from === 'html') {
					query += " and compat='html5'";
				}
				var ajaxopts = $.extend({
					url: "http://query.yahooapis.com/v1/public/yql",
					dataType: 'jsonp',
					data: {
						q: query,
						format: "json",
						env: 'store://datatables.org/alltableswithkeys',
						callback: "?"
					},
					success: function (data) {
						var result;
						if (embedProvider.yql.xpath && embedProvider.yql.xpath === '//meta|//title|//link') {
							var meta = {};
							if (data.query.results === null) {
								data.query.results = {
									"meta": []
								};
							}
							for (var i = 0, m = data.query.results.meta.length; i < m; i++) {
								var name = data.query.results.meta[i].name || data.query.results.meta[i].property || null;
								if (name === null) {
									continue;
								}
								meta[name.toLowerCase()] = data.query.results.meta[i].content;
							}
							if (!meta.hasOwnProperty("title") || !meta.hasOwnProperty("og:title")) {
								if (data.query.results.title !== null) {
									meta.title = data.query.results.title;
								}
							}
							if (!meta.hasOwnProperty("og:image") && data.query.results.hasOwnProperty("link")) {
								for (var j = 0, l = data.query.results.link.length; j < l; j++) {
									if (data.query.results.link[j].hasOwnProperty("rel")) {
										if (data.query.results.link[j].rel === "apple-touch-icon") {
											if (data.query.results.link[j].href.charAt(0) === "/") {
												meta["og:image"] = url.match(/^(([a-z]+:)?(\/\/)?[^\/]+\/).*$/)[1] + data.query.results.link[j].href;
											} else {
												meta["og:image"] = data.query.results.link[j].href;
											}
										}
									}
								}
							}
							result = embedProvider.yql.datareturn(meta);
						} else {
							result = embedProvider.yql.datareturn ? embedProvider.yql.datareturn(data.query.results) : data.query.results.result;
						}
						if (result === false) {
							return;
						}
						var oembedData = $.extend({}, result);
						oembedData.code = result;
						success(oembedData, externalUrl, container);
					},
					error: settings.onError.call(container, externalUrl, embedProvider)
				}, settings.ajaxOptions || {});

				$.ajax(ajaxopts);
			} else if (embedProvider.templateRegex) {
				if (embedProvider.embedtag.tag !== '') {
					var flashvars = embedProvider.embedtag.flashvars || '';
					var tag = embedProvider.embedtag.tag || 'embed';
					var width = embedProvider.embedtag.width || 'auto';
					// never used?
					//var nocache = embedProvider.embedtag.nocache || 0;
					var height = embedProvider.embedtag.height || 'auto';
					var src = externalUrl.replace(embedProvider.templateRegex, embedProvider.apiendpoint);
					if (!embedProvider.nocache) {
						src += '&jqoemcache=' + rand(5);
					}
					if (embedProvider.apikey) {
						src = src.replace('_APIKEY_', settings.apikeys[embedProvider.name]);
					}

					var code = $('<' + tag + '/>')
						.attr('src', src)
						.attr('width', width)
						.attr('height', height)
						.attr('allowfullscreen', embedProvider.embedtag.allowfullscreen || 'true')
						.attr('allowscriptaccess', embedProvider.embedtag.allowfullscreen || 'always')
						.css('max-height', settings.maxHeight || 'auto')
						.css('max-width', settings.maxWidth || 'auto');
					if (tag === 'embed') {
						code
							.attr('type', embedProvider.embedtag.type || "application/x-shockwave-flash")
							.attr('flashvars', externalUrl.replace(embedProvider.templateRegex, flashvars));
					} else if (tag === 'iframe') {
						code
							.attr('scrolling', embedProvider.embedtag.scrolling || "no")
							.attr('frameborder', embedProvider.embedtag.frameborder || "0");
					}

					success({
						code: code
					}, externalUrl, container);
				} else if (embedProvider.apiendpoint) {
					//Add APIkey if true
					if (embedProvider.apikey) {
						embedProvider.apiendpoint = embedProvider.apiendpoint.replace('_APIKEY_', settings.apikeys[embedProvider.name]);
					}
					$.ajax($.extend({
						url: externalUrl.replace(embedProvider.templateRegex, embedProvider.apiendpoint),
						dataType: 'jsonp',
						success: function (data) {
							var oembedData = $.extend({}, data);
							oembedData.code = embedProvider.templateData(data);
							success(oembedData, externalUrl, container);
						},
						error: settings.onError.call(container, externalUrl, embedProvider)
					}, settings.ajaxOptions || {}));
				} else {
					success({
						code: externalUrl.replace(embedProvider.templateRegex, embedProvider.template)
					}, externalUrl, container);
				}
			} else {

				var requestUrl = getRequestUrl(embedProvider, externalUrl);

				$.ajax($.extend({
					url: requestUrl,
					dataType: embedProvider.dataType || 'jsonp',
					success: function (data) {
						var oembedData = $.extend({}, data);
						switch (oembedData.type) {
						case "file": //Deviant Art has this
						case "photo":
							oembedData.code = $.fn.oembed.getPhotoCode(externalUrl, oembedData);
							break;
						case "video":
						case "rich":
							oembedData.code = $.fn.oembed.getRichCode(externalUrl, oembedData);
							break;
						default:
							oembedData.code = $.fn.oembed.getGenericCode(externalUrl, oembedData);
							break;
						}
						success(oembedData, externalUrl, container);
					},
					error: settings.onError.call(container, externalUrl, embedProvider)
				}, settings.ajaxOptions || {}));
			}
		},

		getNormalizedParams = function (params) {
			if (params === null) {
				return null;
			}
			var key, normalizedParams = {};
			for (key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key) && key !== null) {
					normalizedParams[key.toLowerCase()] = params[key];
				}
			}
			return normalizedParams;
		};

	/* Public functions */
	$.fn.oembed.insertCode = function (container, embedMethod, oembedData) {
		if (oembedData === null) {
			return;
		}
		if (embedMethod === 'auto' && container.attr("href") !== null) {
			embedMethod = 'append';
		} else if (embedMethod === 'auto') {
			embedMethod = 'replace';
		}
		switch (embedMethod) {
		case "replace":
			container.replaceWith(oembedData.code);
			break;
		case "fill":
			container.html(oembedData.code);
			break;
		case "append":
			container.wrap('<div class="oembedall-container"></div>');
			var oembedContainer = container.parent();
			if (settings.includeHandle && settings.toggler) {
				$(settings.toggler).insertBefore(container).click(function () {
					var $span = $(this),
						encodedUp = window.encodeURIComponent($("<i>" + settings.togglerUp + "</i>").text()),
						encodedString = window.encodeURIComponent($span.text());

					$span.html((encodedString === encodedUp) ? settings.togglerDown : settings.togglerUp);
					$span.parent().children().last().toggle();
				});
			}
			oembedContainer.append('<br/>');
			try {
				oembedData.code.clone().appendTo(oembedContainer);
			} catch (e) {
				oembedContainer.append(oembedData.code);
			}
			/* Make videos semi-responsive
			 * If parent div width less than embeded iframe video then iframe gets shrunk to fit smaller width
			 * If parent div width greater thans embed iframe use the max width
			 * - works on youtubes and vimeo
			 */
			if (settings.maxWidth) {
				var post_width = oembedContainer.parent().width();
				var $iframe = $('iframe', oembedContainer);
				if (post_width < settings.maxWidth) {
					var iframe_width_orig = $iframe.width();
					var iframe_height_orig = $iframe.height();
					var ratio = iframe_width_orig / post_width;
					$iframe.width(iframe_width_orig / ratio);
					$iframe.height(iframe_height_orig / ratio);
				} else {
					if (settings.maxWidth) {
						$iframe.width(settings.maxWidth);
					}
					if (settings.maxHeight) {
						$iframe.height(settings.maxHeight);
					}
				}
			}
			break;
		}
	};

	$.fn.oembed.getPhotoCode = function (url, oembedData) {
		var code,
			alt = oembedData.title ? oembedData.title : '';
		alt += oembedData.author_name ? ' - ' + oembedData.author_name : '';
		alt += oembedData.provider_name ? ' - ' + oembedData.provider_name : '';
		if (oembedData.url) {
			code = '<div><a href="' + url + '" target=\'_blank\'><img src="' + oembedData.url + '" alt="' + alt + '"/></a></div>';
		} else if (oembedData.thumbnail_url) {
			var newURL = oembedData.thumbnail_url.replace('_s', '_b');
			code = '<div><a href="' + url + '" target=\'_blank\'><img src="' + newURL + '" alt="' + alt + '"/></a></div>';
		} else {
			code = '<div>Error loading this picture</div>';
		}
		if (oembedData.html) {
			code += "<div>" + oembedData.html + "</div>";
		}
		return code;
	};

	$.fn.oembed.getRichCode = function (url, oembedData) {
		var code = oembedData.html;
		return code;
	};

	$.fn.oembed.getGenericCode = function (url, oembedData) {
		var title = (oembedData.title !== null) ? oembedData.title : url,
			code = '<a href="' + url + '">' + title + '</a>';
		if (oembedData.html) {
			code += "<div>" + oembedData.html + "</div>";
		}
		return code;
	};

	$.fn.oembed.getOEmbedProvider = function (url) {
		for (var i = 0; i < $.fn.oembed.providers.length; i++) {
			for (var j = 0, l = $.fn.oembed.providers[i].urlschemes.length; j < l; j++) {
				var regExp = new RegExp($.fn.oembed.providers[i].urlschemes[j], "i");
				if (url.match(regExp) !== null) {
					return $.fn.oembed.providers[i];
				}
			}
		}
		return null;
	};

	$.fn.oembed.OEmbedProvider = function (name, type, urlschemesarray, apiendpoint, extraSettings) {
		this.name = name;
		this.type = type; // "photo", "video", "link", "rich", null
		this.urlschemes = urlschemesarray;
		this.apiendpoint = apiendpoint;
		this.maxWidth = 500;
		this.maxHeight = 400;
		extraSettings = extraSettings || {};

		if (extraSettings.useYQL) {

			if (extraSettings.useYQL === 'xml') {
				extraSettings.yql = {
					xpath: "//oembed/html",
					from: 'xml',
					apiendpoint: this.apiendpoint,
					url: function (externalurl) {
						return this.apiendpoint + '?format=xml&url=' + externalurl;
					},
					datareturn: function (results) {
						return results.html.replace(/.*\[CDATA\[(.*)\]\]>$/, '$1') || '';
					}
				};
			} else {
				extraSettings.yql = {
					from: 'json',
					apiendpoint: this.apiendpoint,
					url: function (externalurl) {
						return this.apiendpoint + '?format=json&url=' + externalurl;
					},
					datareturn: function (results) {
						if (results.json.type !== 'video' && (results.json.url || results.json.thumbnail_url)) {
							return '<img src="' + (results.json.url || results.json.thumbnail_url) + '" />';
						}
						return results.json.html || '';
					}
				};
			}
			this.apiendpoint = null;
		}

		for (var property in extraSettings) {
			if (Object.prototype.hasOwnProperty.call(extraSettings, property)) {
				this[property] = extraSettings[property];
			}
		}

		this.format = this.format || 'json';
		this.callbackparameter = this.callbackparameter || "callback";
		this.embedtag = this.embedtag || {
			tag: ""
		};

	};

	/*
	 * Function to update existing providers
	 *
	 * @param  {String}    name             The name of the provider
	 * @param  {String}    type             The type of the provider can be "file", "photo", "video", "rich"
	 * @param  {String}    urlshemesarray   Array of url of the provider
	 * @param  {String}    apiendpoint      The endpoint of the provider
	 * @param  {String}    extraSettings    Extra settings of the provider
	 */
	$.fn.updateOEmbedProvider = function (name, type, urlschemesarray, apiendpoint, extraSettings) {
		for (var i = 0; i < $.fn.oembed.providers.length; i++) {
			if ($.fn.oembed.providers[i].name === name) {
				if (type !== null) {
					$.fn.oembed.providers[i].type = type;
				}
				if (urlschemesarray !== null) {
					$.fn.oembed.providers[i].urlschemes = urlschemesarray;
				}
				if (apiendpoint !== null) {
					$.fn.oembed.providers[i].apiendpoint = apiendpoint;
				}
				if (extraSettings !== null) {
					$.fn.oembed.providers[i].extraSettings = extraSettings;
					for (var property in extraSettings) {
						if (property !== null && extraSettings[property] !== null) {
							$.fn.oembed.providers[i][property] = extraSettings[property];
						}
					}
				}
			}
		}
	};

})(window.jQuery);

// Note MD5 String extension removed
//TODO: include md5 and all known providers and short urls in separate file?

// begin Talker plugin code
//var plugin = this.plugin,
//	Talker = this.Talker;

plugin.oembedAll = {
	icon: "data:image/gif;base64,R0lGODlhEAAQAPUAAGZmZmhoaG1tbXd3d39/f4WFhYiIiI+Pj5+fn6urq6+vr7S0tLq6ur6+vsHBwcXFxcjIyM7OztLS0tjY2NnZ2d7e3uLi4uTk5Ozs7Pb29vj4+P///4uLi8nJydPT09TU1Obm5urq6oaGhsbGxsrKyn19fcvLy9/f3+Dg4Lu7u/Hx8fn5+Wpqam5uboyMjLa2tsfHx8/Pz+vr6/T09Pv7+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/i1NYWRlIGJ5IEtyYXNpbWlyYSBOZWpjaGV2YSAod3d3LmxvYWRpbmZvLm5ldCkAIfkEAQoAGwAsAAAAABAAEAAABXXgJo5blpEoeT3QlY7mJjmOVJ4kdhhXRVcXwwFDoggCkY3lookABBRShrHAiTILhlVDfIkwGlFi0PA2BolSAYDwIgCG8GRh8V4U0RGmm+N/CwR1IxYEBX5GATYREDIBAhUkGg8OGhSOFBoOD2EvhIFeKBcuKSEAIfkEAQoABgAsAAAAABAAEAAABnlAg3BILBoNmcUicxRmmJ4AwKMBgTREzIEDCnEOoYrDUSFSBIEIkhkZf4gZxpIIenQwQw3++MRgDQkDDU0NAwlIHAAITQgAHEwUCiBNIApvQxh7RCFMmwUEFkQVBAUhZmhqEalSZXkPDhofaBQaDg9/RhYEoE1FVkdBACH5BAEKAAUALAAAAAAQABAAAAaAwIJwSCwaC5nFInMUZpieAMCDZBIxBw4oxDmEQN0QkSIIRKqFCEBAIWYYS/eCYS1oME1kBV9IDBpHGSQOIyEZBwAIRxgjDg4gBR4KFk0UIx51GXxEIRgZGkMgIgSUQxUEImJDZAEeGhFnEQECFW4jDRqsFBqEoEcWBKR5RCCQRkEAIfkEAQoABAAsAAAAABAAEAAABntAgnBILBoJmcUicxRmmJ4A4INkEjEHDijEOYRA3RCRIghEqoQIQEAhZhhL94JhJWgwTSHGmhg0mg0DCXYcAAhNCAAcUAoWTSAKVEMZeG4nFhpEIQUljkMfDg4nY2VnEREaHqGSQw8OGh8CAh8hJiaVRhYlnXaZeSAgR0EAIfkEAQoABgAsAAAAABAAEAAABntAg3BILBoNmcUicxRmmJ5AwINkEjEHDijEOYRABS+RIghEqoYIQEAhZhhL94KhGWowTSGmbkgMGk0NAwlIHACERwgAHFAJbUcgClRDGXhFGJZDIQUEKAYadSgEBSFjZR4YHhGpAWxFDw0ZHg4OHhkOD3kUtI95SBS2RkEAIfkEAQoABgAsAAAAABAAEAAABn1Ag3BILBoNmcUicxRmmJ4A4INkEjEHDijEOYRA3RCRIghEqoYIQEAhZhhL94JhNWgwTSHGmhg0mg0DCUgHAAhNCAAcTB8KIE0gClRCGigndXqYBicODpNCJwQFYkMenR4ZESZpUidXqiEfAmwaDg8aRRpMKAQEKHlEII9GQQAh+QQBCgAFACwAAAAAEAAQAAAGfcCCcEgsGguZxSJzFGZUBU8g4CmomETMgQMKcQ4h0BdDpAgCESQzEhBQiKvUkphMrYahCrQZumMeDiRYRSkDCSsgDg4Pe0UIABwZGR4PFHdGIAlvBSsZGGRFn0UhIgQWRBUEIiFlZ1URaVJuRQ92Hq4ri00FFgSmu0QgIEdBACH5BAEKAAEALAAAAAAQABAAAAaAwIBwSCwaA7PXa3YM0EAgmofF8iCZxIrDQZFxXBjQV0b0bGPXQAzQohBlHRiImGzQhjTMDGvE3GkJAw1NDQMJNDMuAAhNCAAcTB8KFk0gCm5DMxhGMmREIAUElEMVBAWeQhQtAB40MR1qLG1ENDB2Hy0tHzQOMHdHFgSiTUVQR0EAOw=="
};

plugin.onMessageInsertion = function (/*event*/) {
	var $anchor = Talker.getLastInsertion().find('a');

	if ($anchor.hasClass('transformed')) {
		return true; // Do not transform the link a second time.
	} else {
		var anyErrors = false,
			$loading = window.jQuery("<img src='" + plugin.oembedAll.icon + "' width='32' height='32' style='position:relative' />");

		// tag as tranformed so we don't do it again
		$anchor.addClass('transformed').oembed(null, {
			embedMethod: "append",
			maxWidth: "800px",
			maxHeight: "600px",
			toggler: '<span class="oembedall-closehide" style="cursor:pointer;padding-right:0.25em;">\u2296</span>',
			togglerDown: "\u2296",
			togglerUp: "\u2295",
			onProviderNotFound: function (u) { 
				console.log("onProviderNotFound");
				console.log(u);
				anyErrors = true; 
			},
			onError: function (u, e) { 
				console.log("onError");
				console.log(u);
				anyErrors = (e.apiendpoint === null); 
			},
			beforeEmbed: function () { 
				//console.log("beforeEmbed");
				if (!anyErrors) {
					$anchor.after($loading);
				}
			},
			afterEmbed: function () { 
				//console.log("afterEmbed");
				//console.log(anyErrors);
				$loading.fadeOut("slow", function () {$loading.remove();});
				if (anyErrors) {
					$loading.remove();
					$anchor.prev(".oembedall-closehide").remove();
				}
			},
			shortURLList: [ "4sq\\.com", "bit\\.ly", "fb\\.me", "flic\\.kr", "goo\\.gl", "lnkd\\.in", "nyti\\.ms", "t\\.co", "tinyurl\\.com", "urlshorteningservicefortwitter\\.com", "wapo\\.st", "youtu\\.be" ],
			oembedProviders: [
				["funnyordie", "video", ["funnyordie\\.com/videos/.+"], "//player.ordienetworks.com/flash/fodplayer.swf?", {
					templateRegex: /.*videos\/([^\/]+)\/([^\/]+)?/,
					embedtag: {
						width: 512,
						height: 328,
						flashvars: "key=$1"
					}
				}],
				["colledgehumour", "video", ["collegehumor\\.com/video/.+"], "//www.collegehumor.com/moogaloop/moogaloop.swf?clip_id=$1&use_node_id=true&fullscreen=1", {
					templateRegex: /.*video\/([^\/]+).*/,
					embedtag: {
						width: 600,
						height: 338
					}
				}],
				["metacafe", "video", ["metacafe\\.com/watch/.+"], "//www.metacafe.com/fplayer/$1/$2.swf", {
					templateRegex: /.*watch\/(\d+)\/(\w+)\/.*/,
					embedtag: {
						width: 400,
						height: 345
					}
				}],
				["twitvid", "video", ["twitvid\\.com/.+"], "//www.twitvid.com/embed.php?guid=$1&autoplay=0", {
					templateRegex: /.*twitvid\.com\/(\w+).*/,
					embedtag: {
						tag: 'iframe',
						width: 480,
						height: 360
					}
				}],
				["blip", "video", ["blip\\.tv/.+"], "//blip.tv/oembed/"],
				["hulu", "video", ["hulu\\.com/watch/.*"], "//www.hulu.com/api/oembed.json"],
				["vimeo", "video", ["www\\.vimeo\\.com\/groups\/.*\/videos\/.*", "www\\.vimeo\\.com\/.*", "vimeo\\.com\/groups\/.*\/videos\/.*", "vimeo\\.com\/.*"], "//vimeo.com/api/oembed.json"],
				["dailymotion", "video", ["dailymotion\\.com/.+"], '//www.dailymotion.com/services/oembed'],
				["Spotify", "rich", ["open\\.spotify\\.com/(track|album|user)/"], "https://embed.spotify.com/oembed/"],
				["mixcloud", "rich", ["mixcloud\\.com/.+"], '//www.mixcloud.com/oembed/', {
					useYQL: 'json'
				}],
				["rdio.com", "rich", ["rd\\.io/.+", "rdio\\.com"], "//www.rdio.com/api/oembed/"],
				["Soundcloud", "rich", ["soundcloud\\.com/.+", "snd.sc/.+"], "//soundcloud.com/oembed", {
					format: 'js'
				}],
				["bandcamp", "rich", ["bandcamp\\.com/album/.+"], null, {
					yql: {
						xpath: "//meta[contains(@content, \\'EmbeddedPlayer\\')]",
						from: 'html',
						datareturn: function (results) {
							return results.meta ? '<iframe width="400" height="100" src="' + results.meta.content + '" allowtransparency="true" frameborder="0"></iframe>' : false;
						}
					}
				}],
				["deviantart", "photo", ["deviantart\\.com/.+", "fav.me/.+", "deviantart.com/.+"], "//backend.deviantart.com/oembed", {
					format: 'jsonp'
				}],
				["imgur.com", "photo", ["imgur\\.com/gallery/.+"], "//imgur.com/$1l.jpg", {
					templateRegex: /.*gallery\/([^\/]+).*/,
					embedtag: {
						tag: 'img'
					},
					nocache: 1
				}],
				["twitter", "rich", ["twitter\\.com/.+"], "https://api.twitter.com/1/statuses/oembed.json"],
				["meetup", "rich", ["meetup\\.(com|ps)/.+"], "//api.meetup.com/oembed"],
				["ebay", "rich", ["ebay\\.*"], "//togo.ebay.com/togo/togo.swf?2008013100", {
					templateRegex: /.*\/([^\/]+)\/(\d{10,13}).*/,
					embedtag: {
						width: 355,
						height: 300,
						flashvars: "base=http://togo.ebay.com/togo/&lang=en-us&mode=normal&itemid=$2&query=$1"
					}
				}],
				["wikipedia", "rich", ["wikipedia\\.org/wiki/.+"], "//$1.wikipedia.org/w/api.php?action=parse&page=$2&format=json&section=0&callback=?", {
					templateRegex: /.*\/\/([\w]+).*\/wiki\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.parse) return false;
						var text = data.parse['text']['*'].replace(/href="\/wiki/g, 'href="http://en.wikipedia.org/wiki');
						return '<div id="content"><h3><a class="nav-link" href="http://en.wikipedia.org/wiki/' + data.parse['displaytitle'] + '">' + data.parse['displaytitle'] + '</a></h3>' + text + '</div>';
					}
				}],
				["imdb", "rich", ["imdb\\.com/title/.+"], "//www.imdbapi.com/?i=$1&callback=?", {
					templateRegex: /.*\/title\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.Title) return false;
						return '<div id="content"><h3><a class="nav-link" href="http://imdb.com/title/' + data.imdbID + '/">' + data.Title + '</a> (' + data.Year + ')</h3><p>Rating: ' + data.imdbRating + '<br/>Genre: ' + data.Genre + '<br/>Starring: ' + data.Actors + '</p></div>  <div id="view-photo-caption">' + data.Plot + '</div></div>';
					}
				}],
				["jsbin", "rich", ["jsbin\\.com/.+"], "//jsbin.com/$1/?", {
					templateRegex: /.*com\/([^\/]+).*/,
					embedtag: {
						tag: 'iframe',
						width: '100%',
						height: '300'
					}
				}],
				//TODO: fix gists
				["gist.github", "rich", ["gist\\.github\\.com\\/.+"], "https://github.com/api/oembed"],
				["github", "rich", ["github\\.com/[-.\\w@]+/[-.\\w@]+"], "https://api.github.com/repos/$1/$2?callback=?", {
					templateRegex: /.*\/([^\/]+)\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.data.html_url) return false;
						return '<div class="oembedall-githubrepos"><ul class="oembedall-repo-stats"><li>' + data.data.language + '</li><li class="oembedall-watchers"><a title="Watchers" href="' + data.data.html_url + '/watchers">&#x25c9; ' + data.data.watchers + '</a></li>' + '<li class="oembedall-forks"><a title="Forks" href="' + data.data.html_url + '/network">&#x0265; ' + data.data.forks + '</a></li></ul><h3><a href="' + data.data.html_url + '">' + data.data.name + '</a></h3><div class="oembedall-body"><p class="oembedall-description">' + data.data.description + '</p>' + '<p class="oembedall-updated-at">Last updated: ' + data.data.pushed_at + '</p></div></div>';
					}
				}],
				["facebook", "rich", ["facebook\\.com/(people/[^\\/]+/\\d+|[^\\/]+$)"], "https://graph.facebook.com/$2$3/?callback=?", {
					templateRegex: /.*facebook.com\/(people\/[^\/]+\/(\d+).*|([^\/]+$))/,
					templateData: function (data) {
						if (!data.id) return false;
						var out = '<div class="oembedall-facebook1"><div class="oembedall-facebook2"><a href="http://www.facebook.com/">facebook</a> ';
						if (data.from) out += '<a href="http://www.facebook.com/' + data.from.id + '">' + data.from.name + '</a>';
						else if (data.link) out += '<a href="' + data.link + '">' + data.name + '</a>';
						else if (data.username) out += '<a href="http://www.facebook.com/' + data.username + '">' + data.name + '</a>';
						else out += '<a href="http://www.facebook.com/' + data.id + '">' + data.name + '</a>';
						out += '</div><div class="oembedall-facebookBody"><div class="contents">';
						if (data.picture) out += '<a href="' + data.link + '"><img src="' + data.picture + '"></a>';
						else out += '<img src="https://graph.facebook.com/' + data.id + '/picture">';
						if (data.from) out += '<a href="' + data.link + '">' + data.name + '</a>';
						if (data.founded) out += 'Founded: <strong>' + data.founded + '</strong><br>';
						if (data.category) out += 'Category: <strong>' + data.category + '</strong><br>';
						if (data.website) out += 'Website: <strong><a href="' + data.website + '">' + data.website + '</a></strong><br>';
						if (data.gender) out += 'Gender: <strong>' + data.gender + '</strong><br>';
						if (data.description) out += data.description + '<br>';
						out += '</div></div>';
						return out;
					}
				}],
				//["stackoverflow", "rich", ["stackoverflow.com/questions/[\\d]+"], "http://api.stackoverflow.com/1.1/questions/$1?body=true&jsonp=?", {
				//	templateRegex: /.*questions\/([\d]+).*/,
				//	templateData: function (data) {
				//		if (!data.questions) return false;
				//		var q = data.questions[0];
				//		var body = $(q.body).text();
				//		var out = '<div class="oembedall-stoqembed"><div class="oembedall-statscontainer"><div class="oembedall-statsarrow"></div><div class="oembedall-stats"><div class="oembedall-vote"><div class="oembedall-votes">' + '<span class="oembedall-vote-count-post"><strong>' + (q.up_vote_count - q.down_vote_count) + '</strong></span><div class="oembedall-viewcount">vote(s)</div></div>' + '</div><div class="oembedall-status"><strong>' + q.answer_count + '</strong>answer</div></div><div class="oembedall-views">' + q.view_count + ' view(s)</div></div>' + '<div class="oembedall-summary"><h3><a class="oembedall-question-hyperlink" href="http://stackoverflow.com/questions/' + q.question_id + '/">' + q.title + '</a></h3>' + '<div class="oembedall-excerpt">' + body.substring(0, 100) + '...</div><div class="oembedall-tags">';
				//		for (var i in q.tags)
				//			out += '<a title="" class="oembedall-post-tag" href="http://stackoverflow.com/questions/tagged/' + q.tags[i] + '">' + q.tags[i] + '</a>';
				//		out += '</div><div class="oembedall-fr"><div class="oembedall-user-info"><div class="oembedall-user-gravatar32"><a href="http://stackoverflow.com/users/' + q.owner.user_id + '/' + q.owner.display_name + '">' + '<img width="32" height="32" alt="" src="http://www.gravatar.com/avatar/' + q.owner.email_hash + '?s=32&amp;d=identicon&amp;r=PG"></a></div><div class="oembedall-user-details">' + '<a href="http://stackoverflow.com/users/' + q.owner.user_id + '/' + q.owner.display_name + '">' + q.owner.display_name + '</a><br><span title="reputation score" class="oembedall-reputation-score">' + q.owner.reputation + '</span></div></div></div></div></div>';
				//		return out;
				//	}
				//}],
				["wordpress", "rich", 
					["wordpress\\.com/.+", "blogs\\.cnn\\.com/.+", "techcrunch\\.com/.+", "wp\\.me/.+", "brandlogic\\.com\\/blog"], 
					"//public-api.wordpress.com/oembed/1.0/?for=jquery-oembed-all"],
				["kickstarter", "rich", ["kickstarter\\.com/projects/.+"], "$1/widget/card.html", {
					templateRegex: /([^\?]+).*/,
					embedtag: {
						tag: 'iframe',
						width: '220',
						height: 380
					}
				}],
				["amazon", "rich", ["amzn\\.com/B+", "amazon\\.com.*/(B\\S+)($|\\/.*)"], "//rcm.amazon.com/e/cm?t=_APIKEY_&o=1&p=8&l=as1&asins=$1&ref=qf_br_asin_til&fc1=000000&IS2=1&lt1=_blank&m=amazon&lc1=0000FF&bc1=000000&bg1=FFFFFF&f=ifr", {
					apikey: true,
					templateRegex: /.*\/(B[0-9A-Z]+)($|\/.*)/,
					embedtag: {
						tag: 'iframe',
						width: '120px',
						height: '240px'
					}
				}],
				[
					"flickr",
					"photo", [
						"flickr\\.com/photos/.+"
					],
					"//flickr.com/services/oembed", {
						callbackparameter: 'jsoncallback'
					}
				],
				[
					"youtube",
					"video", [
						"youtube\\.com/watch.+v=[\\w-]+&?",
						"youtu\\.be/[\\w-]+",
						"youtube\\.com/embed"
					],
					'//www.youtube.com/embed/$1?wmode=transparent', {
						templateRegex: /.*(?:v\=|be\/|embed\/)([\w\-]+)&?.*/,
						embedtag: {
							tag: 'iframe',
							width: '425',
							height: '349'
						}
					}
				]
			]
		});
	} 
};

});
