// create function for bar chart and bubble chart
function charts(sample) {

  // use `d3.json` to pull data from `samples.json`
  d3.json("samples.json").then(function(data) {
    var samples = data.samples.filter(sample_data => sample_data.id == sample)[0];
    var otu_ids = samples.otu_ids;
    var otu_labels = samples.otu_labels;
    var sample_values = samples.sample_values;

    // bar chart
    var bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };

    var bar_data = [bar_trace];

    var bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // plot bar chart
    Plotly.newPlot("bar", bar_data, bar_layout);

    // bubble chart
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {color: otu_ids, size: sample_values}
    };

    var bubble_data = [bubble_trace];

    var bubble_layout = {
      margin: {t: 0},
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };

    // plot bubble chart
    Plotly.newPlot("bubble", bubble_data, bubble_layout);
  });
};



// create function for demographic info
function metadata(sample) {
  d3.json("samples.json").then(function(data) {
    var metadata = data.metadata.filter(demographic_info => demographic_info.id == sample)[0];
    var panel = d3.select("#sample-metadata").html("");
    Object.entries(metadata).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`)});
  });
};


// create initial function to display when page loads
function init() {
  var dropdown = d3.select("#selDataset");

  d3.json("samples.json").then(function(data) {
    var sample_names = data.names;

    sample_names.forEach(function(sample) {
      dropdown.append("option").text(sample).property("value", sample)
    });

    var default_sample = sample_names[0];

    charts(default_sample);
    metadata(default_sample);
    });
};


// create function when new selection is made
function update_charts(update_sample) {
  charts(update_sample);
  metadata(update_sample);
};


// initiate functions
init();