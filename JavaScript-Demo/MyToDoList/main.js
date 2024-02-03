// 選取 HTML 中的元素，將其分別存放在對應的變數中
const todoInput = document.querySelector(".input-text");
const addBtn = document.querySelector(".add-btn");
const wrap = document.querySelector(".wrap");
const localStorageKey = "my-todoList";

// 當網頁加載完成時，呼叫 getFromLocalStorage()函式來初始化頁面
/*使用了DOMContentLoaded事件，它會在整個HTML文檔（包括DOM樹和所有資源）完全載入和解析後觸發。換句話說，這個事件表示頁面的基本結構已經可以進行操作。
這個特定的代碼片段的作用是在頁面完全載入後，呼叫getFromLocalStorage。這可以確保當網頁載入時，LocalStorage 中存儲的代辦事項數據會被取出，從而初始化你的代辦事項清單。*/ 
document.addEventListener("DOMContentLoaded", function () {
    getFromLocalStorage();
});
// 或者使用箭頭函式
// document.addEventListener("DOMContentLoaded", () => getFromLocalStorage());

// 為「新增」按鈕添加點擊事件監聽器，當按鈕被點擊時，執行 handleAddTodo function
addBtn.addEventListener("click", handleAddTodo);

// 處理新增代辦事項
function handleAddTodo() {
    // 獲取輸入框的值，去除頭尾空格
    const inputValue = todoInput.value.trim();
     // 如果輸入框不為空，則執行以下操作
    if (inputValue !== "") {
        // 添加代辦事項
        addTodoItem(inputValue);
        // 將代辦事項存儲到LocalStorage
        setToLocalStorage();
        // 清空輸入框
        todoInput.value = "";
    }
}

// 添加代辦事項
function addTodoItem(item) {
    // 建立代辦事項元素
    const divItem = createTodoItemElement(item);
    // 獲取代辦事項元素中的checkbox，並添加點擊事件監聽器
    const checkbox = divItem.querySelector(".checkbox");
    checkbox.addEventListener("click", handleCheckboxClick);
    // 獲取代辦事項元素中的「編輯」按鈕，並添加點擊事件監聽器
    const editBtn = divItem.querySelector(".edit-Btn");
    editBtn.addEventListener("click", handleEditTodo);
    // 獲取代辦事項元素中的「刪除」按鈕，並添加點擊事件監聽器
    const delBtn = divItem.querySelector(".del-Btn");
    delBtn.addEventListener("click", handleDeleteTodo);
    // 把代辦事項元素載入到畫面上
    wrap.append(divItem);
}

// 建立代辦事項元素
function createTodoItemElement(item) {
    // 建立 div 元素，設定其 class 相關屬性
    const divItem = document.createElement("div");
    divItem.classList.add(
        "list-group-item",
        "d-flex",
        "p-2",
        "mb-2",
        "mt-2",
        "ml-2",
        "border",
        "border-dark-subtle",
        "align-items-center"
    );
    // 在 div 元素中插入 HTML，包含checkbox、輸入框和按鈕
    divItem.innerHTML = `<div class="div-Todo bg-body-secondary bg-opacity-25 d-flex align-items-center p-2">
        <input type="checkbox" class="checkbox form-check-input border">
        <input type="text" class="input-Todo form-control .bg-body-secondary bg-opacity-10 m-2 flex-wrap" disabled="true">
    </div>
    <div class="div-Btn mx-auto">
        <button class="edit-Btn btn btn-warning m-auto">Edit</button>
        <button class="del-Btn btn btn-danger">Delete</button>
    </div>`;
    // 取出代辦事項輸入框中的值，將其值是傳入的item (參數)
    const inputTodoContent = divItem.querySelector(".input-Todo");
    
    inputTodoContent.value = item;
    // 回傳代辦事項元素
    return divItem;
}

// 處理checkbox的click事件
function handleCheckboxClick(event) {
    // 取得checkbox元素及其最近的代辦事項元素
    const checkbox = event.target;
    //closest用法: var closestElement = targetElement.closest(selectors);
    //從父層向下尋找子元素
    const divItem = checkbox.closest(".list-group-item");
    // 將代辦事項存儲到LocalStorage
    setToLocalStorage();
}

// 處理編輯代辦事項
function handleEditTodo(event) {
     // 取得觸發事件的按鈕和最近的代辦事項輸入框
    const editBtn = event.target;
    const todoInput = editBtn.closest(".list-group-item").querySelector(".input-Todo");
    // 如果按鈕文字為 "Edit"，則開始編輯代辦事項；否則儲存已編輯的代辦事項
    if (editBtn.textContent === "Edit") {
        startEditingTodo(editBtn, todoInput);
    } else {
        saveEditedTodo(editBtn, todoInput);
    }
    // 將代辦事項存儲到LocalStorage
    setToLocalStorage();
}

// 開始編輯代辦事項的部分
function startEditingTodo(editBtn, todoInput) {
     // 將按鈕的文字改為 "Save"，並修改按鈕的樣式
    editBtn.textContent = "Save";
    editBtn.classList.remove("btn-warning");//橘色
    editBtn.classList.add("btn-success");//綠色
    // 啟用代辦事項輸入框
    todoInput.disabled = false;
}

// 儲存已編輯代辦事項
function saveEditedTodo(editBtn, todoInput) {
    // 將按鈕文字改為 "Edit"，並修改按鈕的樣式
    editBtn.textContent = "Edit";
    editBtn.classList.remove("btn-success");
    editBtn.classList.add("btn-warning");
    // 禁用代辦事項輸入框
    todoInput.disabled = true;
}

// 處理刪除代辦事項
function handleDeleteTodo(event) {
     // 獲取觸發事件的按鈕
    const delBtn = event.target;
    // 如果按鈕的樣式類別中包含 "del-Btn"
    if (delBtn.classList.contains("del-Btn")) {
        // 取出要刪除的代辦事項
        const delItem = delBtn.closest(".list-group-item");
        // 如果有存此代辦事項，則將其移除，並且更新LocalStorage
        if (delItem) {
            delItem.remove();
            setToLocalStorage();
        }
    }
}

// 將代辦事項存儲到LocalStorage
function setToLocalStorage() {
     // 使用 NodeList 的 forEach 方法
     const itemsToLocalStorage = [];
     document.querySelectorAll(".list-group-item").forEach(todoItem => {
        const itemTodoContent = todoItem.querySelector(".input-Todo");
        const checkbox = todoItem.querySelector(".checkbox");
        itemsToLocalStorage.push({
            value: itemTodoContent.value,
            completed: checkbox.checked,
        });
     });
      // 將物件陣列轉換為 JSON 純文字，並儲存到LocalStorage 
      //setItem(keyName, keyValue)
      localStorage.setItem(localStorageKey, JSON.stringify(itemsToLocalStorage));
}

// 從LocalStorage中取代辦事項的JSON
function getFromLocalStorage() {
    // 從LocalStorage取待辦事項的 JSON 純文字，並轉換為JS物件，若不存在則返回空陣列。
    //getItem(keyName)
    const todos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    // 將代辦事項加到頁面
    todos.forEach((item)=>{
        addTodoItem(item.value);
    });
}
