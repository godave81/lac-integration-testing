var JiraCreateFeature_Page = require('/webdriverioFramework/pageObjects/JiraCreateFeature_Page.js'); // Load Jira Page Objects

module.exports = (function (testCaseName,jiraTeamName,jiraDescription,jiraAcceptanceCriteria,jiraPreliminaryEstimate,jiraCompliance,jiraInvestmentCategory) {

    try {

        JiraCreateFeature_Page.setJiraCreateFeatureButton();
        let url = browser.getUrl();

        if (url.includes('')) { // enter Jira URL
            JiraCreateFeature_Page.submitAllTestJira(testCaseName, jiraTeamName, jiraDescription, jiraAcceptanceCriteria, jiraPreliminaryEstimate, jiraCompliance, jiraInvestmentCategory);
        }

    }

    catch (error) {
        console.log(testCaseName + '\n');
        console.error(error);
    }

    //Submit Jira Feature
    let jiraId = JiraCreateFeature_Page.confirmJiraSuccessfulSubmission();
    return jiraId;

}); //end module.