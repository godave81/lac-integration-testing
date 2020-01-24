const config = require('../config/credentials/config.js');
const envInstance = require('../config/credentials/setEnvInstance.js');
const rallyBulkCreateFeature = require('../common/rally/createFeature/createBulkFeatureRally.js');
const jiraBulkCreateFeature = require('../common/jira/createFeature/createBulkFeatureJira.js');
const jiraBulkUpdateFeature = require('../common/jira/updateFeature/updateBulkFeatureJira.js');
const rallyBulkUpdateFeature = require('../common/rally/updateFeature/updateBulkFeatureRally.js');
const apiJiraToRallyVerifyBulkCreate = require('../common/jira/searchFeature/api/jiraToRallyVerifyBulkCreate.js');
const apiJiraToRallyVerifyBulkUpdateStatus = require('../common/jira/searchFeature/api/jiraToRallyVerifyBulkUpdateStatus.js');
const apiJiraToRallyVerifyBulkUpdatePreliminaryEstimate = require('../common/jira/searchFeature/api/jiraToRallyVerifyBulkUpdatePreliminaryEstimate.js');
const apiRallyToJiraVerifyBulkCreate = require('../common/rally/searchFeature/api/rallyToJiraVerifyBulkCreate.js');
const apiRallyToJiraVerifyBulkUpdateStatus = require('../common/rally/searchFeature/api/rallyTojiraVerifyBulkUpdateStatus.js');
const apiRallyToJiraVerifyBulkUpdatePreliminaryEstimate = require('../common/rally/searchFeature/api/rallyToJiraVerifyBulkUpdatePreliminaryEstimate.js');
const rallyBulkSearchResults = require('../common/jira/searchFeature/performRallyBulkSearch.js');
const jiraBulkSearchResults =  require('../common/rally/searchFeature/performJiraBulkSearch.js');


function executeJiraBulkFeaturesTC (sourceUrl, sourceInputTitle, targetUrl, targetInputTitle) {

  var shortTitle = sourceInputTitle.split('-').pop().trim();
    
  it(shortTitle + ': Bulk Import Create Jira Features', function () {

    //Test Data
    var data = { testCaseName: this.test.title, jiraCSV: process.env.JIRA_BULK_IMPORT_PATH };

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl, sourceInputTitle);

    // Bulk Create Features from JIRA CSV
    var jiraBulkId = jiraBulkCreateFeature(sourceUrl, data.testCaseName, data.jiraCSV);

    //Verify for Bulk Import Features are Synched to Rally targetUrl.
    apiJiraToRallyVerifyBulkCreate(targetUrl, jiraBulkId.jiraTitle, jiraBulkId.totalJiraIdsCount);

    //Display Results in Rally targetUrl.
    rallyBulkSearchResults(targetUrl, jiraBulkId.jiraTitle, jiraBulkId.totalJiraIdsCount);

  });

  it(shortTitle + ': Bulk Import Jira Features: Update Status Field', function () {

    //Test Data
    var data = {testCaseName: this.test.title, statusSelection: 'Analyzing', jiraFeatureImportResults: process.env.JIRA_BULK_OUTPUT_PATH};
  
    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);
      
    // Bulk Update Features from FeatureTestImportResults.csv
    var jiraBulkObj = jiraBulkUpdateFeature(data.testCaseName, data.jiraFeatureImportResults, data.statusSelection);

    // //Wait for all Features are updated to Rally targetUrl.
    apiJiraToRallyVerifyBulkUpdateStatus(targetUrl, jiraBulkObj.featureName, jiraBulkObj.featureCount, data.statusSelection);
      
    // //Display Results in Rally targetUrl.
    rallyBulkSearchResults(targetUrl,jiraBulkObj.featureName,jiraBulkObj.featureCount);

  });

  it(shortTitle + ': Bulk Import Jira Features: Update Preliminary Estimate Field', function () {

    //Test Data
    var data = { testCaseName: this.test.title, statusSelection: 'XS', jiraFeatureImportResults: process.env.JIRA_BULK_OUTPUT_PATH };

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl, sourceInputTitle);

    // Bulk Update Features from FeatureTestImportResults.csv
    var jiraBulkObj = jiraBulkUpdateFeature(data.testCaseName, data.jiraFeatureImportResults, data.statusSelection);

    // //Wait for all Features are updated to Rally targetUrl.
    apiJiraToRallyVerifyBulkUpdatePreliminaryEstimate(targetUrl, jiraBulkObj.featureName, jiraBulkObj.featureCount, data.statusSelection);

    // //Display Results in Rally targetUrl.
    rallyBulkSearchResults(targetUrl,jiraBulkObj.featureName,jiraBulkObj.featureCount);

  });

  
 }; // end of  executeJiraFeaturesTC



function executeRallyBulkFeaturesTC(sourceUrl, sourceInputTitle, targetUrl, targetInputTitle) {

  var shortTitle = sourceInputTitle.split(' › ', 1).toString();

  it(shortTitle + ': Bulk Import Create Rally Features', function () {

    var data = { testCaseName: this.test.title, rallyCSV: process.env.RALLY_BULK_IMPORT_PATH };

    //Set Rally Env
    envInstance.setRallyInstance(sourceUrl, sourceInputTitle);

    // Bulk Create Features from Rally CSV
    var rallyBulkId = rallyBulkCreateFeature(sourceUrl, data.testCaseName, data.rallyCSV);

    //Verify Bulk Import Features are Synched to Jira targetUrl.
    apiRallyToJiraVerifyBulkCreate(targetUrl, rallyBulkId.rallyTitle,rallyBulkId.rallyTotalCount);
    
    //Display Results in Jira targetUrl.
    jiraBulkSearchResults(targetUrl, rallyBulkId.rallyTitle, rallyBulkId.rallyTotalCount);

  });

  it(shortTitle + ': Bulk Import Rally Features: Update Status Field', function () {

    //Test Data
    var data = {testCaseName: this.test.title, statusSelection: 'Analyzing', rallyFeatureImportResults: process.env.RALLY_BULK_OUTPUT_PATH};

    //Set Rally Env
    envInstance.setRallyInstance(sourceUrl, sourceInputTitle);
    
    // Bulk Update Features from PortfolioItemImportResults.csv
    var rallyBulkObj = rallyBulkUpdateFeature(data.testCaseName, data.rallyFeatureImportResults, data.statusSelection);
    
    // Verify Bulk Update Features are Synched to Jira targetUrl.
    apiRallyToJiraVerifyBulkUpdateStatus(targetUrl, rallyBulkObj.featureName, rallyBulkObj.featureCount, data.statusSelection );
    
    // //Display Results in Jira targetUrl.
    jiraBulkSearchResults(targetUrl, rallyBulkObj.featureName, rallyBulkObj.featureCount);

  });

  it(shortTitle + ': Bulk Import Rally Features: Update Preliminary Estimate Field', function () {

    //Test Data
    var data = {testCaseName: this.test.title, statusSelection: 'XS (13)', rallyFeatureImportResults: process.env.RALLY_BULK_OUTPUT_PATH};

    //Set Rally Env
    envInstance.setRallyInstance(sourceUrl, sourceInputTitle);
    
    // Bulk Update Features from PortfolioItemImportResults.csv
    var rallyBulkObj = rallyBulkUpdateFeature(data.testCaseName, data.rallyFeatureImportResults, data.statusSelection);
    
    //Verify Bulk Update Features are Synched to Jira targetUrl.
    apiRallyToJiraVerifyBulkUpdatePreliminaryEstimate(targetUrl, rallyBulkObj.featureName, rallyBulkObj.featureCount, data.statusSelection );

    // //Display Results in Jira targetUrl.
    jiraBulkSearchResults(targetUrl, rallyBulkObj.featureName, rallyBulkObj.featureCount);

  });



}; // end of  executeRallyFeaturesTC

describe(' Load Testing - Bulk Features: Test Suite', function () {

  //Get Inputs
  let source = config.getSourceConfig();
  let target = config.getTargetConfig();


  if (source.sourceInput.includes('rallyTest')) {
    //RALLY TEST CASES
    executeRallyBulkFeaturesTC(source.sourceInputUrl, source.sourceInputTitle, target.targetInputUrl, target.targetInputTitle);
  }

  else if (source.sourceInput.includes('testJira')) {
    //JIRA TEST CASES
    executeJiraBulkFeaturesTC(source.sourceInputUrl, source.sourceInputTitle, target.targetInputUrl, target.targetInputTitle);
  }

}); // end Mocha describe


