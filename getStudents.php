<?php
include 'dbConnection.php';

# retrieves the student_id and the student_name from the studentkey table 
$sql = "SELECT student_id, student_name FROM `studentKey`";

# query executes, success (True or False) is in result
$result = $conn->query($sql);

# all student ids and student names are fetched from table and put into a JSON format
# PHP array is converted to JSON string for processing (exp: [[1,"Alice"],[2,"Bob"],[3,"Charlie"]])
echo json_encode($result->fetch_all());
?>