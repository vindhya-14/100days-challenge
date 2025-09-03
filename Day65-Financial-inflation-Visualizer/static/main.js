// main.js

// DOM Elements
const addBtn = document.getElementById("addBtn");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const transactionList = document.getElementById("transactionList");
const totalBalanceEl = document.getElementById("totalBalance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const calculateBtn = document.getElementById("calculateBtn");
const resultEl = document.getElementById("result");
const filterBtns = document.querySelectorAll(".filter-btn");

// Initialize transactions (use localStorage persistence)
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Chart.js setup
const ctx = document.getElementById("financeChart").getContext("2d");
let financeChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#2ecc71", "#e74c3c"],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text-primary)",
          font: { family: "'Poppins', sans-serif" },
        },
      },
    },
    cutout: "70%",
  },
});

// Add Transaction
addBtn.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!desc || isNaN(amount) || amount <= 0 || !date) {
    alert("Please fill all fields with valid values.");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount,
    type,
    date,
    category,
  };

  transactions.push(transaction);
  saveTransactions();
  updateUI();

  // Reset form
  descInput.value = "";
  amountInput.value = "";
  dateInput.valueAsDate = new Date();
});

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();
  updateUI();
}

// Save to localStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update UI
function updateUI() {
  let income = 0,
    expense = 0;

  transactionList.innerHTML = "";

  if (transactions.length === 0) {
    transactionList.innerHTML =
      '<p style="text-align:center; color:var(--text-secondary)">No transactions yet</p>';
  }

  // Sort by date (newest first)
  transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;

      const li = document.createElement("li");
      li.className = t.type;

      const formattedDate = new Date(t.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      li.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-desc">${t.desc}</div>
          <div class="transaction-date">${formattedDate} • ${t.category}</div>
        </div>
        <div class="transaction-amount ${t.type}-color">
          ${t.type === "income" ? "+" : "-"}₹${t.amount.toFixed(2)}
        </div>
        <div class="transaction-actions">
          <button class="action-btn" onclick="deleteTransaction(${t.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      transactionList.appendChild(li);
    });

  // Update summary
  totalIncomeEl.textContent = `₹${income.toFixed(2)}`;
  totalExpenseEl.textContent = `₹${expense.toFixed(2)}`;
  totalBalanceEl.textContent = `₹${(income - expense).toFixed(2)}`;

  // Update chart
  financeChart.data.datasets[0].data = [income, expense];
  financeChart.update();
}

// Filter Transactions
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    let filtered = [];
    if (btn.dataset.filter === "income")
      filtered = transactions.filter((t) => t.type === "income");
    else if (btn.dataset.filter === "expense")
      filtered = transactions.filter((t) => t.type === "expense");
    else filtered = transactions;

    displayTransactions(filtered);
  });
});

function displayTransactions(transactionsToDisplay) {
  transactionList.innerHTML = "";

  if (transactionsToDisplay.length === 0) {
    transactionList.innerHTML =
      '<p style="text-align:center; color:var(--text-secondary)">No transactions yet</p>';
    return;
  }

  transactionsToDisplay
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((t) => {
      const li = document.createElement("li");
      li.className = t.type;

      const formattedDate = new Date(t.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      li.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-desc">${t.desc}</div>
          <div class="transaction-date">${formattedDate} • ${t.category}</div>
        </div>
        <div class="transaction-amount ${t.type}-color">
          ${t.type === "income" ? "+" : "-"}₹${t.amount.toFixed(2)}
        </div>
        <div class="transaction-actions">
          <button class="action-btn" onclick="deleteTransaction(${t.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      transactionList.appendChild(li);
    });
}

// Inflation Calculator
calculateBtn.addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("amountInput").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const years = parseInt(document.getElementById("years").value);

  if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
    resultEl.textContent = "Please enter valid values.";
    return;
  }

  const futureValue = amount / Math.pow(1 + rate, years);
  resultEl.textContent = `₹${amount.toFixed(
    2
  )} today will be worth ₹${futureValue.toFixed(2)} in ${years} years with ${(
    rate * 100
  ).toFixed(1)}% inflation.`;
});

// Load initial data
document.addEventListener("DOMContentLoaded", () => {
  dateInput.valueAsDate = new Date();
  updateUI();
});
