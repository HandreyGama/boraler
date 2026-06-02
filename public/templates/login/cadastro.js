import {
  registrarUsuario,
  fazerLogin,
  estaLogado,
} from "../../src/modules/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (estaLogado()) {
    window.location.href = "/home";
    return;
  }

  const form = document.getElementById("login-form");
  const nomeInput = document.getElementById("nome-input");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const registerButton = document.getElementById("register-button");
  const togglePassword = document.getElementById("toggle-password");

  loginButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();


    if (!nome) {
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: "Nome é obrigatório",
        confirmButtonColor: "#d95a1a",
      });
      return;
    }

    const cadastro = await registrarUsuario(email, senha);

      const cadastro = registrarUsuario(email, senha);

    const login = await fazerLogin(email, senha);

      const login = fazerLogin(email, senha);

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

  // Lógica do olhinho movida para dentro do escopo correto
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }
});
