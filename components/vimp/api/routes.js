var api           = require('../../core/lib/api')
  , markdownitanc = require('markdown-it-anchor')
  , markdownittoc = require('markdown-it-table-of-contents')
  , markdownitrel = require('markdown-it-replace-link')
  , hljs          = require('highlight.js')
  , markdownit    = require('markdown-it');

function search (request, reply) {
    api.get('/vplugs', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

function fixRelativeUrl (base, link) {
    if (link.match(/^#/)) { return link; }
    if (link.match(/^https?:/)) { return link; }
    return base + '/' + link;
}

function formatReadme (data) {
    if (!data.readme) { return ''; }

    var readme  = new Buffer(data.readme.content, data.readme.encoding).toString('utf8')
      , baseUrl = data.githubUrl + '/raw/master'
      , md      = markdownit({
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
          , replaceLink : function (link) {
                return fixRelativeUrl(baseUrl, link);
            }
        });

    md.use(markdownitanc);
    md.use(markdownittoc);
    md.use(markdownitrel);

    return md.render(readme);
}

function formatDoc (data) {
    return data ? new Buffer(data.content, data.encoding).toString('utf8') : '';
}

function get (request, reply) {
    api.get('/vplugs/' + request.params.id, function (err, response, body) {
        if (err) { return reply.boom(err); }
        if (!body) { return reply(); }

        body.readme = formatReadme(body);
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
