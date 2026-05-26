import "./style.css"
import { bootTerminal } from "./shell"

const app = document.querySelector<HTMLDivElement>("#app")

if (app === null) {
  throw new Error("No se encontró el contenedor #app.")
}

const clockFormatter = new Intl.DateTimeFormat("es-GT", {
  hour: "2-digit",
  minute: "2-digit",
})

app.innerHTML = `
  <main class="app-shell">
    <section class="frame" aria-label="Hypr-folio">
      <header class="status-bar">
        <div>
          <strong>hypr-folio</strong>
          <span>portafolio en terminal</span>
        </div>
        <div id="clock" aria-live="polite"></div>
      </header>
      <div class="terminal-card" id="terminal"></div>
    </section>
  </main>
`

const clock = document.querySelector<HTMLElement>("#clock")

if (clock !== null) {
  const renderClock = () => {
    clock.textContent = clockFormatter.format(new Date())
  }

  renderClock()
  window.setInterval(renderClock, 1000)
}

const terminalHost = document.querySelector<HTMLElement>("#terminal")

if (terminalHost === null) {
  throw new Error("No se encontró el contenedor de la terminal.")
}

bootTerminal({ host: terminalHost })
