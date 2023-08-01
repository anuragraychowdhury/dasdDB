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

let gradingDates = {}; // Global variable for overall gradingDates

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
        var mpGradingDates = totalDates - absentDates; // Use a different variable for local gradingDates
        gradingDates[mp] = mpGradingDates; // Store gradingDates for each marking period
        console.log('Marking Period:', mp);
        console.log('Total Unique Dates:', totalDates);
        console.log('Total Dates with Skilltag 0:', absentDates);
        console.log('Total Grading Dates:', mpGradingDates);

        // Call the loadReport function with the gradingDates value for each marking period
        loadReport(mpGradingDates, mp);
      });

      // Now that attendance data is processed for all marking periods, call createTable
      createTable(attendanceData);
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

  // Calculate marking period totals and create tables for each category
  Object.keys(categories).forEach(function (category) {
    var table = document.createElement('table');
    table.className = 'category-table'; // Apply the class for spacing

    var headerRow = table.insertRow();
    var cellCategory = headerRow.insertCell();
    cellCategory.innerHTML = category;

    var markingPeriodTotals = {}; // Store marking period totals

    // Add column headers for each marking period
    Object.keys(data).forEach(function (mp) {
      var cellMP = headerRow.insertCell();
      cellMP.innerHTML = 'Marking Period ' + mp;

      markingPeriodTotals[mp] = 0; // Initialize marking period total to 0
    });

    var skills = categories[category];

    Object.keys(skills).forEach(function (skill) {
      var skillRow = table.insertRow();
      var cellSkillName = skillRow.insertCell();
      cellSkillName.innerHTML = skill;

      // Add fractions for each marking period
      var grades = skills[skill];
      Object.keys(data).forEach(function (mp, index) {
        var cellGrade = skillRow.insertCell();
        // Use grades for the current marking period
        var fraction = parseInt(grades[index]) + '/' + gradingDates[mp];
        cellGrade.innerHTML = fraction || 'N/A';

        // Update marking period total
        markingPeriodTotals[mp] += parseInt(grades[index]);
      });
    });

    var totalSkills = Object.keys(skills).length; // Get the total number of skills for each category

    // Add row for marking period totals
    var totalRow = table.insertRow();
    var cellTotalLabel = totalRow.insertCell();
    cellTotalLabel.innerHTML = 'Marking Period Totals';

    // Add marking period total values
    Object.keys(data).forEach(function (mp) {
      var cellTotal = totalRow.insertCell();
      var totalGrades = markingPeriodTotals[mp]; // Get the total grades for the marking period
      var totalFraction = totalGrades + '/' + (gradingDates[mp] * totalSkills); // Calculate the total fraction
      cellTotal.innerHTML = totalFraction || 'N/A';
    });

    grContainer.appendChild(table);
  });
}



function loadReport(gradingDates, mp) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var GRdata = JSON.parse(xhr.responseText);

      // Call createTable function with gradingDates and mp as parameters
      createTable(GRdata, gradingDates, mp);
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
