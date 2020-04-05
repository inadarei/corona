#! /usr/bin/env python3

# https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/state/detail/
import pandas as pd
import json

state_data = pd.read_csv("./census.csv")

zz = state_data \
   .filter(items=['NAME', 'POPESTIMATE2019']);

data = state_data.set_index('NAME') \
   .filter(items=['NAME', 'POPESTIMATE2019']) \
   .to_dict()

data_js = "const state_populations = " + json.dumps(data['POPESTIMATE2019'])

with open('populations.js', 'w') as f:
    f.write(data_js)    