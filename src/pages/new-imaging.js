let imagings = [];
let imagingDB = [];
let selectedImaging = null;

/* =========================
   LOAD FROM LOCAL STORAGE
========================= */
window.onload = () => {
  loadImagingFromStorage();
};

/* =========================
   INIT / LOAD
========================= */
function loadImagingFromStorage() {

  const data = localStorage.getItem("imagingDB");

  if (data) {
    imagingDB = JSON.parse(data);
  } else {
    imagingDB = [
      { name: "Radio thorax" },
      { name: "Scanner cérébral" },
      { name: "IRM" },
      { name: "Échographie abdominale" }
    ];

    saveImagingToStorage();
  }
}

/* =========================
   SAVE DB
========================= */
function saveImagingToStorage() {
  localStorage.setItem("imagingDB", JSON.stringify(imagingDB));
}

/* =========================
   OPEN DROPDOWN
========================= */
function openDropdown() {
  renderDropdown(imagingDB);
  document.getElementById("imagingDropdown").classList.remove("hidden");
}

/* =========================
   FILTER SEARCH
========================= */
function filterImaging() {

  const value = document
    .getElementById("searchImaging")
    .value
    .toLowerCase();

  const filtered = imagingDB.filter(i =>
    i.name.toLowerCase().includes(value)
  );

  renderDropdown(filtered);
}

/* =========================
   RENDER DROPDOWN
========================= */
function renderDropdown(list) {

  const box = document.getElementById("imagingDropdown");
  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = `<div>Aucun examen</div>`;
    return;
  }

  list.forEach(i => {
    const div = document.createElement("div");

    div.innerHTML = `🩻 ${i.name}`;

    div.onclick = () => selectImaging(i);

    box.appendChild(div);
  });
}

/* =========================
   SELECT ITEM
========================= */
function selectImaging(i) {

  selectedImaging = i;

  document.getElementById("searchImaging").value = i.name;

  document.getElementById("imagingDropdown").classList.add("hidden");
}

/* =========================
   ADD TO LIST
========================= */
function addImaging() {

  if (!selectedImaging) return;

  imagings.push({
    name: selectedImaging.name
  });

  renderList();
}

/* =========================
   RENDER LIST
========================= */
function renderList() {

  const box = document.getElementById("imagingBox");

  box.innerHTML = "";

  imagings.forEach((i, index) => {
    box.innerHTML += `
      <div style="padding:10px;border-bottom:1px solid #eee">
        🩻 ${i.name}
      </div>
    `;
  });
}

/* =========================
   SHOW MANUAL FORM
========================= */
function showManualForm() {
  document
    .getElementById("manualForm")
    .classList.toggle("hidden");
}

/* =========================
   ADD MANUAL IMAGING
========================= */
function addManualImaging() {

  const name = document.getElementById("mName").value;

  if (!name) return;

  const newItem = { name };

  // add to prescription list
  imagings.push(newItem);

  // add to DB
  imagingDB.push(newItem);

  // save DB
  saveImagingToStorage();

  // update UI
  renderList();

  // reset
  document.getElementById("mName").value = "";

  alert("Examen ajouté ✔️");
}

/* =========================
   SAVE REQUEST
========================= */
function saveImagingRequest() {

  if (imagings.length === 0) {
    alert("Aucun examen !");
    return;
  }

  const name = document.querySelector("input[placeholder='Nom du patient']")?.value || "Patient";
  const age = document.querySelector("input[placeholder='Âge']")?.value || "";

  const date = new Date().toLocaleDateString();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // HEADER
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("CABINET MÉDICAL", 10, 15);

  doc.setFontSize(11);
  doc.setFont("Helvetica", "normal");
  doc.text("Dr. Nom Prénom", 10, 22);
  doc.text("Imagerie médicale", 150, 22);

  doc.line(10, 30, 200, 30);

  // TITLE
  doc.setFontSize(16);
  doc.text("DEMANDE D'IMAGERIE", 60, 45);

  // PATIENT
  doc.setFontSize(12);
  doc.text(`Patient: ${name}`, 10, 60);
  doc.text(`Âge: ${age}`, 10, 68);
  doc.text(`Date: ${date}`, 150, 60);

  doc.line(10, 75, 200, 75);

  // LIST
  let y = 90;

  doc.setFont("Helvetica", "bold");
  doc.text("Examens demandés:", 10, y);
  y += 10;

  doc.setFont("Helvetica", "normal");

  imagings.forEach((i, index) => {
    doc.text(`${index + 1}. ${i.name}`, 12, y);
    y += 10;
  });

  // FOOTER
  doc.line(10, 250, 200, 250);
  doc.text("Signature du médecin", 140, 270);

  // SAVE PDF
  doc.save(`Imagerie_${name}.pdf`);

  // SAVE HISTORY
  let history = JSON.parse(localStorage.getItem("imagingHistory")) || [];

  history.push({
    name,
    age,
    imagings,
    date
  });

  localStorage.setItem("imagingHistory", JSON.stringify(history));

  alert("Demande enregistrée ✔️");
}
