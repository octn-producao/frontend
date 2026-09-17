document.getElementById("year").textContent = new Date().getFullYear();

const animatedElements = document.querySelectorAll(".reveal");
const views = document.querySelectorAll("[data-view]");
const viewLinks = document.querySelectorAll("[data-view-link]");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const validViews = new Set(["home", "consultoria", "servicos", "capacitacao", "formularios"]);

const simulator = document.getElementById("service-simulator");
const serviceCatalog = document.getElementById("service-catalog");
const summaryItems = document.getElementById("summary-items");
const summaryTotal = document.getElementById("summary-total");
const summaryServiceName = document.getElementById("summary-service-name");
const summaryServiceCount = document.getElementById("summary-service-count");
const summarySelectionSuffix = document.getElementById("summary-selection-suffix");
const summaryPlanLabel = document.getElementById("summary-plan-label");
const summaryTotalLabel = document.getElementById("summary-total-label");
const summaryDeliverables = document.getElementById("summary-deliverables");
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const serviceGroups = [
  {
    name: "Consultoria e gestão",
    services: [
      { id: "hora-tecnica", name: "Hora técnica", unit: "hora", unitCents: 16079 },
      { id: "assessoria-rt", name: "Assessoria com responsabilidade técnica", unit: "hora", unitCents: 21428 },
      { id: "assessoria", name: "Assessoria sem responsabilidade técnica", unit: "hora", unitCents: 10714 },
      { id: "consultoria", name: "Consultoria", unit: "hora", unitCents: 16079 },
      { id: "checklist-rdc", name: "Checklist de acordo com a RDC 216/04 Anvisa", unit: "checklist", unitCents: 21428 },
      { id: "auditoria", name: "Auditoria com relatório", unit: "auditoria", unitCents: 430828 },
      { id: "mbp", name: "MBP, POPs, fluxograma e layout", unit: "projeto", unitCents: 430828 },
    ],
  },
  {
    name: "Nutrição clínica e cuidado",
    services: [
      { id: "avaliacao-enteral", name: "Avaliação clínica enteral", unit: "avaliação", unitCents: 42856 },
      { id: "avaliacao-parenteral", name: "Avaliação clínica parenteral", unit: "avaliação", unitCents: 42856 },
      { id: "avaliacao-nutricional", name: "Avaliação nutricional", unit: "avaliação", unitCents: 21428, selected: true },
      { id: "avaliacao-nutricional-individual", name: "Avaliação Nutricional Individual", unit: "avaliação individual", unitCents: 14990, referenceLabel: "referência SindNutriBA 2026–2027", referenceDetail: "Tabela SindNutriBA 2026–2027: Avaliação Nutricional Individual" },
      { id: "bioimpedancia", name: "Bioimpedância", unit: "avaliação", unitCents: 21428 },
      { id: "consulta-clinica", name: "Consulta clínica", unit: "consulta", unitCents: 21428 },
      { id: "consulta-convenio", name: "Consulta por convênio", unit: "consulta", unitCents: 10714 },
      { id: "consultorio-academia", name: "Consultório em academia", unit: "atendimento", unitCents: 21428 },
      { id: "home-care", name: "Home care — consulta domiciliar", unit: "visita", unitCents: 42856 },
      { id: "orientacao", name: "Orientação nutricional", unit: "orientação", unitCents: 10714 },
      { id: "personal-diet", name: "Personal Diet", unit: "atendimento", unitCents: 42828 },
    ],
  },
  {
    name: "Cardápios e produção",
    services: [
      { id: "cardapio-diario", name: "Cardápio diário", unit: "cardápio", unitCents: 10714 },
      { id: "cardapio-semanal", name: "Cardápio semanal", unit: "cardápio", unitCents: 53570 },
      { id: "cardapio-mensal", name: "Cardápio mensal", unit: "cardápio", unitCents: 214280 },
      { id: "ficha-tecnica", name: "Ficha técnica", unit: "ficha", unitCents: 42856 },
      { id: "rotulagem", name: "Rotulagem nutricional", unit: "rótulo", unitCents: 16079 },
    ],
  },
  {
    name: "Educação e capacitação",
    services: [
      { id: "educacao-nutricional", name: "Atividade de educação nutricional", unit: "atividade", unitCents: 16079 },
      { id: "palestra", name: "Palestra", unit: "participante", unitCents: 16079 },
      { id: "treinamento-rt", name: "Treinamento e capacitação em RT", unit: "hora", unitCents: 16079 },
    ],
  },
];

const servicesById = new Map(
  serviceGroups.flatMap((group) => group.services).map((service) => [service.id, service])
);

const fnnOfficialNames = {
  "hora-tecnica": "Hora Técnica",
  "assessoria-rt": "Assessoria com RT - (por hora)",
  assessoria: "Assessoria sem RT - (por hora)",
  consultoria: "Consultoria - (por hora)",
  "checklist-rdc": "CheckList de Acordo com RDC 216/04 ANVISA",
  auditoria: "Auditoria com Relatório",
  mbp: "MBP - (POP’s, Fluxograma, Layout)",
  "avaliacao-enteral": "Avaliação Clínica Enteral",
  "avaliacao-parenteral": "Avaliação Clínica Parenteral",
  "avaliacao-nutricional": "Avaliação Nutricional",
  bioimpedancia: "Bioimpedância",
  "consulta-clinica": "Consulta Clínica",
  "consulta-convenio": "Consulta Convênio",
  "consultorio-academia": "Consultório - (academia)",
  "home-care": "Home Care - (consulta domiciliar / por visita)",
  orientacao: "Orientação Nutricional",
  "personal-diet": "Personal Diet",
  "cardapio-diario": "Cardápio Diário",
  "cardapio-semanal": "Cardápio Semanal",
  "cardapio-mensal": "Cardápio Mensal",
  "ficha-tecnica": "Ficha Técnica - (por ficha)",
  rotulagem: "Rotulagem Nutricional - (por rótulo)",
  "educacao-nutricional": "Atividade de Educação Nutricional",
  palestra: "Palestra - (por participante)",
  "treinamento-rt": "Treinamento Capacitação RT - (por hora)",
};

function setOutput(id, value) {
  document.getElementById(id).textContent = value;
}

function renderServiceCatalog() {
  if (!serviceCatalog) return;

  serviceCatalog.innerHTML = serviceGroups
    .map(
      (group, groupIndex) => `
        <details class="service-group" ${groupIndex === 1 || groupIndex === 2 ? "open" : ""}>
          <summary>
            <span>${group.name}</span>
            <small>${group.services.length} ${group.services.length === 1 ? "serviço" : "serviços"}</small>
          </summary>
          <div class="service-group-list">
            ${group.services
              .map(
                (service) => `
                  <div class="catalog-service" data-service-row>
                    <label class="catalog-service-select" data-reference="${service.referenceDetail ?? `Nome oficial na FNN: ${fnnOfficialNames[service.id] ?? service.name}`}">
                      <input type="checkbox" name="selected-service" value="${service.id}" ${service.selected ? "checked" : ""} />
                      <span>
                        <strong>${service.name}</strong>
                        <small>Por ${service.unit} · ${service.referenceLabel ?? "referência FNN 2026"}</small>
                      </span>
                      <b>${currency.format(service.unitCents / 100)}</b>
                    </label>
                    <label class="catalog-quantity">
                      <span data-quantity-label>Qtd./mês</span>
                      <input
                        type="number"
                        name="quantity-${service.id}"
                        min="1"
                        max="500"
                        step="1"
                        value="1"
                        inputmode="numeric"
                        aria-label="Quantidade de ${service.name}"
                        ${service.selected ? "" : "disabled"}
                      />
                    </label>
                  </div>
                `
              )
              .join("")}
          </div>
        </details>
      `
    )
    .join("");
}

function getSelectedServices() {
  return [...simulator.querySelectorAll('input[name="selected-service"]:checked')].map((checkbox) => {
    const service = servicesById.get(checkbox.value);
    const quantityInput = simulator.elements[`quantity-${checkbox.value}`];
    const parsedQuantity = Number.parseInt(quantityInput.value, 10) || 1;
    const quantity = Math.min(500, Math.max(1, parsedQuantity));
    quantityInput.value = quantity;
    return { ...service, quantity, subtotalCents: service.unitCents * quantity };
  });
}

function updateSimulation() {
  if (!simulator) return;

  const planType = simulator.elements["plan-type"].value;
  const isMonthly = planType === "mensal";

  simulator.querySelectorAll("[data-service-row]").forEach((row) => {
    const checkbox = row.querySelector('input[name="selected-service"]');
    const quantityInput = row.querySelector('input[type="number"]');
    quantityInput.disabled = !checkbox.checked;
    row.classList.toggle("selected", checkbox.checked);
  });
  simulator.querySelectorAll("[data-quantity-label]").forEach((label) => {
    label.textContent = isMonthly ? "Qtd./mês" : "Quantidade";
  });

  const selectedServices = getSelectedServices();
  const totalCents = selectedServices.reduce((sum, service) => sum + service.subtotalCents, 0);
  const serviceCount = selectedServices.length;

  summaryItems.innerHTML = serviceCount
    ? selectedServices
        .map(
          (service) =>
            `<div class="summary-row" role="row"><span role="cell"><strong>${service.name}</strong><small>${service.quantity} × ${currency.format(service.unitCents / 100)} por ${service.unit}</small></span><span role="cell">${currency.format(service.subtotalCents / 100)}</span></div>`
        )
        .join("")
    : '<div class="summary-empty">Selecione ao menos um serviço para montar a proposta.</div>';

  summaryTotal.textContent = currency.format(totalCents / 100);
  summaryPlanLabel.textContent = isMonthly ? "Resumo mensal" : "Resumo avulso";
  summaryServiceName.textContent = isMonthly ? "Plano mensal personalizado" : "Plano avulso personalizado";
  summaryTotalLabel.textContent = isMonthly ? "Mensalidade estimada" : "Total estimado";
  summaryServiceCount.textContent = `${serviceCount} ${serviceCount === 1 ? "serviço" : "serviços"}`;
  summarySelectionSuffix.textContent = serviceCount === 1 ? "selecionado" : "selecionados";

  const frequencyText = isMonthly ? "por mês" : "nesta contratação";
  summaryDeliverables.innerHTML = selectedServices
    .map((service) => `<li>${service.quantity} × ${service.name} ${frequencyText}</li>`)
    .join("");

  const scopeItems = selectedServices.map(
    (service) => `${service.name} (${service.quantity} × ${service.unit})`
  );
  const scopeDescription = scopeItems.length ? scopeItems.join("; ") : "serviços a definir";
  const paymentValue = currency.format(totalCents / 100);

  setOutput(
    "contract-object-output",
    isMonthly
      ? `Prestação mensal recorrente dos seguintes serviços: ${scopeDescription}.`
      : `Prestação avulsa dos seguintes serviços: ${scopeDescription}.`
  );
  setOutput(
    "contract-payment-output",
    isMonthly
      ? `A CONTRATANTE pagará à CONTRATADA a mensalidade de ${paymentValue}.`
      : `A CONTRATANTE pagará à CONTRATADA o valor total de ${paymentValue}.`
  );

  document.getElementById("contract-payment-title").textContent = isMonthly ? "Mensalidade." : "Pagamento.";
  document.getElementById("contract-payment-terms").innerHTML = isMonthly
    ? 'O pagamento vencerá no dia <span class="handwrite-line handwrite-day"></span> de cada mês, com início em <span class="handwrite-line handwrite-date"></span>.'
    : 'O pagamento será realizado na forma e nas datas acordadas entre as partes: <span class="handwrite-line handwrite-full"></span>.';
  document.getElementById("contract-adjustment-clause").hidden = !isMonthly;
  document.getElementById("contract-term-output").innerHTML = isMonthly
    ? 'O contrato vigorará pelo prazo de <span class="handwrite-line handwrite-day"></span> meses, a partir de <span class="handwrite-line handwrite-date"></span>, ou por prazo indeterminado se assinalado: (&nbsp;&nbsp;) indeterminado. Qualquer parte poderá encerrar a parceria mediante aviso escrito com antecedência mínima de 30 dias, sem prejuízo dos valores já vencidos.'
    : 'A contratação vigorará até a conclusão e entrega do escopo avulso, prevista para <span class="handwrite-line handwrite-date"></span>, preservadas as obrigações já assumidas pelas partes.';
}

function activateView(viewName, shouldScroll = true) {
  const requestedView = validViews.has(viewName) ? viewName : "home";
  const selectedView = requestedView === "formularios" && !isAuthenticated() ? "home" : requestedView;

  views.forEach((view) => {
    const isActive = view.dataset.view === selectedView;
    view.hidden = !isActive;
    view.classList.toggle("active", isActive);
  });

  viewLinks.forEach((link) => {
    const isActive = link.dataset.viewLink === selectedView;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  document.title =
    selectedView === "consultoria"
      ? "Consultoria | OCTN"
      : selectedView === "servicos"
        ? "Serviços | OCTN"
      : selectedView === "capacitacao"
        ? "Capacitação | OCTN"
      : selectedView === "formularios"
        ? "Formulários | OCTN"
        : "OCTN | Consultoria Técnica Nutricional";

  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

viewLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetView = link.dataset.viewLink;
    history.pushState(null, "", `#${targetView}`);
    activateView(targetView);
  });
});

window.addEventListener("popstate", () => {
  activateView(window.location.hash.slice(1), false);
});

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document
      .getElementById(button.dataset.scrollTarget)
      ?.scrollIntoView({ behavior: "smooth" });
  });
});

if (simulator) {
  renderServiceCatalog();
  simulator.addEventListener("input", updateSimulation);
  simulator.addEventListener("change", updateSimulation);
  simulator.addEventListener("reset", () => window.setTimeout(updateSimulation, 0));

  document.getElementById("simulation-date").textContent = new Intl.DateTimeFormat("pt-BR").format(new Date());
  document.getElementById("print-simulation").addEventListener("click", () => {
    updateSimulation();
    window.print();
  });

  updateSimulation();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("visible"));
}

// Área profissional e relatórios privados.
const LEGACY_ILPI_STORAGE_KEY = "octn.ilpi.reports.v1";
localStorage.removeItem(LEGACY_ILPI_STORAGE_KEY);
let reportsState = [];
const configuredApiUrl = document.querySelector('meta[name="octn-api-url"]')?.content?.trim();
const API_BASE_URL = (
  configuredApiUrl ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname) ? "http://localhost:3000" : "")
).replace(/\/$/, "");
const authState = { authenticated: false, username: "", email: "", csrfToken: "" };
const REPORT_OWNER_USERNAME = "grazielle.carvalho";
let reportSyncPromise = null;
let reportSyncStatus = { state: "idle", message: "" };

const ilpiForm = document.getElementById("ilpi-form");
const formsDashboard = document.getElementById("forms-dashboard");
const ilpiWorkspace = document.getElementById("ilpi-workspace");
let currentReportId = null;
let formIsDirty = false;

const healthItems = ["Diabetes mellitus", "Hipertensão arterial", "Demência/Alzheimer", "Disfagia", "Perda de peso recente", "Baixa aceitação alimentar", "Feridas/lesão por pressão", "Uso de suplemento nutricional", "Outras condições relevantes"];
const mealItems = ["Café da manhã", "Colação", "Almoço", "Lanche da tarde", "Jantar", "Ceia"];
const kitchenItems = [
  "Cozinha apresenta condições adequadas de organização",
  "Equipamentos disponíveis são suficientes para a produção",
  "Há espaço adequado para armazenamento dos alimentos",
  "Geladeira/freezer apresentam condições adequadas de uso",
  "Alimentos são armazenados de forma organizada",
  "Produtos possuem identificação e controle de validade",
  "Há separação entre alimentos crus e prontos para consumo",
  "Alimentos são armazenados diretamente no chão",
  "Manipuladora utiliza vestimenta adequada",
  "Higienização das mãos é realizada adequadamente",
  "Há rotina de higienização de frutas e hortaliças",
  "Utensílios e superfícies apresentam boas condições",
  "Existe controle de temperatura dos alimentos",
  "Há organização da produção das refeições",
  "A cozinheira recebeu treinamento em boas práticas"
];
const observationItems = ["Apresentação da refeição", "Temperatura adequada", "Consistência adequada", "Porcionamento", "Aceitação pelos residentes", "Auxílio durante a alimentação", "Posicionamento dos idosos", "Ambiente durante a refeição"];

function isAuthenticated() {
  return authState.authenticated;
}

const initialView = window.location.hash.slice(1);
activateView(validViews.has(initialView) ? initialView : "home", false);

function updateAuthUI() {
  const authenticated = isAuthenticated();
  document.getElementById("internal-menu-button").hidden = !authenticated;
  document.getElementById("login-form").hidden = authenticated;
  document.getElementById("logged-panel").hidden = !authenticated;
  document.getElementById("account-button").classList.toggle("authenticated", authenticated);
  document.getElementById("account-button").setAttribute("aria-label", authenticated ? "Conta profissional conectada" : "Entrar na área profissional");
  document.getElementById("account-popover-title").textContent = authenticated ? "Conta profissional" : "Entrar na OCTN";
  if (!authenticated) closeHeaderPopover("internal-menu-button", "internal-menu");
  const loggedUser = document.getElementById("logged-user");
  if (loggedUser) loggedUser.textContent = authenticated ? authState.username : "Menu interno liberado.";
}

function closeHeaderPopover(buttonId, popoverId) {
  document.getElementById(buttonId)?.setAttribute("aria-expanded", "false");
  const popover = document.getElementById(popoverId);
  if (popover) popover.hidden = true;
}

function toggleHeaderPopover(buttonId, popoverId, otherButtonId, otherPopoverId) {
  const button = document.getElementById(buttonId);
  const popover = document.getElementById(popoverId);
  if (!button || !popover) return;
  const shouldOpen = popover.hidden;
  closeHeaderPopover(otherButtonId, otherPopoverId);
  popover.hidden = !shouldOpen;
  button.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen && popoverId === "account-popover" && !isAuthenticated()) {
    window.setTimeout(() => popover.querySelector('input[name="username"]')?.focus(), 0);
  }
}

async function authRequest(path, options = {}) {
  if (!API_BASE_URL) {
    const error = new Error("Serviço de autenticação não configurado.");
    error.status = 503;
    throw error;
  }

  const headers = { Accept: "application/json", ...(options.headers || {}) };
  if (options.body) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    cache: "no-store",
    headers,
    body: options.body,
  });

  const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "Não foi possível concluir a autenticação.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

function applyAuthSession(payload) {
  authState.authenticated = payload.authenticated === true;
  authState.username = payload.user?.username || "";
  authState.email = payload.user?.email || "";
  authState.csrfToken = payload.csrfToken || "";
}

function clearAuthSession() {
  authState.authenticated = false;
  authState.username = "";
  authState.email = "";
  authState.csrfToken = "";
}

async function restoreAuthSession() {
  try {
    applyAuthSession(await authRequest("/api/auth/session"));
  } catch {
    clearAuthSession();
  }

  updateAuthUI();
  if (isAuthenticated() && window.location.hash === "#formularios") {
    activateView("formularios", false);
  }
  if (isAuthenticated()) await loadOwnedReports();
  else renderSavedReports();
}

async function logout() {
  try {
    if (isAuthenticated()) {
      await authRequest("/api/auth/logout", {
        method: "POST",
        headers: { "X-OCTN-CSRF": authState.csrfToken },
      });
    }
  } catch (error) {
    console.warn("Não foi possível encerrar a sessão no servidor.", error);
  } finally {
    clearAuthSession();
    reportsState = [];
    currentReportId = null;
    ilpiWorkspace.hidden = true;
    formsDashboard.hidden = false;
    renderSavedReports();
    updateAuthUI();
    history.pushState(null, "", "#home");
    activateView("home");
    closeHeaderPopover("internal-menu-button", "internal-menu");
    document.getElementById("account-button")?.focus();
  }
}

document.getElementById("account-button")?.addEventListener("click", () => {
  toggleHeaderPopover("account-button", "account-popover", "internal-menu-button", "internal-menu");
});
document.getElementById("internal-menu-button")?.addEventListener("click", () => {
  toggleHeaderPopover("internal-menu-button", "internal-menu", "account-button", "account-popover");
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-actions")) {
    closeHeaderPopover("account-button", "account-popover");
    closeHeaderPopover("internal-menu-button", "internal-menu");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeHeaderPopover("account-button", "account-popover");
  closeHeaderPopover("internal-menu-button", "internal-menu");
});

document.querySelectorAll("#internal-menu [data-view-link]").forEach((button) => {
  button.addEventListener("click", () => closeHeaderPopover("internal-menu-button", "internal-menu"));
});

document.getElementById("login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const message = document.getElementById("login-message");
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  message.textContent = "Autenticando...";

  try {
    const session = await authRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: String(values.get("username") || ""),
        password: String(values.get("password") || ""),
      }),
    });
    applyAuthSession(session);
    message.textContent = "";
    form.reset();
    updateAuthUI();
    closeHeaderPopover("account-button", "account-popover");
    history.pushState(null, "", "#formularios");
    activateView("formularios");
    await loadOwnedReports();
  } catch (error) {
    clearAuthSession();
    updateAuthUI();
    message.textContent = error.status === 429
      ? "Muitas tentativas. Aguarde alguns minutos."
      : error.status >= 500
        ? "Serviço de autenticação indisponível. Tente novamente."
        : "Login ou senha inválidos.";
    form.elements.password.value = "";
    form.elements.password.focus();
  } finally {
    submitButton.disabled = false;
  }
});
document.getElementById("logout-button")?.addEventListener("click", () => void logout());
updateAuthUI();
void restoreAuthSession();

function textInput(name, value = "", type = "text") {
  return `<input type="${type}" data-field="${name}" value="${escapeAttribute(value)}" />`;
}

function selectInput(name, options, value = "") {
  return `<select data-field="${name}">${options.map((option) => `<option ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select>`;
}

function escapeAttribute(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function renderFixedRows(data = {}) {
  document.getElementById("health-rows").innerHTML = healthItems.map((item, index) => `<tr><td>${item}</td><td><input type="number" min="0" name="health${index}Count" value="${escapeAttribute(data[`health${index}Count`] || "")}" /></td><td><input name="health${index}Note" value="${escapeAttribute(data[`health${index}Note`] || "")}" /></td></tr>`).join("");
  document.getElementById("meal-rows").innerHTML = mealItems.map((item, index) => `<tr><td>${item}</td><td><input type="time" name="meal${index}Time" value="${escapeAttribute(data[`meal${index}Time`] || "")}" /></td><td><input name="meal${index}Note" value="${escapeAttribute(data[`meal${index}Note`] || "")}" /></td></tr>`).join("");
  document.getElementById("kitchen-rows").innerHTML = kitchenItems.map((item, index) => `<tr><td>${item}</td><td><select name="kitchen${index}Status"><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Não Avaliado</option><option>Não se Aplica</option></select></td></tr>`).join("");
  document.getElementById("observation-rows").innerHTML = observationItems.map((item, index) => `<tr><td>${item}</td><td><select name="observation${index}Status"><option value="">Selecione</option><option>Adequado</option><option>Parcial</option><option>Inadequado</option><option>Não Avaliado</option><option>Não se Aplica</option></select></td><td><input name="observation${index}Note" /></td></tr>`).join("");
}

function addResidentRow(resident = {}) {
  const row = document.createElement("tr");
  const requiresSpecialDietValue = resident.requiresSpecialDiet || (resident.specialDiet && resident.specialDiet !== "Não" ? "Sim" : "Não");
  row.innerHTML = `<td>${textInput("name", resident.name)}</td><td>${textInput("birthDate", resident.birthDate, "date")}</td><td>${textInput("diagnosis", resident.diagnosis)}</td><td>${selectInput("bedridden", ["Não", "Sim"], resident.bedridden)}</td><td>${selectInput("weightLoss", ["Não", "Sim"], resident.weightLoss)}</td><td>${selectInput("requiresSpecialDiet", ["Não", "Sim"], requiresSpecialDietValue)}</td><td>${selectInput("pastyDiet", ["Não", "Sim"], resident.pastyDiet || "Não")}</td><td>${selectInput("priority", ["Baixa", "Moderada", "Alta", "Imediata"], resident.priority || "Baixa")}</td><td><button class="remove-row" type="button" aria-label="Remover residente">×</button></td>`;
  row.querySelector(".remove-row").addEventListener("click", () => { row.remove(); markDirty(); });
  document.getElementById("resident-rows").appendChild(row);
}

function addActionRow(action = {}) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${textInput("action", action.action)}</td><td>${selectInput("priority", ["Imediata", "Alta", "Moderada", "Baixa"], action.priority || "Moderada")}</td><td>${textInput("responsible", action.responsible)}</td><td>${textInput("deadline", action.deadline)}</td><td>${selectInput("status", ["Pendente", "Em andamento", "Concluída"], action.status || "Pendente")}</td><td><button class="remove-row" type="button" aria-label="Remover ação">×</button></td>`;
  row.querySelector(".remove-row").addEventListener("click", () => { row.remove(); markDirty(); });
  document.getElementById("action-rows").appendChild(row);
}

function addFindingRow(finding = {}) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${selectInput("area", ["Alimentação e nutrição", "Cozinha / boas práticas", "Assistência ao residente", "Documentação", "Estrutura física", "Equipe", "Gestão"], finding.area || "Alimentação e nutrição")}</td><td>${selectInput("classification", ["Risco crítico", "Risco assistencial", "Não conformidade", "Oportunidade de melhoria", "Boa prática observada", "Informação relevante"], finding.classification || "Oportunidade de melhoria")}</td><td>${textInput("finding", finding.finding)}</td><td>${textInput("evidence", finding.evidence)}</td><td>${textInput("reference", finding.reference)}</td><td>${textInput("guidance", finding.guidance)}</td><td>${selectInput("priority", ["Imediata", "Alta", "Moderada", "Baixa", "Não se aplica"], finding.priority || "Moderada")}</td><td><button class="remove-row" type="button" aria-label="Remover achado">×</button></td>`;
  row.querySelector(".remove-row").addEventListener("click", () => { row.remove(); markDirty(); });
  document.getElementById("finding-rows").appendChild(row);
}

function compressAnnexImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        const maxWidth = 1400;
        const maxHeight = 1050;
        const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function addAnnexRow(annex = {}) {
  const item = document.createElement("article");
  item.className = "annex-editor-item";
  item.dataset.fileData = annex.dataUrl || "";
  item.dataset.fileName = annex.fileName || "";
  item.dataset.fileType = annex.fileType || "";
  item.innerHTML = `<div class="annex-editor-grid"><label><span>Tipo de anexo</span>${selectInput("type", ["Registro fotográfico", "Instrumento de mapeamento", "Documento consultado", "Planilha / indicador", "Outro"], annex.type || "Registro fotográfico")}</label><label><span>Título / identificação</span>${textInput("title", annex.title)}</label><label><span>Data do registro</span>${textInput("date", annex.date, "date")}</label><label><span>Código / referência</span>${textInput("code", annex.code)}</label><label class="span-2"><span>Descrição e relação com o achado</span><textarea data-field="description" rows="3">${escapeHtml(annex.description || "")}</textarea></label><label class="annex-file"><span>Arquivo</span><input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" /><small data-file-label>${escapeHtml(annex.fileName || "Nenhum arquivo selecionado")}</small></label></div><div class="annex-preview" ${annex.dataUrl ? "" : "hidden"}><img alt="Prévia do anexo" /></div><button class="remove-row annex-remove" type="button" aria-label="Remover anexo">×</button>`;
  const preview = item.querySelector(".annex-preview");
  if (annex.dataUrl) preview.querySelector("img").src = annex.dataUrl;
  item.querySelector('input[type="file"]').addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    item.dataset.fileName = file.name;
    item.dataset.fileType = file.type;
    item.querySelector("[data-file-label]").textContent = file.name;
    if (file.type.startsWith("image/")) {
      item.dataset.fileData = await compressAnnexImage(file);
      preview.hidden = false;
      preview.querySelector("img").src = item.dataset.fileData;
    } else {
      item.dataset.fileData = "";
      preview.hidden = true;
    }
    markDirty();
  });
  item.querySelector(".annex-remove").addEventListener("click", () => { item.remove(); markDirty(); });
  document.getElementById("annex-rows").appendChild(item);
}

function getReports() {
  return reportsState;
}

function persistReports(reports) {
  reportsState = reports;
}

async function loadOwnedReports() {
  if (!isAuthenticated() || authState.username !== REPORT_OWNER_USERNAME) {
    reportsState = [];
    renderSavedReports();
    return;
  }

  reportSyncStatus = { state: "syncing", message: "Carregando relatórios..." };
  renderSavedReports();
  try {
    const result = await authRequest("/api/reports");
    reportsState = (result.reports || []).map((report) => ({
      ...report,
      data: {
        ...report.data,
        status: report.data?.status === "Concluído" ? "Concluído" : "Em Elaboração",
      },
    }));
    reportSyncStatus = { state: "success", message: "Relatórios carregados" };
  } catch (error) {
    reportsState = [];
    reportSyncStatus = { state: "error", message: error.message || "Falha ao carregar os relatórios" };
    if (error.status === 401) {
      clearAuthSession();
      updateAuthUI();
    }
    console.error("Não foi possível carregar os relatórios.", error);
  } finally {
    localStorage.removeItem(LEGACY_ILPI_STORAGE_KEY);
    renderSavedReports();
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function prepareAnnexForSync(annex) {
  const prepared = { ...annex };
  const source = String(prepared.dataUrl || "");
  if (!source || source.startsWith("data:image/") || source.startsWith("https://")) {
    return prepared;
  }

  const imageUrl = new URL(source, document.baseURI);
  if (imageUrl.origin !== window.location.origin) {
    throw new Error("Origem de anexo não autorizada.");
  }

  const response = await fetch(imageUrl.href, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) throw new Error(`Não foi possível carregar o anexo ${prepared.fileName || "sem nome"}.`);

  prepared.sourceUrl = imageUrl.href;
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) throw new Error("O anexo não é uma imagem válida.");
  prepared.dataUrl = await blobToDataUrl(blob);
  return prepared;
}

async function prepareReportForSync(report) {
  const prepared = JSON.parse(JSON.stringify(report));
  prepared.data.annexes = await Promise.all(
    (prepared.data.annexes || []).map((annex) => prepareAnnexForSync(annex))
  );
  return prepared;
}

function applySyncedAttachments(reportId, result) {
  const reports = getReports();
  const report = reports.find((item) => item.id === reportId);
  if (!report) return;

  for (const attachment of result.attachments || []) {
    const annex = report.data.annexes?.[attachment.index];
    if (!annex) continue;
    annex.dataUrl = attachment.url;
    annex.imageUrl = attachment.url;
    annex.imageStorage = "remote";
  }

  persistReports(reports);

  if (currentReportId === reportId) {
    document.querySelectorAll("#annex-rows .annex-editor-item").forEach((item, index) => {
      const attachment = (result.attachments || []).find((entry) => entry.index === index);
      if (!attachment) return;
      item.dataset.fileData = attachment.url;
      const preview = item.querySelector(".annex-preview");
      preview.hidden = false;
      preview.querySelector("img").src = attachment.url;
    });
  }
}

async function syncOwnedReport(reportRecord = null) {
  if (authState.username !== REPORT_OWNER_USERNAME || !authState.csrfToken) return null;
  if (reportSyncPromise) return reportSyncPromise;

  const localReport = reportRecord || getReports().find((report) => report.id === currentReportId);
  if (!localReport) return null;
  reportSyncStatus = { state: "syncing", message: "Salvando relatório..." };

  reportSyncPromise = (async () => {
    renderSavedReports();
    if (currentReportId === localReport.id) updateSaveIndicator("Salvando relatório...");

    try {
      const preparedReport = await prepareReportForSync(localReport);
      const result = await authRequest("/api/reports/sync", {
        method: "POST",
        headers: { "X-OCTN-CSRF": authState.csrfToken },
        body: JSON.stringify({ report: preparedReport }),
      });
      applySyncedAttachments(localReport.id, result);
      reportSyncStatus = { state: "success", message: "Relatório salvo" };
      if (currentReportId === localReport.id) updateSaveIndicator("Relatório salvo");
      return result;
    } catch (error) {
      console.error("Não foi possível salvar o relatório.", error);
      reportSyncStatus = { state: "error", message: error.message || "Falha ao salvar o relatório" };
      if (error.status === 401) {
        clearAuthSession();
        updateAuthUI();
      }
      if (currentReportId === localReport.id) updateSaveIndicator("Não foi possível salvar · tente novamente");
      return null;
    } finally {
      reportSyncPromise = null;
      renderSavedReports();
    }
  })();

  return reportSyncPromise;
}

function collectDynamicRows(containerId) {
  const selector = containerId === "annex-rows" ? ".annex-editor-item" : "tr";
  return [...document.querySelectorAll(`#${containerId} ${selector}`)]
    .map((row) => Object.fromEntries([...row.querySelectorAll("[data-field]")].map((input) => [input.dataset.field, input.value])))
    .map((item, index) => {
      if (containerId !== "annex-rows") return item;
      const row = document.querySelectorAll("#annex-rows .annex-editor-item")[index];
      return { ...item, fileName: row.dataset.fileName || "", fileType: row.dataset.fileType || "", dataUrl: row.dataset.fileData || "" };
    })
    .filter((item) => containerId === "action-rows" ? item.action?.trim() : containerId === "finding-rows" ? item.finding?.trim() : containerId === "annex-rows" ? [item.title, item.description, item.fileName].some((value) => value?.trim()) : [item.name, item.birthDate, item.diagnosis].some((value) => value?.trim()));
}

function collectFormData() {
  const data = Object.fromEntries(new FormData(ilpiForm).entries());
  data.residents = collectDynamicRows("resident-rows");
  data.actions = collectDynamicRows("action-rows");
  data.findings = collectDynamicRows("finding-rows");
  data.annexes = collectDynamicRows("annex-rows");
  data.reviewConfirmed = ilpiForm.elements.reviewConfirmed.checked ? "Sim" : "";
  return data;
}

function setFormValues(data) {
  [...ilpiForm.elements].forEach((element) => {
    if (!element.name || element.type === "hidden") return;
    const savedValue = /^kitchen\d+Status$/.test(element.name)
      ? ({ S: "Sim", N: "Não", NA: "Não se Aplica" }[data[element.name]] || data[element.name])
      : data[element.name];
    if (element.type === "radio") element.checked = savedValue === element.value;
    else if (element.type === "checkbox") element.checked = data[element.name] === element.value;
    else element.value = savedValue ?? "";
  });
}

function defaultNewReportData() {
  const reports = getReports();
  const number = String(reports.length + 1).padStart(3, "0");
  return { reportNumber: `RTC_ILPI-${new Date().getFullYear()}/A${number}`, version: "1.0", status: "Em Elaboração", subtitle: "Diagnóstico institucional, nutricional e do serviço de alimentação", issueCity: "Salvador/BA", nutritionist: "Grazielle Matos", crn: "17272", residents: [], actions: [], findings: [], annexes: [] };
}

function openReport(report = null) {
  currentReportId = report?.id || crypto.randomUUID?.() || `ilpi-${Date.now()}`;
  const data = report?.data || defaultNewReportData();
  ilpiForm.reset();
  renderFixedRows(data);
  setFormValues(data);
  document.getElementById("resident-rows").innerHTML = "";
  (data.residents?.length ? data.residents : [{}, {}, {}, {}]).forEach(addResidentRow);
  document.getElementById("action-rows").innerHTML = "";
  (data.actions?.length ? data.actions : [{}, {}, {}]).forEach(addActionRow);
  document.getElementById("finding-rows").innerHTML = "";
  (data.findings?.length ? data.findings : [{}, {}, {}]).forEach(addFindingRow);
  document.getElementById("annex-rows").innerHTML = "";
  (data.annexes?.length ? data.annexes : [{}]).forEach(addAnnexRow);
  ilpiForm.elements.reportId.value = currentReportId;
  formsDashboard.hidden = true;
  ilpiWorkspace.hidden = false;
  document.getElementById("current-report-label").textContent = data.institutionName || "Novo diagnóstico";
  formIsDirty = false;
  updateSaveIndicator();
  updateFormInsights();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveCurrentReport() {
  if (!ilpiForm || !isAuthenticated()) return;
  const data = collectFormData();
  const reports = getReports();
  const index = reports.findIndex((report) => report.id === currentReportId);
  const now = new Date().toISOString();
  if (index >= 0) {
    ["contentRevision", "annexRevision", "completionRevision", "consultancyRevision", "summaryPriorityRevision", "reportNumberRevision", "mealCountRevision"].forEach((key) => {
      if (reports[index].data[key] !== undefined) data[key] = reports[index].data[key];
    });
  }
  const record = {
    id: currentReportId,
    createdAt: index >= 0 ? reports[index].createdAt : now,
    updatedAt: now,
    data,
  };
  if (index >= 0) reports[index] = record; else reports.unshift(record);
  persistReports(reports);
  formIsDirty = false;
  updateSaveIndicator("Salvando relatório...");
  document.getElementById("current-report-label").textContent = data.institutionName || "Novo diagnóstico";
  renderSavedReports();
  void syncOwnedReport(record);
  return record;
}

function formatDate(value) {
  if (!value) return "Não informado";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}


function reportStatusControl(report) {
  const status = report.data.status === "Concluído" ? "Concluído" : "Em Elaboração";
  return `<select class="report-status-select" data-report-status aria-label="Alterar status do relatório">
    <option value="Em Elaboração" ${status === "Em Elaboração" ? "selected" : ""}>Em Elaboração</option>
    <option value="Concluído" ${status === "Concluído" ? "selected" : ""}>Concluído</option>
  </select>`;
}

function renderSavedReports() {
  const container = document.getElementById("saved-reports");
  const reports = [...getReports()].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  container.innerHTML = reports.length ? reports.map((report) => `<article class="saved-report" data-report-id="${escapeAttribute(report.id)}"><div><strong>${escapeHtml(report.data.institutionName || "Instituição não informada")}</strong><span>${escapeHtml(report.data.reportNumber || "Sem número")}</span></div><div><strong>${formatDate(report.data.visitDate)}</strong><small>Data da visita</small></div><div>${reportStatusControl(report)}<small>Atualizado ${formatDateTime(report.updatedAt)}</small></div><div class="report-actions"><button type="button" data-edit-report>Editar</button></div></article>`).join("") : '<div class="empty-reports">Nenhum relatório disponível.</div>';
}

function updateSaveIndicator(customText) {
  const indicator = document.getElementById("save-indicator");
  indicator.textContent = customText || (formIsDirty ? "Alterações não salvas" : "Documento carregado");
}

function markDirty() {
  formIsDirty = true;
  updateSaveIndicator();
  updateFormInsights();
}

function updateFormInsights() {
  if (!ilpiForm) return;
  const offeredMealCount = Number(ilpiForm.elements.mealsPerDay.value || 0);
  const allBasicFields = [...ilpiForm.querySelectorAll('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([type="file"]), select, textarea')];
  const basicFields = allBasicFields.filter((field) => {
    const residentRow = field.closest("#resident-rows tr");
    if (residentRow && !residentRow.querySelector('[data-field="name"]')?.value.trim() && !residentRow.querySelector('[data-field="birthDate"]')?.value.trim() && !residentRow.querySelector('[data-field="diagnosis"]')?.value.trim()) return false;
    const actionRow = field.closest("#action-rows tr");
    if (actionRow && !actionRow.querySelector('[data-field="action"]')?.value.trim()) return false;
    const findingRow = field.closest("#finding-rows tr");
    if (findingRow && !findingRow.querySelector('[data-field="finding"]')?.value.trim()) return false;
    const annexRow = field.closest(".annex-editor-item");
    if (annexRow && !annexRow.querySelector('[data-field="title"]')?.value.trim() && !annexRow.querySelector('[data-field="description"]')?.value.trim() && !annexRow.dataset.fileName) return false;
    if (/^health\d+Note$/.test(field.name)) return false;
    const mealMatch = field.name?.match(/^meal(\d+)(Time|Note)$/);
    if (mealMatch) return mealMatch[2] === "Time" && Number(mealMatch[1]) < offeredMealCount;
    if (/^observation\d+Note$/.test(field.name)) return false;
    if (field.name === "specialDietsDetails" && ilpiForm.elements.specialDiets.value !== "Sim") return false;
    return true;
  });
  const radioNames = [...new Set([...ilpiForm.querySelectorAll('input[type="radio"]')].map((input) => input.name))];
  const completedBasics = basicFields.filter((field) => field.value.trim()).length;
  const completedRadios = radioNames.filter((name) => ilpiForm.querySelector('input[name="' + name + '"]:checked')).length;
  const total = basicFields.length + radioNames.length;
  const percent = total ? Math.round(((completedBasics + completedRadios) / total) * 100) : 0;
  document.getElementById("form-progress").style.width = `${percent}%`;
  document.getElementById("form-progress-text").textContent = `${percent}% preenchido`;

  const totalResidents = Number(ilpiForm.elements.totalResidents.value || 0);
  const dependencyTotal = ["independentResidents", "partialResidents", "dependentResidents"].reduce((sum, name) => sum + Number(ilpiForm.elements[name].value || 0), 0);
  const note = document.getElementById("resident-count-note");
  note.classList.toggle("warning", Boolean(totalResidents && dependencyTotal !== totalResidents));
  note.textContent = totalResidents ? (dependencyTotal === totalResidents ? `Conferência: os graus de dependência somam ${dependencyTotal} residentes.` : `Atenção: os graus de dependência somam ${dependencyTotal}, mas o total informado é ${totalResidents}.`) : "Informe o total de residentes para ativar a conferência automática.";

  const scheduledMeals = mealItems.filter((_, index) => ilpiForm.elements[`meal${index}Time`]?.value).length;
  const informedMeals = Number(ilpiForm.elements.mealsPerDay.value || 0);
  const mealNote = document.getElementById("meal-count-note");
  const mealMessages = [];
  if (informedMeals && informedMeals < 6) {
    mealMessages.push(`Não conformidade: a RDC Anvisa nº 502/2021 exige no mínimo 6 refeições diárias; foram informadas ${informedMeals}.`);
  }
  if (informedMeals && scheduledMeals !== informedMeals) mealMessages.push(`Conferir registro: há ${scheduledMeals} horários preenchidos para ${informedMeals} refeições informadas.`);
  if (informedMeals && scheduledMeals === informedMeals && informedMeals >= 6) mealMessages.push(`Conferência: ${scheduledMeals} horários preenchidos e mínimo normativo atendido.`);
  mealNote.classList.toggle("warning", Boolean(informedMeals && (informedMeals < 6 || scheduledMeals !== informedMeals)));
  mealNote.textContent = mealMessages.join(" ") || "Informe o número de refeições diárias para ativar a conferência automática.";

  const data = collectFormData();
  document.getElementById("review-cards").innerHTML = `<div class="review-card"><span>Preenchimento geral</span><strong>${percent}%</strong></div><div class="review-card"><span>Residentes registrados</span><strong>${data.residents.length}</strong></div><div class="review-card"><span>Achados técnicos</span><strong>${data.findings.length}</strong></div><div class="review-card"><span>Plano de ação / anexos</span><strong>${data.actions.length} / ${data.annexes.length}</strong></div>`;
}

function setupSectionNavigation() {
  const sections = [...ilpiForm.querySelectorAll(".form-section")];
  const navigation = document.getElementById("form-section-nav");
  navigation.innerHTML = sections.map((section) => `<button type="button" data-section-target="${section.id}">${section.dataset.sectionTitle}</button>`).join("");
  navigation.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section-target]");
    if (button) document.getElementById(button.dataset.sectionTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.getElementById("new-ilpi")?.addEventListener("click", () => openReport());
document.getElementById("back-to-forms")?.addEventListener("click", () => {
  if (formIsDirty && !confirm("Há alterações não salvas. Deseja voltar mesmo assim?")) return;
  ilpiWorkspace.hidden = true;
  formsDashboard.hidden = false;
  renderSavedReports();
});
document.getElementById("add-resident")?.addEventListener("click", () => { addResidentRow(); markDirty(); });
document.getElementById("add-action")?.addEventListener("click", () => { addActionRow(); markDirty(); });
document.getElementById("add-finding")?.addEventListener("click", () => { addFindingRow(); markDirty(); });
document.getElementById("add-annex")?.addEventListener("click", () => { addAnnexRow(); markDirty(); });
document.getElementById("save-ilpi")?.addEventListener("click", saveCurrentReport);
document.querySelectorAll("[data-save]").forEach((button) => button.addEventListener("click", saveCurrentReport));
ilpiForm?.addEventListener("input", markDirty);
ilpiForm?.addEventListener("change", markDirty);
document.getElementById("saved-reports")?.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-report-id]");
  if (!card) return;
  const reports = getReports();
  const report = reports.find((item) => item.id === card.dataset.reportId);
  if (event.target.closest("[data-edit-report]")) openReport(report);
});

document.getElementById("saved-reports")?.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-report-status]");
  const card = event.target.closest("[data-report-id]");
  if (!select || !card) return;
  const reports = getReports();
  const report = reports.find((item) => item.id === card.dataset.reportId);
  if (!report) return;

  report.data.status = select.value;
  report.updatedAt = new Date().toISOString();
  persistReports(reports);
  if (currentReportId === report.id && ilpiForm.elements.status) {
    ilpiForm.elements.status.value = select.value;
  }
  renderSavedReports();
  const result = await syncOwnedReport(report);
  if (!result) {
    alert("Não foi possível salvar o novo status. Tente novamente.");
    await loadOwnedReports();
  }
});

localStorage.removeItem(LEGACY_ILPI_STORAGE_KEY);

renderFixedRows();
setupSectionNavigation();
renderSavedReports();

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function shown(value, fallback = "Não informado") {
  return value === 0 || String(value ?? "").trim() ? escapeHtml(value) : fallback;
}

function reportField(label, value, full = false) {
  return `<div class="report-field ${full ? "full" : ""}"><span>${label}</span><strong>${shown(value)}</strong></div>`;
}

function reportHeader(data) {
  return '<header class="report-header"><img src="./public/imagens_pub/logo_grazielle_matos.jpeg" alt="Grazielle Matos — Nutricionista" /><div><strong>' + shown(data.reportNumber, "Relatório ILPI") + '</strong><small>Consultoria nutricional independente</small></div></header>';
}

function reportFooter(data, page, total) {
  return `<footer class="report-page-footer"><span>${shown(data.nutritionist, "Nutricionista consultora")} · Documento técnico confidencial</span><span>${shown(data.institutionName, "ILPI")} · Página __OCTN_PAGE__ de __OCTN_TOTAL__</span></footer>`;
}

function reportPage(data, kicker, title, content, page, total, className = "") {
  return `<section class="report-page ${className}">${reportHeader(data)}<h2><span>${kicker}</span>${title}</h2>${content}${reportFooter(data, page, total)}</section>`;
}

function finalizeReportPages(cover, pages, totalPages) {
  let currentPage = 1;
  const numberedCover = cover.replaceAll("__OCTN_TOTAL__", String(totalPages)).replaceAll("__OCTN_PAGE__", "1");
  const body = pages.join("").replaceAll("__OCTN_TOTAL__", String(totalPages)).replace(/__OCTN_PAGE__/g, () => String(++currentPage));
  return numberedCover + body;
}

function reportTable(headers, rows, emptyText = "Sem registros informados") {
  const body = rows.length ? rows.map((row) => `<tr>${row.map((cell) => `<td>${shown(cell, "—")}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">${emptyText}</td></tr>`;
  return `<table class="report-table"><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
}

function buildReportHtml(data) {
  const annexes = (data.annexes || []).filter((annex) => annex.title || annex.description || annex.fileName);
  const annexChunks = annexes.length ? Array.from({ length: Math.ceil(annexes.length / 2) }, (_, index) => annexes.slice(index * 2, index * 2 + 2)) : [[]];
  let totalPages = 0;
  const kitchenStatusLabels = { S: "Sim", N: "Não", NA: "Não se Aplica" };
  const kitchenRows = kitchenItems.map((item, index) => [item, kitchenStatusLabels[data[`kitchen${index}Status`]] || data[`kitchen${index}Status`]]);
  const reportedKitchenRows = kitchenRows.filter((row) => row[1]);
  const applicable = kitchenRows.filter((row) => row[1] === "Sim" || row[1] === "Não");
  const compliant = applicable.filter(([item, status]) => item === "Alimentos são armazenados diretamente no chão" ? status === "Não" : status === "Sim").length;
  const nonCompliant = applicable.length - compliant;
  const compliance = applicable.length ? `${Math.round((compliant / applicable.length) * 100)}%` : "—";
  const highPriorityResidents = (data.residents || []).filter((resident) => resident.priority === "Alta" || resident.priority === "Imediata").length;
  const total = Number(data.totalResidents || 0);
  const diabetes = Number(data.health0Count || 0);
  const hypertension = Number(data.health1Count || 0);
  const weightLoss = Number(data.health4Count || 0);
  const executiveSummary = `A visita técnica realizada em ${formatDate(data.visitDate)} registrou uma instituição com ${shown(data.totalResidents, "quantitativo não informado")} residentes, sendo ${shown(data.bedriddenResidents, "quantitativo não informado")} acamado(s), e ${shown(data.foodEmployees, "quantitativo não informado")} profissional(is) envolvido(s) na alimentação. Foram informados ${diabetes} caso(s) de diabetes mellitus, ${hypertension} de hipertensão arterial e ${weightLoss} de perda de peso recente. A instituição relatou oferta de ${shown(data.mealsPerDay, "quantitativo não informado")} refeições diárias. A existência de cardápio planejado foi registrada como “${shown(data.plannedMenu)}”. Os principais achados e as orientações correspondentes estão consolidados nas seções seguintes.`;

  const cover = `<section class="report-page report-cover"><div class="report-cover-brand"><img src="./public/imagens_pub/logo_grazielle_matos.jpeg" alt="Grazielle Matos — Nutricionista" /><span>Consultoria Técnica Nutricional</span></div><div class="report-cover-title"><span class="report-type">Relatório técnico</span><h1>Diagnóstico Institucional e Nutricional — ILPI</h1><p>${shown(data.subtitle, "Avaliação do serviço de alimentação, do perfil assistencial e das prioridades nutricionais")}</p><table class="cover-client"><tr><td>Contratante</td><td>${shown(data.institutionName)}</td></tr><tr><td>Solicitante</td><td>${shown(data.requestedBy || data.institutionManager)}</td></tr><tr><td>Data da visita</td><td>${formatDate(data.visitDate)}</td></tr><tr><td>Nutricionista consultora</td><td>${shown(data.nutritionist)} · CRN ${shown(data.crn)}</td></tr></table></div><div class="cover-footer"><span>${shown(data.issueCity, "Brasil")} · ${new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date())}</span><span>${shown(data.reportNumber, "Relatório técnico ILPI")}</span><span>Página 1 de __OCTN_TOTAL__</span></div></section>`;

  const page2 = reportPage(data, "Controle do documento", "Finalidade, escopo e metodologia", `<div class="report-grid">${reportField("Número do relatório", data.reportNumber)}${reportField("Contratante", data.institutionName)}${reportField("Solicitante", data.requestedBy || data.institutionManager)}${reportField("CPF da solicitante", data.requesterCpf || "Não informado")}${reportField("Nutricionista consultora", data.nutritionist)}${reportField("Registro profissional", data.crn ? `CRN ${data.crn}` : "Não informado")}</div><h3>Finalidade da contratação</h3><p class="report-paragraph">${shown(data.requestPurpose)}</p><h3>Escopo da avaliação</h3><p class="report-paragraph">${shown(data.assessmentScope)}</p><h3>Metodologia e fontes de evidência</h3><p class="report-paragraph">${shown(data.methodology)}</p>${data.documentsReviewed?.trim() ? `<h3>Documentos e registros consultados</h3><p class="report-paragraph">${shown(data.documentsReviewed)}</p>` : ""}<p class="report-note"><strong>Natureza do documento:</strong> relatório técnico decorrente de consultoria nutricional independente e pontual, baseado nas informações e evidências obtidas na visita. A nutricionista autora não assume responsabilidade técnica pela ILPI, não integra sua equipe permanente e não mantém vínculo empregatício com a instituição. O documento não equivale a licença, certificação ou inspeção sanitária oficial, e a execução das adequações permanece sob responsabilidade da gestão e dos profissionais formalmente designados.</p><p class="report-note"><strong>Sigilo:</strong> documento confidencial destinado à contratante. Dados de saúde, imagens e identificações devem ter acesso restrito.</p>`, 2, totalPages);

  const page3Overview = reportPage(data, "Resumo executivo", "Visão geral do diagnóstico", `<p class="report-paragraph">${executiveSummary}</p><div class="metric-grid"><div class="metric"><span>Total de residentes</span><strong>${shown(data.totalResidents, "—")}</strong></div><div class="metric"><span>Residentes acamados</span><strong>${shown(data.bedriddenResidents, "—")}</strong></div><div class="metric"><span>Perda de peso recente</span><strong>${shown(data.health4Count, "—")}</strong></div><div class="metric"><span>Refeições por dia</span><strong>${shown(data.mealsPerDay, "—")}</strong></div></div><h3>Identificação da instituição</h3><div class="report-grid">${reportField("Nome da instituição", data.institutionName, true)}${reportField("Endereço", data.address, true)}${reportField("Responsável", data.institutionManager)}${reportField("Telefone", data.phone)}${reportField("Início das atividades", formatDate(data.activityStart))}${reportField("Data da visita", formatDate(data.visitDate))}</div><h3>Caracterização</h3>${reportTable(["Indicador", "Quantidade"], [["Total de residentes", data.totalResidents], ["Idosos independentes", data.independentResidents], ["Idosos parcialmente dependentes", data.partialResidents], ["Idosos dependentes", data.dependentResidents], ["Idosos acamados", data.bedriddenResidents], ["Funcionários envolvidos na alimentação", data.foodEmployees]])}`, 3, totalPages);

  const healthRows = healthItems.map((item, index) => [item, data[`health${index}Count`], data[`health${index}Note`]]);
  const mealRows = mealItems.map((item, index) => [item, data[`meal${index}Time`], data[`meal${index}Note`]]);
  const scheduledMealCount = mealItems.filter((_, index) => data[`meal${index}Time`]).length;
  const page3 = reportPage(data, "Seção 03", "Perfil de saúde dos residentes", `<div class="metric-grid"><div class="metric"><span>Diabetes mellitus</span><strong>${shown(data.health0Count, "—")}</strong></div><div class="metric"><span>Hipertensão arterial</span><strong>${shown(data.health1Count, "—")}</strong></div><div class="metric"><span>Perda de peso recente</span><strong>${shown(data.health4Count, "—")}</strong></div><div class="metric"><span>Suplemento nutricional</span><strong>${shown(data.health7Count, "—")}</strong></div></div>${reportTable(["Condição / característica", "Nº de idosos", "Observações"], healthRows)}${total && (diabetes > total || hypertension > total || weightLoss > total) ? '<p class="report-note"><strong>Conferência necessária:</strong> há uma condição clínica com quantitativo superior ao total de residentes informado.</p>' : ""}<p class="report-note"><strong>Leitura técnica:</strong> os quantitativos desta seção representam prevalências informadas na visita e não substituem avaliação nutricional individual ou consulta aos prontuários.</p>`, 3, totalPages);

  const page4 = reportPage(data, "Seção 04", "Rotina alimentar da instituição", `<div class="report-grid">${reportField("Refeições oferecidas por dia", data.mealsPerDay)}${reportField("Existe cardápio planejado", data.plannedMenu)}${reportField("Quem define as refeições", data.mealPlanner, true)}${reportField("Existem dietas especiais", data.specialDiets)}${data.acceptanceRecord ? reportField("Há registro de aceitação alimentar", data.acceptanceRecord) : ""}${data.specialDietsDetails ? reportField("Dietas especiais / critérios", data.specialDietsDetails, true) : ""}</div><h3>Distribuição diária das refeições</h3>${reportTable(["Refeição", "Horário", "Preparação / observações"], mealRows)}${Number(data.mealsPerDay || 0) > 0 && Number(data.mealsPerDay) < 6 ? `<div class="report-callout red"><strong>Não conformidade normativa</strong>A instituição informou ${shown(data.mealsPerDay)} refeições diárias. Os arts. 44 e 45 da RDC Anvisa nº 502/2021 estabelecem oferta mínima de seis refeições por dia, além da observância das Boas Práticas da RDC nº 216/2004.</div>` : ""}${Number(data.mealsPerDay || 0) && scheduledMealCount !== Number(data.mealsPerDay) ? `<p class="report-note"><strong>Conferência do registro:</strong> foram preenchidos ${scheduledMealCount} horários, enquanto o total informado é de ${shown(data.mealsPerDay)} refeições. Ajustar o registro para refletir a rotina efetivamente praticada.</p>` : ""}`, 4, totalPages);

  const residentRows = (data.residents || []).filter((resident) => resident.name || resident.diagnosis).map((resident) => [resident.name, formatDate(resident.birthDate), resident.diagnosis, resident.bedridden, resident.weightLoss, resident.requiresSpecialDiet || (resident.specialDiet && resident.specialDiet !== "Não" ? "Sim" : "Não"), resident.pastyDiet || "Não", resident.priority]);
  const page5 = residentRows.length ? reportPage(data, "Seção 05", "Levantamento geral dos residentes", `<div class="metric-grid"><div class="metric"><span>Registros individualizados</span><strong>${residentRows.length}</strong></div><div class="metric"><span>Prioridade alta/imediata</span><strong>${highPriorityResidents}</strong></div><div class="metric"><span>Perda de peso informada</span><strong>${shown(data.health4Count, "—")}</strong></div><div class="metric"><span>Uso de suplemento</span><strong>${shown(data.health7Count, "—")}</strong></div></div>${reportTable(["Nome / identificação", "Data de nascimento", "Diagnóstico", "Acamado", "Perda de peso", "Dieta Especial", "Dieta Pastosa", "Prioridade"], residentRows)}<p class="report-note"><strong>Critério e confidencialidade:</strong> “Dieta Especial” registra a avaliação da nutricionista sobre a necessidade de conduta dietética específica, não apenas a dieta oferecida atualmente. Esta página contém dados de saúde e deve ter acesso restrito a pessoas autorizadas.</p>`, 5, totalPages) : null;

  const observationRows = observationItems.map((item, index) => [item, data[`observation${index}Status`], data[`observation${index}Note`]]).filter((row) => row[1] || row[2]);
  const page6 = reportedKitchenRows.length ? reportPage(data, "Seção 06", "Visita técnica ao serviço de alimentação", `<div class="metric-grid"><div class="metric"><span>Itens registrados</span><strong>${reportedKitchenRows.length}</strong></div><div class="metric"><span>Respostas conformes</span><strong>${applicable.length ? compliant : "—"}</strong></div><div class="metric"><span>Não conformidades</span><strong>${applicable.length ? nonCompliant : "—"}</strong></div><div class="metric"><span>Índice descritivo</span><strong>${compliance}</strong></div></div>${reportTable(["Item avaliado", "Avaliação"], reportedKitchenRows)}<p class="report-note">O índice considera somente as respostas “Sim” e “Não” registradas na visita.</p>`, 6, totalPages) : null;

  const findingCards = (data.findings || []).filter((finding) => finding.finding).map((finding, index) =>
    '<article class="finding-report-card">' +
      '<header><strong>AT-' + String(index + 1).padStart(2, "0") + ' · ' + shown(finding.area, "Área não informada") + '</strong><span>' + shown(finding.classification, "Sem classificação") + ' · ' + shown(finding.priority, "Sem prioridade") + '</span></header>' +
      '<div class="finding-card-section"><b>Achado</b><p>' + shown(finding.finding) + '</p></div>' +
      '<div class="finding-card-meta">' +
        '<div><b>Evidência / fonte</b><p>' + shown(finding.evidence, "Não informada") + '</p></div>' +
        '<div><b>Referência</b><p>' + shown(finding.reference, "Não informada") + '</p></div>' +
      '</div>' +
      '<div class="finding-card-section"><b>Orientação</b><p>' + shown(finding.guidance, "Não informada") + '</p></div>' +
    '</article>'
  ).join("");
  const findingsPage = findingCards ? reportPage(data, "Síntese técnica", "Achados e orientações", '<p class="report-paragraph">Os achados resultam dos dados, documentos, registros fotográficos e relatos disponíveis no levantamento. Cada orientação está vinculada à respectiva evidência.</p><div class="findings-summary-grid">' + findingCards + '</div><p class="report-note"><strong>Referências:</strong> os fundamentos técnicos ou normativos são apresentados somente quando relacionados ao achado descrito.</p>', 8, totalPages, "findings-report-page") : null;

  const hasCookInterview = [data.cookName, data.cookExperience, data.cookTraining, data.cookPlanning, data.cookDifficulties, data.mostAcceptedFoods, data.mostRejectedFoods, data.foodPurchases, data.specialDietDifficulties, data.missingResources].some((value) => String(value || "").trim());
  const page7 = hasCookInterview ? reportPage(data, "Seção 07", "Entrevista com a cozinheira", `<div class="report-grid">${reportField("Nome", data.cookName)}${reportField("Tempo de experiência", data.cookExperience)}${reportField("Capacitação em Boas Práticas", data.cookTraining)}${reportField("Planejamento das refeições", data.cookPlanning)}${reportField("Principais dificuldades", data.cookDifficulties, true)}${reportField("Alimentos com maior aceitação", data.mostAcceptedFoods)}${reportField("Alimentos com maior rejeição", data.mostRejectedFoods)}${reportField("Compras dos alimentos", data.foodPurchases, true)}${reportField("Dificuldade com dietas especiais", data.specialDietDifficulties)}${reportField("Equipamentos ou recursos ausentes", data.missingResources)}</div><p class="report-note"><strong>Fonte:</strong> informações relatadas durante a entrevista realizada na visita.</p>`, 7, totalPages) : null;

  const hasPriorities = [data.immediatePriority, data.shortPriority, data.mediumPriority].some((value) => String(value || "").trim());
  const page8 = observationRows.length || hasPriorities ? reportPage(data, observationRows.length ? "Observação e prioridades" : "Prioridades", observationRows.length ? "Observação da refeição e prioridades" : "Demandas e prioridades identificadas", `${observationRows.length ? `<h3>Observação da refeição</h3>${reportTable(["Aspecto observado", "Avaliação", "Observações"], observationRows)}` : ""}${hasPriorities ? `<h3>Demandas priorizadas</h3><div class="report-callout red"><strong>Prioridade imediata</strong>${shown(data.immediatePriority)}</div><div class="report-callout yellow"><strong>Curto prazo · até 30 dias</strong>${shown(data.shortPriority)}</div><div class="report-callout green"><strong>Médio prazo · 31 a 90 dias</strong>${shown(data.mediumPriority)}</div>` : ""}`, 8, totalPages) : null;

  const actionRows = (data.actions || []).filter((action) => action.action).map((action) => [action.action, action.priority, action.responsible, action.deadline, action.status]);
  const opinionPage = reportPage(data, "Seção 10", "Parecer diagnóstico inicial", `<h3>Síntese diagnóstica</h3><p class="report-paragraph">${shown(data.diagnosticOpinion)}</p>${data.strengths?.trim() ? `<h3>Pontos fortes observados</h3><p class="report-paragraph">${shown(data.strengths)}</p>` : ""}${data.limitations?.trim() ? `<h3>Limitações do levantamento</h3><p class="report-paragraph">${shown(data.limitations)}</p>` : ""}<p class="report-note"><strong>Natureza do parecer:</strong> diagnóstico inicial baseado nas informações e evidências disponíveis na data da visita. Os achados devem ser reavaliados após as adequações e a complementação documental.</p>`, 9, totalPages);
  const actionPlanTable = actionRows.length ? reportTable(["Ação recomendada", "Prioridade", "Responsável", "Prazo", "Status"], actionRows) : "";
  const actionPlanPage = reportPage(data, "Seção 11", "Recomendações e plano de ação", `<div class="action-plan-intro"><h3>Orientações gerais</h3><p class="report-paragraph">${shown(data.recommendations)}</p></div>${actionPlanTable}`, 10, totalPages, "action-plan-report-page");

  const annexPages = annexChunks.map((chunk, chunkIndex) => {
    const content = chunk.length
      ? `<div class="annex-report-grid">${chunk.map((annex, index) => `<article class="annex-report-item"><div class="annex-report-heading"><strong>ANX-${String(chunkIndex * 2 + index + 1).padStart(2, "0")} · ${shown(annex.title, "Anexo sem título")}</strong><span>${shown(annex.type)}${annex.date ? ` · ${formatDate(annex.date)}` : ""}</span></div>${annex.dataUrl ? `<img src="${escapeAttribute(annex.dataUrl)}" alt="${escapeAttribute(annex.title || "Registro fotográfico")}" />` : `<div class="annex-file-placeholder"><strong>${shown(annex.fileName, "Arquivo não incorporado")}</strong><span>${annex.fileName ? "Documento relacionado ao relatório" : "Espaço reservado para inclusão do arquivo"}</span></div>`}<p>${shown(annex.description, "Descrição não informada")}</p><small>Referência: ${shown(annex.code, "Não informada")}</small></article>`).join("")}</div>`
      : `<div class="annex-empty-report"><strong>Área reservada para anexos e evidências complementares</strong><p>Nenhum anexo foi incorporado nesta versão. Quando disponíveis, relacionar e identificar de forma sequencial:</p><ul><li>registros fotográficos autorizados;</li><li>instrumentos de mapeamento e checklists preenchidos;</li><li>documentos e controles consultados;</li><li>planilhas, indicadores e evidências de adequação.</li></ul><p>Cada anexo deverá indicar data, autoria ou fonte, local/processo retratado e relação com o respectivo achado técnico.</p></div>`;
    return reportPage(data, "Anexos", chunk.length ? `Evidências complementares · bloco ${chunkIndex + 1}` : "Área reservada para evidências", content, 11 + chunkIndex, totalPages, "annex-report-page");
  });

  const signaturePage = reportPage(data, "Encerramento", "Assinaturas e termo de concordância", `<div class="signature-context"><div><span>Relatório</span><strong>${shown(data.reportNumber)}</strong></div><div><span>Instituição</span><strong>${shown(data.institutionName)}</strong></div><div><span>Data da visita</span><strong>${formatDate(data.visitDate)}</strong></div><div><span>Local de emissão</span><strong>${shown(data.issueCity, "Não informado")}</strong></div></div><section class="signature-term"><h3>Termo de concordância e ciência</h3><p>Por meio das assinaturas abaixo, as partes declaram ter lido e estar cientes do conteúdo deste relatório. A solicitante confirma o recebimento das orientações e a ciência da necessidade de analisar, priorizar e encaminhar as ações propostas.</p><p>A assinatura da nutricionista consultora atesta a autoria desta avaliação técnica pontual, sem assunção de responsabilidade técnica pela ILPI, vínculo empregatício ou integração à equipe permanente da instituição. A execução e o acompanhamento das adequações permanecem sob responsabilidade da gestão e dos profissionais formalmente designados.</p></section><div class="signature-page-blocks"><div><div class="signature-stamp-space"><img src="./public/imagens_pub/assinatura-carimbo-nutricionista.jpg" alt="Assinatura e carimbo da nutricionista consultora" /></div><span class="signature-line"></span><strong>${shown(data.nutritionist, "Nutricionista consultora")}</strong><small>Nutricionista consultora · CRN ${shown(data.crn, "não informado")}</small></div><div><div class="signature-stamp-space" aria-hidden="true"></div><span class="signature-line"></span><strong>${shown(data.requestedBy || data.institutionManager, "Solicitante / responsável pela instituição")}</strong><small>Solicitante · CPF ${shown(data.requesterCpf, "não informado")}</small></div></div><div class="signature-date-line"><span>Local: __________________________________________</span><span>Data: ______/______/____________</span></div>`, 12 + annexPages.length, totalPages, "signature-report-page");

  const contentPages = [page2, page3Overview, page3, page4, page5, page6, findingsPage, page7, page8, opinionPage, actionPlanPage, ...annexPages, signaturePage].filter(Boolean);
  const cleanReportText = (value) => String(value || "").replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#039;", "'");
  const tocEntries = [
    { kicker: "Documento", title: "Capa — Diagnóstico Institucional e Nutricional", page: 1 },
    { kicker: "Organização", title: "Sumário", page: 2 },
    ...contentPages.map((pageHtml, index) => {
      const heading = pageHtml.match(/<h2><span>(.*?)<\/span>(.*?)<\/h2>/);
      return {
        kicker: cleanReportText(heading?.[1] || "Seção"),
        title: cleanReportText(heading?.[2] || "Conteúdo do relatório"),
        page: index + 3
      };
    })
  ];
  const tocItems = tocEntries.map((entry) =>
    '<div class="toc-entry"><div><span>' + shown(entry.kicker) + '</span><strong>' + shown(entry.title) + '</strong></div><b>' + entry.page + '</b></div>'
  ).join("");
  totalPages = 2 + contentPages.length;
  const tocPage = reportPage(data, "Organização do documento", "Sumário", '<p class="report-paragraph">Relação das páginas que compõem esta versão do relatório técnico.</p><div class="toc-list">' + tocItems + '</div>', 2, totalPages, "toc-report-page");
  const reportPages = [tocPage, ...contentPages];
  return finalizeReportPages(cover, reportPages, totalPages);
}

function buildSummaryReportHtml(data) {
  const priorityOrder = { Imediata: 0, Alta: 1, Moderada: 2, Baixa: 3 };
  const findings = [...(data.findings || [])]
    .filter((finding) => finding.finding)
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  const actions = [...(data.actions || [])]
    .filter((action) => action.action)
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
  const immediateActions = actions.filter((action) => action.priority === "Imediata").slice(0, 6);
  const highCount = findings.filter((finding) => finding.priority === "Alta").length;
  const mealCount = Number(data.mealsPerDay || 0);

  const immediateItems = immediateActions.map((action) =>
    '<li><strong>' + shown(action.action) + '</strong><span>' + shown(action.responsible, "Responsável a definir") + ' · Prazo: ' + shown(action.deadline, "a definir") + ' · ' + shown(action.status, "Pendente") + '</span></li>'
  ).join("");

  const mealAlert = mealCount > 0 && mealCount < 6
    ? '<div class="summary-noncompliance"><strong>NÃO CONFORME · OFERTA DIÁRIA DE REFEIÇÕES</strong><p>A instituição informou ' + shown(data.mealsPerDay) + ' refeições diárias. O art. 44 da RDC Anvisa nº 502/2021 estabelece a oferta mínima de seis refeições por dia. O art. 45 da mesma resolução determina a observância das Boas Práticas aplicáveis à manipulação, preparação, armazenamento e distribuição dos alimentos, em conformidade com a RDC Anvisa nº 216/2004.</p></div>'
    : "";
  const narrative =
    'A visita técnica realizada em ' + formatDate(data.visitDate) +
    ' caracterizou a instituição com ' + shown(data.totalResidents, "quantitativo não informado") +
    ' residentes, sendo ' + shown(data.independentResidents, "—") + ' independentes, ' +
    shown(data.partialResidents, "—") + ' parcialmente dependentes e ' +
    shown(data.dependentResidents, "—") + ' dependentes, incluindo ' +
    shown(data.bedriddenResidents, "—") + ' pessoa(s) acamada(s). Foram informados ' +
    shown(data.health4Count, "—") + ' caso(s) de perda de peso recente. Na rotina alimentar, foram registradas ' +
    shown(data.mealsPerDay, "—") + ' refeições diárias, cardápio planejado: ' +
    shown(data.plannedMenu, "não informado") + ', registro de aceitação: ' +
    shown(data.acceptanceRecord, "não informado") + ' e dietas especiais: ' +
    shown(data.specialDiets, "não informado") +
    '. O diagnóstico aponta necessidade de intervenção coordenada nos eixos nutricional, sanitário, documental, estrutural e de gestão, com comprovação das adequações e reavaliação técnica.';

  const content =
    '<div class="summary-identification">' +
      '<div class="summary-id-wide"><span>Instituição</span><strong>' + shown(data.institutionName) + '</strong><small>' + shown(data.address) + '</small></div>' +
      '<div><span>Relatório</span><strong>' + shown(data.reportNumber) + '</strong><small>Consultoria independente</small></div>' +
      '<div><span>Visita técnica</span><strong>' + formatDate(data.visitDate) + '</strong><small>' + shown(data.issueCity, "Local não informado") + '</small></div>' +
      '<div><span>Nutricionista consultora</span><strong>' + shown(data.nutritionist) + '</strong><small>CRN ' + shown(data.crn) + '</small></div>' +
    '</div>' +
    '<section class="summary-section"><h3>Síntese descritiva</h3><p>' + narrative + '</p></section>' +
    '<div class="summary-metrics">' +
      '<div><span>Residentes</span><strong>' + shown(data.totalResidents, "—") + '</strong></div>' +
      '<div><span>Acamados</span><strong>' + shown(data.bedriddenResidents, "—") + '</strong></div>' +
      '<div><span>Perda de peso</span><strong>' + shown(data.health4Count, "—") + '</strong></div>' +
      '<div><span>Prioridade imediata</span><strong>' + immediateActions.length + '</strong></div>' +
      '<div><span>Prioridade alta</span><strong>' + highCount + '</strong></div>' +
    '</div>' +
    mealAlert +
    '<section class="summary-immediate-priority"><header><strong>PRIORIDADE IMEDIATA · ' + shown(data.institutionName, "Instituição") + '</strong><span>Medidas que não devem aguardar</span></header><ol>' +
      (immediateItems || '<li><strong>Nenhuma ação imediata registrada.</strong></li>') +
    '</ol></section>' +
    '<p class="summary-reference"><strong>Bases principais:</strong> RDC Anvisa nº 502/2021; RDC Anvisa nº 216/2004; Lei nº 8.234/1991; Lei nº 10.741/2003; Resolução CFN nº 600/2018. Os demais achados, evidências e orientações constam no PDF completo.</p>' +
    '<p class="summary-digital-note"><strong>Natureza da atuação:</strong> consultoria nutricional independente e pontual, sem assunção de responsabilidade técnica, vínculo empregatício ou integração da nutricionista à equipe permanente da ILPI. A execução e o acompanhamento das ações cabem à gestão e aos profissionais formalmente designados. O PDF completo contém metodologia, evidências, referências, orientações, plano de ação e anexos.</p>' +
    '<section class="summary-signature-section"><h3>Assinaturas</h3>' +
      '<div class="summary-signatures">' +
        '<div><div class="signature-stamp-space"><img src="./public/imagens_pub/assinatura-carimbo-nutricionista.jpg" alt="Assinatura e carimbo da nutricionista consultora" /></div><span class="signature-line"></span><strong>' + shown(data.nutritionist, "Nutricionista consultora") + '</strong><small>Nutricionista consultora · CRN ' + shown(data.crn, "não informado") + '</small></div>' +
        '<div><div class="signature-stamp-space" aria-hidden="true"></div><span class="signature-line"></span><strong>' + shown(data.institutionManager, "Responsável pela instituição") + '</strong><small>Ciência e recebimento · Data: ____/____/________</small></div>' +
      '</div>' +
    '</section>';

  return reportPage(data, "Resumo executivo para impressão", "Resumo técnico da visita à ILPI", content, 1, 1, "report-summary-page")
    .replaceAll("__OCTN_PAGE__", "1")
    .replaceAll("__OCTN_TOTAL__", "1");
}
async function waitForReportAssets(container) {
  const images = [...container.querySelectorAll("img")];
  await Promise.all(images.map((image) => {
    if (image.complete) return image.decode?.().catch(() => {}) || Promise.resolve();
    return new Promise((resolve) => {
      const finish = () => resolve();
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, 4000);
    });
  }));
  if (document.fonts?.ready) await document.fonts.ready;
}

async function printCurrentReport() {
  const record = saveCurrentReport();
  if (!record) return;
  const report = document.getElementById("ilpi-report");
  report.innerHTML = buildReportHtml(record.data);
  document.body.classList.add("printing-ilpi");
  document.title = `${record.data.reportNumber || "Relatório ILPI"} - ${record.data.institutionName || "OCTN"}`;
  await waitForReportAssets(report);
  window.print();
}
async function printSummaryReport() {
  const record = saveCurrentReport();
  if (!record) return;
  const report = document.getElementById("ilpi-report");
  report.innerHTML = buildSummaryReportHtml(record.data);
  document.body.classList.add("printing-ilpi");
  document.title = (record.data.reportNumber || "Relatório ILPI") + " - Resumo - " + (record.data.institutionName || "OCTN");
  await waitForReportAssets(report);
  window.print();
}

document.getElementById("print-ilpi")?.addEventListener("click", printCurrentReport);
document.getElementById("print-ilpi-summary")?.addEventListener("click", printSummaryReport);
document.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", printCurrentReport));
window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-ilpi");
  document.title = "Formulários | OCTN";
});
