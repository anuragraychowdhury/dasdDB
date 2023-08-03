// Get the URL parameters

const urlParams = new URLSearchParams(window.location.search);

// Retrieve the input values from the URL parameters
const studentName = urlParams.get('studentName');
const teacher = urlParams.get('teacher');
const jobCoachName = urlParams.get('job-coach-name');
const workSite = urlParams.get('work-site');
const school = urlParams.get('school');
const studentID = urlParams.get('studentID');

  // Display the retrieved values in the form
document.getElementById('studentNameGR').innerText = studentName;
// document.getElementById('display-teacher').innerText = teacher;
// document.getElementById('display-job-coach-name').innerText = jobCoachName;
// document.getElementById('display-work-site').innerText = workSite;
// document.getElementById('display-school').innerText = school;

/*
function generateReport() {
  // Get the student name from the HTML element
  var studentName = document.getElementById("studentNameHTML").innerText;
  
  // Encode the student name to ensure proper URL encoding
  var encodedStudentName = encodeURIComponent(studentName);

  // Redirect to the next page with the student name as a parameter
  window.location.href = "contextualData.html?studentName=" + encodedStudentName;
}
*/
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
        //console.log('Marking Period:', mp);
        //console.log('Total Unique Dates:', totalDates);
        //console.log('Total Dates with Skilltag 0:', absentDates);
        //console.log('Total Grading Dates:', mpGradingDates);

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
  var markingPeriodTotalsPerCategory = []; // 2D array to store marking period totals per category

  // Process the data to group skills by category
Object.keys(data).forEach(function (mp) {
  var markingPeriodData = data[mp];
  markingPeriodData.forEach(function (item) {
    if (item && item.category) { // Add a check to ensure item.category exists and is not undefined
      var category = item.category.trim(); // Apply trim here to remove whitespace
      if (!categories.hasOwnProperty(category)) {
        categories[category] = {};
      }
      categories[category][item.skill] = categories[category][item.skill] || [];
      categories[category][item.skill].push(item.total_grade);
    }
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

    var mpTotalsArray = []; // Array to store the marking period totals for the category

    // Add marking period total values
    Object.keys(data).forEach(function (mp) {
      var cellTotal = totalRow.insertCell();
      var totalGrades = markingPeriodTotals[mp]; // Get the total grades for the marking period
      var totalFraction = totalGrades + '/' + (gradingDates[mp] * totalSkills); // Calculate the total fraction
      cellTotal.innerHTML = totalFraction || 'N/A';

      mpTotalsArray.push(totalFraction || 'N/A'); // Store the total fraction in the array
    });

    // Store the marking period totals for the current category in the 2D array
    markingPeriodTotalsPerCategory.push([category, ...mpTotalsArray]);
    
    var tableDiv = document.createElement('div');
        tableDiv.style.width = '100%'; // Set the width to 100% to take up the full width of the table

        // Create a textarea element
        var textarea = document.createElement('textarea');
        textarea.style.width = '100%'; // Set the width to 100% to take up the full width of the table
        textarea.rows = 3; // You can adjust the number of rows as needed
        textarea.placeholder = 'Enter your comments here...';

        // Append the textarea to the div
        tableDiv.appendChild(textarea);

        // Append the div with the textarea after each table
        grContainer.appendChild(table);
        grContainer.appendChild(tableDiv);
  });
  console.log("Graph Data",markingPeriodTotalsPerCategory)
    drawBarGraph(markingPeriodTotalsPerCategory);
  return markingPeriodTotalsPerCategory; // Return the 2D array
}
function createTextArea() {
  var textarea = document.createElement('textarea');
  textarea.setAttribute('rows', '5'); // Set the number of rows
  textarea.setAttribute('cols', '100'); // Set the number of columns
  textarea.setAttribute('placeholder', 'Enter your comment here...'); // Set the placeholder text
  return textarea;
}

function drawBarGraph(data) {
  // Prepare the data for the chart
  const categories = data.map((item) => item[0]);
  const mpTotals = data.map((item) => item.slice(1));

  // Prepare the dataset for each marking period
  const datasets = mpTotals[0].map((_, index) => ({
    label: `Marking Period ${index + 1}`,
    data: mpTotals.map((item) => item[index].split('/')[0]), // Extract the numerator from the fraction
    backgroundColor: getRandomColor(), // Function to get random colors for each bar
  }));

  // Create the bar graph
  const ctx = document.getElementById('barGraph').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Grades',
          },
        },
      },
    },
  });
}

function getRandomColor() {
  // Function to generate a random color in hexadecimal format
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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

attendance();















