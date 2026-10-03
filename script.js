emailjs.init(EMAILJS_CONFIG.publicKey);

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

  const data = {
    ano_aluno: document.getElementById("ano-aluno").value,
    quando: document.getElementById("quando").value,
    tipo: document.getElementById("tipo").value,
    local: document.getElementById("local").value || "Não informado",
    descricao: document.getElementById("descricao").value.trim(),
    nome_vitima: document.getElementById("nome-vitima").value.trim() || "Anônimo",
    nome_autor: document.getElementById("nome-autor").value.trim() || "Não informado",
    recipient_email: EMAILJS_CONFIG.recipientEmail
  };

  const now = new Date();
  data.protocolo = makeProtocol();
  data.data_envio = now.toLocaleString("pt-BR");

  status.className = "status loading";
  status.textContent = "Enviando sua denúncia com segurança...";
  submitBtn.disabled = true;

  try {
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, data);

    lastReport = { ...data, envio: now.toISOString() };
    document.getElementById("protocol-code").textContent = data.protocolo;

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