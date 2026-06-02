import { fazerLogin, estaLogado } from "../../src/modules/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  if (estaLogado()) {
    window.location.href = "/home";
    return;
  }

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const senha = passwordInput.value.trim();

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
});

const passwordInput = document.getElementById("password-input");
const togglePassword = document.getElementById("toggle-password");

if (togglePassword) {
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    this.textContent = type === "password" ? "visibility" : "visibility_off";
  });
}
