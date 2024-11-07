import json
import aiohttp_jinja2
import jinja2
import aiofiles
from aiohttp import web
from handlers import handle_index, handle_calendario, handle_registrar_jornadas

# Create the app and configure Jinja2
app = web.Application()
aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('templates'))

# Read the JSON file asynchronously
async def read_json_file(path):
    async with aiofiles.open(path, mode='r') as file:
        content = await file.read()
        return content

# Handler to serve the equipos data
async def handle_equipos(request):
    try:
        equipos_data = await read_json_file('./static/equipos.json')  # Adjust the path to your json file
        return web.Response(text=equipos_data, content_type='application/json')
    except Exception as e:
        return web.Response(text=f"Error: {str(e)}", status=500)
    
async def handle_equipos_original(request):
    try:
        equipos_data = await read_json_file('./static/equipos_original.json')  # Adjust the path to your json file
        return web.Response(text=equipos_data, content_type='application/json')
    except Exception as e:
        return web.Response(text=f"Error: {str(e)}", status=500)

# Handler to update equipos data
async def handle_update_equipos(request):
    try:
        data = await request.json()
        async with aiofiles.open('./static/equipos.json', mode='w') as file:
            await file.write(json.dumps(data, indent=4))  # Ensure the data is correctly formatted
        return web.Response(text="Datos actualizados correctamente", content_type='application/json')
    except Exception as e:
        return web.Response(text=f"Error: {str(e)}", status=500)
    

async def handle_reiniciar_tabla(request):
    try:
        # Lee los datos de equipos_original.json
        equipos_original_data = await read_json_file('./static/equipos_original.json')
        
        # Escribe los mismos datos en equipos.json
        async with aiofiles.open('./static/equipos.json', mode='w') as file:
            await file.write(equipos_original_data)  # Escribe los datos sin modificar
        
        return web.Response(text=json.dumps({"message": "Tabla reiniciada correctamente"}), content_type='application/json')
    except Exception as e:
        return web.Response(text=json.dumps({"error": str(e)}), status=500, content_type='application/json')



# Register routes
app.router.add_get('/', handle_index)
app.router.add_get('/calendario', handle_calendario)
app.router.add_get('/registrarJornadas', handle_registrar_jornadas)
app.router.add_get('/equipos', handle_equipos)  # New route to fetch equipos data
app.router.add_get('/equipos_original', handle_equipos_original)  # New route to fetch equipos data
app.router.add_post('/updateEquipos', handle_update_equipos)
app.router.add_static('/static/', path='./static')
# Registrar la ruta
app.router.add_post('/reiniciarTabla', handle_reiniciar_tabla)  # Ruta para reiniciar la tabla


# Start the server
if __name__ == '__main__':
    web.run_app(app, host='127.0.0.1', port=8080)

print("Rutas registradas:")
for route in app.router.routes():
    print(route)
