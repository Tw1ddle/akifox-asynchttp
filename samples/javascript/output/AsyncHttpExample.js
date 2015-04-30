(function () { "use strict";
var AsyncHttpExample = function() { };
AsyncHttpExample.__name__ = true;
AsyncHttpExample.setContent = function(id,content) {
	var d = window.document.getElementById(id);
	if(d == null) js.Lib.alert("Unknown element : " + id);
	d.innerHTML = content;
};
AsyncHttpExample.main = function() {
	com.akifox.asynchttp.AsyncHttp.logEnabled = true;
	com.akifox.asynchttp.AsyncHttp.errorSafe = true;
	new com.akifox.asynchttp.AsyncHttpRequest({ url : "test.html", callback : function(response) {
		if(response.get_isOK()) AsyncHttpExample.setContent("asynchttp-text",response.get_content()); else AsyncHttpExample.setContent("asynchttp-text","ERROR -> " + response.get_status());
	}}).send();
	new com.akifox.asynchttp.AsyncHttpRequest({ url : "test.xml", callback : function(response1) {
		if(response1.get_isOK()) {
			AsyncHttpExample.setContent("asynchttp-xml-print",StringTools.htmlEscape(response1.get_content()));
			AsyncHttpExample.setContent("asynchttp-xml-code",response1.get_content());
		} else AsyncHttpExample.setContent("asynchttp-xml","ERROR -> " + response1.get_status());
	}}).send();
	new com.akifox.asynchttp.AsyncHttpRequest({ url : "test.js", callback : function(response2) {
		if(response2.get_isOK()) {
			AsyncHttpExample.setContent("asynchttp-js-print",response2.get_content());
			AsyncHttpExample.setContent("asynchttp-js-code",response2.get_content());
		} else AsyncHttpExample.setContent("asynchttp-js-print","ERROR -> " + response2.get_status());
	}}).send();
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw "EReg::matched";
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.exists = function(it,f) {
	var $it0 = it.iterator();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var XmlType = { __ename__ : true, __constructs__ : [] };
var Xml = function() {
};
Xml.__name__ = true;
Xml.parse = function(str) {
	return haxe.xml.Parser.parse(str);
};
Xml.createElement = function(name) {
	var r = new Xml();
	r.nodeType = Xml.Element;
	r._children = new Array();
	r._attributes = new haxe.ds.StringMap();
	r.set_nodeName(name);
	return r;
};
Xml.createPCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.PCData;
	r.set_nodeValue(data);
	return r;
};
Xml.createCData = function(data) {
	var r = new Xml();
	r.nodeType = Xml.CData;
	r.set_nodeValue(data);
	return r;
};
Xml.createComment = function(data) {
	var r = new Xml();
	r.nodeType = Xml.Comment;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocType = function(data) {
	var r = new Xml();
	r.nodeType = Xml.DocType;
	r.set_nodeValue(data);
	return r;
};
Xml.createProcessingInstruction = function(data) {
	var r = new Xml();
	r.nodeType = Xml.ProcessingInstruction;
	r.set_nodeValue(data);
	return r;
};
Xml.createDocument = function() {
	var r = new Xml();
	r.nodeType = Xml.Document;
	r._children = new Array();
	return r;
};
Xml.prototype = {
	get_nodeName: function() {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName;
	}
	,set_nodeName: function(n) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._nodeName = n;
	}
	,set_nodeValue: function(v) {
		if(this.nodeType == Xml.Element || this.nodeType == Xml.Document) throw "bad nodeType";
		return this._nodeValue = v;
	}
	,set: function(att,value) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		this._attributes.set(att,value);
	}
	,exists: function(att) {
		if(this.nodeType != Xml.Element) throw "bad nodeType";
		return this._attributes.exists(att);
	}
	,addChild: function(x) {
		if(this._children == null) throw "bad nodetype";
		if(x._parent != null) HxOverrides.remove(x._parent._children,x);
		x._parent = this;
		this._children.push(x);
	}
};
var com = {};
com.akifox = {};
com.akifox.asynchttp = {};
com.akifox.asynchttp.AsyncHttpTransferMode = { __ename__ : true, __constructs__ : ["UNDEFINED","FIXED","CHUNKED"] };
com.akifox.asynchttp.AsyncHttpTransferMode.UNDEFINED = ["UNDEFINED",0];
com.akifox.asynchttp.AsyncHttpTransferMode.UNDEFINED.__enum__ = com.akifox.asynchttp.AsyncHttpTransferMode;
com.akifox.asynchttp.AsyncHttpTransferMode.FIXED = ["FIXED",1];
com.akifox.asynchttp.AsyncHttpTransferMode.FIXED.__enum__ = com.akifox.asynchttp.AsyncHttpTransferMode;
com.akifox.asynchttp.AsyncHttpTransferMode.CHUNKED = ["CHUNKED",2];
com.akifox.asynchttp.AsyncHttpTransferMode.CHUNKED.__enum__ = com.akifox.asynchttp.AsyncHttpTransferMode;
com.akifox.asynchttp.ContentKind = { __ename__ : true, __constructs__ : ["XML","JSON","IMAGE","TEXT","BYTES"] };
com.akifox.asynchttp.ContentKind.XML = ["XML",0];
com.akifox.asynchttp.ContentKind.XML.__enum__ = com.akifox.asynchttp.ContentKind;
com.akifox.asynchttp.ContentKind.JSON = ["JSON",1];
com.akifox.asynchttp.ContentKind.JSON.__enum__ = com.akifox.asynchttp.ContentKind;
com.akifox.asynchttp.ContentKind.IMAGE = ["IMAGE",2];
com.akifox.asynchttp.ContentKind.IMAGE.__enum__ = com.akifox.asynchttp.ContentKind;
com.akifox.asynchttp.ContentKind.TEXT = ["TEXT",3];
com.akifox.asynchttp.ContentKind.TEXT.__enum__ = com.akifox.asynchttp.ContentKind;
com.akifox.asynchttp.ContentKind.BYTES = ["BYTES",4];
com.akifox.asynchttp.ContentKind.BYTES.__enum__ = com.akifox.asynchttp.ContentKind;
com.akifox.asynchttp.AsyncHttp = function() {
	this.REGEX_FILENAME = new EReg("([^?/]*)($|\\?.*)","");
	this.REGEX_URL = new EReg("^(https?)://([^/\\?:]+)(:\\d+|)(/[^\\?]*|)(\\?.*|)","");
};
com.akifox.asynchttp.AsyncHttp.__name__ = true;
com.akifox.asynchttp.AsyncHttp.log = function(message) {
	if(com.akifox.asynchttp.AsyncHttp.logEnabled) console.log(message);
};
com.akifox.asynchttp.AsyncHttp.error = function(message) {
	if(com.akifox.asynchttp.AsyncHttp.errorSafe) console.log(message); else throw message;
};
com.akifox.asynchttp.AsyncHttp.prototype = {
	determineContentKind: function(contentType) {
		var contentKind = com.akifox.asynchttp.ContentKind.BYTES;
		var _g = 0;
		var _g1 = com.akifox.asynchttp.AsyncHttp._contentKindMatch;
		while(_g < _g1.length) {
			var el = _g1[_g];
			++_g;
			if(el.regex.match(contentType)) {
				contentKind = el.kind;
				break;
			}
		}
		return contentKind;
	}
	,determineBinary: function(contentKind) {
		if(contentKind == com.akifox.asynchttp.ContentKind.BYTES || contentKind == com.akifox.asynchttp.ContentKind.IMAGE) return true;
		return false;
	}
	,determineContentType: function(headers) {
		var contentType = "text/plain";
		if(headers != null) {
			if(headers.exists("content-type")) contentType = headers.get("content-type");
		}
		return contentType;
	}
	,determineFilename: function(url) {
		var filename = "";
		var rx = this.REGEX_FILENAME;
		if(rx.match(url)) filename = rx.matched(1);
		if(filename == "") filename = "untitled";
		return filename;
	}
	,elapsedTime: function(start) {
		return Std["int"]((haxe.Timer.stamp() - start) * 1000) / 1000;
	}
	,send: function(request) {
		request.finalise();
		this.useHaxeHttp(request);
	}
	,useHaxeHttp: function(request) {
		var _g = this;
		if(request == null) return;
		var start = haxe.Timer.stamp();
		var url = request.get_url();
		var status = 0;
		var headers = new haxe.ds.StringMap();
		var content = null;
		var contentType = "text/plain";
		var contentIsBinary = this.determineBinary(this.determineContentKind(contentType));
		var filename = this.determineFilename(request.get_url());
		var r = new haxe.Http(request.get_url());
		r.async = true;
		if(request.get_content() != null) r.setPostData(Std.string(request.get_content()));
		var httpstatusDone = false;
		r.onError = function(msg) {
			com.akifox.asynchttp.AsyncHttp.error("" + request.get_fingerprint() + " ERROR: Request failed -> " + msg);
			var time = _g.elapsedTime(start);
			if(request.get_callback() != null) (request.get_callback())(new com.akifox.asynchttp.AsyncHttpResponse(request,time,url,headers,status,content,contentIsBinary,filename));
		};
		r.onData = function(data) {
			if(!httpstatusDone) status = 200;
			var time1 = _g.elapsedTime(start);
			content = data;
			com.akifox.asynchttp.AsyncHttp.log("" + request.get_fingerprint() + " INFO: Response Complete " + status + " (" + time1 + " s)\n> " + request.get_method() + " " + request.get_url());
			if(request.get_callback() != null) (request.get_callback())(new com.akifox.asynchttp.AsyncHttpResponse(request,time1,url,headers,status,content,contentIsBinary,filename));
		};
		r.onStatus = function(http_status) {
			status = http_status;
			com.akifox.asynchttp.AsyncHttp.log("" + request.get_fingerprint() + " INFO: Response HTTP Status " + status);
			httpstatusDone = true;
		};
		r.request(request.get_content() != null);
	}
	,randomUID: function(size) {
		if(size == null) size = 32;
		var nchars = com.akifox.asynchttp.AsyncHttp.UID_CHARS.length;
		var uid = new StringBuf();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			uid.addChar((function($this) {
				var $r;
				var index = Std.random(nchars);
				$r = HxOverrides.cca(com.akifox.asynchttp.AsyncHttp.UID_CHARS,index);
				return $r;
			}(this)));
		}
		return uid.b;
	}
};
com.akifox.asynchttp.AsyncHttpMethod = function() { };
com.akifox.asynchttp.AsyncHttpMethod.__name__ = true;
com.akifox.asynchttp.AsyncHttpMethod.validate = function(value) {
	if(value == null || HxOverrides.indexOf(com.akifox.asynchttp.AsyncHttpMethod.METHODS,value,0) == -1) value = "GET";
	return value;
};
com.akifox.asynchttp.AsyncHttpRequest = function(options) {
	this._callback = null;
	this._contentIsBinary = false;
	this._contentType = "application/x-www-form-urlencoded";
	this._content = null;
	this._method = "GET";
	this._async = true;
	this._timeout = 10;
	this._finalised = false;
	this._fingerprint = new com.akifox.asynchttp.AsyncHttp().randomUID(8);
	if(options != null) {
		if(options.async != null) this.set_async(options.async);
		if(options.url != null) this.set_url(options.url);
		if(options.callback != null) this.set_callback(options.callback);
		if(options.headers != null) this._headers = options.headers;
		if(options.timeout != null) this.set_timeout(options.timeout);
		if(options.method != null) this.set_method(options.method);
		if(options.content != null) this.set_content(options.content);
		if(options.contentType != null) this.set_contentType(options.contentType);
		if(options.contentIsBinary != null) this.set_contentIsBinary(options.contentIsBinary);
	}
};
com.akifox.asynchttp.AsyncHttpRequest.__name__ = true;
com.akifox.asynchttp.AsyncHttpRequest.prototype = {
	toString: function() {
		return "[AsyncHttpRequest <" + this._fingerprint + "> (" + this._method + " " + this._url + ")]";
	}
	,clone: function() {
		return new com.akifox.asynchttp.AsyncHttpRequest({ async : this._async, url : this._url, callback : this._callback, headers : this._headers, timeout : this._timeout, method : this._method, content : this._content, contentType : this._contentType, contentIsBinary : this._contentIsBinary});
	}
	,send: function() {
		new com.akifox.asynchttp.AsyncHttp().send(this);
	}
	,finalise: function() {
		this._finalised = true;
	}
	,get_fingerprint: function() {
		return this._fingerprint;
	}
	,get_headers: function() {
		return this._headers;
	}
	,addHeader: function(header,value) {
		this._headers.set(header,value);
		value;
		return this;
	}
	,get_timeout: function() {
		return this._timeout;
	}
	,set_timeout: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.timeout] Can't modify a property when the instance is already sent");
			return this._timeout;
		}
		if(value < 1) value = 1;
		return this._timeout = value;
	}
	,get_async: function() {
		return this._async;
	}
	,set_async: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.async] Can't modify a property when the instance is already sent");
			return this._async;
		}
		return this._async = value;
	}
	,get_url: function() {
		return this._url;
	}
	,set_url: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.url] Can't modify a property when the instance is already sent");
			return this._url;
		}
		return this._url = value;
	}
	,get_method: function() {
		return this._method;
	}
	,set_method: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.method] Can't modify a property when the instance is already sent");
			return this._method;
		}
		value = com.akifox.asynchttp.AsyncHttpMethod.validate(value);
		return this._method = value;
	}
	,get_content: function() {
		return this._content;
	}
	,set_content: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.content] Can't modify a property when the instance is already sent");
			return this._content;
		}
		return this._content = value;
	}
	,get_contentType: function() {
		return this._contentType;
	}
	,set_contentType: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.contentType] Can't modify a property when the instance is already sent");
			return this._contentType;
		}
		if(value == null) value = "application/x-www-form-urlencoded";
		var ahttp = new com.akifox.asynchttp.AsyncHttp();
		this._contentIsBinary = ahttp.determineBinary(ahttp.determineContentKind(value));
		return this._contentType = value;
	}
	,get_contentIsBinary: function() {
		return this._contentIsBinary;
	}
	,set_contentIsBinary: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.contentIsBinary] Can't modify a property when the instance is already sent");
			return this._contentIsBinary;
		}
		return this._contentIsBinary = value;
	}
	,get_callback: function() {
		return this._callback;
	}
	,set_callback: function(value) {
		if(this._finalised) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpRequest " + this._fingerprint + " ERROR: [.callback] Can't modify a property when the instance is already sent");
			return this._callback;
		}
		return this._callback = value;
	}
};
com.akifox.asynchttp.AsyncHttpResponse = function(request,time,url,headers,status,content,contentIsBinary,filename) {
	this._request = request;
	this._time = time;
	this._url = url;
	this._status = status;
	this._isOK = this._status >= 200 && this._status < 400;
	this._headers = headers;
	this._contentIsBinary = contentIsBinary;
	this._contentRaw = content;
	if(!this._contentIsBinary) this._content = this.toText(); else this._content = this._contentRaw;
	this._filename = filename;
	if(this._headers.exists("content-type")) this._contentType = this._headers.get("content-type"); else this._contentType = "text/plain";
	this._contentLength = 0;
	if(this._headers.exists("content-length")) this._contentLength = Std.parseInt(this._headers.get("content-length")); else if(content != null) this._contentLength = this._content.length;
	this._contentKind = new com.akifox.asynchttp.AsyncHttp().determineContentKind(this._contentType);
};
com.akifox.asynchttp.AsyncHttpResponse.__name__ = true;
com.akifox.asynchttp.AsyncHttpResponse.prototype = {
	toString: function() {
		return "[AsyncHttpResponse <" + this._fingerprint + "> (isOK " + Std.string(this._isOK) + ", status " + this._status + ", " + this._contentLength + " bytes in " + this._time + " sec)]";
	}
	,get_isBinary: function() {
		return this._contentIsBinary;
	}
	,get_isText: function() {
		return !this._contentIsBinary;
	}
	,get_isXml: function() {
		return this._contentKind == com.akifox.asynchttp.ContentKind.XML;
	}
	,get_isJson: function() {
		return this._contentKind == com.akifox.asynchttp.ContentKind.JSON;
	}
	,get_isImage: function() {
		return this._contentKind == com.akifox.asynchttp.ContentKind.IMAGE;
	}
	,toXml: function() {
		var _contentXml = null;
		try {
			_contentXml = Xml.parse(this.toText());
		} catch( msg ) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpResponse " + this._fingerprint + " ERROR: parse Xml -> " + Std.string(msg));
		}
		return _contentXml;
	}
	,toJson: function() {
		var _contentJson = null;
		try {
			_contentJson = JSON.parse(this.toText());
		} catch( msg ) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpResponse " + this._fingerprint + " ERROR: parse Json -> " + Std.string(msg));
		}
		return _contentJson;
	}
	,toText: function() {
		var _contentText = null;
		try {
			_contentText = Std.string(this._contentRaw);
		} catch( msg ) {
			com.akifox.asynchttp.AsyncHttp.error("AsyncHttpResponse " + this._fingerprint + " ERROR: parse Text -> " + Std.string(msg));
		}
		return _contentText;
	}
	,get_fingerprint: function() {
		return this._request.get_fingerprint();
	}
	,get_url: function() {
		return this._url;
	}
	,get_headers: function() {
		return this._headers;
	}
	,get_status: function() {
		return this._status;
	}
	,get_content: function() {
		return this._content;
	}
	,get_contentRaw: function() {
		return this._contentRaw;
	}
	,get_contentType: function() {
		return this._contentType;
	}
	,get_contentIsBinary: function() {
		return this._contentIsBinary;
	}
	,get_contentLength: function() {
		return this._contentLength;
	}
	,get_time: function() {
		return this._time;
	}
	,get_filename: function() {
		return this._filename;
	}
	,get_isOK: function() {
		return this._isOK;
	}
};
var haxe = {};
haxe.Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
};
haxe.Http.__name__ = true;
haxe.Http.prototype = {
	setPostData: function(data) {
		this.postData = data;
		return this;
	}
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js.Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) return;
			var s;
			try {
				s = r.status;
			} catch( e ) {
				s = null;
			}
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else switch(s) {
			case 12029:
				me.req = null;
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.req = null;
				me.onError("Unknown host");
				break;
			default:
				me.req = null;
				me.responseData = r.responseText;
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.iterator();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += encodeURIComponent(p.param) + "=" + encodeURIComponent(p.value);
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e1 ) {
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.iterator();
		while( $it1.hasNext() ) {
			var h1 = $it1.next();
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) onreadystatechange(null);
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
};
haxe.Timer = function() { };
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
};
haxe.io = {};
haxe.io.Bytes = function() { };
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.prototype = {
	getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
};
haxe.io.Eof = function() { };
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; return $x; };
haxe.xml = {};
haxe.xml.Parser = function() { };
haxe.xml.Parser.__name__ = true;
haxe.xml.Parser.parse = function(str) {
	var doc = Xml.createDocument();
	haxe.xml.Parser.doParse(str,0,doc);
	return doc;
};
haxe.xml.Parser.doParse = function(str,p,parent) {
	if(p == null) p = 0;
	var xml = null;
	var state = 1;
	var next = 1;
	var aname = null;
	var start = 0;
	var nsubs = 0;
	var nbrackets = 0;
	var c = str.charCodeAt(p);
	var buf = new StringBuf();
	while(!(c != c)) {
		switch(state) {
		case 0:
			switch(c) {
			case 10:case 13:case 9:case 32:
				break;
			default:
				state = next;
				continue;
			}
			break;
		case 1:
			switch(c) {
			case 60:
				state = 0;
				next = 2;
				break;
			default:
				start = p;
				state = 13;
				continue;
			}
			break;
		case 13:
			if(c == 60) {
				var child = Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start));
				buf = new StringBuf();
				parent.addChild(child);
				nsubs++;
				state = 0;
				next = 2;
			} else if(c == 38) {
				buf.addSub(str,start,p - start);
				state = 18;
				next = 13;
				start = p + 1;
			}
			break;
		case 17:
			if(c == 93 && str.charCodeAt(p + 1) == 93 && str.charCodeAt(p + 2) == 62) {
				var child1 = Xml.createCData(HxOverrides.substr(str,start,p - start));
				parent.addChild(child1);
				nsubs++;
				p += 2;
				state = 1;
			}
			break;
		case 2:
			switch(c) {
			case 33:
				if(str.charCodeAt(p + 1) == 91) {
					p += 2;
					if(HxOverrides.substr(str,p,6).toUpperCase() != "CDATA[") throw "Expected <![CDATA[";
					p += 5;
					state = 17;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) == 68 || str.charCodeAt(p + 1) == 100) {
					if(HxOverrides.substr(str,p + 2,6).toUpperCase() != "OCTYPE") throw "Expected <!DOCTYPE";
					p += 8;
					state = 16;
					start = p + 1;
				} else if(str.charCodeAt(p + 1) != 45 || str.charCodeAt(p + 2) != 45) throw "Expected <!--"; else {
					p += 2;
					state = 15;
					start = p + 1;
				}
				break;
			case 63:
				state = 14;
				start = p;
				break;
			case 47:
				if(parent == null) throw "Expected node name";
				start = p + 1;
				state = 0;
				next = 10;
				break;
			default:
				state = 3;
				start = p;
				continue;
			}
			break;
		case 3:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(p == start) throw "Expected node name";
				xml = Xml.createElement(HxOverrides.substr(str,start,p - start));
				parent.addChild(xml);
				state = 0;
				next = 4;
				continue;
			}
			break;
		case 4:
			switch(c) {
			case 47:
				state = 11;
				nsubs++;
				break;
			case 62:
				state = 9;
				nsubs++;
				break;
			default:
				state = 5;
				start = p;
				continue;
			}
			break;
		case 5:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				var tmp;
				if(start == p) throw "Expected attribute name";
				tmp = HxOverrides.substr(str,start,p - start);
				aname = tmp;
				if(xml.exists(aname)) throw "Duplicate attribute";
				state = 0;
				next = 6;
				continue;
			}
			break;
		case 6:
			switch(c) {
			case 61:
				state = 0;
				next = 7;
				break;
			default:
				throw "Expected =";
			}
			break;
		case 7:
			switch(c) {
			case 34:case 39:
				state = 8;
				start = p;
				break;
			default:
				throw "Expected \"";
			}
			break;
		case 8:
			if(c == str.charCodeAt(start)) {
				var val = HxOverrides.substr(str,start + 1,p - start - 1);
				xml.set(aname,val);
				state = 0;
				next = 4;
			}
			break;
		case 9:
			p = haxe.xml.Parser.doParse(str,p,xml);
			start = p;
			state = 1;
			break;
		case 11:
			switch(c) {
			case 62:
				state = 1;
				break;
			default:
				throw "Expected >";
			}
			break;
		case 12:
			switch(c) {
			case 62:
				if(nsubs == 0) parent.addChild(Xml.createPCData(""));
				return p;
			default:
				throw "Expected >";
			}
			break;
		case 10:
			if(!(c >= 97 && c <= 122 || c >= 65 && c <= 90 || c >= 48 && c <= 57 || c == 58 || c == 46 || c == 95 || c == 45)) {
				if(start == p) throw "Expected node name";
				var v = HxOverrides.substr(str,start,p - start);
				if(v != parent.get_nodeName()) throw "Expected </" + parent.get_nodeName() + ">";
				state = 0;
				next = 12;
				continue;
			}
			break;
		case 15:
			if(c == 45 && str.charCodeAt(p + 1) == 45 && str.charCodeAt(p + 2) == 62) {
				parent.addChild(Xml.createComment(HxOverrides.substr(str,start,p - start)));
				p += 2;
				state = 1;
			}
			break;
		case 16:
			if(c == 91) nbrackets++; else if(c == 93) nbrackets--; else if(c == 62 && nbrackets == 0) {
				parent.addChild(Xml.createDocType(HxOverrides.substr(str,start,p - start)));
				state = 1;
			}
			break;
		case 14:
			if(c == 63 && str.charCodeAt(p + 1) == 62) {
				p++;
				var str1 = HxOverrides.substr(str,start + 1,p - start - 2);
				parent.addChild(Xml.createProcessingInstruction(str1));
				state = 1;
			}
			break;
		case 18:
			if(c == 59) {
				var s = HxOverrides.substr(str,start,p - start);
				if(s.charCodeAt(0) == 35) {
					var i;
					if(s.charCodeAt(1) == 120) i = Std.parseInt("0" + HxOverrides.substr(s,1,s.length - 1)); else i = Std.parseInt(HxOverrides.substr(s,1,s.length - 1));
					buf.add(String.fromCharCode(i));
				} else if(!haxe.xml.Parser.escapes.exists(s)) buf.b += Std.string("&" + s + ";"); else buf.add(haxe.xml.Parser.escapes.get(s));
				start = p + 1;
				state = next;
			}
			break;
		}
		c = StringTools.fastCodeAt(str,++p);
	}
	if(state == 1) {
		start = p;
		state = 13;
	}
	if(state == 13) {
		if(p != start || nsubs == 0) parent.addChild(Xml.createPCData(buf.b + HxOverrides.substr(str,start,p - start)));
		return p;
	}
	throw "Unexpected end";
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Browser = function() { };
js.Browser.__name__ = true;
js.Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw "Unable to create XMLHttpRequest object.";
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
Xml.Element = "element";
Xml.PCData = "pcdata";
Xml.CData = "cdata";
Xml.Comment = "comment";
Xml.DocType = "doctype";
Xml.ProcessingInstruction = "processingInstruction";
Xml.Document = "document";
com.akifox.asynchttp.AsyncHttp.USER_AGENT = "akifox-asynchttp";
com.akifox.asynchttp.AsyncHttp.DEFAULT_CONTENT_TYPE = "text/plain";
com.akifox.asynchttp.AsyncHttp.DEFAULT_FILENAME = "untitled";
com.akifox.asynchttp.AsyncHttp._contentKindMatch = [{ kind : com.akifox.asynchttp.ContentKind.IMAGE, regex : new EReg("^image/(jpe?g|png|gif)","i")},{ kind : com.akifox.asynchttp.ContentKind.XML, regex : new EReg("(application/xml|text/xml|\\+xml)","i")},{ kind : com.akifox.asynchttp.ContentKind.JSON, regex : new EReg("^(application/json|\\+json)","i")},{ kind : com.akifox.asynchttp.ContentKind.TEXT, regex : new EReg("(^text|application/javascript)","i")}];
com.akifox.asynchttp.AsyncHttp.logEnabled = false;
com.akifox.asynchttp.AsyncHttp.errorSafe = true;
com.akifox.asynchttp.AsyncHttp.UID_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
com.akifox.asynchttp.AsyncHttpMethod.GET = "GET";
com.akifox.asynchttp.AsyncHttpMethod.POST = "POST";
com.akifox.asynchttp.AsyncHttpMethod.PUT = "PUT";
com.akifox.asynchttp.AsyncHttpMethod.DELETE = "DELETE";
com.akifox.asynchttp.AsyncHttpMethod.METHODS = ["GET","POST","PUT","DELETE"];
com.akifox.asynchttp.AsyncHttpMethod.DEFAULT_METHOD = "GET";
com.akifox.asynchttp.AsyncHttpRequest.DEFAULT_CONTENT_TYPE = "application/x-www-form-urlencoded";
haxe.xml.Parser.escapes = (function($this) {
	var $r;
	var h = new haxe.ds.StringMap();
	h.set("lt","<");
	h.set("gt",">");
	h.set("amp","&");
	h.set("quot","\"");
	h.set("apos","'");
	h.set("nbsp",String.fromCharCode(160));
	$r = h;
	return $r;
}(this));
AsyncHttpExample.main();
})();
