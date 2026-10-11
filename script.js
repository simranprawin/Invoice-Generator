const itemsList = document.getElementById("itemsList");
const addItemButton = document.getElementById("addItem");
const printButton = document.getElementById("printInvoice");

const subtotalElement = document.getElementById("subtotal");
const taxAmountElement = document.getElementById("taxAmount");
const discountAmountElement = document.getElementById("discountAmount");
const finalTotalElement = document.getElementById("finalTotal");

const taxInput = document.getElementById("tax");
const discountInput = document.getElementById("discount");
const invoiceDateInput = document.getElementById("invoiceDate");
const dueDateInput = document.getElementById("dueDate");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

invoiceDateInput.value = getToday();
dueDateInput.value = addDays(new Date(), 14);

function createItemRow(description = "", quantity = 1, price = 0) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>
      <input
        type="text"
        class="item-description"
        placeholder="Product or service description"
        value="${description}"
      />
    </td>

    <td>
      <input
        type="number"
        class="item-quantity"
        min="1"
        step="1"
        value="${quantity}"
      />
    </td>

    <td>
      <input
        type="number"
        class="item-price"
        min="0"
        step="0.01"
        value="${price}"
      />
    </td>

    <td class="item-total">${currency.format(0)}</td>

    <td>
      <button class="delete-btn" title="Delete item" type="button">
        🗑
      </button>
    </td>
  `;

  itemsList.appendChild(row);

  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", calculateInvoice);
  });

  row.querySelector(".delete-btn").addEventListener("click", () => {
    row.remove();

    if (itemsList.children.length === 0) {
      createItemRow();
    }

    calculateInvoice();
  });

  calculateInvoice();
}

function calculateInvoice() {
  let subtotal = 0;

  document.querySelectorAll("#itemsList tr").forEach((row) => {
    const quantity =
      Number(row.querySelector(".item-quantity").value) || 0;

    const price =
      Number(row.querySelector(".item-price").value) || 0;

    const itemTotal = quantity * price;

    row.querySelector(".item-total").textContent =
      currency.format(itemTotal);

    subtotal += itemTotal;
  });

  const taxRate = Number(taxInput.value) || 0;
  const discountRate = Number(discountInput.value) || 0;

  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discountRate / 100);
  const finalTotal = subtotal + taxAmount - discountAmount;

  subtotalElement.textContent = currency.format(subtotal);
  taxAmountElement.textContent = currency.format(taxAmount);
  discountAmountElement.textContent = currency.format(discountAmount);
  finalTotalElement.textContent = currency.format(Math.max(finalTotal, 0));
}

addItemButton.addEventListener("click", () => {
  createItemRow("New item", 1, 0);
});

taxInput.addEventListener("input", calculateInvoice);
discountInput.addEventListener("input", calculateInvoice);

printButton.addEventListener("click", () => {
  window.print();
});

createItemRow("Website Design", 1, 500);
createItemRow("Hosting Service", 1, 100);