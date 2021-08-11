// import data.js and assign variable
var tableData = data;

// create function to import data.js table
var table_body = d3.select("tbody");

function buildTable(data) {
    table_body.html("");
    data.forEach(function(dataRow) {
        var newRow = table_body.append("tr")
        Object.values(dataRow).forEach(function(colValue) {
           newRow.append("td").text(colValue);
       });
    });
};

// display table in html
buildTable(tableData);


// create function to filter data
function submitHandler() {
    d3.event.preventDefault();

    var inputValue = d3.select("#datetime").property("value");
    var filteredData = tableData.filter(tableData => tableData.datetime === inputValue);

    buildTable(filteredData);
};

// create clickable button to filter results
d3.select("button").on("click", submitHandler);

// create button when hitting enter on keyboard
d3.select("form").on("submit", submitHandler);
