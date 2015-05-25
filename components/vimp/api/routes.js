var api           = require('../../core/lib/api')
  , markdownitanc = require('markdown-it-anchor')
  , markdownittoc = require('markdown-it-table-of-contents')
  , hljs          = require('highlight.js')
  , markdownit    = require('markdown-it');

function search (request, reply) {
    api.get('/vplugs', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

function formatReadme (data) {
    if (!data) { return ''; }

    // TODO: replace relative urls with absolute
    // prepend body.githubUrl + '/raw/master/' + relUrl

    var readme = new Buffer(data.content, data.encoding).toString('utf8')
      , md     = markdownit({
            html        : true
          , xhtmlOut    : true
          , breaks      : true
          , langPrefix  : 'language-'
          , linkify     : true
          , typograhper : true
          , highlight   : function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(lang, str, true).value;
                } else {
                    return hljs.highlightAuto(str).value;
                }
            }
        });

    md.use(markdownitanc);
    md.use(markdownittoc);

    return md.render(readme);
}

function formatDoc (data) {
    return data ? new Buffer(data.content, data.encoding).toString('utf8') : '';
}

function get (request, reply) {
    api.get('/vplugs/' + request.params.id, function (err, response, body) {
        if (err) { return reply.boom(err); }
        if (!body) { return reply(); }

        body.readme = formatReadme(body.readme);
        body.doc    = formatDoc(body.doc);

        return reply(body);
    });
}

function keywords (request, reply) {
    api.get('/vplugkeywords', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

module.exports = [{
    method  : 'GET'
  , path    : '/api/vplugs'
  , handler : search
}, {
    method  : 'GET'
  , path    : '/api/vplugs/{id}'
  , handler : get
}, {
    method  : 'GET'
  , path    : '/api/vplugkeywords'
  , handler : keywords
}];
