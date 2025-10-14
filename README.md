# AI Academic Analytics Dashboard

A powerful AI-driven analytics platform for educational institutions to analyze student performance and teacher feedback using machine learning.

## Features

### Academic Data Analysis
- Upload student performance CSV files
- Machine learning predictions using Linear Regression
- Real-time KPI dashboard showing:
  - Average marks
  - Pass/fail statistics
  - Total student count
- Department-wise performance bar charts
- Color-coded student performance heatmap
- Export analyzed data with predictions

### Feedback Sentiment Analysis
- Upload teacher feedback CSV files
- AI-powered sentiment classification
- Interactive pie chart showing sentiment distribution
- Identifies positive, neutral, and negative feedback

## Quick Start

The application is already configured and running! Simply:

1. **Academic Analysis:**
   - Click "Choose File" under "Academic Data Analysis"
   - Upload `sample_data/academic_data.csv` (or your own CSV)
   - Click "Upload & Analyze"
   - View the comprehensive analytics dashboard

2. **Feedback Analysis:**
   - Click "Choose File" under "Teacher Feedback Analysis"
   - Upload `sample_data/feedback_data.csv` (or your own CSV)
   - Click "Analyze Feedback"
   - View sentiment distribution

## CSV File Requirements

### Academic Data CSV
Required columns:
- `Student_Name` - Student's full name
- `Department` - Academic department
- `Attendance` - Attendance percentage (0-100)
- `Total` - Total marks obtained

Example:
```csv
Student_Name,Department,Attendance,Total
Alice Johnson,Computer Science,85,78
Bob Smith,Mathematics,90,82
```

### Feedback Data CSV
Required column:
- `Feedback` - Text feedback from students

Optional columns:
- `Teacher_Name` - Instructor name
- `Course` - Course identifier

Example:
```csv
Teacher_Name,Course,Feedback
Dr. Smith,CS101,The lectures were very engaging and well-structured!
```

## Technology Stack

- **Backend:** Python Flask with scikit-learn & TextBlob
- **Frontend:** React with Tailwind CSS
- **Visualization:** Chart.js
- **ML Models:** Linear Regression, Sentiment Analysis

## Sample Data

Two sample CSV files are provided in the `sample_data/` directory:
- `academic_data.csv` - 20 sample student records
- `feedback_data.csv` - 10 sample teacher feedback entries

## How It Works

### Machine Learning Prediction
The system uses Linear Regression to analyze the relationship between student attendance and academic performance, generating predicted scores based on attendance patterns.

### Sentiment Analysis
TextBlob analyzes feedback text and classifies it as:
- **Positive** - Polarity score > 0.1
- **Neutral** - Polarity score between -0.1 and 0.1
- **Negative** - Polarity score < -0.1

## Performance Heatmap Color Coding

- 🟢 **Green** - Excellent (≥75 marks)
- 🟡 **Yellow** - Average (50-74 marks)
- 🔴 **Red** - Needs Improvement (<50 marks)

## Export Features

After academic analysis, click "Download Analyzed CSV" to export a CSV file containing:
- Original student data
- ML-predicted performance scores
- Ready for further analysis in Excel or other tools
