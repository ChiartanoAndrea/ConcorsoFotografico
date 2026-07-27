function User(id, nome, surname, email) {
    this.id = id;
    this.name = nome;
    this.surname = surname;
    this.email = email;
}

function Image(id, titolo, url) {
    this.id = id;
    this.titolo = titolo;
    this.url = url;
    this.voti = 0;

}

function Vote(utente_id, immagine_id) {
    this.utente_id = utente_id;
    this.immagine_id = immagine_id;
}

export { User, Image, Vote };