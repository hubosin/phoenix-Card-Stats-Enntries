async function loadSVG() {
  const res = await fetch("card-template.svg");
  const text = await res.text();
  return new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
}

function gradeLabel(str) {
  if (!str) return "";
  if (str.includes("9")) return "Freshman";
  if (str.includes("10")) return "Sophomore";
  if (str.includes("11")) return "Junior";
  if (str.includes("12")) return "Senior";
  return str;
}

function calculate(card) {
  const l = card["Horizantal distance"];
  const h = card["Vertical distane"];
  const t = card["Time(S)"];
  const m = card["Mass(Kgs)"];

  const hyp = Math.sqrt(l*l + h*h);
  const speed = hyp / t;
  const accel = speed / t;
  const force = m * accel;
  const work = force * hyp;
  const power = work / t;
  const hp = power / 745.7;

  return { l, h, hyp, speed, accel, force, work, power, hp };
}

function fill(svg, card) {
  const s = calculate(card);

  svg.querySelector("#name").textContent = card.Name;
  svg.querySelector("#grade").textContent = gradeLabel(card["Grade level"]);
  svg.querySelector("#weight").textContent = `Weight: ${card["Mass(Kgs)"].toFixed(1)} kg`;
  svg.querySelector("#activity").textContent = `Activity: ${card.Use}`;

  svg.querySelector("#length").textContent = `Length: ${s.l}`;
  svg.querySelector("#height").textContent = `Height: ${s.h}`;
  svg.querySelector("#hypotenuse").textContent = `Hyp: ${s.hyp.toFixed(2)}`;

  svg.querySelector("#speed").textContent = `Speed: ${s.speed.toFixed(2)}`;
  svg.querySelector("#acceleration").textContent = `Accel: ${s.accel.toFixed(2)}`;
  svg.querySelector("#force").textContent = `Force: ${s.force.toFixed(2)}`;

  svg.querySelector("#work").textContent = `Work: ${s.work.toFixed(2)}`;
  svg.querySelector("#power").textContent = `Power: ${s.power.toFixed(2)}`;
  svg.querySelector("#horsepower").textContent = `${s.hp.toFixed(2)} HP`;

  svg.querySelector("#card-img")
     .setAttribute("href", card.Image);
}

async function start() {
  const res = await fetch("data.json");
  const lines = (await res.text()).split("\n").filter(Boolean);
  const cards = lines.map(JSON.parse);

  const template = await loadSVG();
  const grid = document.getElementById("card-grid");

  cards.forEach(card => {
    const svg = template.cloneNode(true);
    fill(svg, card);
    grid.appendChild(svg);
  });
}

start();
