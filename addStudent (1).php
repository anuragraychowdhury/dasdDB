<?php
include 'dbConnection.php';
$studName = $_POST['AddStudentName'];
echo $studName;
$sql = "INSERT INTO studentKey(student_name)
VALUES ('$studName')"; 
//checks AddStudentName value from index.html (html part for add student) and posts it

if ($conn->query($sql) === TRUE) 
{
  echo "New record created successfully";
} 
else 
{
  echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
?>