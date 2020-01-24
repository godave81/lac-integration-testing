// const fs = require('fs');
var JiraBulkUpdate_Page = require('/webdriverioFramework/pageObjects/JiraBulkUpdate_Page.js'); // Load Jira Bulk Page Objects

module.exports = (function jiraBulkUpdateFeature(testCaseName, jiraFeatureImportResults, statusSelection) {

    //Read jiraFeatureImportResults CSV
    let fileContents= JiraBulkUpdate_Page.jiraFeatureImportResults(jiraFeatureImportResults);

    console.log(`Executing ${testCaseName} using data found at ${fileContents.url} \n`);

    try {

        console.log(`Navigate to Bulk Operation Wizard:\nStep 1 of 4: Choose Issues`);
        JiraBulkUpdate_Page.navigateJiraBulkOperation(fileContents.url);

        console.log(`Step 2 of 4: Choose Operation`);
        JiraBulkUpdate_Page.navigatetoJiraChooseIssues();

        console.log(`Step 3 of 4: Choose Operation Details`);
        let jiraOperationDetailsSelection = JiraBulkUpdate_Page.navigatetoJiraChooseOperation(statusSelection);
        JiraBulkUpdate_Page.navigateJiraOperationDetails(jiraOperationDetailsSelection);

        console.log(`Step 4 of 4: Bulk Updates In Progress... \n`);
        JiraBulkUpdate_Page.navigateJiraConfirmBulkUpdate(statusSelection,testCaseName);
    }

    catch (error) {
        console.log(testCaseName + '\n');
        console.error(error);
    }

    
    return fileContents;

}); //end module.