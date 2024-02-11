# Filename - server.py

# Import flask and datetime module for showing date and time
from flask import Flask, request
from flask_cors import CORS
import datetime
import pandas as pd
import plotly
import plotly.express as px
import json
from urllib.request import urlopen

df = pd.read_csv('DATA_PROJECT.csv')
#print(df)
df["Date"] = pd.to_datetime(df["Date"])
df = df.set_index(df["Date"])
df.drop(df.tail(2).index,inplace=True)
df.pop(df.columns[-1])
#print(df)

df2 = pd.read_csv('ongoing_predictions.csv')
df2 = df2.transpose()
df2.columns = df.columns[0:-2]
today = datetime.datetime.today().date()
date_range = pd.date_range(today, periods=1030, freq='D')
df2.index = date_range

end_date = today + datetime.timedelta(days=45)  # 30 days for a month + 15 days for half a month
end_datetime = datetime.datetime.combine(end_date, datetime.datetime.min.time())
filtered_df2 = df2[df2.index <= end_datetime]


x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)
CORS(app)


# Route for seeing a data
@app.route('/data')
def get_time():

	# Returning an api for showing in reactjs
	return {
		'Name':"Pranay's House Depreciation", 
		"Age":"22",
		"Date":x, 
		"programming":"python"
		}


@app.route('/<string:cur>')
def chart1(cur):
    fig = px.line(df[cur], x=df.index, y=cur, template="plotly_dark")
    print(df[cur])
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON

@app.route('/pred_<string:cur>')
def chart2(cur):
    currencies = ['AUD','BWP','BRL','BND','CAD','CLP','CNY','DKK','EUR','INR','JPY','KRW','KWD','MYR','MTL','NZD','NOK','OMR','QAR','SAR','SGD','ZAR','SEK','CHF','THB','TTD','AED','GBP','USD']
    fig = px.line(filtered_df2[cur], x=filtered_df2.index, y=cur, template="plotly_dark")
    print(df2[cur])
    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON

@app.route('/endpoint', methods=['POST'])
def endpoint():
    data = request.json


# Running app
if __name__ == '__main__':
	app.run(debug=True)
