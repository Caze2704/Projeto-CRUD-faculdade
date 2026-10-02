const express = require('express')
const { engine } = require('express-handlebars')
const port = 3000
const user = require('./routes/routes.js')

const app = express()

// Conectando handlebars.

app.engine('handlebars', engine({
    partialsDir: ['views/partials']
}))
app.set('view engine', 'handlebars')

// Middlewares

app.use(express.static('public'))

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.use('/acesso', user)

app.get('/', (req, res) => {    
    res.render('home')
})

app.use(function(req, res, next){
    res.status(400).render('404')
})

app.listen(port, () => {
    console.log('servidor on')
})
