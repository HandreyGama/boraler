import { fazerLogin, estaLogado } from "../../src/modules/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  // Impede o acesso à tela caso o usuário já esteja autenticado
  if (estaLogado()) {
    window.location.href = "/home";
    return;
  }

  // Mapeamento dos elementos da árvore DOM
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const togglePassword = document.getElementById("toggle-password");

  // Processamento do formulário de login de forma assíncrona (Aguardando a API)
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim().toLowerCase();
      const senha = passwordInput.value.trim();

      // Chamada à API tratada corretamente com await (trazido do Arquivo 02)
      const resultado = await fazerLogin(email, senha);

      if (resultado.sucesso) {
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: resultado.mensagem,
          confirmButtonColor: "#d95a1a",
        }).then(() => {
          window.location.href = "/home";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: resultado.mensagem,
          confirmButtonColor: "#d95a1a",
        });
      }
    });
  }

  // Lógica de alternância de visibilidade da senha (Olhinho encapsulado com segurança)
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Troca o nome do ícone (o Google Fonts faz a troca automática pelo texto)
      this.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }
});
