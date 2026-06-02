import {
  registrarUsuario,
  fazerLogin,
  estaLogado,
} from "../../src/modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Impede que o usuário acesse a tela caso já esteja autenticado
  if (estaLogado()) {
    window.location.href = "/home";
    return;
  }

  // Mapeamento dos elementos da árvore DOM
  const form = document.getElementById("login-form");
  const nomeInput = document.getElementById("nome-input");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const registerButton = document.getElementById("register-button");
  const togglePassword = document.getElementById("toggle-password");

  // Redirecionamento para tela inicial/login se o botão existir
  if (registerButton) {
    registerButton.addEventListener("click", () => {
      window.location.href = "/";
    });
  }

  // Processamento do formulário de cadastro de forma assíncrona
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nome = nomeInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const senha = passwordInput.value.trim();

      // Validação de segurança no lado do cliente
      if (!nome) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Nome é obrigatório",
          confirmButtonColor: "#d95a1a",
        });
        return;
      }

      // Requisição assíncrona de cadastro corrigida (com await)
      const cadastro = await registrarUsuario(email, senha);

      if (!cadastro.sucesso) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: cadastro.mensagem,
          confirmButtonColor: "#d95a1a",
        });
        return;
      }

      // Autenticação automática assíncrona após cadastro (com await)
      const login = await fazerLogin(email, senha);

      if (login.sucesso) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: cadastro.mensagem,
          confirmButtonColor: "#d95a1a",
        }).then(() => {
          window.location.href = "/home";
        });
      }
    });
  }

  // Lógica de alternância de visibilidade da senha (Olhinho) protegida e encapsulada
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }
});
