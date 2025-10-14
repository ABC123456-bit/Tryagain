# AI Academic Analytics Dashboard

## Project Overview
An AI-powered academic analytics dashboard that helps educational institutions analyze student performance and teacher feedback using machine learning and sentiment analysis.

**Created:** October 14, 2025
**Tech Stack:** Flask (Python), React, Tailwind CSS, Chart.js
**Status:** Fully functional MVP

## Key Features
1. **Academic Data Analysis**
   - CSV file upload for student data
   - Linear regression model to predict performance based on attendance
   - KPI dashboard (average marks, pass/fail counts, total students)
   - Department-wise performance bar charts
   - Student performance heatmap (color-coded: green ≥75, yellow ≥50, red <50)
   - CSV export with predictions

2. **Feedback Sentiment Analysis**
   - CSV file upload for teacher feedback
   - TextBlob-powered sentiment classification (positive/neutral/negative)
   - Interactive pie chart visualization

## Architecture

### Backend (`backend/app.py`)
- **Framework:** Flask with CORS enabled
- **Port:** 8080
- **Endpoints:**
  - `GET /` - Health check
  - `POST /upload` - Academic data analysis
  - `POST /feedback` - Sentiment analysis
- **ML Models:**
  - Scikit-learn Linear Regression for performance prediction
  - TextBlob for sentiment analysis

### Frontend (`frontend/src/`)
- **Framework:** React 18
- **Port:** 5000 (primary webview)
- **Styling:** Tailwind CSS
- **Charts:** Chart.js with react-chartjs-2
- **Key Component:** `App.js` - Main dashboard with all features

## Project Structure
```
├── backend/
│   └── app.py           # Flask server with ML endpoints
├── frontend/
│   ├── public/
│   │   └── index.html   # HTML template
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── index.js     # React entry point
│   │   └── index.css    # Tailwind imports
│   ├── package.json     # Node dependencies
│   └── .env             # React dev server config
└── sample_data/
    ├── academic_data.csv  # Sample student data
    └── feedback_data.csv  # Sample feedback data

```

## Dependencies

### Python (backend)
- flask
- flask-cors
- pandas
- scikit-learn
- textblob

### Node.js (frontend)
- react, react-dom
- react-scripts (Create React App)
- chart.js, react-chartjs-2
- tailwindcss, postcss, autoprefixer

## How to Use

1. **Academic Analysis:**
   - Upload a CSV with columns: `Student_Name`, `Department`, `Attendance`, `Total`
   - View KPIs, department charts, and student heatmap
   - Download analyzed data with predictions

2. **Feedback Analysis:**
   - Upload a CSV with column: `Feedback`
   - View sentiment distribution pie chart

## Sample Data Format

**Academic CSV:**
```csv
Student_Name,Department,Attendance,Total
Alice Johnson,Computer Science,85,78
```

**Feedback CSV:**
```csv
Teacher_Name,Course,Feedback
Dr. Smith,CS101,The lectures were very engaging!
```

## Recent Changes
- October 14, 2025: Initial implementation with full feature set
  - Backend ML endpoints with Flask
  - React frontend with Tailwind and Chart.js
  - Both workflows configured and running
  - Sample CSV files created for testing
