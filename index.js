const express = require('express');
const app = express();
const mysql = require ("mysql");
const bodyParser = require('body-parser');

//Connexion a la base de données 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "database_producteur"
});
//les log en cas d'erreur ou de reussis de la connexion
connection.connect((err) =>{
    if(err){
        console.error("Erreur de connexion : "+err.stack)
        return;
    }
    console.log("Connexion reussie à la bdd ! ")
});

const versionApi = '/api/v1';

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//function de verification de chaque champs
function notnull(value) {
    return (value !== null && value !== undefined && value !== '');
}



//                                          API PRODUCTEUR    
// -------------------------------- ******************************** ----------------------------------------------//


// Affichage de tous les producteur
app.get(`${versionApi}/listproducteur`, (req, res) => {
    connection.query("SELECT * FROM producteur", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows)
        console.log("Les données sont : ", rows)
    })
})

//Ajout d'un producteur
app.post(`${versionApi}/addproducteur`, (req, res)=>{
    console.log("Route ajout de producteur");
    const nom = req.body.nom;
    const prenoms = req.body.prenoms;
    const date_naissance = req.body.date;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const username = req.body.username;
    const contact = req.body.contact;
    const produit = req.body.produit;


    //defission de la date actuelle
    const dateActuelle = new Date();
    // Obtient l'année, le mois, le jour, l'heure, les minutes, les secondes et les millisecondes actuels
    const annee = dateActuelle.getFullYear();
    const mois = dateActuelle.getMonth() + 1; // Les mois commencent à partir de 0
    const jour = dateActuelle.getDate();
    const date = annee + "-" + mois + "-" + jour;

    console.log("Etape de verifications" + nom + " : " + prenoms + " : " +date_naissance + " : " + password +  + " : " + repassword + " : " + username + " : " +contact + " : " +produit);
    // Vérification des champs non nuls
    if (notnull(nom) && notnull(prenoms) && notnull(date_naissance) && notnull(password) &&
        notnull(repassword) && notnull(username) && notnull(contact) && notnull(produit)) {
        //Verification que les deux mot de passe sont identique    
        const requete = "SELECT * FROM producteur WHERE usernameProd =?"
        connection.query(requete, [username] , (err, rows,fields)=>{
            console.log("Select des producteur : "+ rows);
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).send({Erreur : "Erreur : le nom d'utilisateur existe deja"});
            }else{
                if(repassword === password){
                    const sql = "INSERT INTO producteur(`nomProd`, `prenomsProd`, `date_naissProd`, `pwdProd`, `usernameProd`, `date_CreaProd`, `contactProd`, `idProduit`) VALUES (?,?,?,?,?,?,?,?)";
                    connection.query(sql,[nom, prenoms, date_naissance, password, username, date, contact, produit], (err, rows, fields) => {
                        console.log("Entree dans la requete ajouts de producteur")
                        if(err) throw err;
                        const successMessage = "Enregistrement effectué avec succès ";
                        res.status(200);
                        res.json({Success: successMessage});
                        console.log("💖💖Requete de l'ajout terminer")
                        } )
                }else{
                    res.status(400).json({Erreur : "Les deux mot de passe ne sont pas identique"})
                }
            }
        })

    } else {
        // Au moins un champ est nul
        res.status(400).json({Erreur : "Veuillez remplir tous les champs"});
    }    

});

//Modification d'un producteur
app.put(`${versionApi}/updateproducteur`, (req, res) => {
    const id = req.body.id;
    const nom = req.body.nom;
    const prenoms = req.body.prenoms;
    const date_naissance = req.body.date;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const username = req.body.username;
    const contact = req.body.contact;
    const produit = req.body.produit;

    // Vérifier que les champs ne sont pas vide
    if (notnull(id) && notnull(nom) && notnull(prenoms) && notnull(date_naissance) && notnull(password) &&
        notnull(repassword) && notnull(username) && notnull(contact) && notnull(produit)) {
        //Verification que les deux mot de passe sont identique    
        const requete = "SELECT * FROM producteur WHERE idProd != ? AND usernameProd =?"
        connection.query(requete, [id,username] , (err, rows,fields)=>{
            console.log("Select des producteur : "+ rows);
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).json({Erreur : "le nom d'utilisateur existe deja"});
            }else{
                if(repassword === password){
                    const sql = "UPDATE producteur SET nomProd = ?, prenomsProd = ?, date_naissProd = ?, pwdProd = ?, usernameProd = ?, contactProd = ?, idProduit = ? WHERE idProd = ?";
                    connection.query(sql,[nom, prenoms, date_naissance, password, username, contact, produit,id], (err, rows, fields) => {
                        console.log("Entree dans la requete ajouts de producteur")
                        if(err) throw err;
                        const successMessage = "Modification effectué avec succès ";
                        res.status(200);
                        res.json({Success: successMessage});
                        console.log("💖💖Requete de l'ajout terminer")
                        } )
                }else{
                    res.status(400).json({Erreur : "Les deux mot de passe ne sont pas identique"})
                }
            }
        })
    } else {
        // Au moins un champ est nul
        res.status(400).json({Erreur : "Veuillez remplir tous les champs"});
    }    

});


//Suppression d'un producteur
app.delete(`${versionApi}/deleteproducteur`, (req, res) => {
    const id = req.body.id; // Récupérer l'ID de la catégorie à supprimer

    // Requête SQL pour supprimer la catégorie
    const sql = `DELETE FROM producteur WHERE idProd = ?`;

    // Exécution de la requête SQL
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la catégorie : ' + err.stack);
            res.status(500).json({ message: "Erreur lors de la suppression de la catégorie." });
            return;
        }
        console.log("Catégorie supprimée avec succès.");
        res.status(200)
        res.json({ Sucess: "Producteur supprimée avec succès." });
    });
});

//                                          API CATEGORIES    
// -------------------------------- ******************************** ----------------------------------------------//


//Ajout de categorie
app.post(`${versionApi}/addcategorie`, (req, res)=>{
    console.log("Route ajout de categorie");
    const nom = req.body.categorie;
    if(nom){
        connection.query("INSERT INTO categorieproduit(libelleCatProd) VALUES ('" + nom + "')", (err, rows, fields) => {
        console.log("Entree dans la requete ajouts de categorie")
        if(err) throw err;
        const successMessage = "Enregistrement effectué avec succès de " + nom;
        res.status(200);
        res.json({Success: successMessage});
        console.log("💖💖Requete de l'ajout terminer")
        } )
    }else{
        res.status(400).json({Erreur : "Aucune catégorie fournie dans les données JSON."});
    }

})

//Liste des categories
app.get(`${versionApi}/listcategories`, (req, res) => {
    connection.query("SELECT * FROM categorieproduit", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows);
        console.log(rows.length);
    })
})

//modifier une categorie precise
app.put(`${versionApi}/updatecategories`, (req, res) => {
    const id = req.body.id;
    const nouveauLibelle = req.body.libelle; // Récupérer le nouveau libellé de la catégorie depuis le corps de la requête JSON
    console.log("Entree dans la route Modification des categories");
    if(notnull(id) && notnull(nouveauLibelle)){
        console.log("Tous entree sont non null");
        const requete = "SELECT * FROM categorieproduit WHERE idCatProd != ? AND libelleCatProd = ?" ; 
        connection.query(requete, [id, nouveauLibelle], (err, rows, fields) => {
            console.log("La categorie existe deja");
            if(err) throw err;
            if(rows.length > 0){
                res.status(400).json({Erreur : "La categorie existe deja"});
            }
            else{
                // Requête SQL pour mettre à jour la catégorie
                const sql = `UPDATE categorieproduit SET libelleCatProd = ? WHERE idCatProd = ?`;
                // Exécution de la requête SQL
                connection.query(sql, [nouveauLibelle, id], (err, result) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour de la catégorie : ' + err.stack);
                        res.status(500).json({ Erreur: "Erreur lors de la modification de la catégorie." });
                        return;
                    }
                    console.log("Catégorie modifiée avec succès.");
                    res.status(200);
                    res.json({ Sucess: "Catégorie modifiée avec succès." });
                });
            }
        })
    }else{
        res.status(400).json({ Erreur : "Veuillez remplir tous les champs"});
    }
});


//Suppression d'une categorie
app.delete(`${versionApi}/deletecategories`, (req, res) => {
    const id = req.body.id; // Récupérer l'ID de la catégorie à supprimer

    // Requête SQL pour supprimer la catégorie
    const sql = `DELETE FROM categorieproduit WHERE idCatProd = ?`;

    // Exécution de la requête SQL
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la catégorie : ' + err.stack);
            res.status(500).json({ message: "Erreur lors de la suppression de la catégorie." });
            return;
        }
        console.log("Catégorie supprimée avec succès.");
        res.status(200);
        res.json({ message: "Catégorie supprimée avec succès." });
    });
});


//                                          API PRODUIT    
// -------------------------------- ******************************** ----------------------------------------------//

//Ajout de produit
app.post(`${versionApi}/addproduit`, (req, res)=>{
    console.log("Route ajout de produit");
    const libelle = req.body.libelle;
    const categorie = req.body.categorie;
    const prix = req.body.prix;
    if(notnull(libelle) && notnull(categorie) && notnull(prix)){
        const requete = "SELECT * FROM produit WHERE  libelleProduit =?" // Requete ppur voir si le libelle n'existe pas deja
        connection.query(requete, [libelle] , (err, rows,fields)=>{
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).json({Erreur : "Erreur : le produit existe deja"});
            }else{
                const sql = "INSERT INTO produit(libelleProduit, idCatProd, prixProduit) VALUES (?,?,?)";
                connection.query(sql, [libelle, categorie, prix], (err, rows, fields) => {
                console.log("Entree dans la requete ajouts de produit");
                if(err) throw err;
                const successMessage = "Enregistrement effectué avec succès";
                res.status(200);
                res.json({Success: successMessage});
                console.log("💖💖Requete de l'ajout terminer")
                } )
            }
        })
    }else{
        res.status(400)
        res.json({Erreur : "Veuillez remplir tous les champs"});
    }

})

//Liste des produits
app.get(`${versionApi}/listproduit`, (req, res) => {
    connection.query("SELECT * FROM produit", (err, rows, fields) => {
        if(err) throw err;
        res.status(200);
        res.json(rows);
        console.log(rows.length);
    })
})

//modifier une un produit
app.put(`${versionApi}/updateproduit`, (req, res) => {
    const id = req.body.id;
    const libelle = req.body.libelle;
    const categorie = req.body.categorie;
    const prix = req.body.prix; // Récupérer le nouveau libellé de la catégorie depuis le corps de la requête JSON

    // Vérifier si le nouveau libellé est fourni dans les données JSON
    if (notnull(id) && notnull(prix) && notnull(libelle) && notnull(categorie)){
        const requete = "SELECT * FROM produit WHERE idProduit != ? AND libelleProduit =? "
        connection.query(requete, [id, libelle] , (err, rows,fields)=>{
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).json({Erreur : "Erreur : le produit existe deja"});
            }else{
                // Requête SQL pour mettre à jour la catégorie
                const sql = `UPDATE produit SET libelleProduit = ?, idCatProd = ?, prixProduit =? WHERE idProduit = ?`;
                // Exécution de la requête SQL
                connection.query(sql, [libelle, categorie, prix, id], (err, result) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour de la catégorie : ' + err.stack);
                        res.status(500).json({ Erreur: "Erreur lors de la modification de la Produit." });
                        return;
                    }
                    console.log("Produit modifiée avec succès.");
                    res.status(200);
                    res.json({ Sucess: "Produit modifiée avec succès." });
                });
            }
        });
    }
    else{
        res.status(400).json({ Erreur: "Le nouveau libellé de la catégorie est manquant dans les données JSON." });
        return;
    }
});

//Suppression d'une categorie
app.delete(`${versionApi}/deleteproduit`, (req, res) => {
    const id = req.body.id; // Récupérer l'ID du produit à supprimer

    // Requête SQL pour supprimer le produit
    const sql = `DELETE FROM produit WHERE idProduit = ?`;

    // Exécution de la requête SQL
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression du produit : ' + err.stack);
            res.status(500).json({ message: "Erreur lors de la suppression de la catégorie." });
            return;
        }
        console.log("produit supprimée avec succès.");
        res.status(200);
        res.json({ Sucess: "produit supprimée avec succès." });
    });
});

//                                          API ADMIN    
// -------------------------------- ******************************** ----------------------------------------------//

//Ajout d'un administrateur
app.post(`${versionApi}/addadmin`, (req, res)=>{
    console.log("Route ajout d' admin");
    const nom = req.body.nom;
    const prenoms = req.body.prenoms;
    const date_naissance = req.body.date;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const username = req.body.username;
    const contact = req.body.contact;
    const levelAdmin = "0";

    //defission de la date actuelle
    const dateActuelle = new Date();
    // Obtient l'année, le mois, le jour, l'heure, les minutes, les secondes et les millisecondes actuels
    const annee = dateActuelle.getFullYear();
    const mois = dateActuelle.getMonth() + 1; // Les mois commencent à partir de 0
    const jour = dateActuelle.getDate();
    const date = annee + "-" + mois + "-" + jour;

    console.log("Etape de verifications" + nom + " : " + prenoms + " : " +date_naissance + " : " + password +  + " : " + repassword + " : " + username + " : " +contact);
    // Vérification des champs non nuls
    if (notnull(nom) && notnull(prenoms) && notnull(date_naissance) && notnull(password) &&
        notnull(repassword) && notnull(username) && notnull(contact)) {
        //Verification que les deux mot de passe sont identique    
        const requete = "SELECT * FROM admin WHERE usernameAdmin =?"
        connection.query(requete, [username] , (err, rows,fields)=>{
            console.log("Select des admin : "+ rows);
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).json({Erreur : "le nom d'utilisateur existe deja"});
            }else{
                if(repassword === password){
                    const sql = "INSERT INTO admin(`nomAdmin`, `prenomsAdmin`, `levelAdmin`, `date_naissAdmin`, `pwdAdmin`, `usernameAdmin`, `date_CreaAdmin`, `contactAdmin`) VALUES (?,?,?,?,?,?,?,?)";
                    connection.query(sql,[nom, prenoms, levelAdmin, date_naissance, password, username, date, contact], (err, rows, fields) => {
                        console.log("Entree dans la requete ajouts d'un admin")
                        if(err) throw err;
                        const successMessage = "Enregistrement effectué avec succès ";
                        res.status(200);
                        res.json({Success: successMessage});
                        console.log("💖💖Requete de l'ajout terminer")
                        } )
                }else{
                    res.status(400).json({Erreur : "Les deux mot de passe ne sont pas identique"})
                }
            }
        })

    } else {
        // Au moins un champ est nul
        res.status(400).json({Erreur : "Veuillez remplir tous les champs"});
    }    
});

// Affichage de tous les admin
app.get(`${versionApi}/listadmin`, (req, res) => {
    connection.query("SELECT * FROM admin", (err, rows, fields) => {
        if(err) throw err;
        res.json(rows)
        console.log("Les données sont : ", rows)
    })
})

//Modification d'un admin
app.put(`${versionApi}/updateadmin`, (req, res) => {
    const id = req.body.id;
    const nom = req.body.nom;
    const prenoms = req.body.prenoms;
    const date_naissance = req.body.date;
    const password = req.body.password;
    const repassword = req.body.repassword;
    const username = req.body.username;
    const contact = req.body.contact;

    // Vérifier que les champs ne sont pas vide
    if (notnull(id) && notnull(nom) && notnull(prenoms) && notnull(date_naissance) && notnull(password) &&
        notnull(repassword) && notnull(username) && notnull(contact)) {
        //Verification que les deux mot de passe sont identique    
        const requete = "SELECT * FROM admin WHERE idAdmin != ? AND usernameAdmin =?"
        connection.query(requete, [id,username] , (err, rows,fields)=>{
            console.log("Select des admins : "+ rows);
            if(rows.length > 0) {
                console.log("Verification du nombre de ligne");
                res.status(400).json({Erreur : "le nom d'utilisateur existe deja"});
            }else{
                if(repassword === password){
                    const sql = "UPDATE admin SET nomAdmin = ?, prenomsAdmin = ?, date_naissAdmin = ?, pwdAdmin = ?, usernameAdmin = ?, contactAdmin = ? WHERE idAdmin = ?";
                    connection.query(sql,[nom, prenoms, date_naissance, password, username, contact, id], (err, rows, fields) => {
                        console.log("Entree dans la requete modification de admin")
                        if(err) throw err;
                        const successMessage = "Modification effectué avec succès ";
                        res.status(200);
                        res.json({Success: successMessage});
                        console.log("💖💖Requete de l'ajout terminer")
                        } )
                }else{
                    res.status(400).json({Erreur : "Les deux mot de passe ne sont pas identique"})
                }
            }
        })
    } else {
        // Au moins un champ est nul
        res.status(400).json({Erreur : "Veuillez remplir tous les champs"});
    }    

});

//                                          API ACHAT    
// -------------------------------- ******************************** ----------------------------------------------//


app.listen(8080, () => console.log('Listening on port 8080'));