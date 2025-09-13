<?php
/**
 * Save Grading Data API
 * 
 * This file handles saving student grading data to the database. It processes skill selections
 * for a specific student and date, prevents skill marking when student is absent, and updates
 * the gradingTable with the new grade records.
 * 
 * @author Anurag Ray Chowdhury
 * @version 1.0
 */

# connection to the database
include 'dbConnection.php'; 

# used to display errors to the developer (1 value enables display, 0 disables display)
ini_set('display_errors', 1);

# tells us which errors to display (in this case, all of them)
error_reporting(E_ALL);

# Retrieve data from HTTP POST request sent by the client
# Extract student ID, date, and selected skills from the form submission
$sid = $_POST["grading_sid"];        # Student ID for the grade record
$date = $_POST["grading_date"];      # Date for which skills are being marked
$skills = $_POST["skills"];          # Comma-separated string of selected skill IDs

# Check if student is marked absent for this date
# skilltag = '0' represents an absence record in the database
$sql_check_absent = "SELECT * FROM `gradingTable` WHERE `student_id` = '$sid' AND `date` = '$date' AND `skilltag` = '0'";
$result_check_absent = $conn->query($sql_check_absent);

# If student is absent, prevent skill marking and exit early
if ($result_check_absent->num_rows > 0) {
    echo "Cannot mark skills - student is absent on this date";
    exit;
}

# Split the comma-separated skills string into an array
# This allows us to process each selected skill individually
$skill_arr = preg_split ("/\,/", $skills); 

# Delete existing skill records for this student and date
# Note: We only delete skill records (skilltag != '0'), not absence records
# This ensures we can update skill selections without affecting attendance data
$sql = "DELETE FROM `gradingTable` WHERE `student_id` = '" . $sid . "' AND `date` = '" . $date . "' AND `skilltag` != '0'";

# Execute the deletion query
$result = $conn->query($sql);

# Process each selected skill and insert new grade records
foreach ($skill_arr as $skill) {
    # Get the skill_id for the skill name from the skillKey table
    $sql_get_id = "SELECT skill_id FROM skillKey WHERE skilltag = '$skill'";
    $result_get_id = $conn->query($sql_get_id);
    
    # If skill exists in the database, insert a new grade record
    if ($result_get_id && $result_get_id->num_rows > 0) {
        $row = $result_get_id->fetch_assoc();
        $skill_id = $row['skill_id'];
        
        # Insert new grade record with grade = 1 (skill completed)
        $sql = "INSERT INTO `gradingTable` (`student_id`, `date`, `skilltag`, `grade`) VALUES (" . $sid .", '". $date."', '" . $skill_id. "', '1');";
        $result = $conn->query($sql);
    }
}

echo "Changes saved";
?>
