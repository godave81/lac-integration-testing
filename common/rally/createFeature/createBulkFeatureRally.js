const path = require('path');
var RallyBulkImport_Page = require('/webdriverioFramework/pageObjects/RallyBulkImport_Page.js'); // Load Rally Bulk Page Objects

module.exports = (function rallyBulkCreateFeature(sourceUrl, testCaseName, rallyCSV) {

    let dirPath = path.dirname(rallyCSV); // returns directory from path
    let fileName = path.basename(rallyCSV); //return filename from path
    const filePath = path.join(dirPath, fileName);

    try {
        console.log(`Importing CSV on ${sourceUrl} for ${testCaseName}\n`);

        // Navigate and Upload file.
        RallyBulkImport_Page.navigateRallyBulkCreationSetup();
        RallyBulkImport_Page.uploadRallyFeatureCSVTemplate(filePath);

    } // end try

    catch (error) {
        console.log(testCaseName + '\n');
        console.error(error);
    }

    //Submit Bulk Import, Assert Submisison
    let featureCount = RallyBulkImport_Page.confirmRallyBulkSubmission();
    
    //Export Results.
    let featureName =  RallyBulkImport_Page.getBulkImportFeatureName(filePath);
    let resultsUrl =   RallyBulkImport_Page.getBulkImportResultsUrl(sourceUrl,featureName);

    let featureIds = [];
    featureIds = RallyBulkImport_Page.getBulkImportFormattedIds(featureName,featureCount);
    RallyBulkImport_Page.exportBulkImportResults(resultsUrl,featureName, featureCount, featureIds);


    // Return rallyBulkFeatureObject
    let rallyFeatureObject = {
        rallyTotalCount: featureCount,
        rallyTitle: featureName,
        resultsUrl: resultsUrl,
        rallyIds: featureIds
    }

    return rallyFeatureObject;

}); //end module.