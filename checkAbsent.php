<?php
include 'dbConnection.php';

# checks whether grading sid and grading date are in the URL (gets if that is the case)
if (isset($_GET['grading_sid']) && isset($_GET['grading_date'])) {
    $sid = $_GET['grading_sid'];
    $date = $_GET['grading_date'];

    # result here will simply hold the grade based on the params provided inside the sql statement
    # stored in result and eventually fetched by the entry
    $sql = "SELECT grade FROM gradingTable WHERE student_id = $sid AND date = '$date' AND skilltag = 0;";
    $result = $conn->query($sql);
    $entry = $result->fetch_assoc();

    # if the entry exists and grade is 1, return 1; otherwise return 0
    if ($entry && $entry['grade'] == 1) {
        echo "1"; # skilltag 0 with grade 1 exists (absent button should remain green)
    } else {
        echo "0"; # skilltag 0 with grade 1 does not exist (absent button should be blue)
    }
} else {
    echo "Invalid parameters.";
}
?>
