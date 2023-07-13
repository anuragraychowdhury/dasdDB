getStudent();
bindEventHandlers(); // This binds the event handler

function getStudent()
{
    
    var table = document.getElementById("myTable");
    if (table.innerHTML != "<tr class='header'><th style='width:10%'>Name</th></tr>"){
        table.innerHTML ="<tr class='header'><th style='width:10%'>Name</th></tr>";
    }
    
    var oHttp = new XMLHttpRequest();
    var oThat = this;
 
 oHttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
            {
                var stdlist = JSON.parse(this.response);
                //debugger;
                for(var i = 0; i < stdlist.length; i++)
                    {
                        
                        
                     document.getElementById("myTable").innerHTML += '<tr> <td> <div class="block" id="studName" onclick="sendSIDAndSNAME(' + stdlist[i][0] + ', \'' + stdlist[i][1].replace("+", "") + '\')">' + stdlist[i][1].replace("+", " ") + '</div> </td> </tr>'; 
                        
                        // document.getElementById("myTable").innerHTML += '<tr> <td> <div class="block" id="studName" onclick="sendSNAME(\'' + stdlist[i][1] + '\')">' + stdlist[i][1] + '</div> </td> </tr>';


                        //document.getElementById("myTable").innerHTML += '<tr> <td> <div class="block" id="studName" onclick="sendSID(' + stdlist[i][0] + ')">' + stdlist[i][1] + '</div> </td> </tr>';
                        
                        

                        /*
                        newrow = document.getElementById("myTable").insertRow(1);
                        id = newrow.insertCell(0);
                        id.innerHTML = '<button id="studId" >'+stdlist[i][0]+'</button>';
                        nameVariable = newrow.insertCell(1);
                        nameVariable.innerHTML = '<button id="studName">'+stdlist[i][1]+'</button>';
                        */
                    }//"<a onClick=\"hifi("+ stdlist[i].ID+");\">"+stdlist[i].Name+"</a>";
                  // document.getElementById("myInput").onkeyup = filterTable(); 
                }
            };
    oHttp.open("GET", "getStudents.php", true);
    oHttp.send();
}



function sendSID(but)
    {
        document.getElementById("sid").value = but;
        document.getElementById("formToGK").submit();
    } //getting studentID and using it for the next page
    
function sendSNAME(name)
    {
        document.getElementById("sname").value = name;
        document.getElementById("formToGK").submit();
    }
    
function sendSIDAndSNAME(id, name) 
    {
        sendSID(id);
        sendSNAME(name);
    }

function filterTable() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
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

function deleteStudent() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteStudent.php?", true);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhttp.responseText);
    }
  };

  var params='DeleteStudentName='+encodeURIComponent(document.getElementById("DeleteStudentName").value);
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

function deleteValidation() {
    deleteStudent();
    getStudent();
    showSnackbar();
}

function AddOpenForm() {
  document.getElementById("addForm").style.display = "block";
  AddDisableButton();
}//end of openForm

function DeleteOpenForm() {
  document.getElementById("deleteForm").style.display = "block";
  DeleteDisableButton();
}//end of openForm

function AddCloseForm() {
  document.getElementById("addForm").style.display = "none";
  AddEnableButton()
}//end of closeForm

function DeleteCloseForm() {
  document.getElementById("deleteForm").style.display = "none";
  enableButton();
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

function DeleteDisableButton() 
{
  document.getElementById("delete_student_button").disabled = true;
}

function DeleteEnableButton() 
{
  document.getElementById("delete_student_button").disabled = false;
}