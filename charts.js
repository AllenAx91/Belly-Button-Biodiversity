function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1.1. Create the buildCharts function.
function buildCharts(sample) {
  // 1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 1.3. Create a variable that holds the samples array. 
    var samples_raw = data.samples;
    // console.log(samples_raw);
    // 1.4. Create a variable that filters the samples for the object with the desired sample number.
    var samples_array = samples_raw.filter(sampleObj => sampleObj.id == sample);
    // console.log(samples_array);
    // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadata_Array = metadata.filter(sampleObj => sampleObj.id == sample);
    //  1.5. Create a variable that holds the first sample in the array.
    var samples_details = samples_array[0];
    console.log(samples_details);
    //  3.2. Create a variable that holds the first sample in the metadata array. 
    var metadata_details = metadata_Array[0];
    // console.log(metadata_details);
    // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samples_details.otu_ids;
    var otu_labels = samples_details.otu_labels;
    var sample_values = samples_details.sample_values;
        // console.log(otu_ids);
        // console.log(otu_labels);
        // console.log(sample_values);
     // 3.3. Create a variable that holds the washing frequency.
    var wash_freq = metadata_details.wfreq;
    // console.log(wash_freq);
        // 1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).sort((a, b) => a - b).reverse();

  
    console.log(yticks);
    // 1.8. Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_values,
        y: yticks,
        type: "bar",
        orientation: 'h',
        text: otu_labels
      }
    ];
    // 1.9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      
    };
    // 1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // 2.1. Create the trace for the bubble chart.
     var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: sample_values,
        colorscale: 'RdBu'
      },
      text: otu_labels
    }
   
    ];

    // 2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
                title: 
                {
                  text: 'OTU ID' 
                } 
              },
      hovermode:'closest'
    };

    // 2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // 3.4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        // domain: { 
        //   x: [0, 10], y: [0, 10] },
        value: wash_freq,
        title: { text: "scrubs per week", font: { size: 20 } },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: "black" },
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
        }
      }
    ];
    
    // 3.5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 550, height: 450,
      title: "Belly Button Washing Frequency",
      font: { size: 18, family: "Arial" }
    };

    // 3.6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);

  });
}

