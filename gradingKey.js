getCurrentDate();
var gradingDate = document.getElementById("gradingDate");
var date = gradingDate.value;
var sid = new URLSearchParams(window.location.search).get('studentID');
loadButtons();

var studentName = new URLSearchParams(window.location.search).get('studentName');
var studentNameElement = document.getElementById('studentNameHTML');
studentNameElement.textContent = studentName;

var buttonData;

function dateRefresh() {
  if (date !== document.getElementById("gradingDate").value) {
    date = document.getElementById("gradingDate").value;
    loadButtons();
  }
}

function getCurrentDate() {
  const currentDate = new Date().toISOString().split('T')[0];
  document.getElementById("gradingDate").value = currentDate;
}

function loadButtons() {
  var buttonContainer = document.getElementById("buttonContainer");
  if (buttonContainer.innerHTML !== "") {
    buttonContainer.innerHTML = "";
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      buttonData = JSON.parse(xhr.responseText);
      createButtons(buttonData);
    }
  };
  xhr.open("GET", "getGradingButtons.php?grading_sid=" + sid + "&grading_date=" + date, true);
  xhr.send();
}

function createButtons(data) {
  var buttonContainer = document.getElementById("buttonContainer");
  var categoryContainer = {};
  var categories = [];

  data.forEach(function(button) {
    var skillId = button[0];
    var skillName = button[1];
    var category = button[2];
    var grade = button[3]; // NEW

    if (!categoryContainer.hasOwnProperty(category)) {
      categoryContainer[category] = document.createElement("div");
      categories.push(category);
    }

    var skillContainer = document.createElement("div"); // Create a container for the skill
    skillContainer.className = "skill-container";

    var buttonElement = document.createElement("button");
    buttonElement.className = "block";
    buttonElement.textContent = skillName;

    // Add click event listener to the button
    buttonElement.addEventListener("click", function() {
      if (this.style.backgroundColor === "lightgreen") {
        this.style.backgroundColor = "#BDD5E7";
      } else {
        this.style.backgroundColor = "lightgreen";
      }
    });

    var trashcanIcon = document.createElement("i");
    trashcanIcon.className = "fas fa-trash-alt trashcan-icon";
    trashcanIcon.dataset.skillId = skillId; // Set the skillId as a data attribute

    skillContainer.appendChild(buttonElement); // Add the button to the skill container
    buttonElement.appendChild(trashcanIcon); // Add the trash can icon to the button element
    categoryContainer[category].appendChild(skillContainer);
  });

  var lastCategoryIndex = categories.length - 1;
  categories.forEach(function(category, index) {
    var categoryDiv = categoryContainer[category];

    if (index !== lastCategoryIndex) {
      var categoryHeading = document.createElement("h3");
      categoryHeading.className = "header-font";
      categoryHeading.textContent = category;
      categoryDiv.insertBefore(categoryHeading, categoryDiv.firstChild);
    }

    buttonContainer.appendChild(categoryDiv);
  });

  // Attach event listener for trashcan icon using event delegation
  buttonContainer.addEventListener("click", function(event) {
    var target = event.target;

    // Check if the clicked element has the trashcan icon class
    if (target.classList.contains("trashcan-icon")) {
      console.log("Trash clicked");

      if (confirm("Are you sure you want to remove this skill?")) {
          var skillId = target.dataset.skillId;
          deleteSkill(skillId)
        }
    }
  });
}

function deleteSkill(skillId) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteSkill.php?", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
      // Reload the buttons after deletion
      loadButtons();
      showSnackbar("Skill deleted!");
    }
  };

  var params = "skillId=" + encodeURIComponent(skillId);
  xhttp.send(params);
}


function saveChanges() {
  var date = document.getElementById('gradingDate').value;
  var skills = [];

  var buttonContainer = document.getElementById('buttonContainer');
  var buttons = buttonContainer.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    var skillId = buttonData[i][0];

    if (button.style.backgroundColor === 'lightgreen') {
      skills.push(skillId);
    }
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'saveData.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = xhr.responseText;
      console.log(response);
      showSnackBar('Changes saved');
    }
  };

  var params = 'grading_sid=' + encodeURIComponent(sid) +
    '&grading_date=' + encodeURIComponent(date) +
    '&skills=' + encodeURIComponent(skills.join(','));

  xhr.send(params);
}

function showSnackBar(message) {
  var snackBar = document.createElement('div');
  snackBar.className = 'snack-bar';
  snackBar.textContent = message;

  var snackBarContainer = document.getElementById('snackBarContainer');
  snackBarContainer.appendChild(snackBar);

  setTimeout(function() {
    snackBar.classList.add('show');
  }, 100);

  setTimeout(function() {
    snackBarContainer.removeChild(snackBar);
  }, 3000);
}

function sendNameID() {
  document.getElementById("sid").value = sid;
  document.getElementById("sname").value = studentName;
  document.getElementById("formToCD").submit();
}
