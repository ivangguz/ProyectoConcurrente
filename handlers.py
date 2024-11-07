import aiohttp_jinja2
from aiohttp import web

# Handler for the index page
@aiohttp_jinja2.template('index.html')
async def handle_index(request):
    context = {'message': 'Bienvenidos a la página principal'}
    return context

# Handler for the calendario page
@aiohttp_jinja2.template('calendario.html')
async def handle_calendario(request):
    context = {'message': 'Aquí está tu calendario'}
    return context


# Handler for the registrarJornadas page
@aiohttp_jinja2.template('registrarJornadas.html')
async def handle_registrar_jornadas(request):
    context = {'message': 'Registra tus jornadas aquí'}
    return context
