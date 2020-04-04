function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function to_plot_data(data, population=0) {
  plot_data = {};
  plot_data["x"] = [];
  plot_data["y"] = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
        plot_data["x"].push(key);
        if (population===0) {
          plot_data["y"].push(data[key]);  
        } else {
          plot_data["y"].push(data[key]/population);
        }
    }
  }
  plot_data['mode'] = 'lines+markers';
  return plot_data;
}

function draw (states, type) {
  let data = [];
  let data_percapita = [];

  states.forEach((state) => {
    const only_state = states_data[state];
    const plot_data = to_plot_data(only_state[type])
    plot_data["name"] = state;

    const plot_data_percapita = to_plot_data(only_state[type], state_populations[state])
    plot_data_percapita["name"] = state;

    data.push(plot_data);
    data_percapita.push(plot_data_percapita);
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
state_dropdown();

$("#show").click(function() {
  const states = $('#state_selector').val();
  if (states.length<1) {
    $('#state_required').modal()
    return;
  }

  draw(states, 'cases');
  draw(states, 'deaths');
  
})
