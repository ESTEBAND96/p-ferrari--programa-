var _elqQ = window._elqQ || [];

function removeURLParameter(url, parameter) {
	var urlparts= url.split('?');   
	if (urlparts.length>=2) {

		var prefix= encodeURIComponent(parameter)+'=';
		var pars= urlparts[1].split(/[&;]/g);

		for (var i= pars.length; i-- > 0;) {    
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
				pars.splice(i, 1);
			}
		}

		url= urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
		return url;
	} else {
		return url;
	}
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function async_load() {
	if (document.contains!=undefined && document.contains(document.getElementById("elqLoader"))) {
		document.getElementById("elqLoader").remove();
	} else if (document.body && document.body.contains && document.body.contains(document.getElementById("elqLoader"))) {
		if (document.getElementById("elqLoader").parentNode != null) {
			document.getElementById("elqLoader").parentNode.removeChild(this);
		}
	}

	var s = document.createElement('script');
	s.type = 'text/javascript';
	s.async = true;
	s.id = 'elqLoader';
	s.src = '//img.en25.com/i/elqCfg.min.js';
	var headArray = document.getElementsByTagName("HEAD");
	var headTag = headArray[0];
	headTag.appendChild(s);					
}   	

function onTrackNeeded(path)     	{
	var elqSafeUrl = location.href.replace("#", "/");
	var elqLocation = elqSafeUrl + "";
	if(path != null){
		elqLocation = elqLocation + "/" + path
	}
	window._elqQ.push(['elqSetSiteId', '171237132']);
	window._elqQ.push(['elqUseFirstPartyCookie', 'trackS3.ferrari.com']);
	window._elqQ.push(['elqTrackPageView', elqLocation]);
	async_load();
}

(function () {
	async_load();
})();

function elqGetCookie(name) {
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var position = cookies[i].indexOf('=');
		if (position > 0 && position < cookies[i].length - 1) {
			var x = cookies[i].substr(0, position);
			var y = cookies[i].substr(position + 1);
			x = x.replace(/^\s+|\s+$/g, '');
			if (x == name) {
				return unescape(y);
			}
		}
	}
	return '';
}

function elqGetCookieSubValue(name, subKey) {
	var cookieValue = elqGetCookie(name);
	if (cookieValue == null || cookieValue == '')
		return '';
	var cookieSubValue = cookieValue.split('&');
	for (var i = 0; i < cookieSubValue.length; i++) {
		var pair = cookieSubValue[i].split('=');
		if (pair.length > 1) {
			if (pair[0] == subKey) {
				GUID = pair[1];
				return pair[1];
			}
		}
	}
	return '';
}

function elqSetCustomerGUID() {
	var elqCustomerGuid = elqGetCookieSubValue('ELOQUA', 'GUID');				
	if (elqCustomerGuid != null && elqCustomerGuid != ''){
		var emailFromUrl = getURLParameter('em');
		if(emailFromUrl != null){
			var iframe = document.createElement('iframe');
			iframe.style = 'display:none';
			iframe.id = 'iframeElq';
			var param = 'emailAddress='+encodeURIComponent(emailFromUrl)+'&elqCookieWrite=0&elqCustomerGUID='+elqCustomerGuid+'&elqSiteID=171237132&elqFormName=TrackMapp&trackedMapp=true'
			iframe.src = 'https://s171237132.t.eloqua.com/e/f2?'+param;
			document.body.appendChild(iframe);
		}
	}else{
		setTimeout(function(){elqSetCustomerGUID()},5000);
	}
	return;
}

function elqSetCustomerGUIDHiddenField(nameForm) {
	var elqCustomerGuid = elqGetCookieSubValue('ELOQUA', 'GUID');				
	if (elqCustomerGuid != null && elqCustomerGuid != ''){
		document.forms[nameForm].elements['elqCustomerGUID'].value = elqCustomerGuid;
	}else{
		setTimeout(function(){elqSetCustomerGUIDHiddenField(nameForm)},5000);
	}
	return;
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

onTrackNeeded();
elqSetCustomerGUID();