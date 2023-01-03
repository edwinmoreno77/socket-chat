
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://fatima-app-backend.vercel.app/api/auth/';

let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulPrivateMessages = document.querySelector('#ulPrivateMessages');
const btnSalir = document.querySelector('#btnSalir');

//validate localstorage token
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }
    try {

        const resp = await fetch(url + 'renew', {
            headers: { 'x-auth-token': token },
        });

        const { token: tokenDB, ok, ...rest } = await resp.json();
        localStorage.setItem('token', tokenDB);
        user = rest;
        document.title = user.name;

        await connectSocket();

    } catch (error) {
        console.log(error);
        window.location = 'index.html';
    }
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-auth-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', drawMessages);

    socket.on('active-users', drawUsers);

    socket.on('private-message', (payload) => {
        console.log('Privado:', payload);
        drawPrivateMessages(payload);
    });
}

const drawUsers = (users = []) => {
    let usersHtml = '';
    users.forEach(({ name, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const drawMessages = (messages = []) => {
    let messagesHtml = '';
    messages.forEach(({ name, message }) => {
        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}:</span>
                    <span>${message}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = messagesHtml;
}

const drawPrivateMessages = (messages = []) => {
    let messagesHtml = '';
    const { from, message } = messages;
    messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${from}:</span>
                    <span>${message}</span>
                </p>
            </li>
        `;


    ulPrivateMessages.innerHTML = messagesHtml;
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (message.length === 0) { return; }

    socket.emit('send-message', { message, uid });

    txtMessage.value = '';
});

// btnSalir.addEventListener('click', () => {

//     localStorage.removeItem('token');

//     const auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(() => {
//         console.log('User signed out.');
//         window.location = 'index.html';
//     });
// });

const main = async () => {

    await validarJWT();

}

// (() => {
//     gapi.load('auth2', () => {
//         gapi.auth2.init();
//         main();
//     });
// })();

main();