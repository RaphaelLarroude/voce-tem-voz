const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkjgdyyw";
const DEBATE_FORMSPREE_ENDPOINT = "https://formspree.io/f/mnpnernj";

const form = document.getElementById("report-form");
const formSection = document.getElementById("form-section");
const successSection = document.getElementById("success-section");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

let lastReport = null;

function makeProtocol() {
  const now = new Date();
  const stamp = now.getTime().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return "VTV-" + stamp + "-" + random;
}

function simpleHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).toUpperCase().padStart(8, "0");
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const now = new Date();
  const protocolo = makeProtocol();

  document.getElementById("protocolo").value = protocolo;
  document.getElementById("data_envio").value = now.toLocaleString("pt-BR");

  const formData = new FormData(form);

  status.className = "status loading";
  status.textContent = "Enviando sua denúncia com segurança...";
  submitBtn.disabled = true;

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Falha no envio");

    lastReport = {
      protocolo,
      envio: now.toISOString(),
      tipo: formData.get("tipo"),
      ano_aluno: formData.get("ano_aluno"),
      quando: formData.get("quando"),
      nome_vitima: formData.get("nome_vitima") || "Anônimo",
      descricao: formData.get("descricao")
    };

    document.getElementById("protocol-code").textContent = protocolo;
    formSection.classList.add("hidden");
    successSection.classList.remove("hidden");
    successSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    status.className = "status error";
    status.textContent = "Não foi possível enviar agora. Verifique sua conexão e tente novamente.";
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById("download-certificate").addEventListener("click", function () {
  if (!lastReport) return;

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 700;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
  gradient.addColorStop(0, "#6d28d9");
  gradient.addColorStop(1, "#ec4899");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1000, 700);

  ctx.fillStyle = "white";
  ctx.fillRect(50, 50, 900, 600);

  ctx.fillStyle = "#4c1d95";
  ctx.font = "bold 44px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICADO DE ENVIO", 500, 140);

  ctx.font = "26px Segoe UI, sans-serif";
  ctx.fillText("Você Tem Voz — Registro de Denúncia Anônima", 500, 190);

  ctx.fillStyle = "#111827";
  ctx.font = "24px Segoe UI, sans-serif";
  const lines = [
    "Protocolo: " + lastReport.protocolo,
    "Data e hora do envio: " + new Date(lastReport.envio).toLocaleString("pt-BR"),
    "Tipo de situação: " + lastReport.tipo,
    "Ano/série informado: " + lastReport.ano_aluno,
    "Data do ocorrido: " + lastReport.quando,
    "Identificação: " + lastReport.nome_vitima,
    "",
    "Este comprovante confirma que um relato foi enviado",
    "pelo site Você Tem Voz. O conteúdo completo permanece",
    "confidencial e não é exibido neste certificado."
  ];

  lines.forEach((line, index) => {
    ctx.fillText(line, 500, 260 + index * 42);
  });

  ctx.fillStyle = "#6b7280";
  ctx.font = "18px Segoe UI, sans-serif";
  ctx.fillText("Código de verificação: " + simpleHash(lastReport.protocolo + lastReport.envio + lastReport.descricao), 500, 600);

  const link = document.createElement("a");
  link.download = "certificado-" + lastReport.protocolo + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

document.getElementById("new-report").addEventListener("click", function () {
  form.reset();
  status.textContent = "";
  successSection.classList.add("hidden");
  formSection.classList.remove("hidden");
  formSection.scrollIntoView({ behavior: "smooth" });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

const debateForm = document.getElementById("debate-form");
const debateStatus = document.getElementById("debate-status");
const debateSubmitBtn = document.getElementById("debate-submit-btn");
const debateSuccess = document.getElementById("debate-success");

debateForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  debateStatus.className = "status loading";
  debateStatus.textContent = "Enviando sua opinião...";
  debateSubmitBtn.disabled = true;

  try {
    const response = await fetch(DEBATE_FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(debateForm),
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error("Falha no envio");

    debateForm.classList.add("hidden");
    debateStatus.textContent = "";
    debateSuccess.classList.remove("hidden");
  } catch (error) {
    debateStatus.className = "status error";
    debateStatus.textContent = "Não foi possível enviar sua opinião agora. Tente novamente.";
  } finally {
    debateSubmitBtn.disabled = false;
  }
});