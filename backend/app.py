from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "AI Academic Analytics Backend Running!"})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    df = pd.read_csv(file)

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

    student_scores = df[['Student_Name','Total','Predicted_Total']].to_dict(orient='records') if 'Student_Name' in df.columns else []

    csv_data = df.to_csv(index=False)

    return jsonify({
        "kpis": {
            "average_marks": round(avg_marks,2),
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
    df = pd.read_csv(file)

    if 'Feedback' not in df.columns:
        return jsonify({"error": "CSV must have 'Feedback' column"}), 400

    sentiments = {"positive":0, "neutral":0, "negative":0}
    df['Sentiment'] = ""
    for i, feedback in enumerate(df['Feedback']):
        analysis = TextBlob(str(feedback))
        if analysis.sentiment.polarity > 0.1:
            sentiments['positive'] += 1
            df.at[i,'Sentiment'] = "Positive"
        elif analysis.sentiment.polarity < -0.1:
            sentiments['negative'] += 1
            df.at[i,'Sentiment'] = "Negative"
        else:
            sentiments['neutral'] += 1
            df.at[i,'Sentiment'] = "Neutral"

    csv_data = df.to_csv(index=False)
    return jsonify({
        "sentiments": sentiments,
        "csv_data": csv_data
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
