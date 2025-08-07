let transactions = [
  // {
  //     id:0,
  //     date:"",
  //     transName:"expName",
  //     nature:"0",
  //     value:"100",
  //     desc:""
  // },
  // {
  //     id:1,
  //     date:"",
  //     transName:"incName",
  //     nature:"1",
  //     value:"100",
  //     desc:""
  // }
];
let incomeValue = 0;
let expenseValue = 0;
let profitValue = 0;

function calculation() {
  incomeValue = transactions
    .filter((val) => val.nature === "1")
    .reduce((val, arr) => (arr += parseFloat(val.value)), 0);
  console.log("Income Value", incomeValue);
  expenseValue = transactions
    .filter((val) => val.nature === "0")
    .reduce((val, arr) => (arr += parseFloat(val.value)), 0);
  console.log("expense value", expenseValue);
}

// button and view list
let btnAdd = document.getElementById("btn-add");
let viewList = document.getElementById("view-list");

// span list of income,expense and profit mention the total value of each span
let incomeSpan = document.getElementById("income-value");
let expenseSpan = document.getElementById("expense-value");
let profitSpan = document.getElementById("profit-value");

let updateStatus = false;

incomeSpan.innerText = incomeValue;
expenseSpan.innerText = expenseValue;
profitSpan.innerText = profitValue;

// Input Value
let tranactionName = document.getElementById("trans-name");
let selectNature = document.getElementById("select-nature");
let amount = document.getElementById("amount");
let description = document.getElementById("desc-name");

// message
let tranactionNameMsg = document.getElementById("trans-name-msg");
let selectNatureMsg = document.getElementById("select-nature-msg");
let amountMsg = document.getElementById("amount-msg");
let decsNameMsg = document.getElementById("desc-name-msg");
let btnAddMsg = document.getElementById("btn-add-msg");

// Filter the Transaction
let all = document.getElementById("all");
let income = document.getElementById("inc");
let expense = document.getElementById("exp");

all.addEventListener("click", () => {
  all.value = 1;
  income.value = 0;
  expense.value = 0;
  all.setAttribute("checked", "");
  expense.removeAttribute("checked");
  income.removeAttribute("checked");
  fetchData();
});
income.addEventListener("click", () => {
  all.value = 0;
  income.value = 1;
  expense.value = 0;
  income.setAttribute("checked", "");
  expense.removeAttribute("checked");
  all.removeAttribute("checked");
  filterData(1);
});
expense.addEventListener("click", () => {
  all.value = 0;
  income.value = 0;
  expense.value = 1;
  expense.setAttribute("checked", "");
  income.removeAttribute("checked");
  all.removeAttribute("checked");
  filterData(0);
});

// create
btnAddMsg.classList.remove("shown");
// Validation for the Input Elements
tranactionName.addEventListener("blur", function () {
  CheckValue(
    tranactionName.value,
    tranactionNameMsg,
    "Please Enter the transction name"
  );
});
selectNature.addEventListener("blur", function () {
  CheckValue(
    selectNature.value,
    selectNatureMsg,
    "Please Select the nature name"
  );
});
amount.addEventListener("blur", function () {
  CheckValue(amount.value, amountMsg, "Please Enter the Amount");
});
description.addEventListener("blur", function () {
  CheckValue(description.value, decsNameMsg, "Please Enter the Desc");
});

// Create Transaction of any one it may Income or Expense
btnAdd.addEventListener("click", () => {
  let transName = tranactionName.value;
  let nature = selectNature.value;
  let value = amount.value;
  let desc = description.value;
  if (transName === "" || nature === "" || value === "" || desc === "") {
    setInterval(() => {
      btnAddMsg.classList.remove("shown");
      btnAddMsg.innerText = "";
    }, 1500);
    btnAddMsg.classList.add("shown","notify");
    btnAddMsg.innerText = "Please Fill all details";
  } else {
    let transaction = {
      id: transactions[transactions?.length - 1]?.id + 1 || 1,
      date: Date.now(),
      transName,
      nature,
      value,
      desc,
      status: "Active",
    };
    console.log("transction", transaction);
    // addNewTrans(tranactionName)
    checkData(transaction);
    clearData();
  }
});
// General validation
function CheckValue(val, varName, msg) {
  if (val === "") {
    varName.classList.add("shown");
    varName.innerText = msg || "Invalid";
    // console.log("varname",varName);
  } else {
    varName.classList.remove("shown");
  }
}
function checkData(obj) {
  console.log("check obj", obj);

  let selectedData = transactions.findIndex(
    (trans) => trans.transName === obj.transName
  );
  console.log("seletededData", selectedData);
  if (selectedData < 0) {
    addNewTrans(obj);
  } else {
    // alert("is there",selectedData)
    updateTrans(selectedData, obj, updateStatus);
  }
  console.log(transactions);
}
function addNewTrans(newObj) {
  transactions.push(newObj);
  console.log(transactions);
  fetchData();
}
function updateTrans(index, obj, update) {
  const oldObj = transactions[index];
  const newObj = obj;
  if (update) {
    transactions[index] = newObj;
    updateStatus = false;
  } else {
    if (oldObj.nature === newObj.nature) {
      updateValue = parseFloat(oldObj.value) + parseFloat(newObj.value);
      transactions[index] = { ...transactions[index], value: updateValue };
    } else {
      updateValue = parseFloat(oldObj.value) - parseFloat(newObj.value);
      if (updateValue < 0) {
        transactions[index] = {
          ...transactions[index],
          nature: newObj.nature,
          value: updateValue / -1,
        };
      } else {
        transactions[index] = { ...transactions[index], value: updateValue };
      }
    }
  }
  fetchData();
}
// view
function fetchData() {
  viewList.innerHTML = "";
  transactions.forEach((val, index) => {
    renderListValue(val, index);
    calculation();
  });
}
fetchData();

function renderListValue(obj, index) {
  let listContent = document.createElement("li");
  const indexValue = index + 1 || 1;
  let nature = "";
  let valMark = "";
  if (obj.nature === "0") {
    nature = "Expense";
    valMark = "red";
  } else {
    nature = "Income";
    valMark = "green";
  }
  listContent.innerHTML = `
            <li>
            <div class="list-content">
            <div class="list-main-content">
            <span>${indexValue}</span>
            <strong>${obj?.transName}</strong>
            <span>${nature}</span>
            <span>${obj?.desc}</span>
            <span class=${valMark}>Rs.${obj.value}</span>
            </div>
            <div>
            <button class="btn-edit btn" onClick="editTransaction(${obj.id})">Edit</button>
            <button class="btn-delete btn" onClick="deleteTransaction(${obj.id})">Delete</button>
            </div>
            </div>
            </li>
            `;
  viewList.appendChild(listContent);
}
// Edit
function editTransaction(id) {
  selectingData = transactions.findIndex((val) => val.id === id);
  updating(selectingData);
  fetchData();
}

// Delete
function deleteTransaction(id) {
  transactions = transactions.filter((val) => val.id != id);
  fetchData();
}

//other Utilities
function clearData() {
  (tranactionName.value = ""),
    (selectNature.value = ""),
    (amount.value = ""),
    (description.value = "");
}
function updating(index) {
  (tranactionName.value = transactions[index].transName),
    (selectNature.value = transactions[index].nature),
    (amount.value = transactions[index].value),
    (description.value = transactions[index].desc);
  updateStatus = true;
}

function filterData(filter) {
  viewList.innerHTML = "";
  if (filter === 1) {
    const incomeData = transactions.filter((trans) => trans.nature == filter);
    console.log(incomeData);

    if (incomeData.length > 0) {
      incomeData.forEach((val, index) => {
        renderListValue(val, index);
      });
    } else {
      viewList.innerHTML = "";
    }
  } else {
    const expenseData = transactions.filter((trans) => {
      console.log("expense", filter, trans.nature, trans.nature == filter);
      return trans.nature == filter;
    });
    console.log("expense", expenseData);
    console.log("trans", transactions);

    if (expenseData.length > 0) {
      expenseData.forEach((val, index) => {
        renderListValue(val, index);
      });
    } else {
      viewList.innerHTML = "";
    }
  }
}
