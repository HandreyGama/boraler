import { registrarUsuario, fazerLogin, estaLogado, isAdmin } from '../../src/modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (estaLogado()) {
        window.location.href = isAdmin() ? '/admin/home' : '/home';
        return;
    }

    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('register-button');

    loginButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value.trim();

        if (!email || !senha) {
            alert('Email e senha são obrigatórios');
            return;
        }

        const cadastro = await registrarUsuario(email, senha);
        alert(cadastro.mensagem);

        if (cadastro.sucesso) {
            window.location.href = isAdmin() ? '/admin/home' : '/home';
        }
    });
});
