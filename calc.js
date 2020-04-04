function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function to_plot_data(data) {
  console.log('------')
  console.log(data);
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
  console.log(plot_data)
  return plot_data;
}

function draw (state, type) {
  g = document.createElement('div');
  g.setAttribute("id", "div" + type + name);
  document.body.appendChild(g);

  const only_state = states_data[state];
  console.log(only_state[type]);
  const plot_data = to_plot_data(only_state[type])
  console.log(plot_data);

  const data = [ plot_data ];

  var layout = {
    title: capitalize(type) + ' in ' + state
  };

  console.log(data)
  
  Plotly.newPlot('div' + type + name, data, layout);
}

draw('New York', 'cases')
draw('New York', 'deaths')