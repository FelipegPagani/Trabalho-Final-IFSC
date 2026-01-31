const form = document.getElementById("form")
const list = document.getElementById("list")
const incomeEl = document.getElementById("income")
const expenseEl = document.getElementById("expense")
const balanceEl = document.getElementById("balance")
const filterButtons = document.querySelectorAll(".filters button")
const themeToggle = document.getElementById("themeToggle")

let items = JSON.parse(localStorage.getItem("fin_items")) || []
let filter = "all"

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark")
  themeToggle.textContent = "☀️"
}

function save() {
  localStorage.setItem("fin_items", JSON.stringify(items))
}

function render() {
  list.innerHTML = ""

  let income = 0
  let expense = 0

  items
    .filter(item => filter === "all" || item.type === filter)
    .forEach(item => {
      const li = document.createElement("li")
      li.className = item.type

      li.innerHTML = `
        <span>${item.description}</span>
        <span>R$ ${item.amount.toFixed(2)}</span>
        <span>${item.type === "income" ? "Receita" : "Despesa"}</span>
        <span>${item.category}</span>
        <button data-id="${item.id}">✕</button>
      `

      list.appendChild(li)
    })

  items.forEach(item => {
    if (item.type === "income") income += item.amount
    else expense += item.amount
  })

  incomeEl.textContent = `R$ ${income.toFixed(2)}`
  expenseEl.textContent = `R$ ${expense.toFixed(2)}`
  balanceEl.textContent = `R$ ${(income - expense).toFixed(2)}`
}

form.addEventListener("submit", e => {
  e.preventDefault()

  const description = document.getElementById("description").value
  const amount = Number(document.getElementById("amount").value)
  const type = document.getElementById("type").value
  const category = document.getElementById("category").value

  items.push({
    id: Date.now(),
    description,
    amount,
    type,
    category
  })

  save()
  render()
  form.reset()
})

list.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    const id = Number(e.target.dataset.id)
    items = items.filter(item => item.id !== id)
    save()
    render()
  }
})

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter
    render()
  })
})

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark")
  const dark = document.body.classList.contains("dark")
  localStorage.setItem("theme", dark ? "dark" : "light")
  themeToggle.textContent = dark ? "☀️" : "🌙"
})

render()
