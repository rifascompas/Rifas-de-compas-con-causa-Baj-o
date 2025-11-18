/* ===================
    CONFIGURACIÓN
=================== */
const TOTAL_TICKETS = 120;
const TICKET_PRICE = 80; // MXN
const SOLD_TICKETS = [3,6,9,15,18,40,77,89];
const WHATSAPP_NUMBER = "5214420001122";
const PRIZE_IMAGE = "premio.png";
const PRIZE_TITLE = "¡Participa y gana este fabuloso premio!";
const PRIZE_DESC = "Descripción corta del premio aquí.";
const MAX_PER_USER = 20; // ← Límite máximo por persona


/* ===================
    END CONFIG
=================== */

document.getElementById("ticket-price").value = TICKET_PRICE;
document.getElementById("prize-img").src = PRIZE_IMAGE;
document.getElementById("prize-title").textContent = PRIZE_TITLE;
document.getElementById("prize-desc").textContent = PRIZE_DESC;
document.getElementById("max-txt").textContent = MAX_PER_USER;

let selectedTickets = [];

// Render cuadrícula de boletos
function renderGrid() {
  const grid = document.getElementById("tickets-grid");
  grid.innerHTML = "";
  for(let i=1; i<=TOTAL_TICKETS; i++) {
    const btn = document.createElement("div");
    btn.classList.add("ticket");
    btn.textContent = i;
    if(SOLD_TICKETS.includes(i)) btn.classList.add("sold");
    if(selectedTickets.includes(i)) btn.classList.add("selected");
    btn.tabIndex = SOLD_TICKETS.includes(i) ? -1 : 0;
    // Interacción solo si disponible
    if(!SOLD_TICKETS.includes(i)) {
      btn.addEventListener("click", () => toggleTicket(i));
      btn.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleTicket(i);}
      });
    }
    grid.appendChild(btn);
  }
}

function toggleTicket(n) {
  const idx = selectedTickets.indexOf(n);
  if(idx === -1) {
    if(selectedTickets.length >= MAX_PER_USER){
      alert("Límite máximo de " + MAX_PER_USER + " boletos por persona.");
      return;
    }
    selectedTickets.push(n);
  }
  else
    selectedTickets.splice(idx,1);
  updateSummary();
  renderGrid();
}

function updateSummary() {
  document.getElementById("selected-count").textContent = selectedTickets.length;
  document.getElementById("subtotal-amount").textContent = "$" + (selectedTickets.length * TICKET_PRICE) + " MXN";
}

// Máquina de la suerte
document.getElementById("lucky-btn").addEventListener("click", () => {
  let cuantos = parseInt(document.getElementById("lucky-amount").value) || 1;
  if(cuantos < 1) cuantos = 1;
  if(cuantos > (MAX_PER_USER - selectedTickets.length)){
    alert("Sólo puedes seleccionar " + (MAX_PER_USER - selectedTickets.length) + " boletos más.");
    return;
  }
  let disponibles = [];
  for(let i=1; i<=TOTAL_TICKETS; i++)
    if(!SOLD_TICKETS.includes(i) && !selectedTickets.includes(i)) disponibles.push(i);
  if(cuantos > disponibles.length){
    alert("Sólo quedan " + disponibles.length + " boletos disponibles.");
    return;
  }
  shuffle(disponibles);
  for(let i=0; i<cuantos; i++) selectedTickets.push(disponibles[i]);
  updateSummary();
  renderGrid();
});
function shuffle(arr) {
  for(let i = arr.length-1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Validaciones campos nombre/teléfono
function isValidPhone(str){
  return /^[0-9]{10,15}$/.test(str.trim());
}

// Finalizar compra
document.getElementById("finalizar-btn").addEventListener("click", () => {
  if(selectedTickets.length === 0) {
    alert("Selecciona al menos un boleto.");
    return;
  }
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  if(nombre.length < 2){
    alert("Por favor, escribe tu nombre.");
    document.getElementById("nombre").focus();
    return;
  }
  if(!isValidPhone(telefono)){
    alert("Ingresa un teléfono válido (10-15 dígitos, sólo números).");
    document.getElementById("telefono").focus();
    return;
  }
  const total = selectedTickets.length * TICKET_PRICE;
  let mensaje =
`Hola, quiero confirmar mi compra:
Nombre: ${nombre}
Teléfono: ${telefono}
Boletos seleccionados: ${selectedTickets.sort((a,b)=>a-b).join(', ')}
Total: $${total} MXN`;
  const encoded = encodeURIComponent(mensaje);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
});

// Prevenir valores locos en máquina de suerte
document.getElementById("lucky-amount").addEventListener("change", (e)=>{
  let val = parseInt(e.target.value)||1;
  if(val<1) val=1;
  if(val>MAX_PER_USER) val=MAX_PER_USER;
  e.target.value = val;
});

// Mejoras visuales UX: salto a formar, estilos en error, etc. (opcional expandible)

// -------- Inicializar
renderGrid();
updateSummary();