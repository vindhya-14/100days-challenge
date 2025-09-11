const monthYear = document.getElementById("month-year");
const datesContainer = document.getElementById("dates");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get first and last day
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Update header
  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Clear old dates
  datesContainer.innerHTML = "";

  // Add empty slots for first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    datesContainer.appendChild(emptyDiv);
  }

  // Add dates
  for (let day = 1; day <= lastDate; day++) {
    const dateDiv = document.createElement("div");
    dateDiv.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      year === today.getFullYear() &&
      month === today.getMonth()
    ) {
      dateDiv.classList.add("today");
    }

    datesContainer.appendChild(dateDiv);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);
