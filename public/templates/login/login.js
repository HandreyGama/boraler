import { fazerLogin, estaLogado, isAdmin } from '../../src/modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (estaLogado()) {
        window.location.href = isAdmin() ? '/admin/home' : '/home';
        return;
    }

    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value.trim();

        const resultado = await fazerLogin(email, senha);
        alert(resultado.mensagem);

        if (resultado.sucesso) {
            window.location.href = isAdmin() ? '/admin/home' : '/home';
        }
    });
});
