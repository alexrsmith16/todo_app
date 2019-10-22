let listsArray = [];
const LISTS_CONTAINER = document.getElementById("lists_container");
let tx = document.getElementsByTagName('textarea');

if (localStorage.getItem("lists") === null) {
    localStorage.setItem("lists", JSON.stringify([]));
}
else {
    listsArray = JSON.parse(localStorage["lists"]);
    console.log(listsArray);
    for (let i of listsArray) {
        writeList(JSON.parse(localStorage["list_" + i]));
    }
}

function watchTextArea() {
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
        tx[i].addEventListener("input", OnInput, false);
        // tx[i].addEventListener("keydown", textAreaKey);
    }
}
watchTextArea();

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function createList(name, color = "#688bff") {
    let list = {};
    list.id = listsArray.length === 0 ? 0 : ++listsArray[listsArray.length - 1];
    list.name = name;
    list.color = color;
    list.listItemsArray = [];
    list.listCompletedItems = [];
    writeList(this);
    localStorage.setItem("list_" + list.id, JSON.stringify(list));
    localStorage["lists"] = JSON.stringify(listsArray.push(list.id));
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
    console.log("close");
    ADD_MODAL.style.display = "none";
}

function writeList(list) {
    let newListElement =`
        <div id="list_${list.id}" class="col-4">
            <div>
                <h3>${list.name}</h3>
                <ul>
                    <li><textarea id="add_item_list_${list.id}" class="col-12" placeholder="new list item..." rows="1" onkeydown="textAreaKey(event)"></textarea></li>
                </ul>
            </div>
        </div>
        `;
    LISTS_CONTAINER.insertAdjacentHTML("beforeend", newListElement);
    watchTextArea();
}

function deleteList(list) {
    listsArray = listsArray.filter(i => i !== list.id);
    localStorage["lists"] = listsArray;
    localStorage.removeItem("list_" + list.id);
}

function textAreaKey(e) {
    if (e.which === 13) {
        console.log(e.target);
        addItem(e.target)
    }
}

function addItem(element) {

}