const tasksParagraph = document.querySelector('.js-tasks-paragraph')
const taskNameInput = document.querySelector('.js-task-name-input')
const taskField = document.querySelector('.tasks-container')

let tasksQuantity = 0
let firstTask = false
let isTasksParagraph = false
const complitedTasks = {}

// for debugging
//localStorage.removeItem('tasksList')

const { tasksNamesList, tasksList } = defineData()

updateTaskField()

function defineData() {
  const tasksListStorage = localStorage
    .getItem('tasksList')
  const tasksNamesListStorage = localStorage
    .getItem('tasksNamesList')

  if (tasksListStorage !== '[]' && tasksListStorage !== null) {
    createTasksParagraph()
    const tasksList = JSON
      .parse(tasksListStorage)
    const tasksNamesList = JSON
      .parse(tasksNamesListStorage)

    return { tasksNamesList, tasksList }
  }
  
  return { tasksNamesList: [], tasksList: [] }
}

function createTask() {
  if (!firstTask || !isTasksParagraph) {
    firstTask = true
    createTasksParagraph()
  }

  taskName = taskNameInput.value
  taskNameInput.value = ''

  taskHTML = `
  <div class="task-${taskName} task">
    <input class="js-checkbox-${taskName} checkbox" type="checkbox" 
      onchange="taskDone(this.checked, '${taskName}')">
    <p class="task-name">${taskName}</p>
    <button class="delete-button" onclick="
      removeTask('${taskName}')
      ">
      Delete
    </button>
    <p class="js-task-${taskName}-state-paragraph taskState">
    </p>
  </div>
  `
  tasksList.push({[taskName]: taskHTML})
  tasksNamesList.push(taskName)

  updateTaskField()

  tasksQuantity++
}

function updateTaskField() {
  let html = ''
  for (let i = 0; i < tasksList.length; i++) {
    const currentTaskName = tasksNamesList[i]

    const currentTaskHTML = tasksList[i][currentTaskName]
    html += currentTaskHTML
  }
  
  taskField.innerHTML = html

  updateLocalStorage()
}

function updateLocalStorage() {
  const jsonTasksList = JSON.stringify(tasksList)
  const jsonTasksNamesList = JSON.stringify(tasksNamesList)

  localStorage.setItem('tasksList', jsonTasksList)
  localStorage.setItem('tasksNamesList', jsonTasksNamesList)
}

function createTasksParagraph() {
  tasksParagraphHTML = `
    <p>State:</p>
    <p>Name:</p>
  `
  tasksParagraph.innerHTML = tasksParagraphHTML

  tasksParagraph.classList.add('tasks-paragraph-margin')

  firstTask = true
}

function taskDone(event, taskName) {
  const className = `.js-task-${taskName}-state-paragraph`
  const tasksParagraph = document
    .querySelector(className)
  if (!event) {
    tasksParagraph.innerHTML = ''
    updateTaskList(taskName)

    return
  }

  tasksParagraph.innerHTML = 'Done!'
  updateTaskList(taskName, true)
  
  return
}

function updateTaskList(taskName, taskComplite=false) {
  let checkedState = ''
  
  if (taskComplite) {
    checkedState = ' checked'
  }

  const checkbox = document
    .querySelector(`.js-checkbox-${taskName}`)
  
  checkbox.outerHTML = `
    <input class="js-checkbox-${taskName} checkbox" 
      type="checkbox" 
      onchange="taskDone(this.checked, '${taskName}')"
      ${checkedState}>
  `

  index = defineIndexOfTask(taskName)
  const currentHTML = document
    .querySelector(`.task-${taskName}`)

  tasksList[index][taskName] = currentHTML.outerHTML
  updateLocalStorage()
}

function removeTask(taskName) {
  const index = defineIndexOfTask(taskName)
  
  tasksNamesList.splice(index, 1)
  tasksList.splice(index, 1)

  updateTaskField()
  tasksQuantity--
  
  if (tasksQuantity <= 0) {
    tasksParagraph.innerHTML = ''
    tasksParagraph.classList.remove('tasks-paragraph-margin')
  }
}

function defineIndexOfTask(taskName) {
  for (let i = 0; i < tasksNamesList.length; i++) {
    if (taskName === tasksNamesList[i]) {
      return i
    }
  }
}

function keyPressed(event) {
  if (event.key === 'Enter') {
    createTask()
  }
}
