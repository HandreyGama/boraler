import { fazerLogin, estaLogado, isAdmin } from '../../src/modules/auth.js';
const USERS_KEY = 'libdb_users';
const CURRENT_USER_KEY = 'libdb_current_user';

document.addEventListener('DOMContentLoaded', () => {
    const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
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
        
        if (resultado.sucesso) {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: resultado.mensagem,
                confirmButtonColor: '#d95a1a'
            }).then(() => {
                window.location.href = '/home';
            });
        } else {
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);
            if (usuario) {
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario));

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Login realizado com sucesso!',
                }).then(() => {
                    window.location.href = '/home';
                });
                return 

            }
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: resultado.mensagem,
                confirmButtonColor: '#d95a1a'
            });
        }
    });

    const togglePassword = document.getElementById('toggle-password');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }
});
