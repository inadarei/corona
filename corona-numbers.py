#! /usr/bin/env python3

# Source: https://github.com/nytimes/covid-19-data
import pandas as pd
import json

state_data = pd.read_csv("./covid-19-data/us-states.csv")

data = {}

for state in state_data.state.unique():
  data[state] = state_data[
    state_data['state'] == state
  ].set_index('date') \
   .filter(items=['date', 'cases', 'deaths']) \
   .to_dict()

data_js = "const states_data = " + json.dumps(data)

with open('states.js', 'w') as f:
    f.write(data_js)
