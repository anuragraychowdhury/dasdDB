// makes it so that this is the first thing that happens (date is retrieved)
// date and the student id are retrieved here -> tied to the gradingKey.html page
getCurrentDate();
gradingDate = document.getElementById("gradingDate");
var date = gradingDate.value;
const sid = new URLSearchParams(window.location.search).get('studentID');

loadButtons();
checkAbsent();

// student name is set in the span element -> studentNameHTML is set as studentName that was retrieved from the html 
const studentName = new URLSearchParams(window.location.search).get('studentName');
    // set the student name in the <span> element
    var studentNameElement = document.getElementById('studentNameHTML');
    studentNameElement.textContent = studentName;

// if the date is not currently what is in the parameter of the URL, the date is refreshed and assocaited functions are also refreshed
var buttonData;
function dateRefresh(){
    if(date != document.getElementById("gradingDate").value){
       date = document.getElementById("gradingDate").value;
       loadButtons();
       checkAbsent()
    }
}

function getCurrentDate() {
  // turns the date from the URL to a string and then sets the value to currentDate
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById("gradingDate").value = currentDate;
}
//-------------------------------------------------------------------------------------SECTION 1------------------------------------------------------------------------------------------

// button container is created by getting the id from gradingKey.html
function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");

  // ensures that button container is empty before adding new buttons
  if (buttonContainer.innerHTML != "") {
    buttonContainer.innerHTML = "";
  }

  // sends a get request to getGradingButtons.php by passing in the sid and the date
  // can make HTTP requests like GET or POST which will retrieve data
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    // xhr.readyState === 4 && xhr.status === 200 : conditions for succesful completion
    if (xhr.readyState === 4 && xhr.status === 200) {
      var buttonData = JSON.parse(xhr.responseText); // JSON string is stored into a JS object (buttonData)
      var absentButton = document.querySelector('.absent-button'); // JS object also assigned to the absent button
      
      // create buttons is run to generate the actual buttons themselves
      createButtons(buttonData, absentButton.classList.contains('clicked')); // Pass the 'absentClicked' value
    }
  };
  xhr.open("GET", "getGradingButtons.php?grading_sid=" + sid + "&grading_date=" + date, true);
  xhr.send();
}

// 
function createButtons(data) {

  buttonData = data; // buttonData is stored in data
  var buttonContainer = document.getElementById("buttonContainer"); // button container is where buttons will be created
  var categoryContainer = {}; // buttons will be grouped by categories in categoryContainer
  var categories = []; // list of all categories in categories list

  var absentButtonClicked = false; // flag to track if the "Manage Absent" button is clicked

  // check if the "Manage Absent" button is clicked
  var absentButton = document.querySelector('.absent-button');
  if (absentButton.classList.contains('clicked')) {
    absentButtonClicked = true;
  }

  // 4 elements present in each button in buttonData
  buttonData.forEach(function (button) {
    var skillId = button[0];
    var skillName = button[1];
    var category = button[2].trim();
    var grade = button[3];

    // if the category container doesn't already have the category, create a new div for that category
    // add the category to the div too
    if (!categoryContainer.hasOwnProperty(category)) {
      categoryContainer[category] = document.createElement("div");
      categories.push(category);
    }

    // button created with the skill name on top
    var buttonElement = document.createElement("button");
    buttonElement.className = "block";
    buttonElement.textContent = skillName;

    // what color to make button
    if (grade == 1) {
      buttonElement.style.backgroundColor = "lightgreen";
    }

    // buttons all get disabled if the absent button has been marked
    if (absentButtonClicked) {
      buttonElement.disabled = true; // disable buttons if "Manage Absent" is clicked
    } else {
      buttonElement.disabled = false; // enable buttons if "Manage Absent" is not clicked
    }

    // checks to see if the buttonElement was ever clicked
    buttonElement.addEventListener("click", function () {
      if (!absentButtonClicked) {
        // only allow button click if "Manage Absent" is not clicked
        // ensures that we change the button color to green on the click
        if (this.style.backgroundColor === "lightgreen") {
          this.style.backgroundColor = "#bdd5e7";
        } else {
          this.style.backgroundColor = "lightgreen";
        }
      }
    });

    // category container holds the categories and the buttons that are associated with them 
    categoryContainer[category].appendChild(buttonElement);
  });

  // for all the categories that we have, we are creating a header and assigning it a style
  categories.forEach(function (category) {
    var categoryDiv = categoryContainer[category];

    var categoryHeading = document.createElement("h3");
    categoryHeading.className = "header-font";
    categoryHeading.textContent = category;
    categoryDiv.insertBefore(categoryHeading, categoryDiv.firstChild); // inserting the category heading at the top of the div and makes sure it shows up at the top of its section

    buttonContainer.appendChild(categoryDiv); // appended to buttonContainer which holds all respective buttons; want to organize buttons by the category that they are in 
  });
}

//-------------------------------------------------------------------------------------SECTION 2------------------------------------------------------------------------------------------
function saveChanges() {
  // when save changes is hit, we need the student and the date that the changes are being saved for
  var sid = new URLSearchParams(window.location.search).get('studentID');
  var date = document.getElementById('gradingDate').value;
  var skills = []; // will eventually store the skillIDs of the skills that have been selected

  // retrieve all the buttons from the button container
  var buttonContainer = document.getElementById('buttonContainer');
  var buttons = buttonContainer.getElementsByTagName('button');

  // iterate through all the buttons that we got and check if the button is selected or not
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var skillId = buttonData[i][0];

    // selection check
    if (button.style.backgroundColor === 'lightgreen') {
      // if selected, add the button to the skill array
      skills.push(skillId);
    }
  }

  // skills array is turned into a comma seperated string
  var skillsString = skills.join(',');

  // create new variable for HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'saveData.php', true); // PHP script that will cause the data to be saved
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // indicate the format of the data being sent
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;
      console.log(response); // log the response for debugging
      showSnackBar('Changes saved'); // snack bar display as a confirmation
    }
  };

  var params = 'grading_sid=' + encodeURIComponent(sid) +
    '&grading_date=' + encodeURIComponent(date) +
    '&skills=' + encodeURIComponent(skillsString);

  xhr.send(params); // send the params to the server (php); params encoded above for easier processing 
}
//-------------------------------------------------------------------------------------SECTION 3------------------------------------------------------------------------------------------
function showSnackBar(message) {
  // create snack bar element
  var snackBar = document.createElement('div');
  snackBar.className = 'snack-bar';
  snackBar.textContent = message; // passed into the snack bar to indicate what will show up

  // snakckbar is appended to snackbar container so that it can show up in the HTML
  var snackBarContainer = document.getElementById('snackBarContainer');
  snackBarContainer.appendChild(snackBar); // appends fully processed snack bar from above

  // trigger the css animation
  setTimeout(function () {
    snackBar.classList.add('show');
  }, 100); // delays the showing of the snackbar by 100 ms

  // after a certain duration, remove the snackbar
  setTimeout(function () {
    snackBarContainer.removeChild(snackBar);
  }, 3000); // time in milliseconds for how long the snack bar stays shown
}

// function used to send hidden form data (student id and name) to the gradingReport form 
function sendNameID(){
    
        document.getElementById("sid").value = sid;
    
        document.getElementById("sname").value = studentName;
        
        document.getElementById("formToCD").submit();
    
}
//-------------------------------------------------------------------------------------SECTION 4------------------------------------------------------------------------------------------
function addSkill() {
  // create http request object variable
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "addSkill.php", true); // which file to interact with on the server side
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText); // for debugging
    }
  };

  // gets the values of the skill name and category that we want toadd (this is from the form that comes up for add skill)
  var skill = document.getElementById("AddSkill").value;
  var category = document.getElementById("AddCategory").value;
  var params = 'AddSkill=' + encodeURIComponent(skill) + '&AddCategory=' + encodeURIComponent(category);
  xhttp.send(params);
}

// open and close add skill form 
function openAddForm() {
  document.getElementById("addSkillForm").style.display = "block";
}

function closeAddForm() {
  document.getElementById("addSkillForm").style.display = "none";
}

// snack bar that pops up to confirm whether a skill has been added or not
function addSkillValidation() {
  var skillName = document.getElementById("AddSkill").value;
  var category = document.getElementById("AddCategory").value;
  
  if (skillName === "" || category === "") {
    confirmAction();
  } else {
    addSkill();
    closeAddForm();
    showSnackbar("Skill added!");
  }
}

// enabling and disabling the add skill button for certain situations
function disableAddSkillButton() {
  document.getElementById("add-skill-button").disabled = true;
}

function enableAddSkillButton() {
  document.getElementById("add-skill-button").disabled = false;
}
//-------------------------------------------------------------------------------------SECTION 5------------------------------------------------------------------------------------------
function deleteSkill() {
  // similar logic to add skill but we are deleting the skill instead; same overall skeleton
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteSkill.php", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
    }
  };

  // retrieve the skill name that we want to delete
  var skillToDelete = document.getElementById("DeleteSkillName").value; // assuming skill name is provided in the input field
  var params = 'SkillName=' + encodeURIComponent(skillToDelete); // modify the parameter name to match your server-side code
  xhttp.send(params);
}

// open and close delete form for the skill
function openDeleteForm() {
  document.getElementById("deleteSkillForm").style.display = "block";
}

function closeDeleteForm() {
  document.getElementById("deleteSkillForm").style.display = "none";
}

// snack bar for the skill form submission
function confirmDeleteSkill() {
  var confirmDelete = confirm("Are you sure you want to delete this skill?");
  if (confirmDelete) {
    deleteSkill();
    showSnackBar("Skill deleted!"); 
    closeDeleteForm();
  }
}

// function that runs -> runs the function that runs the snackbar and the delete skill itself
function deleteSkillValidation() {
  var skillToDelete = document.getElementById("DeleteSkillName").value;

  if (skillToDelete === "") {
    confirmAction(); // show confirmation for empty skill name
  } else {
    confirmDeleteSkill(); // ask for confirmation to delete the skill
  }
}

function disableDeleteSkillButton() {
  document.getElementById("delete-skill-button").disabled = true;
}

function enableDeleteSkillButton() {
  document.getElementById("delete-skill-button").disabled = false;
}
//-------------------------------------------------------------------------------------SECTION 6------------------------------------------------------------------------------------------
function deleteCategory() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteCategory.php", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
    }
  };

  var categoryToDelete = document.getElementById("DeleteCategoryName").value; // assuming category name is provided in the input field
  var params = 'CategoryName=' + encodeURIComponent(categoryToDelete); // modify the parameter name to match your server-side code
  xhttp.send(params);
}

function openDeleteCatForm() {
  document.getElementById("deleteCategoryForm").style.display = "block";
}

function closeDeleteCatForm() {
  document.getElementById("deleteCategoryForm").style.display = "none";
}

function confirmDeleteCategory() {
  var confirmDelete = confirm("Are you sure you want to delete this category?");
  if (confirmDelete) {
    deleteCategory();
    showSnackBar("Category deleted!"); // Changed function name to showSnackBar
    closeDeleteCatForm(); // Close the delete form after confirmation
  }
}

function deleteCategoryValidation() {
  var categoryToDelete = document.getElementById("DeleteCategoryName").value;

  if (categoryToDelete === "") {
    confirmAction(); // Show confirmation for an empty category name
  } else {
    confirmDeleteCategory(); // Ask for confirmation to delete the category
  }
}

function disableDeleteCategoryButton() {
  document.getElementById("delete-category-button").disabled = true;
}

function enableDeleteCategoryButton() {
  document.getElementById("delete-category-button").disabled = false;
}

//-------------------------------------------------------------------------------------SECTION 7------------------------------------------------------------------------------------------
function markAbsent() {
  var sid = new URLSearchParams(window.location.search).get('studentID');
  var date = document.getElementById('gradingDate').value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'markAbsent.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = xhr.responseText;
        console.log(response); // Log the response for debugging

        // After marking or unmarking as absent, update the button color and enable/disable other buttons
        checkAbsent();
      } else {
        var error = "Error marking student as absent: " + xhr.statusText;
        console.error(error);
        // Show a snackbar or display an error message
      }
    }
  };

  var params = 'grading_sid=' + encodeURIComponent(sid) +
    '&grading_date=' + encodeURIComponent(date);

  xhr.send(params);
}

// checks if a student is absent on a said date and changes the color of the absent button based on that
// also marks the skill buttons as enabled or disabled based on the what the response was
function checkAbsent() {
  var sid = new URLSearchParams(window.location.search).get('studentID');
  var date = document.getElementById('gradingDate').value;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'checkAbsent.php?grading_sid=' + encodeURIComponent(sid) + '&grading_date=' + encodeURIComponent(date), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;
      if (response === '1') {
        // button should remain green
        var absentButton = document.querySelector('.absent-button');
        absentButton.classList.add('clicked');

        // disable other buttons when "Manage Absent" is clicked
        disableOtherButtons();
      } else {
        // button should be blue
        var absentButton = document.querySelector('.absent-button');
        absentButton.classList.remove('clicked');

        // enable other buttons when "Manage Absent" is not clicked
        enableOtherButtons();
      }
    }
  };
  xhr.send();
}

// disable all buttons except the absent button
function disableOtherButtons() {
  var buttons = document.querySelectorAll('#buttonContainer button:not(.absent-button)');
  buttons.forEach(function(button) {
    button.disabled = true;
  });
}

// enable all buttons except the absent button 
function enableOtherButtons() {
  var buttons = document.querySelectorAll('#buttonContainer button:not(.absent-button)');
  buttons.forEach(function(button) {
    button.disabled = false;
  });
}
