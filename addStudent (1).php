<?php
include 'dbConnection.php';
$studName = $_POST['AddStudentName'];
echo $studName;
$sql = "INSERT INTO studentKey(student_name) VALUES ('$studName')"; 

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
