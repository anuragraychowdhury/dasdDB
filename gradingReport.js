/**
 * Grading Report JavaScript - DASD Student Database
 * 
 * This file handles the grading report display functionality including generating
 * comprehensive student reports, creating tables with skill progress data,
 * calculating attendance statistics, and rendering visual charts using Chart.js.
 * 
 */

// get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// retrieve the input values from the URL parameters
const studentName = urlParams.get('studentName');
const teacher = urlParams.get('teacher');
const jobCoachName = urlParams.get('job-coach-name');
const workSite = urlParams.get('work-site');
const school = urlParams.get('school');
const studentID = urlParams.get('studentID');

  // display the retrieved values in the form
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
let gradingDates = {}; // global variable for overall gradingDates

// retrieves data from the attendance data php server; jsonify it and then turn data into below variables
function attendance() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var attendanceData = JSON.parse(xhr.responseText);

      // process the attendance data for each marking period
      Object.keys(attendanceData).forEach(function (mp) {
        var markingPeriodData = attendanceData[mp]; // attendanceData is acquired for the respective MP
        var totalDates = markingPeriodData[0].total_unique_dates; // one element of the first element (total dates)
        var absentDates = markingPeriodData[0].total_dates_with_skilltag_0; // another element of the first element (absent dates)
        var mpGradingDates = totalDates - absentDates; // use a different variable for local gradingDates
        gradingDates[mp] = mpGradingDates; // store gradingDates for each marking period
        //console.log('Marking Period:', mp);
        //console.log('Total Unique Dates:', totalDates);
        //console.log('Total Dates with Skilltag 0:', absentDates);
        //console.log('Total Grading Dates:', mpGradingDates);

        // call the loadReport function with the gradingDates value for each marking period
        loadReport(mpGradingDates, mp);
      });

      // now that attendance data is processed for all marking periods, call createTable
      createTable(attendanceData);
    }
  };

  xhr.open(
    'GET',
    'attendance.php?student_id=' + studentID, true
  );
  xhr.send();
}
//-------------------------------------------------------------------------------------SECTION 1------------------------------------------------------------------------------------------
function createTable(data) {
  var grContainer = document.getElementById('grContainer');
  grContainer.innerHTML = ''; // clear any existing content

  var categories = {}; // object to store skills for each category
  var markingPeriodTotalsPerCategory = []; // 2D array to store marking period totals per category

  // process the data to group skills by category
Object.keys(data).forEach(function (mp) {
  var markingPeriodData = data[mp]; // respective marking period data for that MP
  markingPeriodData.forEach(function (item) {
    if (item && item.category) { // add a check to ensure item.category exists and is not undefined
      var category = item.category.trim(); // apply trim here to remove whitespace
      if (!categories.hasOwnProperty(category)) {
        categories[category] = {}; // if the cateogory doesn't exist, create a dict for it
      }
      categories[category][item.skill] = categories[category][item.skill] || [];
      categories[category][item.skill].push(item.total_grade); // example: item = { category: "Math", skill: "Algebra", total_grade: 85 };
    }
  });
});

  // calculate marking period totals and create tables for each category
  Object.keys(categories).forEach(function (category) {
    var table = document.createElement('table');
    table.className = 'category-table'; // create a table for each category

    var headerRow = table.insertRow(); 
    var cellCategory = headerRow.insertCell();
    cellCategory.innerHTML = `<b>${category}</b>`; // formatting for category name
  cellCategory.className = 'boldStud'
  cellCategory.style.border = '1px solid black';

    var markingPeriodTotals = {}; // store marking period totals

    // add column headers for each marking period
    Object.keys(data).forEach(function (mp) {
      var cellMP = headerRow.insertCell();
      cellMP.innerHTML = `<b>Marking Period ${mp}</b>`; // bold formatting for "Marking Period"
    cellMP.className = 'boldStud';
    cellMP.style.border = '1px solid black';

      markingPeriodTotals[mp] = 0; // initialize marking period total to 0
    });

    var skills = categories[category];

    Object.keys(skills).forEach(function (skill) {
      var skillRow = table.insertRow();
      var cellSkillName = skillRow.insertCell();
      cellSkillName.innerHTML = skill;

      // add fractions for each marking period
      var grades = skills[skill];
      Object.keys(data).forEach(function (mp, index) {
        var cellGrade = skillRow.insertCell();
        // grades for each skill and the totals attached to each of them
        var fraction = parseInt(grades[index]) + '/' + gradingDates[mp];
        cellGrade.innerHTML = fraction || 'N/A';

        // total grades for MP is updated
        markingPeriodTotals[mp] += parseInt(grades[index]);
      });
    });

    var totalSkills = Object.keys(skills).length; // get the total number of skills for each category

    // add row for marking period totals
    var totalRow = table.insertRow();
    var cellTotalLabel = totalRow.insertCell();
    cellTotalLabel.innerHTML = `<b>Marking Period Totals</b>`; // Bold formatting for "Marking Period Totals"
  cellTotalLabel.className = 'boldStud';
  cellTotalLabel.style.border = '1px solid black';

    var mpTotalsArray = []; // Array to store the marking period totals for the category

    // add marking period total values
    Object.keys(data).forEach(function (mp) {
      var cellTotal = totalRow.insertCell();
      var totalGrades = markingPeriodTotals[mp]; // get the total grades for the marking period
      var totalFraction = totalGrades + '/' + (gradingDates[mp] * totalSkills); // calculate the total fraction
      cellTotal.innerHTML = totalFraction || 'N/A';

      mpTotalsArray.push(totalFraction || 'N/A'); // store the total fraction in the array
    });

    // store the marking period totals for the current category in the 2D array
    markingPeriodTotalsPerCategory.push([category, ...mpTotalsArray]);
    
    var tableDiv = document.createElement('div');
        tableDiv.style.width = '100%';
        tableDiv.className = 'comment-box';// set the width to 100% to take up the full width of the table

        // create a textarea element
        var textarea = document.createElement('textarea');
        textarea.style.width = '100%'; // set the width to 100% to take up the full width of the table
        textarea.rows = 3; // adjust the number of rows as needed
        textarea.placeholder = 'Enter your comments here...';

        // append the textarea to the div
        tableDiv.appendChild(textarea);

        // append the div with the textarea after each table
        grContainer.appendChild(table);
        grContainer.appendChild(tableDiv);
  });
  console.log("Graph Data",markingPeriodTotalsPerCategory)
    drawBarGraph(markingPeriodTotalsPerCategory);
  return markingPeriodTotalsPerCategory; // return the 2D array
}
function createTextArea() {
  var textarea = document.createElement('textarea');
  textarea.setAttribute('rows', '5'); // set the number of rows
  textarea.setAttribute('cols', '100'); // set the number of columns
  textarea.setAttribute('placeholder', 'Enter your comment here...'); // set the placeholder text
  return textarea;
}
//-------------------------------------------------------------------------------------SECTION 2------------------------------------------------------------------------------------------
function drawBarGraph(data) {
  // prepare the data for the chart
  const categories = data.map((item) => item[0]);
  const mpTotals = data.map((item) => item.slice(1));

  // prepare the dataset for each marking period
  const datasets = mpTotals[0].map((_, index) => ({
    label: `Marking Period ${index + 1}`,
    data: mpTotals.map((item) => {
      const fractionParts = item[index].split('/').map(Number);
      if (fractionParts.length === 2) {
        const percentage = (fractionParts[0] / fractionParts[1]) * 100;
        return percentage.toFixed(2); // limit decimal places to 2
      } else {
        return 'N/A';
      }
    }),
    backgroundColor: getRandomColor(), // function to get random colors for each bar
  }));

  // create the bar graph
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
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Percentage',
          },
          ticks: {
            callback: function (value) {
              return value + '%';
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => context.parsed.y + '%',
          },
        },
      },
    },
  });
}

// function drawBarGraph(data) {
//   // Prepare the data for the chart
//   const categories = data.map((item) => item[0]);
//   const mpTotals = data.map((item) => item.slice(1));

//   // Prepare the dataset for each marking period
//   const datasets = mpTotals[0].map((_, index) => ({
//     label: `Marking Period ${index + 1}`,
//     data: mpTotals.map((item) => item[index].split('/')[0]), // Extract the numerator from the fraction
//     backgroundColor: getRandomColor(), // Function to get random colors for each bar
//   }));

//   // Create the bar graph
//   const ctx = document.getElementById('barGraph').getContext('2d');
//   new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: categories,
//       datasets: datasets,
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Grades',
//           },
//         },
//       },
//     },
//   });
// }
//-------------------------------------------------------------------------------------SECTION 3------------------------------------------------------------------------------------------
function getRandomColor() {
  // function to generate a random color in hexadecimal format
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// just calls create table
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















