// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the input values from the URL parameters
const studentName = urlParams.get('student-name');
const teacher = urlParams.get('teacher');
const jobCoachName = urlParams.get('job-coach-name');
const workSite = urlParams.get('work-site');
const school = urlParams.get('school');
const studentID = urlParams.get('studentID');

  // Display the retrieved values in the form
document.getElementById('display-student-name').innerText = studentName;
document.getElementById('display-teacher').innerText = teacher;
document.getElementById('display-job-coach-name').innerText = jobCoachName;
document.getElementById('display-work-site').innerText = workSite;
document.getElementById('display-school').innerText = school;


function generateReport() {
  // Get the student name from the HTML element
  var studentName = document.getElementById("studentNameHTML").innerText;
  
  // Encode the student name to ensure proper URL encoding
  var encodedStudentName = encodeURIComponent(studentName);

  // Redirect to the next page with the student name as a parameter
  window.location.href = "contextualData.html?studentName=" + encodedStudentName;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

gradingDates = 0

function attendance() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var attendanceData = JSON.parse(xhr.responseText);

      // Process the attendance data for each marking period
      Object.keys(attendanceData).forEach(function (mp) {
        var markingPeriodData = attendanceData[mp];
        var totalDates = markingPeriodData[0].total_unique_dates;
        var absentDates = markingPeriodData[0].total_dates_with_skilltag_0;
        var gradingDates = totalDates - absentDates; // Calculate the gradingDates value
        console.log('Marking Period:', mp);
        console.log('Total Unique Dates:', totalDates);
        console.log('Total Dates with Skilltag 0:', absentDates);
        console.log('Total Grading Dates:', gradingDates);

        // Call the loadReport function with the gradingDates value for each marking period
        loadReport(gradingDates);
      });
    }
  };

  xhr.open(
    'GET',
    'attendance.php?student_id=' + studentID, true
  );
  xhr.send();
}


function createTable(data) {
  var grContainer = document.getElementById('grContainer');
  grContainer.innerHTML = ''; // Clear any existing content

  var categories = {}; // Object to store skills for each category

  // Process the data to group skills by category
  Object.keys(data).forEach(function (mp) {
    var markingPeriodData = data[mp];
    markingPeriodData.forEach(function (item) {
      var category = item.category.trim(); // Apply trim here to remove whitespace
      if (!categories.hasOwnProperty(category)) {
        categories[category] = {};
      }
      categories[category][item.skill] = categories[category][item.skill] || [];
      categories[category][item.skill].push(item.total_grade);
    });
  });

  // Create tables for each category
  Object.keys(categories).forEach(function (category) {
    var table = document.createElement('table');
    table.className = 'category-table'; // Apply the class for spacing
    
    var headerRow = table.insertRow();
    var cellCategory = headerRow.insertCell();
    cellCategory.innerHTML = category;

    // Add column headers for each marking period
    Object.keys(data).forEach(function (mp, index) {
      var cellMP = headerRow.insertCell();
      cellMP.innerHTML = 'Marking Period ' + mp;
    });

    var skills = categories[category];

    Object.keys(skills).forEach(function (skill) {
      var skillRow = table.insertRow();
      var cellSkillName = skillRow.insertCell();
      cellSkillName.innerHTML = skill;

      // Add grades for each marking period
      var grades = skills[skill];
      Object.keys(data).forEach(function (mp, index) {
        var cellGrade = skillRow.insertCell();
        cellGrade.innerHTML = grades[index] || 'N/A';
      });
    });

    grContainer.appendChild(table);
  });
}



// function createTable(array, gradingDates) {
//   var table;
//   var grContainer = document.getElementById('grContainer');

//   var categoryContainer = {};
//   var categories = [];
  
//   var leftTotal = 0;
//   var rightTotal = 0;
//   var toggle = -1;

//   for (let i = 0; i < array.length; ++i) {
//     var skill = array[i][0];
//     var category = array[i][1].trim();
//     var totalGrade = array[i][2];

//     if (!categoryContainer.hasOwnProperty(category)) {
        
//     if (toggle == 0){
        
//         cell2.innerHTML +=  ': ' + leftTotal + '/' + rightTotal;
//         leftTotal = 0;
//         rightTotal = 0;
        
//     }else{
//         toggle = 0;
//     }
//       console.log(leftTotal + '/' + rightTotal);
//       categoryContainer[category] = document.createElement('div');
//       categories.push(category);
//       table = document.createElement('table');
//       var row = table.insertRow();
//       var cell1 = row.insertCell(0);
//       var cell2 = row.insertCell(1);
//       cell1.innerHTML = category;
//       cell2.innerHTML = 'Total Grade';
//     }

//     row = table.insertRow();
//     var cell1_1 = row.insertCell(0);
//     var cell2_1 = row.insertCell(1);
//     cell1_1.innerHTML = skill;
    
//     // Calculate the fraction
//     var fraction = totalGrade + '/' + gradingDates;
//     cell2_1.innerHTML = fraction;
    
//     leftTotal = leftTotal + parseInt(totalGrade);
//     rightTotal = rightTotal + gradingDates; 

//     categoryContainer[category].appendChild(table);
//   }
  
//   cell2.innerHTML +=  ': ' + leftTotal + '/' + rightTotal;
//   leftTotal = 0;
//   rightTotal = 0;
 
//   categories.forEach(function (category, index) {
//     var categoryDiv = categoryContainer[category];

//     if (index !== 0) {
//       var categoryHeading = document.createElement('br');
//       categoryDiv.insertBefore(categoryHeading, categoryDiv.firstChild);
//     }

//     grContainer.appendChild(categoryDiv);
//   });
// }

function loadReport() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var GRdata = JSON.parse(xhr.responseText);

      // Call createTable function with gradingDates as a parameter
      createTable(GRdata);
    }
  };
  xhr.open(
    'GET',
    'gradingReport.php?student_id=' + studentID, true
  );
  xhr.send();
}

$(function() {
  $("#start-date").datepicker({
    dateFormat: "mm/dd/yy",
    onSelect: function(selected) {
      var startDate = $(this).datepicker("getDate");
      $("#end-date").datepicker("option", "minDate", startDate);
    }
  });

  $("#end-date").datepicker({
    dateFormat: "mm/dd/yy",
    onSelect: function(selected) {
      var endDate = $(this).datepicker("getDate");
      $("#start-date").datepicker("option", "maxDate", endDate);
    }
  });

});

attendance();
