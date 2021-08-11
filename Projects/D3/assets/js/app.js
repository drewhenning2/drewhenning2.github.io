// set chart size and parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//append a div classed chart to the scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = chart.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;

}

function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;

}



// function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}



// function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", data => newXScale(data[chosenXAxis]))
    .attr("cy", data => newYScale(data[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles text
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

  //stylize based on variable chosen
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      return `$${value}`;
  }
  //age (number)
  else {
      return `${value}`;
  }
}

//function to stylize x-axis values for tooltips
function styleY(value, chosenYAxis) {

  //stylize based on variable chosen
  //obesity percentage
  if (chosenYAxis === 'obesity') {
      return `${value}%`;
  }
  //smokes percentage
  else if (chosenYAxis === 'smokes') {
      return `$${value}%`;
  }
  //healthcare percentage
  else {
      return `${value}%`;
  }
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel
  var ylabel

  // chosen x-axis
  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "income") {
    xlabel = "Household Income:";
  }
  else {
    xlabel = "Age:";
  }

  // chosen y-axis
  if (chosenYAxis === "healthcare") {
    ylabel = "No Healthcare:";
  }
  else if (chosenYAxis === "obesity") {
    ylabel = "Obesity:";
  }
  else {
    ylabel = "Smokes:";
  }

  // create tooltip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`<b><u>${d.state}</b></u> <br> ${xlabel} ${styleX(d[chosenXAxis], chosenXAxis)} <br> ${ylabel} ${styleY(d[chosenYAxis])}`);
    });

  circlesGroup.call(toolTip);
  
  circlesGroup.on("mouseover", toolTip.show)
  .on("mouseout", toolTip.hide);

  return circlesGroup;
}



// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
  });

  // LinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12);

  // append circles text
  var circlesText = chartGroup.selectAll(".stateText")
    .data(censusData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("dy", 5)
    .attr("font-size", "13px")
    .text(function(d){return d.abbr});

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .text("Age (Median)")

  var incomeLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .text("Household Income (Median)")



  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")

  var obesityLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", - (height / 2))
    .attr("y", -80)
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes") // value to grab for event listener
    .text("Smokes (%)");

  var healthcareLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr("x", - (height / 2))
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare") // value to grab for event listener
    .text("Lacks Healthcare (%)");

  //updateToolTip function with data
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);



  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        //replace chosenXAxis with value
        chosenXAxis = value;

        //update x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        //update x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        //update circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text with new x values
        circlesText = renderText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //change classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });


  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        //replace chosenYAxis with value
        chosenYAxis = value;

        //update y scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        //update x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        //update circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        //update text with new y values
        circlesText = renderText(circlesText, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

        //update tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        //change classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

}).catch(function(error) {
    console.log(error);
});
