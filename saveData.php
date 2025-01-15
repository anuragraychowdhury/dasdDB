<?php
# connection to the database
include 'dbConnection.php'; 

# used to display errors to the developer (1 value enables display, 0 disables display)
ini_set('display_errors', 1);

# tells us which errors to display (in this case, all of them)
error_reporting(E_ALL);

# $_POST is used to retrieve data (HTTP POST request from the CLIENT)
# data is stored in its own respective variables
$sid = $_POST["grading_sid"];
$date = $_POST["grading_date"];
$skills = $_POST["skills"];

# preg_split is used to split the skills array using a delimiter
# preg_split(string $pattern, string $subject); 
# "/\,/" regex expression to match a comma (using comma as the delimiter)
$skill_arr = preg_split ("/\,/", $skills); 

# creation of a SQL query that will delete from database given specific conditions
$sql = "DELETE FROM `gradingTable` WHERE `student_id` = '" . $sid . "' AND `date` = '" . $date . "'";

# query is passed to the connection object to interact with the server and perform request
# returns True if query was succesful, False otherwise
$result = $conn->query($sql);

# loops through each skill in the skill array
# inserts new changes into the gradinTable (AFTER PREVIOUS DELETION)
foreach ($skill_arr as $skill) {
    $sql = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES (" . $sid .", '". $date."', '" . $skill. "', '1');";
    $result = $conn->query($sql);
}

echo "Changes saved";
?>
