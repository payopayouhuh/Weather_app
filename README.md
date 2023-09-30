# Weather_app
IBMのインターンシップで作成したweather_app.天気のデータを取得してユーザーが任意にデータを変更,csvによって保存可能.
### Feature to Solve Customer Issues
- **Capability to Acquire Various Information**
   - Prefecture and area (only those with more than 20 stores)
   - Duration
   - Weather information
   - Units of data (/h /day /week /early-mid-late month /month)

### User-Centric Additional Features
- **Display Acquired Data in Graphs**
- **Download Acquired Data as CSV File**
   - Users can preview what kind of data is stored in the CSV file before downloading.

### Source of Data Acquisition
- Weather Company Data Package Service
- Data Package API
   - Weather data is acquired via a RESTful API call.

### Data Processing for Changing Units of Data (/h /day /week /early-mid-late month /month)
- **Averaging:** Items such as temperature and humidity can be averaged.
- **Mode:** icon code → It is also possible to retrieve weather images from here.


![image](https://github.com/payopayouhuh/Weather_app/assets/134220954/5b3baa85-44ea-4949-99de-1f2d0fd8835a)

