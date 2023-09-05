from flask import Flask, render_template, request, Response, jsonify, json
import requests
import pandas as pd
import io
from flask import jsonify

app = Flask(__name__)

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# グローバル変数として csv_data を初期化
csv_data = None

@app.route('/api/weather', methods=['GET', 'POST'])
def api_weather():
    global csv_data
    weather_data = None

    if request.method == 'POST':
        data = request.get_json()
        latitude = data['latitude']
        longitude = data['longitude']
        startDate = data['startDate']
        startTime = data['startTime']
        startDateTime = f"{startDate}T{startTime}Z"
        endDate = data['endDate']
        endTime = data['endTime']
        endDateTime = f"{endDate}T{endTime}Z"

        api_url = f"https://api.weather.com/v3/wx/hod/r1/direct?geocode={latitude},{longitude}&startDateTime={startDateTime}&endDateTime={endDateTime}&format=json&units=m&apiKey=7698370dea91420198370dea91720199"
        response = requests.get(api_url)
        
        if response.status_code == 200:
            weather_data = response.json()
            df = pd.DataFrame.from_dict(weather_data)
            csv_data = df.to_csv(index=False)  # csv_data を更新
        else:
            weather_data = {'error': 'Could not retrieve data'}

    return jsonify(weather_data)

@app.route('/download_csv')
def download_csv():
    global csv_data 

    if csv_data:
        output = io.StringIO()
        output.write(csv_data)
        output.seek(0)
        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment;filename=weather_data.csv"}
        )
    else:
        return "No data available for download"

if __name__ == '__main__':
    app.run(debug=True)
