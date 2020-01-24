var RallyBulkUpdate_Page = require('/webdriverioFramework/pageObjects/RallyBulkUpdate_Page.js'); // Load Rally Bulk Page Objects

module.exports = (function rallyBulkUpdateFeature(testCaseName, rallyFeatureImportResults, statusSelection) {

    //Read PortfolioItemImportResults CSV
    let fileContents = RallyBulkUpdate_Page.rallyFeatureImportResults(rallyFeatureImportResults);

    console.log(`Executing ${testCaseName} using data found at ${fileContents.url} \n`);

    try {

        console.log(`Step 1 of 4: Filter Rally Features: \n`);
        let bulkFilterCount = RallyBulkUpdate_Page.navigateRallyFilterFeatures(fileContents.featureName, fileContents.featureCount);

        console.log(`Step 2 of 4: Navigate Bulk Edit`);
        RallyBulkUpdate_Page.navigateRallyBulkEditDisplayPanel(bulkFilterCount);

        console.log(`Step 3 of 4: Perform Bulk Edit Operation`);
        RallyBulkUpdate_Page.rallyPerformBulkEditSelection(statusSelection);

        console.log(`Step 4 of 4: Bulk Updates In Progress... \n`);
        var rallyBulkUpdateIndicator = RallyBulkUpdate_Page.rallyBulkEditSubmit();

    }

    catch (error) {
        console.log(testCaseName + '\n');
        console.error(error);
    }

    console.log(rallyBulkUpdateIndicator);

    return fileContents;

}); //end module.