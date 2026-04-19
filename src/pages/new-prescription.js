let drugs = [];
let drugDB = [];
let selectedDrug = null;

/* =========================
   LOAD FROM LOCAL STORAGE
========================= */
window.onload = () => {
  loadDrugsFromStorage();
};

/* =========================
   INIT / LOAD
========================= */
function loadDrugsFromStorage() {

  const data = localStorage.getItem("drugDB");

  if (data) {
    drugDB = JSON.parse(data);
  } else {
    drugDB = [
      { name: "Paracétamol", dose: "500mg", type: "Comprimé" },
      { name: "Amoxicilline", dose: "1g", type: "Comprimé" },
      { name: "Ibuprofène", dose: "200mg", type: "Comprimé" }
    ];
    saveDrugsToStorage();
  }
}

/* =========================
   SAVE
========================= */
function saveDrugsToStorage() {
  localStorage.setItem("drugDB", JSON.stringify(drugDB));
}

/* =========================
   OPEN DROPDOWN
========================= */
function openDropdown() {
  renderDropdown(drugDB);
  document.getElementById("drugDropdown").classList.remove("hidden");
}

/* =========================
   FILTER
========================= */
function filterDrugs() {
  const value = document.getElementById("searchDrug").value.toLowerCase();

  const filtered = drugDB.filter(d =>
    d.name.toLowerCase().includes(value)
  );

  renderDropdown(filtered);
}

/* =========================
   RENDER DROPDOWN
========================= */
function renderDropdown(list) {
  const box = document.getElementById("drugDropdown");

  box.innerHTML = "";

  if (list.length === 0) {
    box.innerHTML = `<div>Aucun médicament</div>`;
    return;
  }

  list.forEach(d => {
    const div = document.createElement("div");
    div.innerHTML = `💊 ${d.name} - ${d.dose} (${d.type})`;

    div.onclick = () => selectDrug(d);

    box.appendChild(div);
  });
}

/* =========================
   SELECT
========================= */
function selectDrug(d) {
  selectedDrug = d;

  document.getElementById("searchDrug").value =
    `${d.name} - ${d.dose}`;

  document.getElementById("drugDropdown").classList.add("hidden");
}

/* =========================
   ADD TO PRESCRIPTION
========================= */
function addDrug() {

  if (selectedDrug) {
    drugs.push({
      drug: selectedDrug.name,
      dose: selectedDrug.dose,
      type: selectedDrug.type
    });

    render();
    return;
  }
}

/* =========================
   RENDER PRESCRIPTION
========================= */
function render() {
  const box = document.getElementById("drugBox");
  if (!box) return;

  box.innerHTML = "";

  drugs.forEach(d => {
    box.innerHTML += `
      <div style="padding:10px;border-bottom:1px solid #eee">
        💊 ${d.drug} — ${d.dose} (${d.type})
      </div>
    `;
  });
}

/* =========================
   SHOW FORM
========================= */
function showManualForm() {
  document.getElementById("manualForm").classList.toggle("hidden");
}

/* =========================
   ADD MANUAL DRUG
========================= */
function addManualDrug() {

  const name = document.getElementById("mName").value;
  const dose = document.getElementById("mDose").value;
  const unit = document.getElementById("mUnit").value;
  const type = document.getElementById("mType").value;

  if (!name || !dose) return;

  const fullDose = dose + " " + unit;

  const newDrug = {
    name,
    dose: fullDose,
    type
  };

  drugs.push({
    drug: name,
    dose: fullDose,
    type
  });

  drugDB.push(newDrug);
  saveDrugsToStorage();

  renderDropdown(drugDB);
  render();

  document.getElementById("mName").value = "";
  document.getElementById("mDose").value = "";

  alert("Médicament enregistré ✔️");
}

/* =========================
   CLOSE DROPDOWN
========================= */
document.addEventListener("click", function(e) {
  if (!e.target.closest("#searchDrug") &&
      !e.target.closest("#drugDropdown")) {
    document.getElementById("drugDropdown").classList.add("hidden");
  }
});

/* =========================
   🔥 SAVE + PDF (FINAL)
========================= */
function savePrescription() {

  if (drugs.length === 0) {
    alert("Aucun médicament !");
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
  doc.text("Spécialité", 10, 28);
  doc.text("Tél: 0550 00 00 00", 150, 22);

  // LINE
  doc.line(10, 32, 200, 32);

  // TITLE
  doc.setFontSize(16);
  doc.text("ORDONNANCE", 80, 45);

  // PATIENT
  doc.setFontSize(12);
  doc.text(`Patient: ${name}`, 10, 60);
  doc.text(`Âge: ${age}`, 10, 68);
  doc.text(`Date: ${date}`, 150, 60);

  doc.line(10, 75, 200, 75);

  // MEDS
  let y = 90;

  doc.setFont("Helvetica", "bold");
  doc.text("Prescription:", 10, y);
  y += 10;

  doc.setFont("Helvetica", "normal");

  drugs.forEach((d, i) => {
    doc.text(`${i + 1}. ${d.drug}`, 12, y);
    y += 6;
    doc.text(`   ${d.dose} - ${d.type}`, 12, y);
    y += 10;
  });

  // FOOTER
  doc.line(10, 250, 200, 250);
  doc.text("Signature du médecin", 140, 270);

  // DOWNLOAD
  doc.save(`Ordonnance_${name}.pdf`);

  // SAVE LOCAL HISTORY
  let history = JSON.parse(localStorage.getItem("prescriptions")) || [];

  history.push({
    name,
    age,
    drugs,
    date
  });

  localStorage.setItem("prescriptions", JSON.stringify(history));

  alert("Ordonnance enregistrée ✔️");
}
