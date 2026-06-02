import { atualizarSenha } from "../../src/modules/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const togglePassword = document.getElementById("toggle-password");
  const confirmInput = document.getElementById("confirm-password-input");
  const toggleConfirm = document.getElementById("toggle-confirm-password");
  const loginForm = document.getElementById("login-form");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }

  if (toggleConfirm && confirmInput) {
    toggleConfirm.addEventListener("click", function () {
      const type =
        confirmInput.getAttribute("type") === "password" ? "text" : "password";
      confirmInput.setAttribute("type", type);
      this.textContent = type === "password" ? "visibility" : "visibility_off";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const novaSenha = passwordInput.value.trim();
      const confirmacaoSenha = confirmInput.value.trim();

      if (!email || !novaSenha || !confirmacaoSenha) {
        Swal.fire({
          title: "Atenção",
          text: "Todos os campos são obrigatórios.",
          icon: "warning",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      if (novaSenha !== confirmacaoSenha) {
        Swal.fire({
          title: "Erro",
          text: "As senhas não conferem. Por favor, tente novamente.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }

      const resultado = atualizarSenha(email, novaSenha);

      if (resultado.sucesso) {
        Swal.fire({
          title: "Sucesso",
          text: resultado.mensagem,
          icon: "success",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      } else {
        Swal.fire({
          title: "Erro",
          text: resultado.mensagem,
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    });
  }
});
