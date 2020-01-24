const path = require('path');
var JiraBulkImport_Page = require('/webdriverioFramework/pageObjects/JiraBulkImport_Page.js'); // Load Jira Bulk Page Objects

module.exports = (function (sourceUrl, testCaseName, jiraCSV) {

    let bulkCreateURL = sourceUrl.replace("Dashboard.jspa", "BulkCreateSetupPage!default.jspa?externalSystem=com.atlassian.jira.plugins.jira-importers-plugin:bulkCreateCsv");
    let dirPath = path.dirname(jiraCSV); // returns directory from path
    let fileName = path.basename(jiraCSV); //return filename from path
    const filePath = path.join(dirPath, fileName);

    try {
        console.log(`Importing CSV on ${sourceUrl} for ${testCaseName}\n`);

        //Bulk Create Upload jira CSV
        JiraBulkImport_Page.navigateJiraBulkCreationSetup(bulkCreateURL);
        JiraBulkImport_Page.uploadJiraFeatureCSVTemplate(filePath);

        //enter Bulk Settngs
        JiraBulkImport_Page.navigateJiraBulkCreationSettings();
        JiraBulkImport_Page.setJiraProjectName(sourceUrl);

        //Enter Map Fields
        JiraBulkImport_Page.navigateJiraBulkCreationMapFields();
        JiraBulkImport_Page.setJiraMapFields("Feature Name","Issue Type","Summary"); //minimum required field.
        JiraBulkImport_Page.navigateJiraBulkCreationMapValues();

        //Validate and Submit
        JiraBulkImport_Page.validateSubmitJiraMapValues();

    } // end try

    catch (error) {
        console.log(testCaseName + '\n');
        console.error(error);
    }

    //Confirm Submission
    let jiraBulkObj = JiraBulkImport_Page.confirmJiraBulkSubmission();

    //Export Results
    JiraBulkImport_Page.exportBulkImportResults(jiraBulkObj.totalJiraIds,jiraBulkObj.jiraURL,jiraBulkObj.jiraTitle,jiraBulkObj.totalJiraIdsCount);
    
    return jiraBulkObj;

}); //end module.