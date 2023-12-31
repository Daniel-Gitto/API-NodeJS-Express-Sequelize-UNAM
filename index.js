import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'
const require = createRequire(import.meta.url)
const datos = require('./datos.json')



const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.get('/productos/', async (req, res) => {
    try {
        //let allProducts = datos.productos
        const allProducts = await Producto.findAll() 

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/productos/:id', async (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            //datos.productos.push(req.body)
            const productoAGuardar = new Producto(req.body)
            await productoAGuardar.save()
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.patch('/productos/:id', async (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    try {
        let productoAActualizar = await Producto.findByPk(idProductoAEditar)

        if (!productoAActualizar) {
            return res.status(204).json({"message":"Producto no Encontrado"})}

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
        
            await productoAActualizar.update(req.body)

            res.status(200).send('Producto actualizado')
        })
    
    } catch (error) {
        res.status(204).json({"message":"Producto no encontrado"})
    }
})

app.delete('/productos/:id', async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    try {
        let productoABorrar = await Producto.findByPk(idProductoABorrar);
        if (!productoABorrar){
            return res.status(204).json({"message":"Producto no encontrado"})
        }

        await productoABorrar.destroy()
        res.status(200).json({message: 'Producto borrado'})

    } catch (error) {
        res.status(204).json({message: error})
    }
})



app.get('/usuarios/', async (req, res) => {
    try {
        //let allUsuarios = datos.usuarios
        const allUsers = await Usuario.findAll() 

        res.status(200).json(allUsers)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = await Usuario.findByPk(usuarioId)

        res.status(200).json(usuarioEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.post('/usuarios', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            //datos.usuarios.push(req.body)
            const usuarioAGuardar = new Usuario(req.body)
            await usuarioAGuardar.save()
        })
    
        res.status(201).json({"message": "exitoso"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})
app.patch('/usuarios/:id', async (req, res) => {
    let idUsuarioAEditar = parseInt(req.params.id)
    try {
        let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)

        if (!usuarioAActualizar) {
            return res.status(204).json({"message":"Usuario no encontrado"})}

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
        
            await usuarioAActualizar.update(req.body)

            res.status(200).send('Usuario modificado')
        })
    
    } catch (error) {
        res.status(204).json({"message":"Usuario no encontrado"})
    }
})
app.delete('/usuarios/:id', async (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id);
    try {
        let usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar);
        if (!usuarioABorrar){
            return res.status(204).json({"message":"Usuario no encontrado"});
        }
        await usuarioABorrar.destroy();
        res.status(200).json({"message": 'Usuario Eliminado'});
    } catch (error) {
        console.error(error); // Imprime el mensaje de error en la consola para depuración
        res.status(500).json({"message": 'Error al eliminar el usuario'}); // Utiliza 500 para indicar un error interno del servidor
    }
});



app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate();
    console.log('Conección con la DDBB Establecida.');
  } catch (error) {
    console.error('Error en la conección con la DB:', error);
  }

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




