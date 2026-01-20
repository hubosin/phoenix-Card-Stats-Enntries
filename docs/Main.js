console.log("main.js loaded");

// Base path for GitHub Pages compatibility
const basePath = window.location.pathname.includes('/phoenix-Card-Stats-Enntries-main/') 
  ? '/phoenix-Card-Stats-Enntries-main/docs/'
  : '/docs/';

// Position configuration - easily adjust here
const positions = {
  photo: { top: '70px', left: '30px', width: '200px', height: '120px' },
  name: { top: '47px' },
  weight: { top: '53.2px', right: '32px' },
  length: { bottom: '202px', left: '125px' },
  height: { bottom: '201.5px', left: '158px' },
  hyp: { bottom: '202px', left: '195px' },
  speed: { top: '237px', left: '150px' },
  velocity: { top: '257px', left: '150px' },
  accel: { top: '277px', left: '150px' },
  force: { top: '297px', left: '150px' },
  work: { top: '317px', left: '150px' },
  power: { top: '337px', left: '150px' },
  hp: { top: '357px', left: '150px' },
  qrcode: { bottom: '10px', right: '10px' }
};

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
  const accel = (2 * hyp) / (t * t);
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

  const detailUrl = `detail.html?name=${encodeURIComponent(card.Name)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(detailUrl)}`;

  el.innerHTML = `
    <img class="bg" src="Card-Template.svg">

    <img class="photo"
         src="${basePath}${card.Image}"
         onerror="this.src='${basePath}images/placeholder.png'">

    <div class="text name">${card.Name}</div>

    <div class="text weight">${card["Mass(Kgs)"].toFixed(1)}</div>

    <div class="text length">${s.l}</div>
    <div class="text height">${s.h}</div>
    <div class="text hyp">${s.hyp.toFixed(2)}</div>

    <div class="text speed">${s.speed.toFixed(2)} m/s</div>
    <div class="text velocity">${s.speed.toFixed(2)} m/s</div>
    <div class="text accel">${s.accel.toFixed(2)} m/s²</div>

    <div class="text force">${s.force.toFixed(2)} N</div>
    <div class="text work">${s.work.toFixed(2)} J</div>

    <div class="text power">${s.power.toFixed(2)} W</div>
    <div class="text hp">${s.hp.toFixed(2)} HP</div>

    <div class="qrcode">
      <a href="${detailUrl}" target="_blank">
        <img src="${qrUrl}" alt="Details">
      </a>
    </div>
  `;

  return el;
}

async function start() {
  const res = await fetch(`${basePath}data.json`);
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
