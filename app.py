from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    weather_data = None
    if request.method == 'POST':
        latitude = request.form['latitude']
        longitude = request.form['longitude']
        startDateTime = request.form['startDateTime']
        endDateTime = request.form['endDateTime']
        
        api_url = f"https://api.weather.com/v3/wx/hod/r1/direct?geocode={latitude},{longitude}&startDateTime={startDateTime}&endDateTime={endDateTime}&format=json&units=m&apiKey=7698370dea91420198370dea91720199"
        
        response = requests.get(api_url)
        if response.status_code == 200:
            weather_data = response.json()
        else:
            weather_data = {'error': 'Could not retrieve data'}

    return render_template('index.html', weather_data=weather_data)

if __name__ == '__main__':
    app.run(debug=True)
