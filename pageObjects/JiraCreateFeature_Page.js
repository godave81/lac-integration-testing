class JiraCreateFeature_Page {

    /* Common JIRA selectors. Enter Selectors in all methods */
    get jiraCreateFeatureButton() { return $(""); }
    get jiraFeatureName()         { return $(""); }
    get jiraSummaryName()         { return $(""); }
    get jiraTeamName()            { return $(""); }
    get jiraDescription()         { return $(""); }
    get jiraAcceptanceCriteria()  { return $(""); }
    get jiraPreliminaryEstimate() { return $(""); }
    get jiraCompliance()          { return $(""); }
    get jiraInvestmentCategory()  { return $(""); }
    get jiraSubmitFeature()       { return $(""); }
   
    
    
    setJiraCreateFeatureButton() {
        return this.jiraCreateFeatureButton.click().$("").waitForVisible();
    }


    submitAllTestJira(testCaseName,jiraTeamName,jiraDescription,jiraAcceptanceCriteria,jiraPreliminaryEstimate,jiraCompliance,jiraInvestmentCategory) {

        this.jiraFeatureName.setValue(testCaseName); //Set Feature Name
        this.jiraSummaryName.setValue(testCaseName); //Set Summary Name

        if (jiraTeamName) {
            jiraTeamName = "";
            this.jiraTeamName.click().$("").setValue(jiraTeamName).keys("").$("").waitUntil(function () {
                return browser.keys("");
            }, process.env.JIRA_TIMEOUT)
        }

        if (jiraDescription) {
            this.jiraDescription.waitForExist();
            browser.frame(this.jiraDescription.value).setValue("", jiraDescription);
            browser.frameParent();
        }

        if (jiraAcceptanceCriteria) {
            this.jiraAcceptanceCriteria.waitForExist();
            browser.frame(this.jiraAcceptanceCriteria.value).setValue("", jiraAcceptanceCriteria);
            browser.frameParent();
        }

        if (jiraPreliminaryEstimate) {
            if (jiraPreliminaryEstimate.includes("XS"))
                this.jiraPreliminaryEstimate.click();
        }

        if (jiraCompliance) {
            if (jiraCompliance.includes("No"))
                this.jiraCompliance.click();
        }

        if (jiraInvestmentCategory) {
            if (jiraInvestmentCategory.includes("Run the Business"))
                this.jiraInvestmentCategory.click();
        }

    } // end submitAllJiraFeature

   
    

  
    confirmJiraSuccessfulSubmission() {

       let isjiraSubmitFeature =  this.jiraSubmitFeature.click().waitUntil(function () {
            return $("").isVisible() === true
        }, process.env.JIRA_TIMEOUT, 'timeout error');

        if(isjiraSubmitFeature) {

            console.log($("").getText()); //print confirmation messages 
        }

       let jiraId =  $("").getText().split(' - ').shift().trim();
       return jiraId;
    }

} // end class JiraCreateFeature_Page

module.exports = new JiraCreateFeature_Page();