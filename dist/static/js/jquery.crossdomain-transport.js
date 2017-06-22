/*
 * jQuery Iframe Transport Plugin
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global define, require, window, document */

;(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS:
        factory(require('jquery'));
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Helper variable to create unique names for the transport iframes:
    var counter = 0;

    // The crossdomain transport accepts one additional options:
    // options.initialIframeSrc: the URL of the initial iframe src,
    //  by default set to "javascript:false;"
    $.ajaxTransport('crossdomain', function (options) {
        if (options.async) {
            // javascript:false as initial iframe src
            // prevents warning popups on HTTPS in IE6:
            var initialIframeSrc = options.initialIframeSrc || 'javascript:false;',
                iframe, callback;
            return {
                _doSend: function (_, completeCallback) {
                    try {
                        window.frames[options.id].xhr.send(options, function () {
                            var xhr = this,
                                status, statusText, responses;
                            // Was never called and is aborted or complete
                            if ( xhr.readyState === 4 ) {
                                responses = {crossdomain:null};
                                status = xhr.status;

                                // Support: IE<10
                                // Accessing binary-data responseText throws an exception
                                // (#11426)
                                if ( typeof xhr.responseText === "string" ) {
                                    try {
                                        responses.crossdomain = $.parseJSON(xhr.responseText);
                                    } catch(e) {
                                        responses.crossdomain = xhr.responseText;
                                    }
                                }

                                // Firefox throws an exception when accessing
                                // statusText for faulty cross-domain requests
                                try {
                                    statusText = xhr.statusText;
                                } catch ( e ) {
                                    // We normalize with Webkit giving an empty statusText
                                    statusText = "";
                                }

                                // Filter status for non standard behaviors

                                // If the request is local and we have data: assume a success
                                // (success with no data won't get notified, that's the best we
                                // can do given current implementations)
                                if ( !status && !options.crossDomain ) {
                                    status = responses.crossdomain ? 200 : 404;

                                    // IE - #1450: sometimes returns 1223 when it should be 204
                                } else if ( status === 1223 ) {
                                    status = 204;
                                }
                            }

                            // Call complete if needed
                            if ( responses ) {
                                completeCallback( status, statusText, responses, xhr.getAllResponseHeaders() );
                            }
                        });
                    } catch (e) {
                    }
                },
                send: function (_, completeCallback) {
                    var self = this;
                    callback = completeCallback;
                    iframe = $(options.id);
                    if(!iframe.length){
                        // IE versions below IE8 cannot set the name property of
                        // elements that have already been added to the DOM,
                        // so we set the name along with the iframe HTML markup:
                        counter += 1;
                        if(!options.id){
                            options.id = 'crossdomain-transport-' + counter;
                        }
                        iframe = $(
                            '<iframe src="' + initialIframeSrc +
                            '" name="' + options.id + '"></iframe>'
                        ).css({
                            width: 0,
                            height:0,
                            display: 'none'
                        }).one('load', function () {
                            self._doSend(_, completeCallback);
                        });
                        iframe.appendTo(document.body);
                    }else{
                        self._doSend(_, completeCallback);
                    }
                },
                abort: function () {
                    if ( callback ) {
                        callback( undefined, true );
                    }
                }
            };
        }
    });
}));
