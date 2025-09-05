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

# Check if student is marked absent for this date
$sql_check_absent = "SELECT * FROM `gradingTable` WHERE `student_id` = '$sid' AND `date` = '$date' AND `skilltag` = '0'";
$result_check_absent = $conn->query($sql_check_absent);

# If student is absent, don't allow skill marking
if ($result_check_absent->num_rows > 0) {
    echo "Cannot mark skills - student is absent on this date";
    exit;
}

# preg_split is used to split the skills array using a delimiter
# preg_split(string $pattern, string $subject); 
# "/\,/" regex expression to match a comma (using comma as the delimiter)
$skill_arr = preg_split ("/\,/", $skills); 

# creation of a SQL query that will delete from database given specific conditions
# BUT ONLY DELETE SKILL RECORDS, NOT ABSENT RECORDS
$sql = "DELETE FROM `gradingTable` WHERE `student_id` = '" . $sid . "' AND `date` = '" . $date . "' AND `skilltag` != '0'";

# query is passed to the connection object to interact with the server and perform request
# returns True if query was succesful, False otherwise
$result = $conn->query($sql);

# loops through each skill in the skill array
# inserts new changes into the gradinTable (AFTER PREVIOUS DELETION)
foreach ($skill_arr as $skill) {
    # Get the skill_id for the skill name
    $sql_get_id = "SELECT skill_id FROM skillKey WHERE skilltag = '$skill'";
    $result_get_id = $conn->query($sql_get_id);
    
    if ($result_get_id && $result_get_id->num_rows > 0) {
        $row = $result_get_id->fetch_assoc();
        $skill_id = $row['skill_id'];
        
        $sql = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES (" . $sid .", '". $date."', '" . $skill_id. "', '1');";
        $result = $conn->query($sql);
    }
}

echo "Changes saved";
?>
