let DomElements = (() => {
  return {
    TaskInput: document.querySelector(".input_field"),
    TaskSubmit: document.querySelector(".task_add_button"),
    TaskList: document.querySelector(".task_list"),
    ResetAllTask: document.querySelector(".reset_app_button"),
    ClearTasksDone: document.querySelector(".clear_tasks_done_button"),
    Button1: document.querySelector(".button1"),
    Button2: document.querySelector(".button2"),
    Date: document.querySelector(".date"),
    Weekday: document.querySelector(".weekday"),
    Month: document.querySelector(".month"),
    UserName: document.querySelector(".userName"),
    ModalContainer: document.querySelector(".modal_container"),
    ModalSubmit: document.querySelector(".modal_input_submit"),
    ModalInput: document.querySelector(".modal_input"),
  };
})();
// domElements Selector Module

let displayDate = (() => {
  let date = new Date();
  let arrayOfWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let arrayOfMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  DomElements.Date.innerHTML = date.getDate();
  DomElements.Weekday.innerHTML = arrayOfWeekDays[date.getDay()];
  DomElements.Month.innerHTML = arrayOfMonths[date.getMonth()];
})();

// display date to the header section

let UIController = (() => {
  let value = 0;
  return {
    taskAddtoDom: (localStorage) => {
      let taskInputValue;
      localStorage
        ? (taskInputValue = localStorage.taskValue)
        : (taskInputValue = DomElements.TaskInput.value);
      // if the method is called from the localStorage module then the taksInputValue will be the value stored in localStorage
      let checkStatus = localStorage.status == true ? "checked" : "";
      // checking if the task is done i.e status is true if true then set input field is autochecked and ClearTasksDone button is called which will update number of taskDone
      checkStatus ? UIController.ClearTasksDone(true) : null;
      if (taskInputValue.length > 0) {
        let taskId = DataController.addTasktoArray(
          taskInputValue,
          localStorage.status
        );
        // calling to add task in the array and also get the taskId when there is localstorage avaliable then also passing the status so that if the task status is true then adding the task to the array status will be true
        let html = `<div class="task ${taskId}"><div class="task_left"><input type="checkbox" class="input_checkbox ${checkStatus}" ${checkStatus}/><p>${taskInputValue}</p></div><div class="task_right"><button class="task_delete"><i class="fas fa-trash-alt"></i></button></div></div>`;
        DomElements.TaskList.insertAdjacentHTML("beforeend", html);
        // inserting new task into dom
        DomElements.TaskInput.value = "";
        // clearing input field
      }
    },
    taskRemovefromDom: (e, allTaskRemove) => {
      if (e) {
        // event listner will give the task which we want to remove from dom
        let removeChild = e.target.parentNode.parentNode.parentNode;
        DomElements.TaskList.removeChild(removeChild);
        DataController.removeTaskfromArray(removeChild.classList[1]);
        // calling DataController which will remove the task from the array of tasks
      } else if (allTaskRemove) {
        while (DomElements.TaskList.firstElementChild) {
          //  when reset button is pressed then all the task is reomved from the array one by one then it is removed from the dom
          DataController.removeTaskfromArray(
            DomElements.TaskList.firstElementChild.classList[1]
          );
          // here we are passing the task one by one by its unique id to remove from the array
          DomElements.TaskList.removeChild(DomElements.TaskList.firstChild);
        }
        localStorage.clear();
        // Clearing LocalStorage when reset button is called
        DomElements.ModalContainer.style.display = "flex";
        // after clearing localstorage displaying modalContainer
      } else {
        // when clear tasks button is pressed the this block of code will get all the task which input check field has class of checked which means that is is done then they will be removed from the dom one by one
        let checked_classesNode = document.getElementsByClassName("checked");
        for (i = 0; i < checked_classesNode.length; i++) {
          DomElements.TaskList.removeChild(
            checked_classesNode[i].parentNode.parentNode
          );
          i--;
        }
      }
    },
    ResetAllTask_update: (value) => {
      DomElements.ResetAllTask.innerHTML = value;
    },
    // shows number of total task to the Reset All Tasks Button
    ClearTasksDone: (add) => {
      // add means if the task is checked and if its unchecked then value is reduced by one
      add ? (value += 1) : (value -= 1);
      DomElements.ClearTasksDone.innerHTML = value;
    },
  };
})();

let DataController = (() => {
  let ArrayofTasks = [];
  class Task {
    constructor(id, taskValue, status) {
      this.id = id;
      this.taskValue = taskValue;
      this.status = status;
    }
  }
  return {
    addTasktoArray: (value, status) => {
      if (ArrayofTasks.length == 0) {
        const newTask = new Task(1, value, false);
        status ? (newTask.status = true) : null;
        // when status is provided from the localstorage tasks we are setting the created task status according to
        ArrayofTasks.push(newTask);
        LocalStorage(ArrayofTasks);
      } else {
        const newTask = new Task(
          ArrayofTasks[ArrayofTasks.length - 1].id + 1,
          value,
          false
        );
        status ? (newTask.status = true) : null;
        // when status is provided from the localstorage tasks we are setting the created task status according to
        ArrayofTasks.push(newTask);
        LocalStorage(ArrayofTasks);
      }
      UIController.ResetAllTask_update(ArrayofTasks.length);
      //  to show the number of total tasks
      return ArrayofTasks[ArrayofTasks.length - 1].id;
      //  when UIController call this Module's addTasktoArray method then it will return a unique id which will be assigned to the task
    },
    removeTaskfromArray: (value) => {
      if (!value) {
        // when clear tasks done button is pressed then this method is called which will remove all the tasks which has a status of true
        for (i = 0; i < ArrayofTasks.length; i++) {
          if (ArrayofTasks[i].status === true) {
            ArrayofTasks.splice(i, 1);
            i--;
            LocalStorage(ArrayofTasks);
            UIController.ClearTasksDone();
          }
        }
        UIController.taskRemovefromDom();
        // once remove from arrayOfTasks then remove from dom
      } else {
        // particular task to be removed
        for (i = 0; i < ArrayofTasks.length; i++) {
          if (ArrayofTasks[i].id == value) {
            //  the id that is provided when the method is called is matched with all arrayOfTasks id
            // when match is found remove it from the array and update the clear tasks done button
            if (ArrayofTasks[i].status == true) {
              UIController.ClearTasksDone();
            }
            ArrayofTasks.splice(i, 1);
            LocalStorage(ArrayofTasks);
          }
        }
      }
      UIController.ResetAllTask_update(ArrayofTasks.length);
    },
    TaskStatus: (e) => {
      // when input is checked then status:true is set and when the checked input is again called then status:false is set
      let id = e.target.parentNode.parentNode.classList[1];
      for (i = 0; i < ArrayofTasks.length; i++) {
        if (ArrayofTasks[i].id == id) {
          if (!e.target.classList[1]) {
            e.target.classList.add("checked");
            ArrayofTasks[i].status = true;
            LocalStorage(ArrayofTasks);
            UIController.ClearTasksDone(true);
          } else {
            ArrayofTasks[i].status = false;
            LocalStorage(ArrayofTasks);
            e.target.classList.remove("checked");
            UIController.ClearTasksDone();
          }
        }
      }
    },
  };
})();

let LocalStorage = (() => {
  return (ArrayofTasks) => {
    localStorage.setItem("ArrayOfTasks", JSON.stringify(ArrayofTasks));
  };
})();
// this module will set Array to localstorage

let Controller = () => {
  let UserName = DomElements.UserName;
  if (localStorage.getItem("userName")) {
    DomElements.ModalContainer.style.display = "none";
    UserName.innerHTML = localStorage.getItem("userName");
  }
  // if UserName is avaliable in localstorage then remove the modal
  DomElements.ModalSubmit.addEventListener("click", () => {
    let EnteredName = DomElements.ModalInput.value;
    UserName.innerHTML = EnteredName;
    DomElements.ModalContainer.style.display = "none";
    localStorage.setItem("userName", EnteredName);
  });
  // if UserName is not available then show the modal
  if (localStorage.getItem("ArrayOfTasks")) {
    if (JSON.parse(localStorage.getItem("ArrayOfTasks")).length > 0) {
      let ArrayOfTasks = JSON.parse(localStorage.getItem("ArrayOfTasks"));
      ArrayOfTasks.forEach((element) => {
        UIController.taskAddtoDom(element);
      });
    }
  }
  // checking if Task data in localstorage is available
  DomElements.TaskSubmit.addEventListener("click", () =>
    UIController.taskAddtoDom(false)
  );
  document.addEventListener("keypress", (e) =>
    e.keyCode == 13 ? UIController.taskAddtoDom(false) : null
  );
  // add Task to Dom when submit button clicked or pressed entered
  document.addEventListener("click", (e) =>
    e.target.classList[1] == "fa-trash-alt"
      ? UIController.taskRemovefromDom(e)
      : null
  );
  // remove Task from dom when delete button clicked
  document.addEventListener("click", (e) =>
    e.target.classList[0] == "input_checkbox"
      ? DataController.TaskStatus(e)
      : null
  );
  // change status when checkbox is clicked
  DomElements.Button1.addEventListener("click", () =>
    DataController.removeTaskfromArray()
  );
  // remove all tasks from the arrayOfTasks which are done from there according their status they will be removed from both array and from dom
  DomElements.Button2.addEventListener("click", () =>
    UIController.taskRemovefromDom(undefined, true)
  );
  // remove all tasks and reset the app
};

Controller();
// calling app Controller Module
