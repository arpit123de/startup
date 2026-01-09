const data = JSON.parse(localStorage.getItem("startupData"));
document.getElementById("summary").innerHTML = `
<h3>Idea</h3><p>${data.idea}</p>
<h3>Business</h3><p>${data.business}</p>
<h3>Targets</h3><p>${data.targets.join(", ")}</p>
`;

fetch("http://localhost:8000/startup/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(res => play(res.agents));

async function play(agents) {
  for (let a of agents) {
    draw(a.role, a.output);
    await new Promise(r => setTimeout(r, 1200));
  }
}

const svg = document.getElementById("canvas");
let yOffset = 30;

function drawAgent(agent, text) {
  const padding = 20;

  const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textEl.setAttribute("x", 40);
  textEl.setAttribute("y", yOffset + padding);
  textEl.setAttribute("fill", "#ffffff");
  textEl.setAttribute("font-size", "18");

  text.split("\n").forEach((line, i) => {
    const tspan = document.createElementNS(textEl.namespaceURI, "tspan");
    tspan.setAttribute("x", 40);
    tspan.setAttribute("dy", i === 0 ? "0" : "1.6em");
    tspan.textContent = line;
    textEl.appendChild(tspan);
  });

  svg.appendChild(textEl);

  const box = textEl.getBBox();

  const rect = document.createElementNS(svg.namespaceURI, "rect");
  rect.setAttribute("x", 20);
  rect.setAttribute("y", yOffset);
  rect.setAttribute("width", box.width + padding * 2);
  rect.setAttribute("height", box.height + padding * 2);
  rect.setAttribute("rx", 14);
  rect.setAttribute("fill", "#14162a");
  rect.setAttribute("stroke", "#a855f7");

  svg.insertBefore(rect, textEl);

  yOffset += box.height + 60;
}

async function startAgents() {
  svg.innerHTML = "";
  yOffset = 30;

  const targets = [...document.querySelectorAll("#step-targets input:checked")].map(e => e.value);
  const agents = [...document.querySelectorAll("#step-agents input:checked")].map(e => e.value);

  for (let agent of agents) {
    let content = `🧠 ${agent} Agent\n`;

    if (agent === "Customer") {
      content += `🎯 Target Users: ${targets.join(", ")}\n📌 Validating real needs`;
    } else {
      content += `📌 Providing insights for startup growth`;
    }

    drawAgent(agent, content);
    await new Promise(res => setTimeout(res, 900));
  }
}