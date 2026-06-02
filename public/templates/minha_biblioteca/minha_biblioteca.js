import {
  getMyLibraryBooks,
  upsertBook
} from "../../src/modules/reader_store.js";

const booksGrid = document.getElementById("books-grid");

const searchInput = document.getElementById("search-input");

const botoesFiltro = document.querySelectorAll(".filtros button");
let filtroAtual = "todos";
let livrosDaBiblioteca = [];

document.addEventListener("DOMContentLoaded", () => {
const themeToggleBtn = document.getElementById('theme-toggle');
  function aplicarTemaBiblioteca(tema) {
      if (tema === 'dark') {
          document.body.classList.add('dark-mode');
          if (themeToggleBtn) themeToggleBtn.querySelector('.icon-theme').textContent = 'light_mode';
      } else {
          document.body.classList.remove('dark-mode');
          if (themeToggleBtn) themeToggleBtn.querySelector('.icon-theme').textContent = 'dark_mode';
      }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  aplicarTemaBiblioteca(savedTheme);

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
          aplicarTemaBiblioteca(event.newValue || 'light');
      }
  });

  carregarMinhaBiblioteca();

  botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
      filtroAtual = botao.dataset.filter;

      botoesFiltro.forEach((b) => b.classList.remove("active"));
      botao.classList.add("active");

      aplicarFiltro();
    });
  });

  searchInput?.addEventListener("input", () => {
    aplicarFiltro();
  });
});

function carregarMinhaBiblioteca() {
  livrosDaBiblioteca = getMyLibraryBooks();

  console.log("Livros da minha biblioteca:", livrosDaBiblioteca);

  atualizarEstatisticas(livrosDaBiblioteca);
  aplicarFiltro();
}
function aplicarFiltro() {
  let livrosFiltrados = [...livrosDaBiblioteca];

  if (filtroAtual === "lendo") {
    livrosFiltrados = livrosFiltrados.filter(
      (livro) => livro.status === "lendo"
    );
  }

  if (filtroAtual === "quero-ler") {
    livrosFiltrados = livrosFiltrados.filter(
      (livro) => livro.status === "quero-ler"
    );
  }

  if (filtroAtual === "concluidos") {
    livrosFiltrados = livrosFiltrados.filter(
      (livro) => livro.status === "concluido"
    );
  }

  if (filtroAtual === "favoritos") {
    livrosFiltrados = livrosFiltrados.filter(
      (livro) => livro.favorite || livro.favorito
    );
  }
  const termo = (searchInput?.value || "").toLowerCase().trim();

  if (termo) {
    livrosFiltrados = livrosFiltrados.filter((livro) =>
      (livro.titulo || "").toLowerCase().includes(termo) ||
      (livro.autor || "").toLowerCase().includes(termo)
    );
  }
  renderizarLivros(livrosFiltrados);
}
function renderizarLivros(livros) {
  booksGrid.innerHTML = "";

  if (livros.length === 0) {
    booksGrid.innerHTML = `
  <div class="sem-livros">
     <span class="material-symbols-outlined sem-livros-icon">
menu_book
</span>

      <h3>Nenhum livro encontrado</h3>

      <p>
          Opa! Você ainda não adicionou nenhum livro à sua biblioteca...
      </p>
  </div>
`;
    return;
  }

  livros.forEach((livro) => {
    booksGrid.innerHTML += `
  <article 
  class="book-card"
  onclick="window.location.href='/book?id=${encodeURIComponent(livro.id)}'"
>
       <div class="livro-capa-wrapper">

  ${
    livro.capaUrl
      ? `<img class="livro-capa" src="${livro.capaUrl}" alt="Capa do livro ${livro.titulo}">`
      : `<div class="livro-capa sem-capa">Sem capa</div>`
  }

  <div class="livro-overlay">
      <button class="btn-ver">Ver detalhes</button>
  </div>

</div>

        <h3>${livro.titulo || "Título desconhecido"}</h3>
        <p>${livro.autor || "Autor desconhecido"}</p>

        <span class="status">${formatarStatus(livro.status)}</span>

        <div class="progress">
          <div class="progress-fill" style="width: ${livro.readingProgress || 0}%"></div>
        </div>

        <span>${livro.readingProgress || 0}%</span>
      </article>
    `;
  });
}

function atualizarEstatisticas(livros) {
  document.getElementById("total-livros").textContent = livros.length;

  document.getElementById("total-favoritos").textContent =
    livros.filter((livro) => livro.favorito || livro.favorite).length;

  document.getElementById("total-lendo").textContent =
    livros.filter((livro) => livro.status === "lendo").length;

  document.getElementById("total-concluidos").textContent =
    livros.filter((livro) => livro.status === "concluido").length;
}
function formatarStatus(status) {
  if (status === "quero-ler") return "Quero Ler";
  if (status === "lendo") return "Lendo";
  if (status === "concluido") return "Concluído";
  return "Quero Ler";
}
const voltarBtn = document.getElementById("voltar-btn");

voltarBtn?.addEventListener("click", () => {
  window.location.href = "/home";
});
