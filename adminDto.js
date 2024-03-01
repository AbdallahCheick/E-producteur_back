// AdminDTO.js
class AdminDto {
    constructor(id, nom, prenoms, sexe, level, date_naiss, pwd, username, date_Crea, contact) {
        this.id = id;
        this.nom = nom;
        this.prenoms = prenoms;
        this.sexe = sexe;
        this.level = level;
        this.date_naiss = this.formatDate(date_naiss);
        this.pwd = pwd;
        this.username = username;
        this.date_Crea = this.formatDate(date_Crea);
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
}

module.exports = {
    AdminDto
};