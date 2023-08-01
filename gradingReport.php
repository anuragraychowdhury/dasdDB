<?php
include 'dbConnection.php';
$sid = $_GET['student_id'];

// Fetch the marking periods start and end dates from the database
$sqlMarkingPeriods = "SELECT markingPeriod, MPstartDate, MPendDate FROM mpData";
$resultMarkingPeriods = $conn->query($sqlMarkingPeriods);

// Array to hold the result data for all marking periods
$allMarkingPeriodsData = array();

while ($rowMarkingPeriod = $resultMarkingPeriods->fetch_assoc()) {
    $markingPeriod = $rowMarkingPeriod['markingPeriod'];
    $startDate = $rowMarkingPeriod['MPstartDate'];
    $endDate = $rowMarkingPeriod['MPendDate'];

    // Query to get data for the current marking period
    $sql = "SELECT skillKey.skill AS skill, skillKey.category, COALESCE(SUM(gradingTable.grade), 0) AS total_grade 
            FROM skillKey 
            LEFT JOIN gradingTable ON gradingTable.skilltag = skillKey.skilltag 
            AND gradingTable.student_id = $sid 
            AND gradingTable.date BETWEEN '$startDate' AND '$endDate' 
            GROUP BY skillKey.skill, skillKey.category 
            ORDER BY skillKey.category";

    $result = $conn->query($sql);

    // Fetch the data for the current marking period and store it in an array
    $currentMarkingPeriodData = array();
    while ($row = $result->fetch_assoc()) {
        $currentMarkingPeriodData[] = $row;
    }

    // Add the data for the current marking period to the array of all marking periods' data
    $allMarkingPeriodsData[$markingPeriod] = $currentMarkingPeriodData;
}

echo json_encode($allMarkingPeriodsData);
?>
