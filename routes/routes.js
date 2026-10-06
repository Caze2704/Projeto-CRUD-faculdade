const express = require('express')
const router = express.Router()
const pool = require('../config/db.js')
const multer = require('multer')
const msg = {
    created: "Cadastro criado com sucesso!",
    deleted: "Cadastro excluído",
    updated: "Cadastro atualizado",
    duplicatedEmail: "E-mail já existente."
}

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
    const params = [name, age, email, bytesPhoto, namePhoto]
    const valores = {name, age, email}

    pool.query(insert, params, (err) => {
        if(err){
            console.log(err)
            if(err.code === '23505'){
                return res.render('home', {
                    error: "esse email já foi cadastrado.",
                    valores
                })
                return res.status(500).end()
            }
        }
        res.redirect('/acesso/cadastros?msg=created')
    })
})

router.get('/api/cadastros', (req, res) => {
    const busca = req.query.busca || ''

    const select = 'SELECT idcadastros, name, photo_type FROM cadastros WHERE name ILIKE $1 ORDER BY name LIMIT 50'

    let params = ['%' + busca + '%']

    pool.query(select, params, function(err, data){
        if(err){
            console.log(err)
            return res.status(500).json({
                error: "[ERROR]"
            })
        }
        console.log(data.rows)
        res.json(data.rows)
    })
})

router.get('/cadastros', (req, res) => {
    const select = 'SELECT * from cadastros'
    pool.query(select, (err, data) => {
        if(err){
            console.log(err)
        }
        const cadastros = data.rows
        const message = msg[req.query.msg]
        
        res.render('cadastros', {cadastros, message})
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
        const message = msg[req.query.msg]
        res.render('cadastro', {infoUser, message})
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
        res.redirect('/acesso/cadastros?msg=deleted')
    })
})

router.get('/cadastro/:id/update', (req, res) => {
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

    const infoUser = {name, age, email}

    pool.query(update, valores, (err, data) => {
        if(err){
            console.log(err)
            if(err.code === '23505'){
                return res.redirect(`/cadastro/${id}/update?erro=duplicatedEmail`)
            }
            return res.status(500).end()
        }
        res.redirect(`/acesso/cadastro/${id}?msg=updated`)
    })
})
module.exports = router