let step = 0;

const panels = document.querySelectorAll(".panel");
const circles = document.querySelectorAll(".circle");

function updateUI() {
  panels.forEach(p => p.classList.remove("active"));
  circles.forEach(c => c.classList.remove("active"));

  panels[step].classList.add("active");
  circles[step].classList.add("active");
}

function nextStep() {
  if (step < panels.length - 1) {
    step++;
    updateUI();
  }
}

function prevStep() {
  if (step > 0) {
    step--;
    updateUI();
  }
}

function finish() {
  // OPTIONAL: store data if needed
  const data = {
    idea: document.getElementById("idea").value,
    business: document.getElementById("business").value,
    targets: [...document.querySelectorAll("input[type=checkbox]:checked")]
      .map(e => e.value)
  };

  localStorage.setItem("startup_data", JSON.stringify(data));

  // 🔥 REDIRECT TO CANVAS PAGE
  window.location.href = "/canvas/";
}
