getCurrentDate();
gradingDate = document.getElementById("gradingDate")
var date = gradingDate.value;
const sid = new URLSearchParams(window.location.search).get('studentID');
loadButtons();
// window.addEventListener("load", loadButtons);

const studentName = new URLSearchParams(window.location.search).get('studentName');
    // Set the student name in the <span> element
    var studentNameElement = document.getElementById('studentNameHTML');
    studentNameElement.textContent = studentName;

// setInterval(function(){
//   if(date != document.getElementById("gradingDate").value){
//       date = document.getElementById("gradingDate").value;
//       loadButtons();
//   }
// }, 1000);

var buttonData;
function dateRefresh(){
    if(date != document.getElementById("gradingDate").value){
       date = document.getElementById("gradingDate").value;
       loadButtons();
    }
}
function getCurrentDate() {
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById("gradingDate").value = currentDate;
}

// Make an AJAX request to fetch the button data
function loadButtons() {
    var buttonContainer = document.getElementById("buttonContainer");
    if (buttonContainer.innerHTML != ""){
        buttonContainer.innerHTML ="";
    }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var buttonData = JSON.parse(xhr.responseText);
      createButtons(buttonData);
    }
  };
  xhr.open("GET", "getGradingButtons.php?grading_sid="+sid+"&grading_date=" + date, true);
  xhr.send();
}

function createButtons(data) {
  buttonData = data;
  var buttonContainer = document.getElementById("buttonContainer");
  var categoryContainer = {};
  var categories = [];

  buttonData.forEach(function(button) {
    var skillId = button[0];
    var skillName = button[1];
    var category = button[2].trim();
    var grade = button[3];

    if (!categoryContainer.hasOwnProperty(category)) {
      categoryContainer[category] = document.createElement("div");
      categories.push(category);
    }

    var buttonElement = document.createElement("button");
    buttonElement.className = "block";
    buttonElement.textContent = skillName;

    if (grade == 1) {
      buttonElement.style.backgroundColor = "lightgreen";
    }

    buttonElement.addEventListener("click", function() {
      if (this.style.backgroundColor === "lightgreen") {
        this.style.backgroundColor = "lightgray";
      } else {
        this.style.backgroundColor = "lightgreen";
      }
    });

    categoryContainer[category].appendChild(buttonElement);
  });

  categories.forEach(function(category) {
    var categoryDiv = categoryContainer[category];

    var categoryHeading = document.createElement("h3");
    categoryHeading.className = "header-font";
    categoryHeading.textContent = category;
    categoryDiv.insertBefore(categoryHeading, categoryDiv.firstChild);

    buttonContainer.appendChild(categoryDiv);
  });
}


function saveChanges() {
  var sid = new URLSearchParams(window.location.search).get('studentID');
  var date = document.getElementById('gradingDate').value;
  var skills = [];

  var buttonContainer = document.getElementById('buttonContainer');
  var buttons = buttonContainer.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var skillId = buttonData[i][0];

    // Check if the button is selected
    if (button.style.backgroundColor === 'lightgreen') {
      // Add the skillId to the skills array
      skills.push(skillId);
    }
  }

  // Convert the skills array to a comma-separated string
  var skillsString = skills.join(',');

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'saveData.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;
      console.log(response); // Log the response for debugging
      showSnackBar('Changes saved');
    }
  };

  var params = 'grading_sid=' + encodeURIComponent(sid) +
    '&grading_date=' + encodeURIComponent(date) +
    '&skills=' + encodeURIComponent(skillsString);

  xhr.send(params);
}

function showSnackBar(message) {
  // Create a snack bar element
  var snackBar = document.createElement('div');
  snackBar.className = 'snack-bar';
  snackBar.textContent = message;

  // Append the snack bar to the snack bar container
  var snackBarContainer = document.getElementById('snackBarContainer');
  snackBarContainer.appendChild(snackBar);

  // Trigger the CSS animation
  setTimeout(function () {
    snackBar.classList.add('show');
  }, 100); // Delaying the addition of 'show' class for 100 milliseconds

  // After a certain duration, remove the snack bar
  setTimeout(function () {
    snackBarContainer.removeChild(snackBar);
  }, 3000); // Adjust the timeout (in milliseconds) to control how long the snack bar stays visible
}

function sendNameID(){
    
        document.getElementById("sid").value = sid;
    
        document.getElementById("sname").value = studentName;
        
        document.getElementById("formToCD").submit();
    
}

function addSkill() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "addSkill.php", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
    }
  };

  var skill = document.getElementById("AddSkill").value;
  var category = document.getElementById("AddCategory").value;
  var params = 'AddSkill=' + encodeURIComponent(skill) + '&AddCategory=' + encodeURIComponent(category);
  xhttp.send(params);
}

function openAddForm() {
  document.getElementById("addSkillForm").style.display = "block";
}

function closeAddForm() {
  document.getElementById("addSkillForm").style.display = "none";
}

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

function disableAddSkillButton() {
  document.getElementById("add-skill-button").disabled = true;
}

function enableAddSkillButton() {
  document.getElementById("add-skill-button").disabled = false;
}

function deleteSkill() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteSkill.php", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
    }
  };

  var skillToDelete = document.getElementById("DeleteSkillName").value; // Assuming skill name is provided in the input field
  var params = 'SkillName=' + encodeURIComponent(skillToDelete); // Modify the parameter name to match your server-side code
  xhttp.send(params);
}

function openDeleteForm() {
  document.getElementById("deleteSkillForm").style.display = "block";
}

function closeDeleteForm() {
  document.getElementById("deleteSkillForm").style.display = "none";
}

function confirmDeleteSkill() {
  var confirmDelete = confirm("Are you sure you want to delete this skill?");
  if (confirmDelete) {
    deleteSkill();
    showSnackBar("Skill deleted!"); // Changed function name to showSnackBar
    closeDeleteForm(); // Close the delete form after confirmation
  }
}

function deleteSkillValidation() {
  var skillToDelete = document.getElementById("DeleteSkillName").value;

  if (skillToDelete === "") {
    confirmAction(); // Show confirmation for empty skill name
  } else {
    confirmDeleteSkill(); // Ask for confirmation to delete the skill
  }
}

function disableDeleteSkillButton() {
  document.getElementById("delete-skill-button").disabled = true;
}

function enableDeleteSkillButton() {
  document.getElementById("delete-skill-button").disabled = false;
}
