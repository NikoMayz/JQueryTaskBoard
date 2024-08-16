// Retrieve tasks from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to generate a unique task ID
function generateTaskId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Function to create a task card
function createTaskCard(task) {
    const card = $('<div>').addClass('card mb-3').attr('id', 'task-' + task.id);
    const cardHeader = $('<div>').addClass('card-header').text(task.title);
    const cardBody = $('<div>').addClass('card-body');

    // Append description
    cardBody.append($('<p>').addClass('card-text').text('Description: ' + task.description));

    // Format and append due date
    const dueDateText = 'Due Date: ' + task.dueDate;
    cardBody.append($('<p>').addClass('card-text').text(dueDateText));

    // Append progress
    cardBody.append($('<p>').addClass('card-text').text('Progress: ' + task.progress));

    const cardFooter = $('<div>').addClass('card-footer');
    const deleteButton = $('<button>').addClass('btn btn-danger delete-task').text('Delete');
    deleteButton.on("click", handleDeleteTask);
    cardFooter.append(deleteButton);

    // Apply conditional styling based on the due date
    if (task.dueDate && task.progress !== "Completed") {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "YYYY-MM-DD");

        // If the task is due today, make the card yellow; if it is overdue, make it red
        if (now.isSame(taskDueDate, "day")) {
            card.addClass("bg-warning text-white");
        } else if (now.isAfter(taskDueDate)) {
            card.addClass("bg-danger text-white");
            deleteButton.addClass("border-light");
        }
    }

    card.append(cardHeader, cardBody, cardFooter);
    return card;
}

// Function to render the task list
function renderTaskList() {
    $('.lane .card-body').empty(); // Clear existing tasks
    taskList.forEach(function (task) {
        if (task.title.trim() !== '' && task.description.trim() !== '') {
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
        }
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $('[name="task-title"]').val().trim();
    let description = $('[name="task-description"]').val().trim();
    let dueDate = $('[name="due-date"]').val();

    if (title === '' || description === '') {
        alert('Please fill out all fields.');
        return;
    }

    let newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        progress: 'Not Yet Started'
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();

    // Clear form fields
    $('[name="task-title"]').val('');
    $('[name="task-description"]').val('');
    $('[name="due-date"]').val('');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();
    let taskCard = $(event.target).closest('.card');
    let taskId = taskCard.attr('id').replace('task-', '');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let droppedTaskCard = ui.draggable;
    let taskId = droppedTaskCard.attr('id').replace('task-', '');
    let taskIndex = taskList.findIndex(task => task.id === taskId);

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
        renderTaskList();
    } else {
        console.error('Dropped task not found!');
    }
}

// Document ready function
$(document).ready(function () {
    renderTaskList();

    $('#generateTaskIdBtn').on('click', handleAddTask);
    $('.swim-lanes .card-body').on('click', '.delete-task', handleDeleteTask);

    $('.lane .card-body').droppable({
        accept: '.card',
        drop: handleDrop
    });

    // Initialize date picker (assumes you have a date picker plugin loaded)
    $('[name="due-date"]').datepicker();
});
