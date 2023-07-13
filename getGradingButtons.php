<?php
include 'dbConnection.php';
$sid = $_GET['grading_sid'];
$date = $_GET['grading_date'];

$sql = "SELECT skillKey.*,coalesce(gradingTable.grade,0) FROM gradingTable RIGHT JOIN skillKey ON gradingTable.skilltag = skillKey.skilltag AND gradingTable.student_id = $sid AND gradingTable.date = '$date';";

$result = $conn->query($sql);
echo json_encode($result->fetch_all());
?>