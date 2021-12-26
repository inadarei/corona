#! /usr/bin/env python3

# Source: https://github.com/nytimes/covid-19-data
import pandas as pd
import json
from datetime import date
from dateutil.relativedelta import *

state_data = pd.read_csv("./covid-19-data/us-states.csv")

data = {}
df = {}


dateformat = "%Y-%m-%d";
today = date.today()
startdate = today+relativedelta(months=-15)
todate = today.strftime(dateformat)
fromdate = startdate.strftime(dateformat)
#print(todate)
#print(fromdate)

for state in state_data.state.unique():
  df = state_data[
    state_data['state'] == state
  ].set_index('date') \
   .filter(items=['cases', 'deaths']) \
   .loc[fromdate:todate];
  #print('state ', state)
  #print(df)
  data[state] = df.to_dict(); 

data_js = "const states_data = " + json.dumps(data)

with open('states.js', 'w') as f:
    f.write(data_js)
