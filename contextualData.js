const studentName = new URLSearchParams(window.location.search).get('studentName');
    // set the student name in the <span> element
    var studentNameElement = document.getElementById('studentNameHTML');
    studentNameElement.innerHTML = studentName;

const studentID = new URLSearchParams(window.location.search).get('studentID');

// form is submitted at the end of the contextual data input (sid is taken as a hidden variable and submitted to the form; sid was in URL)
function newFormSubmit()
{
    document.getElementById('sid').value = studentID;
    document.getElementById("formToGR").submit();
}

// date picker interface for the start and the end date 
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
      
    });
