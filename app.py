import aiohttp_jinja2
import jinja2
from aiohttp import web
from handlers import handle_index, handle_calendario, handle_registrar_jornadas

# Create the app and configure Jinja2
app = web.Application()
aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('templates'))

# Register routes
app.router.add_get('/', handle_index)
app.router.add_get('/calendario', handle_calendario)  # Ensure this route exists
app.router.add_get('/registrarJornadas', handle_registrar_jornadas)
app.router.add_static('/static/', path='./static')

# Start the server
if __name__ == '__main__':
    web.run_app(app, host='127.0.0.1', port=8080)
