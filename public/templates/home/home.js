import { fazerLogout } from '../../src/modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const botao = document.getElementById('logout-button');

    botao.addEventListener('click', () => {
        Swal.fire({
            icon: 'question',
            title: 'Deseja sair?',
            text: 'Você será desconectado.',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d95a1a'
        }).then((result) => {
            if (result.isConfirmed) {
                fazerLogout();
                window.location.href = '/';
            }
        });
    });
});