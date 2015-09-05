var express = require('express');
var router  = express.Router();
var mime    = require('mime');
var url     = require('url');

var http    = require('http');
var https   = require('https');
var gm      = require('gm');
var fs      = require('fs');
//var imageMagick = gm.subClass({imageMagick: true});
var uuid    = require('node-uuid');
var _       = require('lodash-node');
var path    = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Standard Automata' });
});

router.get('/popmachination.html', function(req, res, next) {
    res.render('popmachination', { title: 'Standard Automata' });
});

router.get('/sphere.html', function(req, res, next) {
    res.render('sphere', { title: 'Standard Automata' });
});

router.get('/dragJade.html', function(req, res, next) {
    res.render('drag', { title: 'Standard Automata' });
});

router.get('/library', function(req, res, next){
    var library = {};
    var currentDir = './public/writable';
    fs.readdir(currentDir, function (err, files) {
        if (err) {
            throw err;
        }
        var data = [];
        files.forEach(function (file) {
            try {
                var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                if (!isDirectory) {
                    data.push({ id : file, img: '/writable/'+file});
                }
            } catch(e) {
                console.log(e);
            }
        });
        data = _.sortBy(data, function(f) { return f.id });
        library['items'] = data;
        res.json(library);
    });
});

whitelist = process.env.WHITELIST || []; // [/\.gov$/, /google\.com$/];
delay = parseInt(process.env.DELAY) || 5000;
mimeTypes = [
    'image/gif',
    'image/jpeg',
    'image/png',
    // Common typos
    'image/jpg',
];

// to get this to work you need imagemagic. can be installed on osx with brew install imagemagick
// here's an example URI to get this thing fired off and working.
// http://localhost:3000/proxy/http%3A%2F%2Fi.imgur.com%2FRAy04SU.jpg/352/72.jpg
router.get('/proxy/:url', function (req, res, next) {

    //copied from https://github.com/jpmckinney/image-proxy/blob/master/lib/image-proxy.js
    var extension,
        retrieve = function (remote) {
            // @see http://nodejs.org/api/url.html#url_url
            var options = url.parse(remote);
            // @see https://github.com/substack/hyperquest
            options.agent = false;
            if (options.protocol !== 'http:' && options.protocol !== 'https:') {
                return res.status(404).send('Expected URI scheme to be HTTP or HTTPS');
            }
            if (!options.hostname) {
                return res.status(404).send('Expected URI host to be non-empty');
            }
            options.headers = {'User-Agent': 'image-proxy/0.0.6'}

            var agent = options.protocol === 'http:' ? http : https
                , timeout = false
            // @see http://nodejs.org/api/http.html#http_http_get_options_callback
                , request = agent.get(options, function (response) {
                    if (timeout) {
                        // Status code 504 already sent.
                        return;
                    }

                    // @see http://nodejs.org/api/http.html#http_response_statuscode
                    if ((response.statusCode === 301 || response.statusCode === 302) && response.headers['location']) {
                        var redirect = url.parse(response.headers['location']);
                        // @see https://tools.ietf.org/html/rfc7231#section-7.1.2
                        if (!redirect.protocol) {
                            redirect.protocol = options.protocol;
                        }
                        if (!redirect.hostname) {
                            redirect.hostname = options.hostname;
                        }
                        if (!redirect.port) {
                            redirect.port = options.port;
                        }
                        if (!redirect.hash) {
                            redirect.hash = options.hash;
                        }
                        return retrieve(url.format(redirect));
                    }

                    // The image must return status code 200.
                    if (response.statusCode !== 200) {
                        return res.status(404).send('Expected response code 200, got ' + response.statusCode);
                    }

                    // The image must be a valid content type.
                    // @see http://nodejs.org/api/http.html#http_request_headers
                    var mimeType;

                    mimeType = (response.headers['content-type'] || '').replace(/;.*/, '');
                    extension = mime.extension(mimeType);

                    if (mimeTypes.indexOf(mimeType) === -1) {
                        return res.status(404).send('Expected content type ' + mimeTypes.join(', ') + ', got ' + mimeType);
                    }
                    var id = uuid.v4();
                    var filename = id+'.'+extension;

                    var os = fs.createWriteStream('./public/writable/'+filename);

                    response.pipe(os);
                    var libEntry = {};
                    libEntry['img'] = '/writable/'+filename;
                    libEntry['id'] = filename;
                    os.on('finish',function(){return res.json(libEntry);});
                }).on('error', next);

            // Timeout after five seconds. Better luck next time.
            request.setTimeout(delay, function () {
                timeout = true; // if we abort, we'll get a "socket hang up" error
                return res.status(504).send();
            });
        };

    // Validate parameters.
    if (whitelist.length) {
        var parts = url.parse(req.params.url);
        if (parts.hostname) {
            var any = false, _i, _len;
            if (typeof whitelist === 'string') {
                whitelist = whitelist.split(',');
            }
            for (_i = 0, _len = whitelist.length; _i < _len; _i++) {
                if (typeof whitelist[_i] === 'string') {
                    // Escape periods and add anchor.
                    whitelist[_i] = new RegExp(whitelist[_i].replace('.', '\\.') + '$')
                }
                if (whitelist[_i].test(parts.hostname)) {
                    any = true;
                    break;
                }
            }
            if (!any) { // if none
                return res.status(404).send('Expected URI host to be whitelisted');
            }
        }
    }
    retrieve(req.params.url);
});

module.exports = router;