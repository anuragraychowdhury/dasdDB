<?php
include 'dbConnection.php';
$startDate = $_GET['start_date'];
$endDate = $_GET['end_date'];
$sid = $_GET['student_id'];

//$sql = "SELECT skill, category, SUM(grade) FROM skillKey LEFT JOIN gradingTable on gradingTable.skilltag = skillKey.skilltag WHERE student_id = $sid AND date BETWEEN '$startDate' AND '$endDate' GROUP BY skill, category, grade;";

$sql="SELECT skillKey.skill AS skill, skillKey.category, COALESCE(SUM(gradingTable.grade), 0) AS total_grade FROM skillKey LEFT JOIN gradingTable ON gradingTable.skilltag = skillKey.skilltag AND gradingTable.student_id = $sid AND gradingTable.date BETWEEN '$startDate' AND '$endDate' GROUP BY skillKey.skill, skillKey.category ORDER BY skillKey.category;";

$result = $conn->query($sql);
echo json_encode($result->fetch_all());
?>
