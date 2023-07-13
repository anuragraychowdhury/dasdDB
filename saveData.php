<?php
include 'dbConnection.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);

$sid = $_POST["grading_sid"];
$date = $_POST["grading_date"];
$skills = $_POST["skills"];
$skill_arr = preg_split ("/\,/", $skills); 

// Delete existing records for the student and date
$sql = "DELETE FROM `gradingTable` WHERE `student_id` = '" . $sid . "' AND `date` = '" . $date . "'";
$result = $conn->query($sql);

// Insert new records for the selected skills
foreach ($skill_arr as $skill) {
    $sql = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES (" . $sid .", '". $date."', '" . $skill. "', '1');";
    $result = $conn->query($sql);
}
echo "<pre>";
print_r($skills);
echo "</pre>";
echo "<div>Data was inserted.</div>";
?>
<?php
