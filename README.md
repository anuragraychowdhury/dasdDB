# DASD Student Database

A comprehensive PHP-based student grading and attendance tracking system designed for special education programs. This application allows teachers to track student progress across multiple skill categories and generate detailed reports.

## 🎯 Features

- **Student Management**: Add, view, and manage student records
- **Skill Tracking**: Track skills across customizable categories
- **Attendance Management**: Mark students absent and prevent skill marking on absent days
- **Marking Periods**: Organize data across 4 marking periods throughout the school year
- **Comprehensive Reports**: Generate detailed reports with visual charts and progress tracking
- **Real-time Updates**: Save changes instantly with visual feedback

## 🛠️ Technology Stack

- **Backend**: PHP 8.4+
- **Database**: MySQL 9.4+
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js for data visualization
- **Server**: PHP Built-in Development Server

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **PHP 8.4+** with MySQL extension
- **MySQL 9.4+** or MariaDB
- **Web Browser** (Chrome, Firefox, Safari, Edge)

### macOS Installation

```bash
# Install PHP and MySQL using Homebrew
brew install php mysql

# Start MySQL service
brew services start mysql
```

## 🚀 Quick Start

### 1. Clone the Repository (skip if project is already local)

```bash
git clone https://github.com/anuragraychowdhury/dasdDB.git
cd dasdDB
```

### 2. Database Setup (skip if database is set up)

```bash
# Connect to MySQL as root
mysql -u root -p

# Create database and user
CREATE DATABASE id19353024_test;
CREATE USER 'id19353024_testuser'@'localhost' IDENTIFIED BY 'Root_Truss_123';
GRANT ALL PRIVILEGES ON id19353024_test.* TO 'id19353024_testuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Start the Application

```bash
# Start PHP development server
php -S localhost:8000
```

### 4. Access the Application

Open your web browser and navigate to:
```
http://localhost:8000
```

## 📊 Database Schema

The application uses a MySQL database with 4 main tables:

### Database Structure

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   studentKey    │    │    skillKey     │    │     mpData      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ student_id (PK) │    │ skill_id (PK)   │    │ mp_id (PK)      │
│ student_name    │    │ skilltag        │    │ markingPeriod   │
└─────────────────┘    │ category        │    │ MPstartDate     │
         │              └─────────────────┘   │ MPendDate       │
         │                       │            └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  gradingTable   │
                    ├─────────────────┤
                    │ grading_id (PK) │
                    │ student_id (FK) │◄─── studentKey
                    │ date            │
                    │ skilltag (FK)   │◄─── skillKey
                    │ grade           │
                    └─────────────────┘
```

### Table Details

#### 1. **studentKey** - Student Information
- `student_id` (Primary Key, Auto Increment)
- `student_name` (VARCHAR) - Student's full name

#### 2. **skillKey** - Skills and Categories
- `skill_id` (Primary Key, Auto Increment) 
- `skilltag` (VARCHAR) - Name of the skill
- `category` (VARCHAR) - Category the skill belongs to

#### 3. **mpData** - Marking Periods
- `mp_id` (Primary Key, Auto Increment)
- `markingPeriod` (VARCHAR) - Period name (e.g., "MP1", "MP2")
- `MPstartDate` (DATE) - Start date of marking period
- `MPendDate` (DATE) - End date of marking period

#### 4. **gradingTable** - Student Grades and Attendance
- `grading_id` (Primary Key, Auto Increment)
- `student_id` (Foreign Key) - References studentKey.student_id
- `date` (DATE) - Date of the grade/attendance record
- `skilltag` (INT) - References skillKey.skill_id (0 = absent)
- `grade` (INT) - 1 for completed skill, 0 for absent

### Key Relationships

- **One-to-Many**: One student can have many grading records
- **One-to-Many**: One skill can be graded many times across different students/dates
- **Attendance Logic**: When `skilltag = 0`, it represents an absence record
- **Marking Periods**: Used to filter and organize data by academic periods

## 🎮 How to Use

### Adding Students
1. Navigate to the main page
2. Click "Add Student" button
3. Enter student name and save

### Grading Students
1. Click on a student from the main list
2. Select the date for grading
3. Click on skill buttons to mark them as completed (green)
4. Click "Save Changes" to persist the data
5. Use "Mark Absent" to mark a student absent for the day

### Generating Reports
1. Click on a student from the main list
2. Click "Generate Report" button
3. View comprehensive reports with:
   - Skill progress across marking periods
   - Visual charts showing performance
   - Attendance tracking
   - Category-wise breakdowns

### Managing Skills
- **Add Skills**: Use the "Add Skill" form to add new skills
- **Delete Skills**: Remove skills that are no longer needed
- **Categories**: Organize skills into meaningful categories

## 📁 Project Structure

```
dasdDB/
├── index.html              # Main application page
├── gradingKey.html         # Student grading interface
├── gradingReport.html      # Report generation page
├── contextualData.html     # Additional data entry
├── confirmation.html       # Confirmation pages
├── dbConnection.php        # Database connection
├── getStudents.php         # Student data retrieval
├── getGradingButtons.php   # Skill button data
├── saveData.php           # Save grading data
├── markAbsent.php         # Mark student absent
├── checkAbsent.php        # Check absence status
├── attendance.php         # Attendance calculations
├── gradingReport.php      # Report data generation
├── addStudent (1).php     # Add new students
├── addSkill.php           # Add new skills
├── deleteStudent.php      # Remove students
├── deleteSkill.php        # Remove skills
├── addMpData.php          # Add marking period data
├── studentList.js         # Main page JavaScript
├── gradingKey.js          # Grading interface JavaScript
├── gradingReport.js       # Report JavaScript
├── contextualData.js      # Additional data JavaScript
├── stylesIndex.css        # Main page styles
├── stylesGK.css           # Grading interface styles
├── search_table_style.css # Table styling
└── README.md              # This file
```

## 🔧 Configuration

### Database Connection
The database connection is configured in `dbConnection.php`:

```php
$servername = "localhost";
$username = "id19353024_testuser";
$password = "Root_Truss_123";
$dbname = "id19353024_test";
```
