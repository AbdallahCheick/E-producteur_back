const mysql = require ("mysql");
const express = require('express');
const app = express();


app.get('/', (req, res) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "node"
    });
    
    connection.connect((err) =>{
        if(err){
            console.error("Erreur de connexion : "+err.stack)
            return;
        }
        console.log("Connexion reussie à la bdd ! ")
    });
    
    connection.query("SELECT * FROM users", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows)
        console.log("Les données sont : ", rows)
    })
})