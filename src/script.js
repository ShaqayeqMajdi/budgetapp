const menu = document.getElementById("mobile-menu");
const openBtn = document.getElementById("menu-toggle");
const closeBtn = document.getElementById("close-menu");
openBtn.addEventListener("click", () => {
  menu.classList.remove("translate-x-full");
});
closeBtn.addEventListener("click", () => {
  menu.classList.add("translate-x-full");
});

const root = document.getElementById("root");

let budget = 0;
let transactions = [];

function aClick(event) {
  event.preventDefault();
  const href = event.currentTarget.getAttribute("href");
  history.pushState({}, "", href);
  checkState();
}

function getTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;
  transactions.forEach((tran) => {
    if (tran.type === "income") totalIncome += tran.amount;
    else totalExpenses += tran.amount;
  });
  return { totalIncome, totalExpenses };
}

function showBudget() {
  let totals = getTotals();
  let balance = budget + totals.totalIncome - totals.totalExpenses;
  document.getElementById("budget-amount").textContent = budget;
  document.getElementById("income-amount").textContent ="+" + totals.totalIncome;
  document.getElementById("expense-amount").textContent ="-" + totals.totalExpenses;
  document.getElementById("balance-amount").textContent = balance;
  showTransactions();
}

function showTransactions() {
  const transactionList = document.getElementById("transaction-list");
  const htmlContent = transactions
    .map((transaction, index) => {
      return `
        <li class="flex justify-between items-center p-2">
          <div class="text-2xl text-gray-600">
            ${transaction.title}
            <br>
            <span class="text-gray-500 text-xl">
              ${new Date(transaction.date).toLocaleString()}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="${
              transaction.type === "expense" ? "text-red-500" : "text-green-500"
            } text-xl">
              ${transaction.type === "expense" ? "-" : "+"}${transaction.amount}
            </span>
            <img 
              src="./assets/images/trash-can.png" 
              alt="trash" 
              class="w-6 h-6 cursor-pointer" 
              onclick="removeTransaction(${index})"
            />
          </div>
        </li>
      `;
    })
    .join("");

  transactionList.innerHTML = htmlContent;
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  showBudget();
}

document.getElementById("budget-form").addEventListener("submit", function (event) {
    event.preventDefault();
    budget = +document.getElementById("budget-input").value || 0;
    document.getElementById("budget-input").value = "";
    showBudget();
  });

document.getElementById("transaction-form").addEventListener("submit", function (event) {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let amount = +document.getElementById("amount").value;
    let type = document.getElementById("type").value;
    if (!title || !amount) return;

    transactions.push({ title, amount, type });
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "income";

    showBudget();
  });

function savingsPage() {
  const template = `
  `;
  root.innerHTML = template;
}

function profilePage() {
  const template = `
   <div class="max-w-5xl mx-auto space-y-6 mt-14">
      <!-- Profile Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left: Avatar and Name -->
        <div
          class="bg-seashell rounded-xl p-6 flex flex-col items-center text-center shadow-md"
        >
        <img src="./src/assets/images/prf.jpg" alt="avatar" class="w-60 h-60 rounded-full shadow-lg"
          />
          <h2 class="text-7xl font-semibold mt-8 text-persianPink">Ben</h2>
          <p
            class="text-skyblue text-3xl font-semibold border-b-2 border-smith"
          >
            Premium User
          </p>
        </div>

        <!-- Right: Bio & Other Details -->
        <div class="bg-seashell rounded-xl p-10 shadow-md">
          <h3 class="text-5xl text-persianPink mb-10 border-b-2 border-skyblue">
            Personal Information
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            <div>
              <p class="text-seagreen text-4xl">First Name:</p>
              <p class="text-gray-400 text-2xl">Benedict</p>
            </div>
            <div>
              <p class="text-seagreen text-4xl">Last Name:</p>
              <p class="text-gray-400 text-2xl">Spencer</p>
            </div>

            <div>
              <p class="text-seagreen text-4xl">Email:</p>
              <p class="text-gray-400 text-2xl">example@gmail.com</p>
            </div>
            <div>
              <p class="text-seagreen text-4xl">Phone:</p>
              <p class="text-gray-400 text-2xl">+1 (248)679-8745</p>
            </div>

            <div>
              <p class="text-seagreen text-4xl">Birthday:</p>
              <p class="text-gray-400 text-2xl">May 18, 1987</p>
            </div>
            <div>
              <p class="text-seagreen text-4xl">Gender:</p>
              <p class="text-gray-400 text-2xl">Male</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  root.innerHTML = template;
}

function mainPage() {
  const template = `
   <main
        class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <section
          class="md:col-span-1 bg-seashell p-6 rounded-3xl shadow border border-bone"
        >
          <h2
            class="text-3xl font-semibold mb-4 text-persianPink flex flex-row items-center gap-1"
          >
            Set Your Budget
            <img
              src="./assets/images/budget.png"
              class="w-7 h-7"
              alt="moneybag"
            />
          </h2>
          <form id="budget-form" class="space-y-4">
            <input
              type="number"
              placeholder="Enter initial budget"
              id="budget-input"
              class="w-full px-4 py-3 text-2xl bg-alabaster rounded-xl focus:outline-none focus:ring-1 focus:ring-persianPink"
            />
            <button
              type="submit"
              class="w-full bg-skyblue hover:bg-palecyan text-seashell font-medium py-2 rounded-xl transition-all text-2xl"
            >
              Set Budget
            </button>
          </form>
        </section>

        <!-- Add Transactions Section -->
        <section
          class="md:col-span-2 bg-seashell p-6 rounded-3xl shadow border border-bone"
        >
          <h2 class="text-3xl font-medium mb-4 text-persianPink">
            Add Transaction
          </h2>
          <form
            id="transaction-form"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              id="title"
              type="text"
              placeholder="Title"
              class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl"
            />
            <input
              id="amount"
              type="number"
              placeholder="Amount"
              class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl"
            />
            <select
              id="type"
              class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button
              type="submit"
              class="col-span-full bg-persianPink hover:bg-salmonpink text-white font-medium py-2 rounded-lg transition-all text-2xl"
            >
              Add
            </button>
          </form>
        </section>
        <!-- Budget summary section -->
        <section class="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div
            class="bg-seashell p-6 rounded-2xl shadow border border-bone text-center hover:scale-105 hover:shadow-md transition-all"
          >
            <h3 class="text-persianPink text-2xl uppercase">Budget</h3>
            <p id="budget-amount" class="text-3xl font-bold">0</p>
          </div>
          <div
            class="bg-seashell p-6 rounded-2xl shadow border border-smith text-center hover:scale-105 hover:shadow-md transition-all relative"
          >
            <h3 class="text-persianPink text-2xl uppercase">Income</h3>
            <p id="income-amount" class="text-3xl font-bold text-seagreen">
              +0
            </p>
          </div>
          <div
            class="bg-seashell p-6 rounded-2xl shadow border border-salmonpink text-center hover:scale-105 hover:shadow-md transition-all"
          >
            <h3 class="text-persianPink text-2xl uppercase">Expenses</h3>
            <p id="expense-amount" class="text-3xl font-bold text-salmonpink">
              -0
            </p>
          </div>
          <div
            class="bg-seashell p-6 rounded-2xl shadow border border-bone text-center hover:scale-105 hover:shadow-md transition-all"
          >
            <h3 class="text-persianPink text-2xl uppercase">Balance</h3>
            <p id="balance-amount" class="text-3xl font-bold text-blue-500">
              0
            </p>
          </div>
        </section>
        <!-- Transactions Section -->
        <section
          class="md:col-span-3 bg-seashell p-6 rounded-3xl shadow border border-bone mt-4"
        >
          <h2 class="text-4xl font-medium text-persianPink mb-4">
            Transactions
          </h2>
          <div class="flex flex-wrap gap-4 mb-4 items-center">
            <select
              id="filter-type"
              class="px-4 py-2 bg-alabaster rounded-lg text-xl"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              id="sort-order"
              class="px-4 py-2 bg-alabaster rounded-lg text-xl"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <ul id="transaction-list" class="space-y-3"></ul>
        </section>
      </main>
  `;
  root.innerHTML = template;
}

function checkState() {
  const url = location.pathname;
  switch (url) {
    case "/savings":
      savingsPage();
      break;
    case "/profile":
      profilePage();
      break;
    case "/index":
      mainPage();
      break;
    default:
      mainPage();
  }
}

window.addEventListener("DOMContentLoaded", showBudget);
window.addEventListener("popstate", checkState);
