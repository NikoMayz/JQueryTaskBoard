// Function to generate a unique task ID
function generateTaskId() {
    let nextId = Date.now().toString(2) + Math.random().toString(2).substring(2);
    // localStorage.setItem("nextId", JSON.stringify(nextId + 1));
    return nextId;
}

// Function to create a task card
function createTaskCard(task) {
    const card = $('<div>').addClass('card mb-3').attr('id', 'task-' + task.id);
    const cardHeader = $('<div>').addClass('card-header').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    cardBody.append($('<p>').addClass('card-text').text('Description: ' + task.description));
    const dueDateText = 'Due Date: ' + task.dueDate.datepicker;
    cardBody.append($('<p>').addClass('card-text').text(dueDateText));
    cardBody.append($('<p>').addClass('card-text').text('Progress: ' + task.progress));
    const cardFooter = $('<div>').addClass('card-footer');
    const deleteButton = $('<button>').addClass('btn btn-danger delete-task').text('Delete');
    deleteButton.click(function () {
        deleteTask(task.id);
    });
    cardFooter.append(deleteButton);
    card.append(cardHeader, cardBody, cardFooter);
    return card;
}

// Function to render the task list and make cards draggable
function renderTaskList(taskList) {
    $('.lane .card').remove();
    taskList.forEach(function (task) {
        if (task.title.trim() === '' || task.description.trim() === '') {
            return;
        }
        let card = createTaskCard(task);
        card.draggable({
            revert: 'invalid',
            stack: '.card',
            cursor: 'move',
            containment: '.swim-lanes'
        });
        switch (task.progress) {
            case 'Not Yet Started':
                $('#to-do .card-body').append(card);
                break;
            case 'In Progress':
                $('#in-progress .card-body').append(card);
                break;
            case 'Completed':
                $('#done .card-body').append(card);
                break;
            default:
                break;
        }
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    console.log("!",event)
    // event.preventDefault();
    let title = $('[name="task-title"]').val().trim();
    let description = $('[name="task-description"]').val().trim();
    let dueDate = $('[name="due-date"]').val();

    console.log("above the if")

    if (title === '' || description === '') {
        console.log("inside the if")
        alert('Please fill out all fields.');
        return;
    }
    console.log("below the if")

    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        progress: 'Not Yet Started'
    };
    if (!Array.isArray(taskList)) {
        taskList = [];
    }
    let taskList = JSON.parse(localStorage.getItem("tasks"));
        taskList.push (newTask)

    console.log("*", taskList);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    //localStorage.setItem("nextId", JSON.stringify(nextId + 1));
    // renderTaskList(taskList);
    // $('[name="task-title"]').val('');
    // $('[name="task-description"]').val('');
    // $('[name="due-date"]').val('');
    debugger;

}

// Function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    let taskCard = $(event.target).closest('.card');
    let taskId = taskCard.attr('id').replace('task-', '');
    let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList(taskList);
    } else {
        console.error('Task not found!');
    }
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let droppedTaskCard = ui.draggable;
    let taskId = droppedTaskCard.attr('id').replace('task-', '');
    let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
        let newStatusLane = $(event.target).closest('.lane').attr('id');
        let newProgress = '';
        switch (newStatusLane) {
            case 'to-do':
                newProgress = 'Not Yet Started';
                break;
            case 'in-progress':
                newProgress = 'In Progress';
                break;
            case 'done':
                newProgress = 'Completed';
                break;
            default:
                break;
        }
        taskList[taskIndex].progress = newProgress;
        if (newProgress === 'Completed') {
            droppedTaskCard.removeClass('bg-warning bg-danger').css('background-color', 'white');
        }
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList(taskList);
    } else {
        console.error('Dropped task not found!');
    }
}

$(document).ready(function () {
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    if (!Array.isArray(taskList)) {
        taskList = [];
    }
    renderTaskList(taskList);
    $('#generateTaskIdBtn').on('click', handleAddTask);
    $('.swim-lanes .card-body').on('click', '.delete-task', handleDeleteTask);
    $('.lane .card-body').droppable({
        accept: '.card',
        drop: handleDrop
    });
    // $('[name="due-date"]').datepicker();
});


// // Retrieve tasks and nextId from localStorage
// let taskList = JSON.parse(localStorage.getItem("tasks"));

// // Check if taskList is null or not an array, if so, initialize it as an empty array

// if (!Array.isArray(taskList)) {
//     taskList = [];
// }

// // Create a new task object from user input

// let newTask = {
//     title: $('[name="task-title"]').val(),
//     description: $('[name="task-description"]').val(),
//     dueDate: $('[name="due-date"]').val(),
//     progress: "Not Yet Started"
// };

// // Add the new task to the task list

// taskList.push(newTask);

// // Save the updated task list back to localStorage

// localStorage.setItem("tasks", JSON.stringify(taskList));

// // Debugging: Log the newly added task and the updated task list

// console.log("Task added:", newTask);
// console.log("Updated task list:", taskList);




// // let nextId = JSON.parse(localStorage.getItem("nextId"));
// // Retrieve nextId from localStorage
// let nextId = JSON.parse(localStorage.getItem("nextId"));

// // Check if nextId is null or undefined, if so, initialize it to 1
// if (!nextId) {
//     nextId = 1;
// }

// // Function to generate a unique task ID
// function generateTaskId() {
//     // Generate unique ID using nextId
//     let taskId = nextId++;

//     // Save updated nextId back to localStorage
//     localStorage.setItem("nextId", JSON.stringify(nextId));

//     // Return the generated task ID
//     return taskId;
// }

// // Usage example:
// let taskId = generateTaskId();
// console.log("Generated Task ID:", taskId);


// // Todo: create a function to generate a unique task id

// // function generateTaskId() {
// //     let nextId = JSON.parse(localStorage.getItem("nextId"))||1;
// //     localStorage.setItem("nextId", JSON.stringify(nextId + 1));
// //     return nextId = Date.now + Math.random();

// // }

// // Todo: create a function to create a task card

// function createTaskCard(task) {
//     // Create card element
//     let card = $('<div>').addClass('card mb-3').attr('id', 'task-' + task.id);

//     // Create card header
//     let cardHeader = $('<div>').addClass('card-header').text(task.title);

//     // Create card body
//     let cardBody = $('<div>').addClass('card-body');

//     // Add task description
//     cardBody.append($('<p>').addClass('card-text').text('Description: ' + task.description));

//     // Add task due date
//     let dueDateText = 'Due Date: ' + task.dueDate;
//     if (isTaskNearDeadline(task)) {
//         dueDateText += ' (Nearing Deadline)';
//         card.removeClass('bg-danger').addClass('bg-warning');
//     } else if (isTaskOverdue(task)) {
//         dueDateText += ' (Overdue)';
//         card.removeClass('bg-warning').addClass('bg-danger');
//     } else {
//         // Remove any previously added background color classes
//         card.removeClass('bg-warning bg-danger');
//     }
//     cardBody.append($('<p>').addClass('card-text').text(dueDateText));

//     // Add task progress
//     cardBody.append($('<p>').addClass('card-text').text('Progress: ' + task.progress));

//     // Create card footer
//     let cardFooter = $('<div>').addClass('card-footer');

//     // Create delete button
//     let deleteButton = $('<button>').addClass('btn btn-danger delete-task').text('Delete');
//     deleteButton.click(function() {
//         deleteTask(task.id);
//     });

//     // Append delete button to card footer
//     cardFooter.append(deleteButton);

//     // Append header, body, and footer to card
//     card.append(cardHeader, cardBody, cardFooter);

//     return card;
// }


// // Todo: create a function to render the task list and make cards draggable
// function renderTaskList(taskList) {
//     // Clear existing task cards
//     $('.lane .card').remove();

//     // Iterate through the task list
//     taskList.forEach(function(task) {
//         // Check if task title or description are empty
//         if (task.title.trim() === '' || task.description.trim() === '') {
//             // Skip creating task card for tasks with empty titles or descriptions
//             return;
//         }

//         // Create task card
//         let card = createTaskCard(task);

//         // Make card draggable
//         card.draggable({
//             revert: 'invalid',
//             stack: '.card',
//             cursor: 'move',
//             containment: '.swim-lanes'
//         });

//         // Append card to the appropriate column based on task progress
//         switch (task.progress) {
//             case 'Not Yet Started':
//                 $('#to-do .card-body').append(card);
//                 break;
//             case 'In Progress':
//                 $('#in-progress .card-body').append(card);
//                 break;
//             case 'Completed':
//                 $('#done .card-body').append(card);
//                 break;
//             default:
//                 break;
//         }
//     });
// }

// // Todo: create a function to handle adding a new task
// // Function to handle adding a new task

// function handleAddTask(event) {
//     // Prevent the default form submission behavior
//     event.preventDefault();

//     // Gather user inputs
//     let title = $('[name="task-title"]').val().trim();
//     let description = $('[name="task-description"]').val().trim();
//     let dueDate = $('[name="due-date"]').val();

//     // Check if any of the inputs are empty
//     if (title === '' || description === '') {
//         alert('Please fill out all fields.');
//         return;
//     }

//     // Create a new task object
//     let newTask = {
//         id: generateTaskId(), // Assuming you have a function to generate a unique task ID
//         title: title,
//         description: description,
//         dueDate: dueDate,
//         progress: 'Not Yet Started'
//     };

//     // Add the new task to the task list
//     taskList.push(newTask);

//     // Save the updated task list to LocalStorage
//     localStorage.setItem('tasks', JSON.stringify(taskList));

//     // Render the updated task list on the task board
//     renderTaskList(taskList);

//     // Clear the form inputs
//     $('[name="task-title"]').val('');
//     $('[name="task-description"]').val('');
//     $('[name="due-date"]').val(''); // You may want to set a default value or clear it based on your requirements
// }

// // Todo: create a function to handle deleting a task
// // Function to handle deleting a task
// function handleDeleteTask(event) {
//     // Prevent the default button click behavior
//     event.preventDefault();

//     // Find the task card element that contains the delete button
//     let taskCard = $(event.target).closest('.card');

//     // Extract the task ID from the task card element
//     let taskId = taskCard.attr('id').replace('task-', '');

//     // Find the index of the task with the matching ID in the task list
//     let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));

//     // Check if the task index is valid
//     if (taskIndex !== -1) {
//         // Remove the task from the task list
//         taskList.splice(taskIndex, 1);

//         // Save the updated task list to LocalStorage
//         localStorage.setItem('tasks', JSON.stringify(taskList));

//         // Render the updated task list on the task board
//         renderTaskList(taskList);
//     } else {
//         console.error('Task not found!');
//     }
// }


// // Todo: create a function to handle dropping a task into a new status lane
// // Function to handle dropping a task into a new status lane
// function handleDrop(event, ui) {
//     // Find the dropped task card element
//     let droppedTaskCard = ui.draggable;

//     // Extract the task ID from the dropped task card element
//     let taskId = droppedTaskCard.attr('id').replace('task-', '');

//     // Find the index of the task with the matching ID in the task list
//     let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));

//     // Check if the task index is valid
//     if (taskIndex !== -1) {
//         // Determine the new status lane based on the drop target
//         let newStatusLane = $(event.target).closest('.lane').attr('id');

//         // Update the progress status of the dropped task based on the new status lane
//         let newProgress = '';
//         switch (newStatusLane) {
//             case 'to-do':
//                 newProgress = 'Not Yet Started';
//                 break;
//             case 'in-progress':
//                 newProgress = 'In Progress';
//                 break;
//             case 'done':
//                 newProgress = 'Completed';
//                 break;
//             default:
//                 break;
//         }

//         // Update the progress status of the task in the task list
//         taskList[taskIndex].progress = newProgress;

//         // Reset background color of the task card to white if moved to "Done" lane
//         if (newProgress === 'Completed') {
//             droppedTaskCard.removeClass('bg-warning bg-danger').css('background-color', 'white');
//         }

//         // Save the updated task list to LocalStorage
//         localStorage.setItem('tasks', JSON.stringify(taskList));

//         // Render the updated task list on the task board
//         renderTaskList(taskList);
//     } else {
//         console.error('Dropped task not found!');
//     }
// }


// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
// $(document).ready(function () {
//     // Render the task list when the page loads
//     renderTaskList(taskList);

//     // Add event listeners
//     $('#generateTaskIdBtn').on('click', handleAddTask);
//     $('.swim-lanes .card-body').on('click', '.delete-task', handleDeleteTask);

//     // Make lanes droppable
//     $('.lane .card-body').droppable({
//         accept: '.card',
//         drop: handleDrop
//     });

//     // Make the due date field a date picker
//     $('[name="due-date"]').datepicker();
// });


