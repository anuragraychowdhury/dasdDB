<?php
include 'dbConnection.php';

$sql = "SELECT student_id, student_name FROM `studentKey`";

$result = $conn->query($sql);
echo json_encode($result->fetch_all());
?>