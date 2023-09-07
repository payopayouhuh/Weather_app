from flask import Flask, render_template, request, Response, jsonify, json
import requests
import pandas as pd
import io
from flask import jsonify
from pytz import timezone
from datetime import datetime
from data_aggregator import aggregate_data
from plot_multiple_chart import plot_multiple
from flask import Flask, send_file



app = Flask(__name__)

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# グローバル変数として csv_data を初期化
csv_data = None


def filter_data_by_hours(data, open_hour, close_hour):
    jst = timezone('Asia/Tokyo') # 日本時間
    filtered_data = {key: [] for key in data.keys()}  # 元データのすべてのキーで空リストを作成

    for i, time_str in enumerate(data['validTimeUtc']):
        # print(time_str)
        time = datetime.fromisoformat(time_str.replace("Z", "+00:00").replace("+0000", "+00:00"))
        #print(time)
        hour = time.hour
        #print("Hour:", hour)  # 2. ロジックの確認

        if open_hour <= hour < close_hour:
            print(f"Adding data for hour {hour}")  
            for key in filtered_data.keys():
                filtered_data[key].append(data[key][i])

    return filtered_data

@app.route('/api/weather', methods=['GET', 'POST'])
def api_weather():
    global csv_data
    weather_data = None

    try:
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
            open_hour = data['open_hour']
            close_hour = data['close_hour']
            time_unit = data['time_unit']


            api_url = f"https://api.weather.com/v3/wx/hod/r1/direct?geocode={latitude},{longitude}&startDateTime={startDateTime}&endDateTime={endDateTime}&format=json&units=m&apiKey=7698370dea91420198370dea91720199"
            response = requests.get(api_url)
            
            if response.status_code == 200:
                weather_data = response.json()
                weather_data = filter_data_by_hours(weather_data, open_hour, close_hour)


                num_cols = data.get('num_cols', [])
                non_num_cols = data.get('non_num_cols', [])

                weather_data = json.loads(aggregate_data(weather_data, time_unit, num_cols, non_num_cols))

                plot_multiple(weather_data, image_path='./images/plot1.png')

                df = pd.DataFrame.from_dict(weather_data)
                csv_data = df.to_csv(index=False)  # csv_data を更新
            else:
                weather_data = {'error': 'Could not retrieve data'}
    except Exception as e:
        print(f"An error occurred: {e}") 
        return jsonify({'error': 'An unexpected error occurred'}), 500

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
    
@app.route('/get_image')
def get_image():
    try:
        return send_file('./images/plot1.png', mimetype='image/png')
    except FileNotFoundError:
        return "グラフ表示するファイルがまだありません", 404

if __name__ == '__main__':
    app.run(debug=True)
