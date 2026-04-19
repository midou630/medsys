
let items = [];
let db = [];
let selected = null;

function openDropdown() {
  render(db);
  document.getElementById("itemDropdown").classList.remove("hidden");
}

function filterItems() {
  const val = document.getElementById("searchItem").value.toLowerCase();

  render(db.filter(i => i.name.toLowerCase().includes(val)));
}

function render(list) {
  const box = document.getElementById("itemDropdown");
  box.innerHTML = "";

  list.forEach(i => {
    const div = document.createElement("div");
    div.innerHTML = i.name;
    div.onclick = () => select(i);
    box.appendChild(div);
  });
}

function select(i) {
  selected = i;
  document.getElementById("searchItem").value = i.name;
  document.getElementById("itemDropdown").classList.add("hidden");
}

function addManualItem() {
  const name = document.getElementById("mName").value;
  if (!name) return;

  items.push(name);
  db.push({ name });

  render(items);
}

function showManualForm() {
  document.getElementById("manualForm").classList.toggle("hidden");
}
