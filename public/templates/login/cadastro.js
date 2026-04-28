import { registrarUsuario, fazerLogin, estaLogado, isAdmin } from '../../src/modules/auth.js';
const USERS_KEY = 'libdb_users';
const CURRENT_USER_KEY = 'libdb_current_user';
document.addEventListener('DOMContentLoaded', () => {
    const CURRENT_USER_KEY = 'libdb_current_user';
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
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'E-mail e senha são obrigatórios',
                confirmButtonColor: '#d95a1a'
            });
            return;
        }

        const cadastro = await registrarUsuario(email, senha);
        const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        // verifica se já existe
        if (usuarios.find(u => u.email === email)) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Usuário já existe',
            });
            return;
        }

        // adiciona usuário corretamente
        usuarios.push({
            email,
            senha,
            role: 'user'
        });

        // salva de volta no localStorage
        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
        if (!cadastro.sucesso) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: cadastro.mensagem,
                confirmButtonColor: '#d95a1a'
            });
            return;
        }
        if (cadastro.sucesso) {
            Swal.fire({
                icon: 'success',
                title: 'Cadastro realizado!',
                text: 'Sua conta foi criada com sucesso.',
                confirmButtonText: 'Ir para login',
                confirmButtonColor: '#d95a1a',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/';
                }
            });
        }
    });
});

const passwordInput = document.getElementById('password-input');
const togglePassword = document.getElementById('toggle-password');

if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });
}