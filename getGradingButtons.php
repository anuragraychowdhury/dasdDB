<?php
/**
 * Get Grading Buttons Data API
 * 
 * This file retrieves skill data and current grades for a specific student and date.
 * It returns JSON data containing skill information and their current grade status
 * (marked or unmarked) to populate the grading interface buttons.
 * 
 * @author Anurag Ray Chowdhury
 * @version 1.0
 */

include 'dbConnection.php';

# retrieves appropriate data from the URL
$sid = $_GET['grading_sid'];
$date = $_GET['grading_date'];

# gets all columns from skill key and the grade from the grading table (0 if no grade exists)
# result table craeted where we have the grades of individual skills for a certain date and the marked skills are 1, the unmarked are 0
# query (remember this is for ONE date) is stored in result
$sql = "SELECT skillKey.*,coalesce(gradingTable.grade,0) FROM gradingTable RIGHT JOIN skillKey ON gradingTable.skilltag = skillKey.skill_id AND gradingTable.student_id = $sid AND gradingTable.date = '$date';";

$result = $conn->query($sql);
echo json_encode($result->fetch_all());
?>