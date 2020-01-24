require('dotenv').config()
const fs = require('fs');

var dateTime = (new Date()).toISOString().slice(0, 19).replace("T", ":");

//Minimum required fields. Uncomment to include all LACs intergated fields. Add new fields as needed.
const rallyTemplate =
{
    // "Investment Category": "", // enter value
    "Portfolio Item Type": "Feature",
    // "Preliminary Estimate": "", //enter value
    // "State": "Funnel",
    "Name": dateTime + " Create Rally Bulk Feature",
    // "Description": dateTime + " Create Rally Bulk Feature",
    // "Acceptance Criteria": "",
    // "Compliance": ""
};


const jiraTemplate =
{
    "Summary": dateTime + " Create Jira Bulk Feature",
    "Issue Type": "Feature",
    "Status": "Funnel",
    "Project key": "", // enter Key
    "Project name": "", // enter project name
    "Project description": "",
    "Project url": "",
    "Priority": "Medium",
    "Resolution": "",
    "Assignee": "", //enter userid
    "Reporter": "", // enter userid
    "Creator": "",
    "Description": "* description 1",
    "Custom field (Feature Name)": dateTime + " Create Jira Bulk Feature",
    "Custom field (Investment Category)": "",  // enter value
    "Custom field (Preliminary Estimate)": "", // enter value
    "Custom field (Acceptance Criteria)": "" // enter value
};

function createTemplateCSV(csvInput, bulkCount) {

    let CSVPath = "";

    if (csvInput.includes("RALLY-CSV")) {

        CSVPath = "./data/bulkImport/PortfolioItemImportTemplate.csv";
        let rallyHeaders = Object.keys(rallyTemplate);
        let rallyRows = Object.values(rallyTemplate);


        fs.writeFileSync(CSVPath, rallyHeaders, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(CSVPath, "\n", function (err) {
            if (err) throw err;
        });

        for (let i = 0; i < bulkCount; i++) {

            fs.appendFileSync(CSVPath, rallyRows, function (err) {
                if (err) throw err;
            });

            fs.appendFileSync(CSVPath, "\n", function (err) {
                if (err) throw err;
            });
        }

    }

    else if (csvInput.includes("JIRA-CSV")) {

        CSVPath = "./data/bulkImport/FeatureTestImportTemplate.csv";
        let jiraHeaders = Object.keys(jiraTemplate);
        let jiraRows = Object.values(jiraTemplate);


        fs.writeFileSync(CSVPath, jiraHeaders, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(CSVPath, "\n", function (err) {
            if (err) throw err;
        });

        for (let i = 0; i < bulkCount; i++) {

            fs.appendFileSync(CSVPath, jiraRows, function (err) {
                if (err) throw err;
            });

            fs.appendFileSync(CSVPath, "\n", function (err) {
                if (err) throw err;
            });
        }
    }

    else {
        throw new Error(`Invalid Entry found in .env file, Valid Args can be "RALLY-CSV" or "JIRA-CSV"`);
    }

    return console.log(`${csvInput} Template created ${bulkCount} Features at ${CSVPath}`);

} // end function


// Main
var csvInput = process.env.CSV;
var bulkCount = process.env.BULKCOUNT;
createTemplateCSV(csvInput, bulkCount);
