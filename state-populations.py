# https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/state/detail/
import pandas as pd
import json

state_data = pd.read_csv("./census.csv")

zz = state_data \
   .filter(items=['NAME', 'POPESTIMATE2019']);

print(zz)

data = state_data.set_index('NAME') \
   .filter(items=['NAME', 'POPESTIMATE2019']) \
   .to_dict()

with open('populations.json', 'w') as f:
    json.dump(data['POPESTIMATE2019'], f)