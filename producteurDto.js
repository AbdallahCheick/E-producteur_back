const mysql = require ("mysql");

// ProducteurDTO.js
class ProducteurDto {
    constructor(id, nom, prenoms, date_naiss, sexe, date_crea, contact, produit) {
        this.id = id;
        this.nom = nom;
        this.prenoms = prenoms;
        this.sexe = this.sexe(sexe);
        this.date_naiss = this.formatDate(date_naiss);
        this.date_Crea = this.formatDate(date_crea);
        this.produitName(produit, (err, nomProduit) => {
            if (err) {
                console.error("Erreur lors de la récupération du nom du produit : " + err);
                return;
            }
            this.produit = nomProduit;
        });
        this.contact = contact;
    }

    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    produitName(produit, callback) {
        const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "database_producteur"
        });
    
        connection.connect((err) => {
            if (err) {
                console.error("Erreur de connexion : " + err.stack)
                return;
            }
        });
    
        const requete = "SELECT * FROM produit WHERE idProduit= ?";
    
        connection.query(requete, [produit], (err, rows, fields) => {
            if (err) {
                callback(err, null);
                return;
            }
            const nomProduit = rows[0].libelleProduit;
            callback(null, nomProduit);
        });
    }
    

    sexe(sexe) {
        if(sexe ==="M"){
            return "Masculin"
        }else {
            return "Feminin"
        }
    }
}

module.exports = {
    ProducteurDto
};