from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from textblob import TextBlob

# Initialize Flask app
app = Flask(__name__)
CORS(app origins=["https://academic-ikcm-l849idyqk-abc123456-bits-projects.vercel.app"])

@app.route('/')
def home():
    return jsonify({"message": "AI Academic Analytics Backend Running!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 400

    required_columns = ['Student_Name', 'Total']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        return jsonify({"error": f"CSV must have the following columns: {', '.join(missing_columns)}"}), 400

    if 'Attendance' in df.columns and 'Total' in df.columns:
        X = df[['Attendance']]
        y = df['Total']
        model = LinearRegression()
        model.fit(X, y)
        df['Predicted_Total'] = model.predict(X).round(2)

    avg_marks = df['Total'].mean() if 'Total' in df.columns else 0
    pass_count = df[df['Total'] >= 40].shape[0] if 'Total' in df.columns else 0
    fail_count = df[df['Total'] < 40].shape[0] if 'Total' in df.columns else 0
    total_students = df.shape[0]

    dept_avg = df.groupby('Department')['Total'].mean().round(2).to_dict() if 'Department' in df.columns else {}

    columns_to_select = ['Student_Name', 'Total']
    if 'Predicted_Total' in df.columns:
        columns_to_select.append('Predicted_Total')

    student_scores = df[columns_to_select].to_dict(orient='records') if 'Student_Name' in df.columns else []

    csv_data = df.to_csv(index=False)

    return jsonify({
        "kpis": {
            "average_marks": round(avg_marks, 2),
            "pass_count": pass_count,
            "fail_count": fail_count,
            "total_students": total_students
        },
        "department_avg": dept_avg,
        "student_scores": student_scores,
        "csv_data": csv_data
    })

@app.route('/feedback', methods=['POST'])
def feedback_analysis():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return jsonify({"error": f"Failed to read CSV file: {str(e)}"}), 400

    if 'Feedback' not in df.columns:
        return jsonify({"error": "CSV must have 'Feedback' column"}), 400

    sentiments = {"positive": 0, "neutral": 0, "negative": 0}
    df['Sentiment'] = ""
    for i, feedback in enumerate(df['Feedback']):
        analysis = TextBlob(str(feedback))
        if analysis.sentiment.polarity > 0.1:
            sentiments['positive'] += 1
            df.at[i, 'Sentiment'] = "Positive"
        elif analysis.sentiment.polarity < -0.1:
            sentiments['negative'] += 1
            df.at[i, 'Sentiment'] = "Negative"
        else:
            sentiments['neutral'] += 1
            df.at[i, 'Sentiment'] = "Neutral"

    csv_data = df.to_csv(index=False)
    return jsonify({
        "sentiments": sentiments,
        "csv_data": csv_data
    })

@app.route('/demo/academic', methods=['GET'])
def demo_academic():
    try:
        df = pd.read_csv('../sample_data/academic_data.csv')
    except Exception as e:
        return jsonify({"error": f"Failed to load demo data: {str(e)}"}), 500

    if 'Attendance' in df.columns and 'Total' in df.columns:
        X = df[['Attendance']]
        y = df['Total']
        model = LinearRegression()
        model.fit(X, y)
        df['Predicted_Total'] = model.predict(X).round(2)

    avg_marks = df['Total'].mean() if 'Total' in df.columns else 0
    pass_count = df[df['Total'] >= 40].shape[0] if 'Total' in df.columns else 0
    fail_count = df[df['Total'] < 40].shape[0] if 'Total' in df.columns else 0
    total_students = df.shape[0]

    dept_avg = df.groupby('Department')['Total'].mean().round(2).to_dict() if 'Department' in df.columns else {}

    columns_to_select = ['Student_Name', 'Total']
    if 'Predicted_Total' in df.columns:
        columns_to_select.append('Predicted_Total')

    student_scores = df[columns_to_select].to_dict(orient='records') if 'Student_Name' in df.columns else []

    return jsonify({
        "kpis": {
            "average_marks": round(avg_marks, 2),
            "pass_count": pass_count,
            "fail_count": fail_count,
            "total_students": total_students
        },
        "department_avg": dept_avg,
        "student_scores": student_scores
    })

@app.route('/demo/feedback', methods=['GET'])
def demo_feedback():
    try:
        df = pd.read_csv('../sample_data/feedback_data.csv')
    except Exception as e:
        return jsonify({"error": f"Failed to load demo data: {str(e)}"}), 500

    if 'Feedback' not in df.columns:
        return jsonify({"error": "Demo data missing 'Feedback' column"}), 500

    sentiments = {"positive": 0, "neutral": 0, "negative": 0}
    for feedback in df['Feedback']:
        analysis = TextBlob(str(feedback))
        if analysis.sentiment.polarity > 0.1:
            sentiments['positive'] += 1
        elif analysis.sentiment.polarity < -0.1:
            sentiments['negative'] += 1
        else:
            sentiments['neutral'] += 1

    return jsonify({
        "sentiments": sentiments
    })
# Serve React frontend
@app.route('/')
def serve_index():
    return send_from_directory('../frontend/build', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend/build', path)


# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
