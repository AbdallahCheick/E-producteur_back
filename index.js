const express = require('express');
const app = express();
const mysql = require ("mysql");
const bodyParser = require('body-parser');


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


app.get('/database', (req, res) => {

})



const users = [];

for(let i = 0; i<10; i++){
    users.push({
        firstname : 'john'+i,
        lastname : 'Joe'+i,
        number : '0779595588 : '+i
    });
}

console.log(users);

const versionApi = '/api/v1';

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

// Affichage de tous les utilisateurs
app.get(`${versionApi}/users`, (req, res) => {
    connection.query("SELECT * FROM users", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows)
        console.log("Les données sont : ", rows)
    })
})

//afficher un utilisateur specifique qui a l'id egal un parametre
app.get(`${versionApi}/users/:id`, (req, res) =>{
    const id = req.params.id - 1
    
    res.json({
        data : users[id] || null
    })

})

// permet de recuperer des informations dans une requete post
app.post(`${versionApi}/users`, (req, res) =>{
    const data = req.body;
    console.log(data);
    users.push(data);
    res.json({
        index: users.length,
        data : users[users.length-1]
    })
});

//Modifier un utilisateur specifique
app.put(`${versionApi}/users/:id`, (req, res) =>{
    const id = req.params.id - 1;
    const data = req.body;

    users[id] = Object.assign(users[id], data);
    res.json({
        data : users[id]
    })
})

app.delete(`${versionApi}/users/:id`, (req, res) =>{
    
    const id = req.params.id - 1;
    users.splice(id, 1);
    console.log(users.length);

    res.sendStatus(200);
})



app.listen(3000, () => console.log('Listening on port 3000'));