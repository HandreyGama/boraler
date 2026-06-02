import anime from "https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js";

document.addEventListener("DOMContentLoaded", () => {
  // Executa a animação de entrada da seção #login
  const loginSection = document.getElementById("login");

  if (loginSection) {
    anime({
      targets: loginSection,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 800,
      easing: "easeOutQuad",
    });
  }
});
