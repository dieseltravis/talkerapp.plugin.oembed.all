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
			shortURLList: [ "bit.ly" ],
			oembedProviders: [
              [
                "flickr", 
                "photo", 
                [
                  "flickr\\.com/photos/.+"
                ],
                "//flickr.com/services/oembed",
                {
                  callbackparameter:'jsoncallback'
                }
              ],
              [
                "youtube", 
                "video", 
                [
                  "youtube\\.com/watch.+v=[\\w-]+&?", 
                  "youtu\\.be/[\\w-]+",
                  "youtube.com/embed"
                ], 
                '//www.youtube.com/embed/$1?wmode=transparent', 
                {
	              templateRegex: /.*(?:v\=|be\/|embed\/)([\w\-]+)&?.*/,
	              embedtag: {tag: 'iframe',width: '425',height: '349'}
                }
              ]

            ]
		});
    } 
};
