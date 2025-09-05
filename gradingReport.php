<?php
include 'dbConnection.php';
$sid = $_GET['student_id'];

# fetch all amrking period data from the data base
$sqlMarkingPeriods = "SELECT markingPeriod, MPstartDate, MPendDate FROM mpData";
$resultMarkingPeriods = $conn->query($sqlMarkingPeriods);

# array that holds all the marking period data
$allMarkingPeriodsData = array();

# similar to attendance, gets all the marking period data in the form of rows
while ($rowMarkingPeriod = $resultMarkingPeriods->fetch_assoc()) {
    $markingPeriod = $rowMarkingPeriod['markingPeriod'];
    $startDate = $rowMarkingPeriod['MPstartDate'];
    $endDate = $rowMarkingPeriod['MPendDate'];

    # SELECT skillKey.skill AS skill -> retrieve the skill column from the skillKey table -> call it skill
    # retrieve the skillKey.category as well
    # adds up all the grades from the grading table for each skill
    # COALESCE(...,0) -> if no grades are found, result will be 0

    # performs a left join based on the skill tag column in both tables
    # filters grades to only have the specific sid, start date and end date
    # join creates new tables which is ordered by skill, category and the total date (total date from above)
    # aggregate is a bigger table, but it is grouped by skill and category and then total grade is displayed for each
    $sql = "SELECT skillKey.skilltag AS skill, skillKey.category, COALESCE(SUM(gradingTable.grade), 0) AS total_grade 
            FROM skillKey 
            LEFT JOIN gradingTable ON gradingTable.skilltag = skillKey.skilltag 
            AND gradingTable.student_id = $sid 
            AND gradingTable.date BETWEEN '$startDate' AND '$endDate' 
            GROUP BY skillKey.skilltag, skillKey.category 
            ORDER BY skillKey.category";

    $result = $conn->query($sql);

    # gets all the current marking period data from above
    $currentMarkingPeriodData = array();
    while ($row = $result->fetch_assoc()) {
        $currentMarkingPeriodData[] = $row;
    }

    # adds all data for the marking period into overall bigger array
    $allMarkingPeriodsData[$markingPeriod] = $currentMarkingPeriodData;
}

echo json_encode($allMarkingPeriodsData);
?>
