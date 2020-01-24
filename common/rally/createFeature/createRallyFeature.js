var RallyCreateFeature_Page = require('/webdriverioFramework/pageObjects/RallyCreateFeature_Page.js'); // Load Rally Page Objects

module.exports = (function(testCaseTitle,rallyStatus,rallyPreliminaryEstimate,rallyInvestmentCategory,rallyCompliance,rallyDescription,rallyAcceptanceCriteria) {

  try {
    
    var featureName = RallyCreateFeature_Page.setRallyFeatureName(testCaseTitle);
    browser.pause(3000);
    

    if (rallyStatus) {
      RallyCreateFeature_Page.setRallyStatus(rallyStatus);
    }

    if (rallyPreliminaryEstimate) {
      RallyCreateFeature_Page.setRallyPreliminaryEstimate(rallyPreliminaryEstimate);
    }

    if (rallyDescription) {
      RallyCreateFeature_Page.setRallyDescription(rallyDescription);
      browser.frameParent(); //Depart from iFrame
    }

    if (rallyInvestmentCategory) {
      RallyCreateFeature_Page.setRallyInvestmentCategory(rallyInvestmentCategory);
    }

    if (rallyAcceptanceCriteria) {
      RallyCreateFeature_Page.setRallyAcceptanceCriteria(rallyAcceptanceCriteria);
      browser.frameParent(); //Depart from iFrame
    }

    if (rallyCompliance) {
      RallyCreateFeature_Page.setRallyCompliance(rallyCompliance);
    }

  } // end try

  catch (error) {
    console.log(testCaseTitle + '\n');
    console.error(error);
  }

  //Submit Rally Feature
  RallyCreateFeature_Page.submitRallyFeature();
  let rallyId = RallyCreateFeature_Page.confirmRallySuccessfulSubmission(featureName);
  return rallyId;
     
}); //end module.
