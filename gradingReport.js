// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Retrieve the input values from the URL parameters
const studentName = urlParams.get('student-name');
const startDate = formatDate(urlParams.get('start-date'));
const endDate = formatDate(urlParams.get('end-date'));
console.log("nizz",startDate,endDate);//penis
const teacher = urlParams.get('teacher');
const jobCoachName = urlParams.get('job-coach-name');
const workSite = urlParams.get('work-site');
const school = urlParams.get('school');
const studentID = urlParams.get('studentID');

  // Display the retrieved values in the form
document.getElementById('display-student-name').innerText = studentName;
document.getElementById('display-start-date').innerText = startDate;
document.getElementById('display-end-date').innerText = endDate;
document.getElementById('display-teacher').innerText = teacher;
document.getElementById('display-job-coach-name').innerText = jobCoachName;
document.getElementById('display-work-site').innerText = workSite;
document.getElementById('display-school').innerText = school;
loadReport();


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

function loadReport() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var GRdata = JSON.parse(xhr.responseText);
      createTable(GRdata);
    }
  };
  xhr.open('GET', "gradingReport.php?start_date="+startDate+"&end_date="+endDate+"&student_id="+studentID, true);
  xhr.send();
}

$(function() {
  $("#start-date").datepicker({
    dateFormat: "mm/dd/yy",
    onSelect: function(selected) {
      var startDate = $(this).datepicker("getDate");
      $("#end-date").datepicker("option", "minDate", startDate);
      updateDuration();
    }
  });

  $("#end-date").datepicker({
    dateFormat: "mm/dd/yy",
    onSelect: function(selected) {
      var endDate = $(this).datepicker("getDate");
      $("#start-date").datepicker("option", "maxDate", endDate);
      updateDuration();
    }
  });

  function updateDuration() {
    var startDate = $("#start-date").datepicker("getDate");
    var endDate = $("#end-date").datepicker("getDate");
    if (startDate && endDate) {
      var durationInDays = calculateDuration(startDate, endDate);
      $("#duration").val(durationInDays + " days");
    }
  }

  function calculateDuration(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    var days = Math.round(Math.abs((endDate - startDate) / millisecondsPerDay)) + 1;

    var weekends = 0;
    for (var i = 0; i < days; i++) {
      var currentDate = new Date(startDate.getTime() + i * millisecondsPerDay);
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        weekends++;
      }
    }
    var duration = days - weekends;
    return duration;
  }
});
