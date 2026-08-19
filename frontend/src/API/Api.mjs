const URI = 'https://api.focusgrafica.it/api';
//const URI = 'http://localhost:8080/api';

async function logIn(credentials) {
    let url = '';
    let body = {};

    // 1. Controlliamo se è un login con Google o uno standard (username/password)
    if (credentials.provider === 'google') {
        url = URI + '/login/google';
        body = { token: credentials.token };
    } else {
        url = URI + '/login';
        body = { username: credentials.username, password: credentials.password };
    }

    // 2. Usiamo fetch per spedire i dati tramite POST al server
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include' // ATTENZIONE: Questo è FONDAMENTALE! 
                               // Permette al backend di salvare il cookie di sessione nel browser
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.text();
        throw new Error(errDetail || "Errore durante il login");
    }
}


async function logout() {
    const response = await fetch(URI + `/logout`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (response.ok)
        return null;
}


async function getCurrentUser() {
    const res = await fetch(URI + '/session/current', {
    credentials: 'include'
    });
    const textUser= await res.text();
    //const user= await res.json();
    if(res.ok){
        return textUser? JSON.parse(textUser):null;
    }
    else{
        throw new Error("Not authenticated");
    }
}
async function getImages() {
    const res = await fetch(URI + '/immagini', { credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
}

async function voteImage(immagine_id) {
    const res = await fetch(URI + '/vota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ immagine_id })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Errore durante il voto');
    }

    return await res.json();
}

async function getVotesRemaining() {
    const res = await fetch(URI + '/voti-rimasti', {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Errore nel recuperare i voti rimasti');
    }

    return await res.json();
}

const API= {logIn,logout,getCurrentUser,getImages,voteImage,getVotesRemaining};

export default API;
  