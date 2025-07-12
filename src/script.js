const root = document.getElementById("root");

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("-translate-x-full");
}

function activeSidebarItem(clickedBtn) {
  const buttons = document.querySelectorAll(".sidebar-button");

  buttons.forEach((btn) => {
    btn.classList.remove(
      "bg-lightBlue",
      "text-white",
      "font-semibold",
      "rounded-xl"
    );
    btn.classList.add("text-lightGray");
  });

  clickedBtn.classList.remove("text-lightGray");
  clickedBtn.classList.add(
    "bg-lightBlue",
    "text-white",
    "font-semibold",
    "rounded-xl"
  );
}

let budget = Number(localStorage.getItem("budget")) || 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

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
  document.getElementById("income-amount").textContent =
    "+" + totals.totalIncome;
  document.getElementById("expense-amount").textContent =
    "-" + totals.totalExpenses;
  document.getElementById("balance-amount").textContent = balance;
  showTransactions();
}

function showTransactions() {
  const transactionList = document.getElementById("transaction-list");
  const htmlContent = transactions
    .map((transaction, index) => {
      return `
        <li class="flex justify-between items-center p-2">
          <div class="text-2xl text-gray-600">${transaction.title}
          </div>
          <div class="flex items-center gap-2">
            <span class="${
              transaction.type === "expense" ? "text-red-500" : "text-green-500"
            } text-xl">
              ${transaction.type === "expense" ? "-" : "+"}${transaction.amount}
            </span>
            <img src="./assets/icon/trash.svg" alt="trash" class="w-6 h-6 cursor-pointer" onclick="removeTransaction(${index})"/>
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

document
  .getElementById("budget-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    budget = +document.getElementById("budget-input").value || 0;
    document.getElementById("budget-input").value = "";
    localStorage.setItem("budget", budget);
    showBudget();
  });

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let amount = +document.getElementById("amount").value;
    let type = document.getElementById("type").value;
    if (!title || !amount) return;

    transactions.push({ title, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "income";
    showBudget();
  });

function mainPage() {
  const template = `
      <main class="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 ml-32">
        <section class="md:col-span-1 bg-darkBlue p-6 rounded-3xl shadow-md">
          <h2 class="text-3xl font-semibold mb-4 text-mediumBlue flex flex-row items-center gap-1">
            Set Your Budget
            <img src="./assets/image/budget.png" class="w-7 h-7" alt="moneybag"/>
          </h2>
          <form id="budget-form" class="space-y-4">
            <input type="number" placeholder="Enter initial budget" id="budget-input" class="w-full px-4 py-3 text-2xl bg-alabaster rounded-xl focus:outline-none focus:ring-1 focus:ring-lightBlue"/>
            <button  type="submit" class="w-full bg-lightBlue  text-lightGray font-medium py-2 rounded-xl transition-all text-2xl">Set Budget</button>
          </form>
        </section>

        <!-- Add Transactions Section -->
        <section class="md:col-span-2 bg-darkBlue  p-6 rounded-3xl shadow-md">
          <h2 class="text-3xl font-bold mb-4 text-mediumBlue">Add Transaction</h2>
          <form id="transaction-form" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input id="title" type="text" placeholder="Title" class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl"/>
            <input id="amount" type="number" placeholder="Amount" class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl"/>
            <select id="type" class="col-span-1 px-4 py-2 bg-alabaster rounded-lg focus:outline-none focus:ring-1 focus:ring-palecyan text-2xl" >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button type="submit" class="col-span-full bg-lightBlue text-white font-medium py-2 rounded-lg transition-all text-2xl">Add</button>
          </form>
        </section>
        <!-- Budget summary section -->
        <section class="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div class="bg-darkBlue  p-6 rounded-2xl shadow-md border-2 border-bone text-center hover:scale-105  transition-all">
            <h3 class="text-mediumBlue text-2xl uppercase">Budget</h3>
            <p id="budget-amount" class="text-3xl font-bold">0</p>
          </div>
          <div class="bg-darkBlue  p-6 rounded-2xl shadow-md border-2 border-smith text-center hover:scale-105 transition-all relative">
            <h3 class="text-mediumBlue text-2xl uppercase">Income</h3>
            <p id="income-amount" class="text-3xl font-bold text-seagreen">+0</p>
          </div>
          <div class="bg-darkBlue  p-6 rounded-2xl shadow-md border-2 border-salmonpink text-center hover:scale-105 transition-all">
            <h3 class="text-mediumBlue text-2xl uppercase">Expenses</h3>
            <p id="expense-amount" class="text-3xl font-bold text-salmonpink">-0</p>
          </div>
          <div class="bg-darkBlue  p-6 rounded-2xl shadow-md border-2 border-bone text-center hover:scale-105 transition-all">
            <h3 class="text-mediumBlue text-2xl uppercase">Balance</h3>
            <p id="balance-amount" class="text-3xl font-bold text-blue-500">0</p>
          </div>
        </section>
        <!-- Transactions Section -->
        <section class="md:col-span-3 bg-darkBlue  p-6 rounded-3xl shadow-md mt-4">
          <h2 class="text-4xl font-medium text-mediumBlue mb-4">Transactions</h2>
          <ul id="transaction-list" class="space-y-3"></ul>
        </section>
      </main>
    `;
  root.innerHTML = template;
}

function userAccount() {
  const template = `
   <div class="max-w-5xl mx-auto space-y-6 mt-32 ml-52">
      <!-- Profile Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div class="bg-white rounded-xl p-6 flex flex-col items-center text-center shadow-md">
        <img src="src/assets/image/prf.png" alt="avatar" class="w-60 h-60 rounded-full shadow-lg"/>
          <h2 class="text-7xl font-semibold mt-8 text-darkBlue">Ben</h2>
          <p class="text-lightBlue  text-3xl font-semibold border-b-2 border-mediumBlue">Premium User</p>
        </div>

        <div class="bg-white rounded-xl p-10 shadow-md">
          <h3 class="text-5xl text-darkBlue mb-10 border-b-2 border-skyblue">Personal Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
            <div>
            <p class="text-lightBlue text-4xl">First Name:</p>
              <p class="text-gray-400 text-2xl">Benedict</p>
            </div>
            <div>
              <p class="text-lightBlue text-4xl">Last Name:</p>
              <p class="text-gray-400 text-2xl">Spencer</p>
            </div>

            <div>
              <p class="text-lightBlue text-4xl">Email:</p>
              <p class="text-gray-400 text-2xl">example@gmail.com</p>
            </div>
            <div>
              <p class="text-lightBlue text-4xl">Phone:</p>
              <p class="text-gray-400 text-2xl">+1 (248)679-8745</p>
            </div>

            <div>
              <p class="text-lightBlue text-4xl">Birthday:</p>
              <p class="text-gray-400 text-2xl">May 18, 1987</p>
            </div>
            <div>
              <p class="text-lightBlue text-4xl">Gender:</p>
              <p class="text-gray-400 text-2xl">Male</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  root.innerHTML = template;
}

function securityPage() {
  const template = `
  <section class="px-10 py-8 sm:px-6 lg:px-8">
  <div class="max-w-6xl mx-auto text-justify">
    <h1 class="md:text-5xl text-3xl font-bold text-white border-b-2 mb-8 border-white">Security at BudgetWise</h1>
    <p class="text-white leading-relaxed text-xl md:text-2xl">
      At BudgetWise, the security and privacy of your financial data are our highest priorities. 
      We understand that budgeting and managing your money require a high level of trust, and we are fully 
      committed to earning and maintaining that trust every step of the way. All data exchanged between your 
      device and our servers is encrypted using modern, bank-grade security protocols. Additionally, your 
      sensitive information is stored securely using advanced encryption technologies to ensure it remains 
      protected at all times.
    </p>

    <p class="text-white leading-relaxed text-xl md:text-2xl mt-4">
      We implement strict access controls and continuously monitor our systems for any suspicious activity 
      to prevent unauthorized access and ensure system integrity. Our team follows industry best practices 
      for secure software development and applies regular updates and patches to stay ahead of potential threats. 
      We also provide tools like two-factor authentication (2FA) to give you additional control over your account’s safety.
    </p>

    <p class="text-white leading-relaxed text-xl md:text-2xl mt-4">
      Your information is never sold or shared with third parties, and we maintain a transparent data policy 
      to ensure that you stay in control of your personal and financial data. In the unlikely event of any issue, 
      we have robust backup and recovery systems in place to restore your data quickly and safely.
    </p>
 <p class="text-white leading-relaxed text-xl md:text-2xl mt-4">
      Your peace of mind is important to us. That’s why we’ve designed every part of our platform—from login 
      to budget tracking—with security built in from the ground up. If you ever have questions or concerns 
      about your data security, our support team is always here to help.
    </p>
  </div>
</section>
  `;
  root.innerHTML = template;
}

function bankAccount() {
  const template = `
 <h1 class="md:text-5xl text-3xl font-bold text-white border-b-2 mt-10 ml-40 border-white">Wallet Information</h1>
<section class="  px-4 py-12 flex items-center justify-center ml-64  rounded-xl">
  <div class="w-full max-w-md md:max-w-7xl lspace-y-8">
    <div class="relative bg-lightBlue mb-10 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
     <div>
<h2 class="text-xl font-semibold mb-4 sm:mb-0">Bank Card</h2>
<p class="text-lg tracking-widest font-mono">**** **** **** 4582</p>
<div class="flex justify-between mt-4 text-2xl font-medium max-w-xs">
<div>
<p class="uppercase text-gray-100 text-xl">Card Holder</p>
<p class="mt-1">Benedict Spencer</p>
</div>
<div>
<p class="uppercase text-gray-100 text-xs">Expire</p>
<p class="mt-1">08/26</p>
</div>
</div>
</div>
  <div class="w-42 h-24 rounded-xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
    <img src="src/assets/image/credit.png" alt="Card" class="object-cover w-full h-full"/>
  </div>
</div>

<div class="bg-white rounded-2xl p-6 shadow-md space-y-4text-gray-800 text-base md:text-2xl">
  <h3 class="text-3xl font-bold text-skyblue">Bank Information</h3>
  <div class="space-y-2">
    <p><span class="font-semibold">Card Number:</span> 5327-1418-0128-9466</p>
    <p><span class="font-semibold">IBAN:</span> IR62 0120 0000 0000 0000 0000 01</p>
    <p><span class="font-semibold">Bank Name:</span> Melli Bank</p>
    <p><span class="font-semibold">Account Holder: </span>Benedict Spencer</p>
  </div>
</div>
</div> 
</section> `;
  root.innerHTML = template;
}

//Handle Click Function
function aClick(event) {
  event.preventDefault();
  const href = event.currentTarget.getAttribute("href");
  history.pushState({}, "", href);
  checkState();
}

async function checkState() {
  const url = location.pathname;
  switch (url) {
    case "/account":
      await userAccount();
      break;
    case "/mainpage":
      await mainPage();
      break;
    case "/security":
      await securityPage();
      break;
    case "/bank":
      await bankAccount();
      break;
    default:
      mainPage();
      break;
  }
}

window.addEventListener("popstate", checkState);
