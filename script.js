const LISTS_CONTAINER = document.getElementById("lists_container");
const COLOR_CHOSEN = document.getElementById("color_chosen");
const COLOR_PICKER = document.getElementById("color_picker");
let tx = document.getElementsByTagName('textarea');
let textHolder = document.getElementsByClassName("text-holder");
let colorsArray = ["rgb(232, 160, 200)", "rgb(255, 102, 102)", "rgb(206, 138, 81)",
                    "rgb(206,163,67)", "rgb(135, 185, 89)", "rgb(114, 177, 127)",
                    "rgba(134,194,202)", "rgb(138, 177, 236)", "rgb(187, 164, 255)"];

let colorElements = "";
for (let i in colorsArray) {
    colorElements += `<div data-id="${i}" class="color-item" style="background-color: ${colorsArray[i]}" onclick="closeColors(this)"></div>`;
}
COLOR_PICKER.innerHTML = colorElements;

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
    for (let i of textHolder) {
        i.addEventListener("keyup", updateItem);
    }
}
watchTextArea();

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function createList(name, color) {
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
    COLOR_CHOSEN.style.backgroundColor = colorsArray[0];
}

function openColors() {
    COLOR_PICKER.style.display = "flex";
    COLOR_CHOSEN.style.display = "none";
}

function closeColors(element) {
    COLOR_CHOSEN.style.backgroundColor = element.style.backgroundColor;
    COLOR_CHOSEN.style.display = "block";
    COLOR_PICKER.style.display = "none";
}

function addList() {
    const LIST_NAME = document.getElementById("list_name");
    let name = LIST_NAME.value;
    let color = COLOR_CHOSEN.style.backgroundColor;
    createList(name, color);
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
        <div id="list_${list.id}" class="col-4"><div style="background-color: ${list.color}">
            <h2>${list.name}</h2>
            <ul id="list_${list.id}_items" data-id="${list.id}">`;
        for (let i in list.listItemsArray) {
            newListElement += `
            <li data-id="${i}" class="active-item">
                <div class="text-holder" contenteditable="true">${list.listItemsArray[i]}</div>
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
        <div class="list-buttons">
            <button data-id="${list.id}" onclick="clearItems(event)">Clear Completed Items</button>
            <button data-id="${list.id}" onclick="deleteList(event)">Delete List</button>
        </div>
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

function updateItem(event) {
    let itemID = event.target.parentElement.getAttribute("data-id");
    let listID = "list_" + event.target.parentElement.parentElement.getAttribute("data-id");
    let list = JSON.parse(localStorage.getItem(listID));
    list.listItemsArray[itemID] = event.target.innerText;
    localStorage.setItem(listID, JSON.stringify(list));
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
    localStorage.setItem(listID, JSON.stringify(list));
    writeEachList();
}

function deleteList(event) {
    let listID = parseInt(event.target.getAttribute("data-id"));
    localStorage.removeItem("list_" + listID);
    let lists = JSON.parse(localStorage.getItem("lists"));
    let index = lists.indexOf(listID);
    lists.splice(index, 1);
    localStorage.setItem("lists", JSON.stringify(lists));
    writeEachList();
}