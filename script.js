const LISTS_CONTAINER = document.getElementById("lists_container");
let tx = document.getElementsByTagName('textarea');

if (localStorage.getItem("lists") === null) {
    localStorage.setItem("lists", JSON.stringify([]));
}
else {
    writeEachList();
}

function watchTextArea() {
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener("input", OnInput, false);
        tx[i].addEventListener("keyup", textAreaKey);
    }
}
watchTextArea();

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function createList(name, color = "#688bff") {
    let listsArray = JSON.parse(localStorage.getItem("lists"));
    let list = {};
    list.id = listsArray.length === 0 ? 0 : listsArray[listsArray.length - 1] + 1;
    list.name = name;
    list.color = color;
    list.listItemsArray = [];
    list.listCompletedItems = [];
    writeList(list);
    localStorage.setItem("list_" + list.id, JSON.stringify(list));
    listsArray.push(list.id);
    localStorage.setItem("lists", JSON.stringify(listsArray));
}

const ADD_MODAL = document.getElementById("add_list_modal");

function openAddListModal() {
    ADD_MODAL.style.display = "flex";
}

function addList() {
    const LIST_NAME = document.getElementById("list_name");
    let name = LIST_NAME.value;
    createList(name);
    LIST_NAME.value = "";
    ADD_MODAL.style.display = "none";
}

document.getElementById("list_name").addEventListener("keydown", event => event.code === "Enter" ? addList() : "");

function closeModal() {
    ADD_MODAL.style.display = "none";
}

function writeEachList() {
    LISTS_CONTAINER.innerHTML = "";
    let listsArray = JSON.parse(localStorage["lists"]);
    for (let i of listsArray) {
        writeList(JSON.parse(localStorage["list_" + i]));
    }
}

function writeList(list) {
    let newListElement =`
        <div id="list_${list.id}" class="col-4"><div>
            <h2>${list.name}</h2>
            <ul id="list_${list.id}_items" data-id="${list.id}">`;
        for (let i in list.listItemsArray) {
            newListElement += `
            <li data-id="${i}" class="active-item">
                <div class="text-holder">${list.listItemsArray[i]}</div>
                <div class="checkbox-holder">
                    <div type="checkbox" class="checkbox complete"><label onclick="completeItem(event)">&#10003;</label></div>
                    <div type="checkbox" class="checkbox delete"><label onclick="deleteItem(event)">&#65794;</label></div>
                </div>
            </li>`;
        }
        newListElement += `</ul><ul><li><textarea data-id="${list.id}" class="col-12" placeholder="new list item..." rows="1"></textarea></li>`
        for (let i in list.listCompletedItems) {
            newListElement += `<li class="completed-item">${list.listCompletedItems[i]}</li>`;
        }
        newListElement +=`</ul>
        <button data-id="${list.id}" onclick="clearItems(event)">Clear Completed Items</button>
        <button data-id="${list.id}" onclick="deleteList(event)">Delete List</button>
        </div></div>`;
    LISTS_CONTAINER.insertAdjacentHTML("beforeend", newListElement);
    watchTextArea();
}

function textAreaKey(event) {
    if (event.keyCode === 13) {
        addItem(event.target.getAttribute("data-id"), event.target.value);
        event.target.value = "";
    }
}

function addItem(listId, text) {
    let list = JSON.parse(localStorage.getItem("list_" + listId));
    list.listItemsArray.push(text);
    localStorage.setItem("list_" + listId, JSON.stringify(list));
    writeEachList();
}

function completeItem(event) {
    let target = event.target;
    let itemID = target.parentElement.parentElement.parentElement.getAttribute("data-id");
    let listID = target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id");
    let retrievedList = JSON.parse(localStorage.getItem("list_" + listID));
    retrievedList.listCompletedItems.push(retrievedList.listItemsArray.splice(itemID, 1));
    localStorage.setItem("list_" + listID, JSON.stringify(retrievedList));
    writeEachList();
}

function deleteItem(event) {
    let target = event.target;
    let itemID = target.parentElement.parentElement.parentElement.getAttribute("data-id");
    let listID = target.parentElement.parentElement.parentElement.parentElement.getAttribute("data-id");
    let retrievedList = JSON.parse(localStorage.getItem("list_" + listID));
    retrievedList.listItemsArray.splice(itemID, 1);
    localStorage.setItem("list_" + listID, JSON.stringify(retrievedList));
    writeEachList();
}

function clearItems(event) {
    let listID = "list_" + event.target.getAttribute("data-id");
    let list = JSON.parse(localStorage.getItem(listID));
    list.listCompletedItems = [];
    console.log(list);
    localStorage.setItem(listID, JSON.stringify(list));
    writeEachList();
}

function deleteList(event) {
    let listID = parseInt(event.target.getAttribute("data-id"));
    localStorage.removeItem("list_" + listID);
    let lists = JSON.parse(localStorage.getItem("lists"));
    let index = lists.indexOf(listID);
    console.log(index);
    lists.splice(index, 1);
    localStorage.setItem("lists", JSON.stringify(lists));
    writeEachList();
}