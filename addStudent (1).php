<?php
/**
 * Add Student API
 * 
 * This file handles adding new students to the database. It receives student name
 * data via POST request and inserts a new record into the studentKey table.
 * 
 * @author Anurag Ray Chowdhury
 * @version 1.0
 */

include 'dbConnection.php';

# student name is taken in here through the form 
$studName = $_POST['AddStudentName'];

# used for debugging to ensure we got right student name
echo $studName;

# insert into the studentKey table (gives student name col)
$sql = "INSERT INTO studentKey(student_name) VALUES ('$studName')"; 

# error handling
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
