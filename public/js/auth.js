
const myForm = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://fatima-app-backend.vercel.app/api/auth/';

myForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromData = {};
    for (let el of myForm.elements) {
        if (el.name.length > 0) {
            fromData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(fromData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ token, user, msg }) => {
            if (msg) {
                return console.error(msg);
            }

            localStorage.setItem('token', token);
            localStorage.setItem('email', user.email);
            window.location = 'chat.html';
        }).catch(err => {
            console.log(err);
        });


});

function handleCredentialResponse(response) {


    const body = { id_token: response.credential }
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(resp => {
            // console.log(resp)
            localStorage.setItem('email', resp.user.email)
            localStorage.setItem('token', resp.token)

            window.location = 'chat.html'
        })
        .catch(console.warn)
}


const button = document.getElementById('g_id_signout');
button.onclick = async () => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
}