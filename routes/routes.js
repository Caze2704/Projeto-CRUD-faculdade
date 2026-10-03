const express = require('express')
const router = express.Router()
const pool = require('../config/db.js')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: 1
    }
})

router.post('/user/save', upload.single('photo'), (req, res) => {
    const name = req.body.name
    const age = req.body.age
    const email = req.body.email
    let bytesPhoto = null
    let namePhoto = null

    if(req.file){
        bytesPhoto = req.file.buffer
    }
    if(req.file){
        namePhoto = req.file.mimetype
    }

    const insert = 'INSERT INTO cadastros (name, age, email, bytes, photo_type) values ($1, $2, $3, $4, $5)'

    pool.query(insert, [name, age, email, bytesPhoto, namePhoto], (err, data) => {
        if(err){
            console.log(err)
        }
        res.redirect('/acesso/cadastros')
    })
})

router.get('/cadastros', (req, res) => {
    const select = 'SELECT * from cadastros'
    pool.query(select, (err, data) => {
        if(err){
            console.log(err)
        }
        const cadastros = data.rows
        
        res.render('cadastros', {cadastros})
    })
    
})

router.get('/images/:id', (req, res) => {
    const id = req.params.id
    const infoPhoto = 'SELECT bytes, photo_type FROM cadastros WHERE idcadastros = $1'

    pool.query(infoPhoto, [id], (err, data) => {
        if(err){
            console.log(err)
            return res.status(500).end()
        }
        if(!data.rows[0] || data.rows[0].bytes == null){
            return res.status(404).end()
        }
        const photo = data.rows[0]

        res.set('content-type', photo.photo_type)
        res.send(photo.bytes)

    })
})

router.get('/cadastro/:id', (req, res) => {
    const id = req.params.id
    const selectUser = 'SELECT idcadastros, name, age, email, photo_type FROM cadastros WHERE idcadastros = $1'

    pool.query(selectUser, [id], function(err, data){
        if(err){
            console.log(err)
            return res.redirect('/acesso/cadastros')
        }
        const infoUser = data.rows[0]

        res.render('cadastro', {infoUser})
    })
})

router.post('/cadastro/:id/delete', (req, res) => {
    const id = req.params.id
    const deleteUser = 'DELETE FROM cadastros WHERE idcadastros = $1'
    pool.query(deleteUser, [id], function(err){
        if(err){
            console.log(err)
            return res.status(500).end()
        }
        res.redirect('/acesso/cadastros')
    })
})

router.post('/cadastro/:id/update', (req, res) => {
    const id = req.params.id
    const select = 'SELECT idcadastros, name, age, email, photo_type FROM cadastros where idcadastros = $1'

    pool.query(select, [id], function(err, data){
        if(err){
            console.log(err)
            return res.status(500).end()
        }
        const infoUser = data.rows[0]
        res.render('editar', {infoUser})
    })
})

router.post('/cadastro/:id/update/save', upload.single('photo'), (req, res) => {
    const id = req.params.id
    const name = req.body.name
    const age = req.body.age
    const email = req.body.email
    let update = ''
    let valores = []

    if(req.file){
        update = 'UPDATE cadastros SET name = $1, age = $2, email = $3, bytes = $4, photo_type = $5 where idcadastros = $6'
        valores = [name, age, email, req.file.buffer, req.file.mimetype, id]
    }else{
        update = 'UPDATE cadastros SET name = $1, age = $2, email = $3 WHERE idcadastros = $4'
        valores = [name, age, email, id]
    }

    pool.query(update, valores, (err, data) => {
        if(err){
            console.log(err)
            return res.status(500).end()
        }
        res.redirect(`/acesso/cadastro/${id}`)
    })
})
module.exports = router