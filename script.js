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
    .filter((val) => val?.nature === "1")
    .reduce((acc, cv) => (acc += parseFloat(cv.value)), 0);
  expenseValue = transactions
    .filter((val) => val?.nature === "0")
    .reduce((acc, cv) => (acc += parseFloat(cv.value)), 0);
  profitValue = incomeValue - expenseValue;
  incomeSpan.innerText = incomeValue;
  expenseSpan.innerText = expenseValue;
  profitSpan.innerText = profitValue;
}

function setLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function getLocalStorage() {
  transactions = JSON.parse(localStorage.getItem("transactions"));
  if(transactions ===null){
    transactions =[];
  }
  console.log(transactions);
}

// button and view list
let btnAdd = document.getElementById("btn-add");
let btnReset = document.getElementById("btn-reset");
let viewList = document.getElementById("view-list");

// span list of income,expense and profit mention the total value of each span
let incomeSpan = document.getElementById("income-value");
let expenseSpan = document.getElementById("expense-value");
let profitSpan = document.getElementById("profit-value");

let updateStatus = false;
let ExistingDataId = 0;
let ExistingDataIndex = null;
let currentId = transactions[transactions.length-1]; 

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
// ===============================================================

// Validation for the Input Elements
btnAddMsg.classList.remove("shown");

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
// ============================================================

// Create Transaction of any one it may Income or Expense
btnAdd.addEventListener("click", () => {
  let transName = tranactionName.value;
  let nature = selectNature.value;
  let value = amount.value;
  let desc = description.value;
  if (transName === "" || nature === "" || value === "" || desc === "") {
    setTimeout(() => {
      btnAddMsg.classList.remove("shown");
      btnAddMsg.innerText = "";
    }, 1500);
    btnAddMsg.classList.add("shown", "notify");
    btnAddMsg.innerText = "Please Fill all details";
  } else {
    console.log("Transaction Id gen",transactions)
    let transaction = {
      id:parseInt(updateStatus?ExistingDataId:(transactions?.length===0?0:(transactions?.length))+1),
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

btnReset.addEventListener("click",function(){
  alert("working");
  clearData();
})

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

  if(!obj) throw new Error("No data add");
  if (!updateStatus) {
    addNewTrans(obj);
  } else {
    // alert("is there",selectedData)
    updateTrans(ExistingDataIndex, obj, updateStatus);
  }
  console.log(transactions);
}
function addNewTrans(newObj) {
  transactions.push(newObj);
  setLocalStorage();
  console.log("add new", transactions);
  fetchData();
}
function updateTrans(index, obj, update) {
  console.log("update",index,obj,update)
  const oldObj = transactions[index];
  const newObj = obj;
  if (update) {
    transactions[index] = {...newObj};
    console.log("updaated true",transactions[index])
    setLocalStorage();
    updateStatus = false;
    ExistingDataId =0;
    ExistingDataIndex =null;
  } else {
  //   if (oldObj.nature === newObj.nature) {
  //     updateValue = parseFloat(oldObj.value) + parseFloat(newObj.value);
  //     transactions[index] = { ...transactions[index], value: updateValue };
  //   } else {
  //     updateValue = parseFloat(oldObj.value) - parseFloat(newObj.value);
  //     if (updateValue < 0) {
  //       transactions[index] = {
  //         ...transactions[index],
  //         nature: newObj.nature,
  //         value: updateValue / -1,
  //       };
  //     } else {
  //       transactions[index] = { ...transactions[index], value: updateValue };
  //     }
  //   }
  // }
  console.log("updated False")
}
  fetchData();
}
// view
function fetchData() {
  viewList.innerHTML = "";
  getLocalStorage();
  transactions?.forEach((val, index) => {
    renderListValue(val, index);
    calculation();
  });
  // setLocalStorage();
}
fetchData();

function renderListValue(obj, index) {
  let listContent = document.createElement("tr");
  listContent.classList.add("row-data", `row-${obj?.id}`);
  listContent.id = obj?.id;
  listContent.setAttribute("data-action", "view");
  listContent.setAttribute("data-id", `${obj?.id}`);
  const indexValue = index + 1 || 1;
  let nature = "";
  let valMark = "";
  if (obj?.nature === "0") {
    nature = "Expense";
    valMark = "red";
  } else {
    nature = "Income";
    valMark = "green";
  }
  listContent.innerHTML = `
            <td>${indexValue}</td>
            <td>${obj?.transName}</td>
            <td>${nature}</td>
            <td class="desc" title="${obj?.desc}">${obj?.desc}</td>
            <td class=${valMark}>Rs.${obj?.value}</td>
            <td class="action-list-area">
            <span class="action-list"> 
            <button type="button" class="btn-edit action-btn" data-action="edit" data-id="${obj?.id}">Edit</button>
            <button type="button" class="btn-delete action-btn" data-action="delete" data-id="${obj?.id}">Delete</button>
            </span>
            </td>
            `;
  viewList.appendChild(listContent);
}
viewList.addEventListener("click", handleRowAction);

function handleRowAction(event) {
  let target = event.target;
  const action = target.dataset.action;
  const rowId = target.dataset.id;
  console.log("actionClicked", action, rowId);
  if (action === "edit") {
    editTransaction(rowId);
  } else if (action === "delete") {
    deleteTransaction(rowId);
  } else if (action === "view") {
    viewTransition(rowId);
  }
}
// view
function viewTransition(id) {
  console.log("Row Id", id);
}
// Edit
function editTransaction(id) {
  selectingData = transactions.findIndex((val) => val.id === parseInt(id));
  ExistingDataIndex = selectingData
  console.log("edited", selectingData);
  ExistingDataId = id;
  updating(selectingData);
  fetchData();
}

// Delete
function deleteTransaction(id) {
  transactions = transactions.filter((val) => val.id != parseInt(id));
  setLocalStorage();
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
// filter
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
// Generate Id

function generatedId(status){
  if(status){
    let createId = currentId;
    currentId++;
    return createId;
  }else{
    let id = transactions[transactions.length-1].id
    console.log("current Id ",id);
    return id;
  }
}