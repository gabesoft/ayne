var jsdom   = require('jsdom').jsdom
  , URI     = require('URIjs');

function urlMetadata (request, reply) {
    if (!request.params.href) {
        return reply({ href: null, title: null, name: null });
    }

    var href = URI(request.params.href);

    href.protocol(href.protocol() || 'http');

    jsdom.env({
        url  : href.toString()
      , done : function (errors, window) {
            if (!window) { return reply({ href: href.toString() }); }

            var doc   = window.document
              , title = doc.title;

            window.close();
            reply({
                title : title
              , href  : href.toString()
            });
        }
    });
}

module.exports = urlMetadata;
