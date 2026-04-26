import { registrarUsuario, fazerLogin, estaLogado } from '../../src/modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (estaLogado()) {
        window.location.href = '/home';
        return;
    }

    const form = document.getElementById('login-form');
    const nomeInput = document.getElementById('nome-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('register-button');

    loginButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value.trim();

        if (!nome) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Nome é obrigatório',
                confirmButtonColor: '#d95a1a'
            });
            return;
        }

        const cadastro = registrarUsuario(email, senha);

        if (!cadastro.sucesso) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: cadastro.mensagem,
                confirmButtonColor: '#d95a1a'
            });
            return;
        }

        const login = fazerLogin(email, senha);

        if (login.sucesso) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: cadastro.mensagem,
                confirmButtonColor: '#d95a1a'
            }).then(() => {
                window.location.href = '/home';
            });
        }
    });
});
