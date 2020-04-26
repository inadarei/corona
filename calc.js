let wmaMode = true;
function switchWMA(_mode) {
  wmaMode = _mode;
  show_results();
}

function capitalize(string) {
    let ret =  string.charAt(0).toUpperCase() + string.slice(1);
    if (wmaMode) {
      return ret + " (WMA)";
    } else {
      return ret;
    }
}


function to_plot_data(data) {
  plot_data = {};
  plot_data["x"] = [];
  plot_data["y"] = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
        plot_data["x"].push(key);
        plot_data["y"].push(data[key]);  
    }
  }
  plot_data['mode'] = 'lines+markers';
  return plot_data;
}

function percapita(data, population) {
  let data_pop = {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      data_pop[key] = data[key]/population*100000;
    }
  }
  return data_pop;
}

function growth_rates(data) {
  let ret_data = {}
  let past_val, growth_rate;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      
      if (key < "2020-03-22") { 
        past_val = data[key];
        continue;
      }

      if (!past_val || typeof past_val === "undefined" || past_val == 0) {
        past_val = Number.MAX_SAFE_INTEGER;
        growth_rate = 0;
      } else {
        growth_rate = Math.round((data[key] - past_val)/past_val * 100);
      }

      past_val = data[key];
      ret_data[key] = growth_rate;
    }  
  }
  return ret_data;
}

function weighted_moving_averages(_data) {

  const numvalues = Object.values(_data);
  const keys = Object.keys(_data);
  const result = {};
  let counter = 0;
  const wma_cap = 30; // max points in the past to take into account, for weighted moving averages

  for (const key of  keys) {
    const currKey = keys[counter];
    let sum_of_weights = 0;
    let sum_of_values = 0;
    for (let i = counter; i>=0; i--) {
      if ((counter - i) > wma_cap) break;
      const n = i+1; // must start with 1
      sum_of_values += n * numvalues[i];
      sum_of_weights += n;
    }
    result[key] = sum_of_values / sum_of_weights;
    counter++;
  }

  return result;
}

function draw (states, type) {
  let data = [];
  let data_percapita = [];
  let data_growth = [];

  states.forEach((state) => {
    let only_state = states_data[state][type];
    if (wmaMode) {
      only_state = weighted_moving_averages(only_state);
    }

    const plot_data = to_plot_data(only_state)
    plot_data["name"] = state;    
    data.push(plot_data);
  })

  let layout = {
    title: capitalize(type)
  };
  Plotly.newPlot(type, data, layout);


  states.forEach((state) => {
    let only_state = states_data[state][type];
    const population = state_populations[state];

    let percapita_values = percapita(only_state, population);
    if (wmaMode) {
      percapita_values = weighted_moving_averages(percapita_values);
    }
    const plot_data = to_plot_data(percapita_values)
    plot_data["name"] = state;

    data_percapita.push(plot_data);
  })

  layout = {
    title:  capitalize(type) + ' Per 100,000 Population'
  };  
  Plotly.newPlot(type + "_percapita", data_percapita, layout);

  if (type == 'cases') {
    states.forEach((state) => {
      const only_state = states_data[state][type];

      let growth_nums = growth_rates(only_state);

      if (wmaMode) {
        growth_nums = weighted_moving_averages(growth_nums);
      }
      const plot_data = to_plot_data(growth_nums);

      plot_data["name"] = state;
      //plot_data['mode'] = 'markers';
      plot_data['type'] = 'scatter';
      data_growth.push(plot_data);

    })
  
    layout = {
      title: ' Growth rate of ' + capitalize(type)
    };  
    Plotly.newPlot(type + "_growth", data_growth, layout);

  }


}

function show_results() {
  const states = $('#state_selector').val();

  if (states.length<1) {
    $('#state_required').modal()
    return;
  }

  draw(states, 'cases');
  draw(states, 'deaths');
}

// If the "show" button is clicked - show results
$("#show").click(() => {
  const states = $('#state_selector').val();
  document.location.search = "states=" + states;
  show_results();
});


function state_dropdown() {
  states = [];
  for (var key in states_data) {
    states.push({id: key, text: key})
  }

  $("#state_selector").select2({
    data: states,
    maximumSelectionLength: 7
  });
  
}

function init_selector() {
  const params = new URLSearchParams(document.location.search.substring(1));
  const states_param = params.get("states"); // is the string "Jonathan"

  let states = [];
  if (states_param != null) { 
    states = states_param.split(',')
  }

  if (states.length === 0) {
    states = ['California', 'New York']
  }

  $('#state_selector').val(states);
  $('#state_selector').trigger('change');
}

/*
const data_url = "https://covidtracking.com/api/states";
fetch(data_url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });
*/


state_dropdown();
init_selector();
show_results();

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

