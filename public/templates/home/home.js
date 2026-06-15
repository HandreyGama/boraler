import { fazerLogout } from '../../src/modules/auth.js';


async function iniciarTutorial() {
   await Swal.fire({
    title: 'Bem-vindo ao BoraLer! 📚',
    html: `
        <video width="100%" controls autoplay muted>
            <source src="/assets/video_tutorial_1.mp4" type="video/mp4">
            Seu navegador não suporta vídeo.
        </video>

        <p style="margin-top:15px">
            Aqui você encontra diversos livros para leitura.
        </p>
    `,
    width: 600,

    confirmButtonText: 'Próximo',
    showCloseButton: true
    });

    await Swal.fire({
        title: 'Pesquise livros 🔍',
        html: `
        <video width="100%" controls autoplay muted>
            <source src="/assets/video_tutorial_2.mp4" type="video/mp4">
            Seu navegador não suporta vídeo.
        </video>

        <p style="margin-top:15px">
            Pesquise sobre seus livros e autores preferidos
        </p>
    `,
    width: 600,
    
        confirmButtonText: 'Próximo',
        showCloseButton: true
    });

    await Swal.fire({
        title: 'Minha Biblioteca ⭐',
            html: `
        <video width="100%" controls autoplay muted>
            <source src="/assets/video_tutorial_2.mp4" type="video/mp4">
            Seu navegador não suporta vídeo.
        </video>

        <p style="margin-top:15px">
            Adicione livros a sua biblioteca e acompanhe sua leitura 
        </p>
    `,
    width: 600,
        confirmButtonText: 'Começar',
        showCloseButton: true
    });

    await Swal.fire({
        title: 'Acompanhe sua leitura e status 👀',
            html: `
        <video width="100%" controls autoplay muted>
            <source src="/assets/video_tutorial_4.mp4" type="video/mp4">
            Seu navegador não suporta vídeo.
        </video>

        <p style="margin-top:15px">
            leia sem medo de se peder e acompanhe seu progresso 
        </p>
    `,
    width: 600,
        confirmButtonText: 'Começar',
        showCloseButton: true
    });





    localStorage.setItem('tutorialVisto', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('tutorialVisto')) {
    Swal.fire({
        title: 'Deseja assistir ao tutorial?',
        text: 'Conheça as principais funcionalidades do BoraLer.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        confirmButtonColor: '#d95a1a'
    }).then((result) => {
        if (result.isConfirmed) {
            iniciarTutorial();
        } else {
            localStorage.setItem('tutorialVisto', 'true');
        }
    });
}

    const botao = document.getElementById('btn-logout');

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

/* Tema */

const themeToggleBtn = document.getElementById('theme-toggle');
const botao = document.getElementById('btn-logout');

function aplicarTema(tema) {
    if (tema === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.querySelector('.icon-theme').textContent = 'light_mode';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeToggleBtn) themeToggleBtn.querySelector('.icon-theme').textContent = 'dark_mode';
    }
}

const currentTheme = localStorage.getItem('theme') || 'light';
aplicarTema(currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        const novoTema = isDark ? 'dark' : 'light';
        
        localStorage.setItem('theme', novoTema);
        if (themeToggleBtn) themeToggleBtn.querySelector('.icon-theme').textContent = isDark ? 'light_mode' : 'dark_mode';
    });
}

window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        aplicarTema(event.newValue || 'light');
    }
});