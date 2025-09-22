/**
 * Main Page JavaScript - DASD Student Database
 * 
 * This file handles the main page functionality including displaying the student list,
 * search functionality, adding new students, managing marking periods, and navigation
 * to individual student grading interfaces.
 * 
 */

getStudent();
bindEventHandlers(); // This binds the event handler

/**
 * Retrieves and displays the list of all students from the database
 * Makes an AJAX request to getStudents.php and populates the student table
 */
function getStudent() {
  var table = document.getElementById("myTable");
  
  // Reset table to header only if it contains data
  if (table.innerHTML != "<tr class='header'><th style='width:10%'>Name</th></tr>"){
    table.innerHTML ="<tr class='header'><th style='width:10%'>Name</th></tr>";
  }

  // Create XMLHttpRequest to fetch student data
  var oHttp = new XMLHttpRequest();
  oHttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Parse JSON response containing student data
      var stdlist = JSON.parse(this.response);
      
      // Create HTML elements for each student
      for(var i = 0; i < stdlist.length; i++) {
        // Create student block with click handler and delete button
        var studentBlock = '<div class="block student-row" onclick="sendSIDAndSNAME(' + stdlist[i][0] + ', \'' + stdlist[i][1].replace("+", "") + '\')">' +
          '<div class="student-name">' + stdlist[i][1].replace("+", " ") + '</div>' +
          '<i class="fas fa-trash-alt delete-icon" onclick="confirmDelete(' + stdlist[i][0] + ')"></i>' +
          '</div>';
        
        // Add new row to table
        var newRow = table.insertRow(-1);
        var cell = newRow.insertCell(0);
        cell.innerHTML = studentBlock;
      }
    }
  };
  
  // Send GET request to retrieve student data
  oHttp.open("GET", "getStudents.php", true);
  oHttp.send();
}

/**
 * Prompts user for confirmation before deleting a student
 * @param {number} studentId - The ID of the student to delete
 */
function confirmDelete(studentId) {
  var confirmation = confirm("Are you sure you want to delete this student?");
  if (confirmation) {
    deleteStudent(studentId);
  }
}

/**
 * Deletes a student from the database via AJAX request
 * @param {number} studentId - The ID of the student to delete
 */
function deleteStudent(studentId) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteStudent.php?", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
      // Reload the student list after successful deletion
      getStudent();
      showSnackbar("Student deleted!");
    }
  };

  // Send student ID as POST parameter
  var params = 'studentId=' + encodeURIComponent(studentId);
  xhttp.send(params);
}


/**
 * Sets student ID in hidden form and submits to grading interface
 * @param {number} but - Student ID to pass to next page
 */
function sendSID(but) {
    document.getElementById("sid").value = but;
    document.getElementById("formToGK").submit();
}
    
/**
 * Sets student name in hidden form and submits to grading interface
 * @param {string} name - Student name to pass to next page
 */
function sendSNAME(name) {
    document.getElementById("sname").value = name;
    document.getElementById("formToGK").submit();
}
    
/**
 * Sets both student ID and name, then navigates to grading interface
 * @param {number} id - Student ID
 * @param {string} name - Student name
 */
function sendSIDAndSNAME(id, name) {
    sendSID(id);
    sendSNAME(name);
}

/**
 * Filters the student table based on search input
 * Shows/hides table rows that match the search criteria
 */
function filterTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  
  // Loop through all table rows, hide those that don't match search
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";  // Show matching rows
      } else {
        tr[i].style.display = "none";  // Hide non-matching rows
      }
    }       
  }
}

// Move the event binding code inside a separate function
function bindEventHandlers() 
{
  document.getElementById("myInput").onkeyup = filterTable;
}

function addStudent() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "addStudent.php?", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(xhttp.responseText);
    }
  };

  var params='AddStudentName='+encodeURIComponent(document.getElementById("AddStudentName").value);
  xhttp.send(params);
}

function addValidation() {
  var empt = document.getElementById("AddStudentName").value;
  if (empt == "") {
    confirmAction();
  } else {
    addStudent();
    getStudent();
    showSnackbar();
  }
}//end of addValidation

function AddOpenForm() {
  document.getElementById("addForm").style.display = "block";
  AddDisableButton();
}//end of openForm

function AddCloseForm() {
  document.getElementById("addForm").style.display = "none";
  AddEnableButton()
}//end of closeForm

function showSnackbar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}//end of showSnackbar

function confirmAction() {
  let confirmation = confirm("Student Name invalid. Click OK to try again.");
  if (!confirmation) {
    closeForm();
  }
  return confirmation;
}//end of confirmAction

function AddDisableButton() 
{
  document.getElementById("add_student_button").disabled = true;
}

function AddEnableButton() 
{
  document.getElementById("add_student_button").disabled = false;
}

// Function to open the form for adding marking period start and end dates
function OpenMarkingPeriodForm() {
  document.getElementById("markingPeriodForm").style.display = "block";
}

// Function to close the form for adding marking period start and end dates
function CloseMarkingPeriodForm() {
  document.getElementById("markingPeriodForm").style.display = "none";
}

// Function to handle adding a marking period
function AddMarkingPeriod() {
  // Get the marking period data from the form
  const startDate = document.getElementById("StartDate").value;
  const endDate = document.getElementById("EndDate").value;

  // You can perform additional validation here if needed

  // Submit the form or handle the data as needed (e.g., send to the server)
  // For demonstration purposes, we'll just display an alert with the data
  alert(`Marking Period:\nStart Date: ${startDate}\nEnd Date: ${endDate}`);

  // Close the form after submitting
  CloseMarkingPeriodForm();
}

function addMarkingPeriod() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "addMpData.php", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        console.log(xhttp.responseText);
        showSnackbar("MP data submitted!");
      } else {
        console.error("Error: Unable to submit Marking Period data.");
      }
    }
  };

  // Get the values from the form for each Marking Period
  var mp1 = encodeURIComponent(document.getElementById("MP1").value);
  var startDate1 = encodeURIComponent(document.getElementById("StartDate1").value);
  var endDate1 = encodeURIComponent(document.getElementById("EndDate1").value);

  var mp2 = encodeURIComponent(document.getElementById("MP2").value);
  var startDate2 = encodeURIComponent(document.getElementById("StartDate2").value);
  var endDate2 = encodeURIComponent(document.getElementById("EndDate2").value);
  
  var mp3 = encodeURIComponent(document.getElementById("MP3").value);
  var startDate3 = encodeURIComponent(document.getElementById("StartDate3").value);
  var endDate3 = encodeURIComponent(document.getElementById("EndDate3").value);
  
  var mp4 = encodeURIComponent(document.getElementById("MP4").value);
  var startDate4 = encodeURIComponent(document.getElementById("StartDate4").value);
  var endDate4 = encodeURIComponent(document.getElementById("EndDate4").value);

var params =
    'MP1=' + encodeURIComponent(document.getElementById("MP1").value) +
    '&StartDate1=' + encodeURIComponent(document.getElementById("StartDate1").value) +
    '&EndDate1=' + encodeURIComponent(document.getElementById("EndDate1").value) +
    
    '&MP2=' + encodeURIComponent(document.getElementById("MP2").value) +
    '&StartDate2=' + encodeURIComponent(document.getElementById("StartDate2").value) +
    '&EndDate2=' + encodeURIComponent(document.getElementById("EndDate2").value) +
    
    '&MP3=' + encodeURIComponent(document.getElementById("MP3").value) +
    '&StartDate3=' + encodeURIComponent(document.getElementById("StartDate3").value) +
    '&EndDate3=' + encodeURIComponent(document.getElementById("EndDate3").value) +
    
    '&MP4=' + encodeURIComponent(document.getElementById("MP4").value) +
    '&StartDate4=' + encodeURIComponent(document.getElementById("StartDate4").value) +
    '&EndDate4=' + encodeURIComponent(document.getElementById("EndDate4").value);

  xhttp.send(params);
}

