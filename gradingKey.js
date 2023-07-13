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
    var category = button[2];
    var grade = button[3];//NEW

    if (!categoryContainer.hasOwnProperty(category)) {
      // Create a new category container if it doesn't exist
      categoryContainer[category] = document.createElement("div");
      categories.push(category);
    }

    var buttonElement = document.createElement("button");
    buttonElement.className = "block";
    buttonElement.textContent = skillName;
    //here?-----------------------------------------------------------------------
    if (grade == 1){
        buttonElement.style.backgroundColor = 'lightgreen';
    }

    // Add click event listener if needed
    buttonElement.addEventListener("click", function() {
      // Toggle button color between red and grey
      if (this.style.backgroundColor === 'lightgreen') {
        this.style.backgroundColor = 'lightgray';
      } else {
        this.style.backgroundColor = 'lightgreen';
      }

      // Handle button click event
      // You can add your custom logic here
      //console.log('Button clicked:', this.textContent);
    });

    categoryContainer[category].appendChild(buttonElement);
  });

  // Append the category containers to the button container
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