// Main.js (patched)
// Use relative paths so the site works when docs/ is the Pages source
const basePath = ''; // pages serves docs/ as the site root

function sanitizePath(p) {
  if (!p) return p;
  return p.replace(/^\/+/, ''); // remove leading slashes
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

  // sanitize image path (in case data.json has a leading slash)
  const imagePath = sanitizePath(card.Image);

  el.innerHTML = `
    <img class="bg" src="Card-Template.svg">
    <img class="photo" src="${basePath}${imagePath}" onerror="(function(){ console.warn('Image failed to load:', '${basePath}${imagePath}'); this.src='${basePath}images/placeholder.png'; })()">
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
  if (!res.ok) {
    console.error("Failed to load data.json", res.status, res.statusText, res.url);
    return;
  }
  const text = await res.text();
  const cards = text.split("\n").filter(line => line.trim().length > 0).map(line => JSON.parse(line));
  const grid = document.getElementById("grid");
  if (!cards.length) {
    console.error("No cards loaded");
    return;
  }
  cards.forEach(card => grid.appendChild(makeCard(card)));
}

start();
