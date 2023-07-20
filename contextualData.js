const studentName = new URLSearchParams(window.location.search).get('studentName');
    // Set the student name in the <span> element
    var studentNameElement = document.getElementById('studentNameHTML');
    studentNameElement.innerHTML = studentName;

const studentID = new URLSearchParams(window.location.search).get('studentID');

function newFormSubmit()
{
    document.getElementById('sid').value = studentID;
    document.getElementById("formToGR").submit();
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
          var durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          $("#duration").val(durationInDays + " days");
        }
        
      }
    });
