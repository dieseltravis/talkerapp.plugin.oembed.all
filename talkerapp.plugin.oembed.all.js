/*!
 * jquery oembed plugin
 *
 * Copyright (c) 2009 Richard Chamorro
 * Licensed under the MIT license
 * 
 * Orignal Author: Richard Chamorro 
 * Forked by Andrew Mee to Provide a slightly diffent kind of embedding experience
 */
(function(e){var l=e("#jqoembeddata");e.fn.oembed=function(d,b,a){c=e.extend(!0,e.fn.oembed.defaults,b);e.fn.oembed.providers=[];e.each(c.oembedProviders,function(){e.fn.oembed.providers.push(new e.fn.oembed.OEmbedProvider(this[0],this[1],this[2],this[3],this[4]))});0===l.length&&(l=e('<span id="jqoembeddata"></span>'),l.appendTo("body"));return this.each(function(){var b=e(this),g=d&&/^(https?\:)?\/\//.test(d)?d:b.attr("href"),f;a?c.onEmbed=a:c.onEmbed||(c.onEmbed=function(a){e.fn.oembed.insertCode(this,
c.embedMethod,a)});if(null!==g&&void 0!==g){for(var h=0,l=c.shortURLList.length;h<l;h++)if(null!==g.match(RegExp("//"+c.shortURLList[h]+"/","i")))return h=e.extend({url:"//api.longurl.org/v2/expand",dataType:"jsonp",data:{url:g,format:"json"},success:function(a){g=a["long-url"];f=e.fn.oembed.getOEmbedProvider(a["long-url"]);null!==f?(f.params=p(c[f.name])||{},f.maxWidth=c.maxWidth,f.maxHeight=c.maxHeight,q(b,g,f)):c.onProviderNotFound.call(b,g)}},c.ajaxOptions||{}),e.ajax(h),b;f=e.fn.oembed.getOEmbedProvider(g);
null!==f?(f.params=p(c[f.name])||{},f.maxWidth=c.maxWidth,f.maxHeight=c.maxHeight,q(b,g,f)):c.onProviderNotFound.call(b,g)}return b})};var c;e.fn.oembed.defaults={maxWidth:null,maxHeight:null,includeHandle:!0,toggler:'<span class="oembedall-closehide">&darr;</span>',togglerDown:"&darr;",togglerUp:"&uarr;",embedMethod:"auto",onProviderNotFound:function(){},beforeEmbed:function(){},afterEmbed:function(){},onEmbed:!1,onError:function(){},ajaxOptions:{},webProxyService:null,shortURLList:[],oembedProviders:[]};
var r=function(d,b){b=b?b:"";return d?r(--d,"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(60*Math.random()))+b):b},t=function(d,b){var a=d.apiendpoint,e="",g,a=a+(0>=a.indexOf("?")?"?":"&"),a=a.replace("#","%23");null===d.maxWidth||"undefined"!==typeof d.params.maxwidth&&null!==d.params.maxwidth||(d.params.maxwidth=d.maxWidth);null===d.maxHeight||"undefined"!==typeof d.params.maxheight&&null!==d.params.maxheight||(d.params.maxheight=d.maxHeight);for(g in d.params)Object.prototype.hasOwnProperty.call(d.params,
g)&&g!==d.callbackparameter&&null!==d.params[g]&&(e+="&"+window.encodeURIComponent(g)+"="+d.params[g]);a+="format="+d.format+"&url="+window.encodeURIComponent(b)+e;"json"!==d.dataType&&(a+="&"+d.callbackparameter+"=?");return a=c.webProxyService?c.webProxyService+window.encodeURIComponent(a):a},m=function(d,b,a){l.data(b,d.code);c.beforeEmbed.call(a,d);c.onEmbed.call(a,d);c.afterEmbed.call(a,d)},q=function(d,b,a){if(void 0!==l.data(b)&&null!==l.data(b)&&"iframe"!==a.embedtag.tag){var k={code:l.data(b)};
m(k,b,d)}else if(a.yql){var k=a.yql.from||"htmlstring",g=a.yql.url?a.yql.url(b):b,f="SELECT * FROM "+k+' WHERE url="'+g+'" and '+(/html/.test(k)?"xpath":"itemPath")+"='"+(a.yql.xpath||"/")+"'";"html"===k&&(f+=" and compat='html5'");k=e.extend({url:"http://query.yahooapis.com/v1/public/yql",dataType:"jsonp",data:{q:f,format:"json",env:"store://datatables.org/alltableswithkeys",callback:"?"},success:function(c){if(a.yql.xpath&&"//meta|//title|//link"===a.yql.xpath){var f={};null===c.query.results&&
(c.query.results={meta:[]});for(var h=0,k=c.query.results.meta.length;h<k;h++){var l=c.query.results.meta[h].name||c.query.results.meta[h].property||null;null!==l&&(f[l.toLowerCase()]=c.query.results.meta[h].content)}f.hasOwnProperty("title")&&f.hasOwnProperty("og:title")||null===c.query.results.title||(f.title=c.query.results.title);if(!f.hasOwnProperty("og:image")&&c.query.results.hasOwnProperty("link"))for(h=0,k=c.query.results.link.length;h<k;h++)c.query.results.link[h].hasOwnProperty("rel")&&
"apple-touch-icon"===c.query.results.link[h].rel&&("/"===c.query.results.link[h].href.charAt(0)?f["og:image"]=g.match(/^(([a-z]+:)?(\/\/)?[^\/]+\/).*$/)[1]+c.query.results.link[h].href:f["og:image"]=c.query.results.link[h].href);c=a.yql.datareturn(f)}else c=a.yql.datareturn?a.yql.datareturn(c.query.results):c.query.results.result;!1!==c&&(f=e.extend({},c),f.code=c,m(f,b,d))},error:c.onError.call(d,b,a)},c.ajaxOptions||{});e.ajax(k)}else if(a.templateRegex)if(""!==a.embedtag.tag){var k=a.embedtag.flashvars||
"",f=a.embedtag.tag||"embed",h=a.embedtag.width||"auto",s=a.embedtag.height||"auto",n=b.replace(a.templateRegex,a.apiendpoint);a.nocache||(n+="&jqoemcache="+r(5));a.apikey&&(n=n.replace("_APIKEY_",c.apikeys[a.name]));h=e("<"+f+"/>").attr("src",n).attr("width",h).attr("height",s).attr("allowfullscreen",a.embedtag.allowfullscreen||"true").attr("allowscriptaccess",a.embedtag.allowfullscreen||"always").css("max-height",c.maxHeight||"auto").css("max-width",c.maxWidth||"auto");"embed"===f?h.attr("type",
a.embedtag.type||"application/x-shockwave-flash").attr("flashvars",b.replace(a.templateRegex,k)):"iframe"===f&&h.attr("scrolling",a.embedtag.scrolling||"no").attr("frameborder",a.embedtag.frameborder||"0");m({code:h},b,d)}else a.apiendpoint?(a.apikey&&(a.apiendpoint=a.apiendpoint.replace("_APIKEY_",c.apikeys[a.name])),e.ajax(e.extend({url:b.replace(a.templateRegex,a.apiendpoint),dataType:"jsonp",success:function(c){var f=e.extend({},c);f.code=a.templateData(c);m(f,b,d)},error:c.onError.call(d,b,a)},
c.ajaxOptions||{}))):m({code:b.replace(a.templateRegex,a.template)},b,d);else k=t(a,b),e.ajax(e.extend({url:k,dataType:a.dataType||"jsonp",success:function(a){a=e.extend({},a);switch(a.type){case "file":case "photo":a.code=e.fn.oembed.getPhotoCode(b,a);break;case "video":case "rich":a.code=e.fn.oembed.getRichCode(b,a);break;default:a.code=e.fn.oembed.getGenericCode(b,a)}m(a,b,d)},error:c.onError.call(d,b,a)},c.ajaxOptions||{}))},p=function(d){if(null===d)return null;var b,a={};for(b in d)Object.prototype.hasOwnProperty.call(d,
b)&&null!==b&&(a[b.toLowerCase()]=d[b]);return a};e.fn.oembed.insertCode=function(d,b,a){if(null!==a)switch("auto"===b&&null!==d.attr("href")?b="append":"auto"===b&&(b="replace"),b){case "replace":d.replaceWith(a.code);break;case "fill":d.html(a.code);break;case "append":d.wrap('<div class="oembedall-container"></div>');b=d.parent();c.includeHandle&&c.toggler&&e(c.toggler).insertBefore(d).click(function(){var a=e(this),b=window.encodeURIComponent(e("<i>"+c.togglerUp+"</i>").text()),d=window.encodeURIComponent(a.text());
a.html(d===b?c.togglerDown:c.togglerUp);a.parent().children().last().toggle()});b.append("<br/>");try{a.code.clone().appendTo(b)}catch(k){b.append(a.code)}if(c.maxWidth)if(d=b.parent().width(),a=e("iframe",b),d<c.maxWidth){b=a.width();var g=a.height();d=b/d;a.width(b/d);a.height(g/d)}else c.maxWidth&&a.width(c.maxWidth),c.maxHeight&&a.height(c.maxHeight)}};e.fn.oembed.getPhotoCode=function(d,b){var a;a=b.title?b.title:"";a+=b.author_name?" - "+b.author_name:"";a+=b.provider_name?" - "+b.provider_name:
"";if(b.url)a='<div><a href="'+d+"\" target='_blank'><img src=\""+b.url+'" alt="'+a+'"/></a></div>';else if(b.thumbnail_url){var c=b.thumbnail_url.replace("_s","_b");a='<div><a href="'+d+"\" target='_blank'><img src=\""+c+'" alt="'+a+'"/></a></div>'}else a="<div>Error loading this picture</div>";b.html&&(a+="<div>"+b.html+"</div>");return a};e.fn.oembed.getRichCode=function(d,b){return b.html};e.fn.oembed.getGenericCode=function(d,b){var a='<a href="'+d+'">'+(null!==b.title?b.title:d)+"</a>";b.html&&
(a+="<div>"+b.html+"</div>");return a};e.fn.oembed.getOEmbedProvider=function(d){for(var b=0;b<e.fn.oembed.providers.length;b++)for(var a=0,c=e.fn.oembed.providers[b].urlschemes.length;a<c;a++)if(null!==d.match(RegExp(e.fn.oembed.providers[b].urlschemes[a],"i")))return e.fn.oembed.providers[b];return null};e.fn.oembed.OEmbedProvider=function(c,b,a,e,g){this.name=c;this.type=b;this.urlschemes=a;this.apiendpoint=e;this.maxWidth=500;this.maxHeight=400;g=g||{};g.useYQL&&(g.yql="xml"===g.useYQL?{xpath:"//oembed/html",
from:"xml",apiendpoint:this.apiendpoint,url:function(a){return this.apiendpoint+"?format=xml&url="+a},datareturn:function(a){return a.html.replace(/.*\[CDATA\[(.*)\]\]>$/,"$1")||""}}:{from:"json",apiendpoint:this.apiendpoint,url:function(a){return this.apiendpoint+"?format=json&url="+a},datareturn:function(a){return"video"!==a.json.type&&(a.json.url||a.json.thumbnail_url)?'<img src="'+(a.json.url||a.json.thumbnail_url)+'" />':a.json.html||""}},this.apiendpoint=null);for(var f in g)Object.prototype.hasOwnProperty.call(g,
f)&&(this[f]=g[f]);this.format=this.format||"json";this.callbackparameter=this.callbackparameter||"callback";this.embedtag=this.embedtag||{tag:""}};e.fn.updateOEmbedProvider=function(c,b,a,k,g){for(var f=0;f<e.fn.oembed.providers.length;f++)if(e.fn.oembed.providers[f].name===c&&(null!==b&&(e.fn.oembed.providers[f].type=b),null!==a&&(e.fn.oembed.providers[f].urlschemes=a),null!==k&&(e.fn.oembed.providers[f].apiendpoint=k),null!==g)){e.fn.oembed.providers[f].extraSettings=g;for(var h in g)null!==h&&
null!==g[h]&&(e.fn.oembed.providers[f][h]=g[h])}}})(this.jQuery);

plugin.oembedAll = {
	icon: "data:image/gif;base64,R0lGODlhEAAQAPUAAGZmZmhoaG1tbXd3d39/f4WFhYiIiI+Pj5+fn6urq6+vr7S0tLq6ur6+vsHBwcXFxcjIyM7OztLS0tjY2NnZ2d7e3uLi4uTk5Ozs7Pb29vj4+P///4uLi8nJydPT09TU1Obm5urq6oaGhsbGxsrKyn19fcvLy9/f3+Dg4Lu7u/Hx8fn5+Wpqam5uboyMjLa2tsfHx8/Pz+vr6/T09Pv7+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/i1NYWRlIGJ5IEtyYXNpbWlyYSBOZWpjaGV2YSAod3d3LmxvYWRpbmZvLm5ldCkAIfkEAQoAGwAsAAAAABAAEAAABXXgJo5blpEoeT3QlY7mJjmOVJ4kdhhXRVcXwwFDoggCkY3lookABBRShrHAiTILhlVDfIkwGlFi0PA2BolSAYDwIgCG8GRh8V4U0RGmm+N/CwR1IxYEBX5GATYREDIBAhUkGg8OGhSOFBoOD2EvhIFeKBcuKSEAIfkEAQoABgAsAAAAABAAEAAABnlAg3BILBoNmcUicxRmmJ4AwKMBgTREzIEDCnEOoYrDUSFSBIEIkhkZf4gZxpIIenQwQw3++MRgDQkDDU0NAwlIHAAITQgAHEwUCiBNIApvQxh7RCFMmwUEFkQVBAUhZmhqEalSZXkPDhofaBQaDg9/RhYEoE1FVkdBACH5BAEKAAUALAAAAAAQABAAAAaAwIJwSCwaC5nFInMUZpieAMCDZBIxBw4oxDmEQN0QkSIIRKqFCEBAIWYYS/eCYS1oME1kBV9IDBpHGSQOIyEZBwAIRxgjDg4gBR4KFk0UIx51GXxEIRgZGkMgIgSUQxUEImJDZAEeGhFnEQECFW4jDRqsFBqEoEcWBKR5RCCQRkEAIfkEAQoABAAsAAAAABAAEAAABntAgnBILBoJmcUicxRmmJ4A4INkEjEHDijEOYRA3RCRIghEqoQIQEAhZhhL94JhJWgwTSHGmhg0mg0DCXYcAAhNCAAcUAoWTSAKVEMZeG4nFhpEIQUljkMfDg4nY2VnEREaHqGSQw8OGh8CAh8hJiaVRhYlnXaZeSAgR0EAIfkEAQoABgAsAAAAABAAEAAABntAg3BILBoNmcUicxRmmJ5AwINkEjEHDijEOYRABS+RIghEqoYIQEAhZhhL94KhGWowTSGmbkgMGk0NAwlIHACERwgAHFAJbUcgClRDGXhFGJZDIQUEKAYadSgEBSFjZR4YHhGpAWxFDw0ZHg4OHhkOD3kUtI95SBS2RkEAIfkEAQoABgAsAAAAABAAEAAABn1Ag3BILBoNmcUicxRmmJ4A4INkEjEHDijEOYRA3RCRIghEqoYIQEAhZhhL94JhNWgwTSHGmhg0mg0DCUgHAAhNCAAcTB8KIE0gClRCGigndXqYBicODpNCJwQFYkMenR4ZESZpUidXqiEfAmwaDg8aRRpMKAQEKHlEII9GQQAh+QQBCgAFACwAAAAAEAAQAAAGfcCCcEgsGguZxSJzFGZUBU8g4CmomETMgQMKcQ4h0BdDpAgCESQzEhBQiKvUkphMrYahCrQZumMeDiRYRSkDCSsgDg4Pe0UIABwZGR4PFHdGIAlvBSsZGGRFn0UhIgQWRBUEIiFlZ1URaVJuRQ92Hq4ri00FFgSmu0QgIEdBACH5BAEKAAEALAAAAAAQABAAAAaAwIBwSCwaA7PXa3YM0EAgmofF8iCZxIrDQZFxXBjQV0b0bGPXQAzQohBlHRiImGzQhjTMDGvE3GkJAw1NDQMJNDMuAAhNCAAcTB8KFk0gCm5DMxhGMmREIAUElEMVBAWeQhQtAB40MR1qLG1ENDB2Hy0tHzQOMHdHFgSiTUVQR0EAOw=="
};

plugin.onMessageInsertion = function (event) {
	var $anchor = Talker.getLastInsertion().find('a');

	if ($anchor.hasClass('transformed')) {
		return true; // Do not transform the link a second time.
	} else {
		var anyErrors = false,
			$loading = $("<img src='" + plugin.oembedAll.icon + "' width='32' height='32' style='position:relative' />");

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
				["vimeo", "video", ["www\.vimeo\.com\/groups\/.*\/videos\/.*", "www\.vimeo\.com\/.*", "vimeo\.com\/groups\/.*\/videos\/.*", "vimeo\.com\/.*"], "//vimeo.com/api/oembed.json"],
				["dailymotion", "video", ["dailymotion\\.com/.+"], '//www.dailymotion.com/services/oembed'],
				["Spotify", "rich", ["open.spotify.com/(track|album|user)/"], "https://embed.spotify.com/oembed/"],
				["mixcloud", "rich", ["mixcloud.com/.+"], '//www.mixcloud.com/oembed/', {
					useYQL: 'json'
				}],
				["rdio.com", "rich", ["rd.io/.+", "rdio.com"], "//www.rdio.com/api/oembed/"],
				["Soundcloud", "rich", ["soundcloud.com/.+", "snd.sc/.+"], "//soundcloud.com/oembed", {
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
				["deviantart", "photo", ["deviantart.com/.+", "fav.me/.+", "deviantart.com/.+"], "//backend.deviantart.com/oembed", {
					format: 'jsonp'
				}],
				["imgur.com", "photo", ["imgur\\.com/gallery/.+"], "//imgur.com/$1l.jpg", {
					templateRegex: /.*gallery\/([^\/]+).*/,
					embedtag: {
						tag: 'img'
					},
					nocache: 1
				}],
				["twitter", "rich", ["twitter.com/.+"], "https://api.twitter.com/1/statuses/oembed.json"],
				["meetup", "rich", ["meetup\\.(com|ps)/.+"], "//api.meetup.com/oembed"],
				["ebay", "rich", ["ebay\\.*"], "//togo.ebay.com/togo/togo.swf?2008013100", {
					templateRegex: /.*\/([^\/]+)\/(\d{10,13}).*/,
					embedtag: {
						width: 355,
						height: 300,
						flashvars: "base=http://togo.ebay.com/togo/&lang=en-us&mode=normal&itemid=$2&query=$1"
					}
				}],
				["wikipedia", "rich", ["wikipedia.org/wiki/.+"], "//$1.wikipedia.org/w/api.php?action=parse&page=$2&format=json&section=0&callback=?", {
					templateRegex: /.*\/\/([\w]+).*\/wiki\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.parse) return false;
						var text = data.parse['text']['*'].replace(/href="\/wiki/g, 'href="http://en.wikipedia.org/wiki');
						return '<div id="content"><h3><a class="nav-link" href="http://en.wikipedia.org/wiki/' + data.parse['displaytitle'] + '">' + data.parse['displaytitle'] + '</a></h3>' + text + '</div>';
					}
				}],
				["imdb", "rich", ["imdb.com/title/.+"], "//www.imdbapi.com/?i=$1&callback=?", {
					templateRegex: /.*\/title\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.Title) return false;
						return '<div id="content"><h3><a class="nav-link" href="http://imdb.com/title/' + data.imdbID + '/">' + data.Title + '</a> (' + data.Year + ')</h3><p>Rating: ' + data.imdbRating + '<br/>Genre: ' + data.Genre + '<br/>Starring: ' + data.Actors + '</p></div>  <div id="view-photo-caption">' + data.Plot + '</div></div>';
					}
				}],
				["jsbin", "rich", ["jsbin.com/.+"], "//jsbin.com/$1/?", {
					templateRegex: /.*com\/([^\/]+).*/,
					embedtag: {
						tag: 'iframe',
						width: '100%',
						height: '300'
					}
				}],
				["github", "rich", ["gist.github.com/.+"], "https://github.com/api/oembed"],
				["github", "rich", ["github.com/[-.\\w@]+/[-.\\w@]+"], "https://api.github.com/repos/$1/$2?callback=?", {
					templateRegex: /.*\/([^\/]+)\/([^\/]+).*/,
					templateData: function (data) {
						if (!data.data.html_url) return false;
						return '<div class="oembedall-githubrepos"><ul class="oembedall-repo-stats"><li>' + data.data.language + '</li><li class="oembedall-watchers"><a title="Watchers" href="' + data.data.html_url + '/watchers">&#x25c9; ' + data.data.watchers + '</a></li>' + '<li class="oembedall-forks"><a title="Forks" href="' + data.data.html_url + '/network">&#x0265; ' + data.data.forks + '</a></li></ul><h3><a href="' + data.data.html_url + '">' + data.data.name + '</a></h3><div class="oembedall-body"><p class="oembedall-description">' + data.data.description + '</p>' + '<p class="oembedall-updated-at">Last updated: ' + data.data.pushed_at + '</p></div></div>';
					}
				}],
				["facebook", "rich", ["facebook.com/(people/[^\\/]+/\\d+|[^\\/]+$)"], "https://graph.facebook.com/$2$3/?callback=?", {
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
						if (data.founded) out += 'Founded: <strong>' + data.founded + '</strong><br>'
						if (data.category) out += 'Category: <strong>' + data.category + '</strong><br>';
						if (data.website) out += 'Website: <strong><a href="' + data.website + '">' + data.website + '</a></strong><br>';
						if (data.gender) out += 'Gender: <strong>' + data.gender + '</strong><br>';
						if (data.description) out += data.description + '<br>';
						out += '</div></div>';
						return out;
					}
				}],
				["stackoverflow", "rich", ["stackoverflow.com/questions/[\\d]+"], "http://api.stackoverflow.com/1.1/questions/$1?body=true&jsonp=?", {
					templateRegex: /.*questions\/([\d]+).*/,
					templateData: function (data) {
						if (!data.questions) return false;
						var q = data.questions[0];
						var body = $(q.body).text();
						var out = '<div class="oembedall-stoqembed"><div class="oembedall-statscontainer"><div class="oembedall-statsarrow"></div><div class="oembedall-stats"><div class="oembedall-vote"><div class="oembedall-votes">' + '<span class="oembedall-vote-count-post"><strong>' + (q.up_vote_count - q.down_vote_count) + '</strong></span><div class="oembedall-viewcount">vote(s)</div></div>' + '</div><div class="oembedall-status"><strong>' + q.answer_count + '</strong>answer</div></div><div class="oembedall-views">' + q.view_count + ' view(s)</div></div>' + '<div class="oembedall-summary"><h3><a class="oembedall-question-hyperlink" href="http://stackoverflow.com/questions/' + q.question_id + '/">' + q.title + '</a></h3>' + '<div class="oembedall-excerpt">' + body.substring(0, 100) + '...</div><div class="oembedall-tags">';
						for (i in q.tags)
							out += '<a title="" class="oembedall-post-tag" href="http://stackoverflow.com/questions/tagged/' + q.tags[i] + '">' + q.tags[i] + '</a>';
						out += '</div><div class="oembedall-fr"><div class="oembedall-user-info"><div class="oembedall-user-gravatar32"><a href="http://stackoverflow.com/users/' + q.owner.user_id + '/' + q.owner.display_name + '">' + '<img width="32" height="32" alt="" src="http://www.gravatar.com/avatar/' + q.owner.email_hash + '?s=32&amp;d=identicon&amp;r=PG"></a></div><div class="oembedall-user-details">' + '<a href="http://stackoverflow.com/users/' + q.owner.user_id + '/' + q.owner.display_name + '">' + q.owner.display_name + '</a><br><span title="reputation score" class="oembedall-reputation-score">' + q.owner.reputation + '</span></div></div></div></div></div>';
						return out;
					}
				}],
				["wordpress", "rich", ["wordpress\\.com/.+", "blogs\\.cnn\\.com/.+", "techcrunch\\.com/.+", "wp\\.me/.+", "brandlogic\\.com\\/blog"], "//public-api.wordpress.com/oembed/1.0/?for=jquery-oembed-all"],
				["kickstarter", "rich", ["kickstarter\\.com/projects/.+"], "$1/widget/card.html", {
					templateRegex: /([^\?]+).*/,
					embedtag: {
						tag: 'iframe',
						width: '220',
						height: 380
					}
				}],
				["amazon", "rich", ["amzn.com/B+", "amazon.com.*/(B\\S+)($|\\/.*)"], "//rcm.amazon.com/e/cm?t=_APIKEY_&o=1&p=8&l=as1&asins=$1&ref=qf_br_asin_til&fc1=000000&IS2=1&lt1=_blank&m=amazon&lc1=0000FF&bc1=000000&bg1=FFFFFF&f=ifr", {
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
						"youtube.com/embed"
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
