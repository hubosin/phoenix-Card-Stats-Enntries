function gradeLabel(str) {
  if (!str) return "";
  if (str.includes("9")) return "Freshman";
  if (str.includes("10")) return "Sophomore";
  if (str.includes("11")) return "Junior";
  if (str.includes("12")) return "Senior";
  return "";
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

function makeCard(card) {
  const s = calculate(card);

  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <img class="bg" src="card-template.svg">
    <img class="photo" src="${card.Image}" onerror="this.src='images/placeholder.png'">

    <div class="text name">${card.Name}</div>
    <div class="text grade">${gradeLabel(card["Grade level"])}</div>

    <div class="text weight">Weight: ${card["Mass(Kgs)"].toFixed(1)} kg</div>
    <div class="text activity">Activity</div>

    <div class="text length">L: ${s.l}</div>
    <div class="text height">H: ${s.h}</div>
    <div class="text hyp">Hyp: ${s.hyp.toFixed(2)}</div>

    <div class="text speed">Speed: ${s.speed.toFixed(2)}</div>
    <div class="text accel">Accel: ${s.accel.toFixed(2)}</div>
    <div class="text force">Force: ${s.force.toFixed(2)}</div>

    <div class="text work">Work: ${s.work.toFixed(1)}</div>
    <div class="text power">Power: ${s.power.toFixed(1)}</div>

    <div class="text hp">${s.hp.toFixed(2)} HP</div>
  `;

  return el;
}

async function start() {
  const res = await fetch("data.json");
  const text = await res.text();

  const cards = text
    .split("\n")
    .filter(line => line.trim().length > 0)
    .map(line => JSON.parse(line));

  const grid = document.getElementById("grid");

  if (!cards.length) {
    console.error("No cards loaded");
    return;
  }

  cards.forEach(card => grid.appendChild(makeCard(card)));
}

start();
