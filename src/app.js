document.querySelectorAll(".card").forEach((card, index) => {
  card.addEventListener("click", () => {
    const routes = [
      "pages/new-prescription.html",
      "pages/new-analysis.html",
      "pages/new-imaging.html",
      "pages/patients.html"
    ];
    if (routes[index]) {
      window.location.href = routes[index];
    }
  });
});
