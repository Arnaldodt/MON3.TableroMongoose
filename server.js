const express = require("express");
const bodyparse = require("body-parser");
const mongoose = require('mongoose');
const { request } = require("express");

mongoose.connect('mongodb://localhost/animales', {useNewUrlParser: true});

const esquema = new mongoose.Schema({
    nombre: {type:String,required:true,maxlength:20},
    tipo: {type:String,required:true,maxlength:20},
    donde_vive: {type:String,required:true,maxlength:20},
    edad: {type:Number,min:1,max:100}
})

const Animales = mongoose.model('Animales', esquema);

const app = express();
app.use(bodyparse.urlencoded({extended:true}))

app.set('view engine','ejs');
app.set('views',__dirname + '/views');
app.use("/recursos", express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    Animales.find()
    .then(data => { 
        if (data.length===0)
            {res.redirect("/mongooses/nuevo")}
        else
            {res.render("index", {animales: data})} 
    })
    .catch(err => res.json(err));
})

app.get('/mongooses/nuevo', (req, res) => {
    res.render("nuevo");
})
app.post('/mongooses', (req, res) => {
    Animales.create(req.body)
        .then(newUserData => console.log('user created: ', newUserData))
        .catch(err => console.log(err));
    res.redirect('/');
})

app.get('/mongooses/:id', (req, res) => {
   
    Animales.findOne({_id: req.params.id })
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Datos no encontrado</h1>")}
        else
            {res.render("muestra", {animales: data})} 
    })
    .catch(err => res.json(err));
})

app.get('/mongooses/editar/:id', (req, res) => {
   
    Animales.findOne({_id: req.params.id })
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Datos no encontrado</h1>")}
        else
            {res.render("editar", {animales: data})} 
    })
    .catch(err => res.json(err));
})

app.post('/mongooses/:id', (req, res) => {
   
    Animales.updateOne({_id: req.params.id},req.body)
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Datos no encontrado</h1>")}
        else
            {res.redirect("/")} 
    })
    .catch(err => res.json(err));
})

app.post('/mongooses/destruir/:id', (req, res) => {
    Animales.remove({_id: req.params.id})
    .then(data => { 
        if (data.length===0)
            {res.send("<h1>Datos no encontrado</h1>")}
        else
            {res.redirect("/")} 
    })
    .catch(err => res.json(err));
})

app.listen(8000, ()=>{
    console.log("Servidor escuchando el puerto 8000");
});