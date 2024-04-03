// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
console.log ("tasklist: ", taskList)
if (taskList==null){

    console.log ("tasklistnot: ", taskList)
    const task=[]
    localStorage.setItem("tasks",JSON.stringify(task))

}

// let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id

function generateTaskId() {
    let nextId = JSON.parse(localStorage.getItem("nextId"))||1;
    localStorage.setItem("nextId", JSON.stringify(nextId + 1));
    return nextId = Date.now + Math.random();

}
// Event listener for button click

document.getElementById("generateTaskIdBtn").addEventListener("click", function() {
    let taskId = generateTaskId();
    console.log("Generated Task ID:", taskId);
});


// Todo: create a function to create a task card
function createTaskCard() {
    let formData=$("#formModal").serializeArray()
    console.log("form", form)
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    console.log ("tasklist: ", taskList)
    if (taskList==null){

        console.log ("tasklistnot: ", taskList)
        const task=[]
        localStorage.setItem("tasks",JSON.stringify(task))

    }
    else {
        taskList.push(formData)
        localStorage.setItem("tasks",JSON.stringify(taskList))

    }

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
