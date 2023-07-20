<?php
include 'dbConnection.php';

if (isset($_GET['grading_sid']) && isset($_GET['grading_date'])) {
    $sid = $_GET['grading_sid'];
    $date = $_GET['grading_date'];

    // Fetch the entry for skilltag 0 with grade 1 (if it exists)
    $sql = "SELECT grade FROM gradingTable WHERE student_id = $sid AND date = '$date' AND skilltag = 0;";
    $result = $conn->query($sql);
    $entry = $result->fetch_assoc();

    // If the entry exists and grade is 1, return 1; otherwise return 0
    if ($entry && $entry['grade'] == 1) {
        echo "1"; // Skilltag 0 with grade 1 exists (button should remain green)
    } else {
        echo "0"; // Skilltag 0 with grade 1 does not exist (button should be blue)
    }
} else {
    echo "Invalid parameters.";
}
?>
