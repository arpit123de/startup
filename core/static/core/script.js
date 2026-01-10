
const agents = {
  idea: [
    "I want to start an IT company that helps people build affordable websites.",
    "Many small businesses cannot afford expensive developers.",
    "The idea is to provide simple, low-cost digital solutions.",
    "We should focus on beginners, shop owners, and startups."
  ],

  ceo: [
    "Our goal is to create an affordable and reliable IT service company.",
    "We must focus on customer needs first.",
    "The company should be easy to trust and easy to use.",
    "Long-term growth is more important than quick profit."
  ],

  tech: [
    "We will build websites using modern and fast technologies.",
    "The platform should be simple so anyone can use it.",
    "Automation will help us deliver projects faster.",
    "The system must work smoothly on mobile and desktop."
  ],

  marketing: [
    "Many people search online for affordable website developers.",
    "We should clearly explain what services we offer.",
    "Simple examples and demos will attract customers.",
    "Trust and transparency will help build our brand."
  ],

  customer: [
    "I want an affordable website for my small business.",
    "Where can I get a website at a low cost?",
    "I need something simple and easy to manage.",
    "Can you help me build my website quickly?",
    "I want good support after the website is delivered."
  ],

  finance: [
    "We should keep prices affordable for small businesses.",
    "Costs must be controlled to stay profitable.",
    "Subscription or basic plans can help revenue.",
    "Customer satisfaction will increase long-term income."
  ]
};
const agentLabels = {
  idea: "Idea",
  ceo: "CEO",
  tech: "Tech",
  marketing: "Marketing",
  customer: "Customer / End User",
  finance: "Finance"
};


/* ORDER OF AGENTS */
const agentOrder = ["idea","ceo","tech","marketing","customer","finance"];

/* STATE */
let agentIndex = 0;
let messageIndex = 0;

const messageBox = document.getElementById("messageBox");
const agentInfo = document.getElementById("agentInfo");

/* Typing effect */
function typeMessage(text, speed = 28) {
  messageBox.innerHTML = "";
  let i = 0;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  messageBox.appendChild(cursor);

  const typing = setInterval(() => {
    if (i < text.length) {
      cursor.insertAdjacentText("beforebegin", text[i]);
      i++;
    } else {
      clearInterval(typing);
    }
  }, speed);
}

/* MAIN LOGIC */

function runConversation() {
  // remove highlight
  document.querySelectorAll(".node").forEach(n =>
    n.classList.remove("active")
  );

  const agentKey = agentOrder[agentIndex];
  const messages = agents[agentKey];

  // activate node safely
  const node = document.getElementById(agentKey);
  if (node) node.classList.add("active");

  // show agent label
  agentInfo.innerText = "Active Agent: " + agentLabels[agentKey];

  // type message
  typeMessage(messages[messageIndex]);

  // move forward
  agentIndex++;

  // when one full round is complete
  if (agentIndex >= agentOrder.length) {
    agentIndex = 0;
    messageIndex++;

    // reset message index safely
    if (messageIndex >= messages.length) {
      messageIndex = 0;
    }
  }
}

/* START LOOP */
runConversation();
setInterval(runConversation, 3500);