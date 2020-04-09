function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

function doubling_nums(data) {
  let ret_data = {}
  let past_val, growth_rate, doubling_time;
  for (var key in data) {
    if (key < "2020-03-22") continue;
    console.log(key);
    if (data.hasOwnProperty(key)) {
      if (past_val === 0) {
        growth_rate = Number.MAX_SAFE_INTEGER;
      } else {
        growth_rate = Math.round((data[key] - past_val)/past_val * 100);
      }
      past_val = data[key];
      doubling_time = growth_rate;
      ret_data[key] = doubling_time;
    }
  }
  return ret_data;
}

function draw (states, type) {
  let data = [];
  let data_percapita = [];
  let data_doubling = [];

  states.forEach((state) => {
    const only_state = states_data[state][type];

    const plot_data = to_plot_data(only_state)
    plot_data["name"] = state;    
    data.push(plot_data);
  })

  let layout = {
    title: capitalize(type)
  };
  Plotly.newPlot(type, data, layout);


  states.forEach((state) => {
    const only_state = states_data[state][type];
    const population = state_populations[state];

    const plot_data = to_plot_data(percapita(only_state, population))
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
      
      const plot_data = to_plot_data(doubling_nums(only_state))
      plot_data["name"] = state;
      //plot_data['mode'] = 'markers';
      plot_data['type'] = 'scatter';
    
      data_doubling.push(plot_data);
    })
  
    layout = {
      //title: ' Doubling Time of ' + capitalize(type) + ', in Days'
      title: ' Growth rate of ' + capitalize(type)
    };  
    Plotly.newPlot(type + "_doubling", data_doubling, layout);
  
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


