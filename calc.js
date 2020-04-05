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
      data_pop[key] = data[key]/population;
    }
  }
  return data_pop;
}

function draw (states, type) {
  let data = [];
  let data_percapita = [];

  states.forEach((state) => {
    const only_state = states_data[state][type];

    const plot_data = to_plot_data(only_state)
    plot_data["name"] = state;    
    data.push(plot_data);
  })

  states.forEach((state) => {
    const only_state = states_data[state][type];
    const population = state_populations[state];

    const plot_data = to_plot_data(percapita(only_state, population))
    plot_data["name"] = state;

    data_percapita.push(plot_data);
  })

  let layout = {
    title: capitalize(type) + ' in ' + states
  };
  Plotly.newPlot(type, data, layout);

  layout = {
    title: ' Per Capita ' + capitalize(type) + ' in ' + states
  };  
  Plotly.newPlot(type + "_percapita", data_percapita, layout);
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
    maximumSelectionLength: 5
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


