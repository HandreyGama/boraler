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
        iniciarTutorial();
    }
    
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