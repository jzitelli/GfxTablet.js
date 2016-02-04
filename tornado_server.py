import logging
_logger = logging.getLogger(__name__)
from operator import itemgetter

from tornado.web import Application, RequestHandler
from tornado.ioloop import IOLoop

from site_settings import config

from GfxTablet import GfxTabletHandler



class MainHandler(RequestHandler):
    def get(self):
        self.render("index.html")



def make_app():
    return Application([(r'/gfxtablet', GfxTabletHandler),
                        (r'/', MainHandler)],
                       debug=config.get('DEBUG', False))



def main():
    app = Application([(r'/gfxtablet', GfxTabletHandler),
                        (r'/', MainHandler)],
                       debug=config.get('DEBUG', False))

    _logger.info("app.settings:\n%s" % '\n'.join(['%s: %s' % (k, str(v))
                                                  for k, v in sorted(app.settings.items(),
                                                                     key=itemgetter(0))]))

    port = config.get('PORT', 5000)

    app.listen(port)
    _logger.info("STATIC_FOLDER   = %s" % flask_app.STATIC_FOLDER)
    _logger.info("listening on port %d" % port)
    _logger.info("press CTRL-C to terminate the server")
    _logger.info("""
                *
           ***********
    *************************
*********************************
STARTING TORNADO APP!!!!!!!!!!!!!
*********************************
    *************************
           ***********
                *
""")
    IOLoop.instance().start()


if __name__ == "__main__":
    logging.basicConfig(level=(logging.DEBUG if app_flask.debug else logging.INFO),
                        format="%(asctime)s: %(levelname)s %(name)s %(funcName)s %(lineno)d:  %(message)s")
    main()
