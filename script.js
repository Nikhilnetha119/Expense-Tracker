document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");

    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const expenseName = document.getElementById("expenseName").value;
        const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);

        if (!isNaN(expenseAmount)) {
            const expenseItem = createExpenseItem(expenseName, expenseAmount);
            expenseList.appendChild(expenseItem);

            // Save to local storage
            saveExpenseToLocalStorage(expenseName, expenseAmount);

            // Clear form inputs
            document.getElementById("expenseName").value = "";
            document.getElementById("expenseAmount").value = "";
        } else {
            alert("Please enter a valid expense amount.");
        }
    });

    // Load expenses from local storage on page load
    loadExpensesFromLocalStorage();

    function createExpenseItem(name, amount) {
        const listItem = document.createElement('li');
        listItem.classList.add("list-group-item");

        const expenseDetails = document.createElement('span');
        expenseDetails.textContent = `${name} - $${amount.toFixed(2)}`;

        const editButton = createButton("Edit", "btn-primary", editExpense);
        const deleteButton = createButton("Delete", "btn-danger", deleteExpense);

        listItem.appendChild(expenseDetails);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    }

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add("btn", className, "btn-sm", "mx-1");
        button.addEventListener('click', onClick);
        return button;
    }

    function saveExpenseToLocalStorage(name, amount) {
        const expenses = getExpensesFromLocalStorage();
        expenses.push({ name, amount });
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function getExpensesFromLocalStorage() {
        const expensesJSON = localStorage.getItem("expenses");
        return expensesJSON ? JSON.parse(expensesJSON) : [];
    }

    function loadExpensesFromLocalStorage() {
        const expenses = getExpensesFromLocalStorage();
        expenses.forEach(expense => {
            const { name, amount } = expense;
            const expenseItem = createExpenseItem(name, amount);
            expenseList.appendChild(expenseItem);
        });
    }

    function deleteExpense() {
        const listItem = this.parentElement;
        const expenseDetails = listItem.querySelector('span').textContent;
        const [name] = expenseDetails.split(' - ');

        const expenses = getExpensesFromLocalStorage();
        const updatedExpenses = expenses.filter(expense => expense.name !== name);
        localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

        listItem.remove();
    }

    function editExpense() {
        const listItem = this.parentElement;
        const expenseDetails = listItem.querySelector('span').textContent;
        const [name, amountText] = expenseDetails.split(' - ');
        const amount = parseFloat(amountText.replace('$', ''));

        const newName = prompt("Enter new name:", name);
        const newAmount = parseFloat(prompt("Enter new amount:", amount));

        if (newName && !isNaN(newAmount)) {
            const expenses = getExpensesFromLocalStorage();
            const updatedExpenses = expenses.map(expense => {
                if (expense.name === name && expense.amount === amount) {
                    expense.name = newName;
                    expense.amount = newAmount;
                }
                return expense;
            });

            localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

            // Update the UI
            listItem.querySelector('span').textContent = `${newName} - $${newAmount.toFixed(2)}`;
        } else {
            alert("Invalid input. Please try again.");
        }
    }
});
