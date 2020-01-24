class RallyCreateFeature_Page {
    /* Enter Rally Selectors in get and set methods */
    get AddNewFeatureButton()       { return $(""); }
    get rallyFeatureName()          { return $(""); }
    get rallyStatus()               { return $(""); }
    get rallyPreliminaryEstimate()  { return $(""); }
    get rallyDescription()          { return $(""); }
    get rallyInvestmentCategory()   { return $(""); }
    get rallyAcceptanceCriteria()   { return $(""); }
    get rallyCompliance()           { return $(""); }
    get rallySubmitFeature()        { return $(""); }
    

    setRallyFeatureName(testCaseTitle) {
        let dateTime = (new Date()).toISOString().slice(0, 19).replace("T", ":");
        let rallyFeatureNameTitle = testCaseTitle + dateTime;
        
        this.AddNewFeatureButton.click();
        this.rallyFeatureName.setValue(rallyFeatureNameTitle).click("").waitForVisible("");
        return rallyFeatureNameTitle;
    }

    setRallyStatus(rallyStatus) {
        if (rallyStatus === 'Funnel')
            return this.rallyStatus.click().$("").click();
    }

    setRallyPreliminaryEstimate(rallyPreliminaryEstimate) {
        if (rallyPreliminaryEstimate === 'XS')
            return this.rallyPreliminaryEstimate.click().$("").click();
    }

    setRallyDescription(rallyDescription) {
        this.rallyDescription.waitForExist();
        return browser.frame(this.rallyDescription.value).setValue("", rallyDescription);
    }

    setRallyInvestmentCategory(rallyInvestmentCategory) {
        this.rallyInvestmentCategory.click();
        return $("").setValue(rallyInvestmentCategory).keys("\uE007");
    }

    setRallyAcceptanceCriteria(rallyAcceptanceCriteria) {
        this.rallyAcceptanceCriteria.waitForExist();
        return browser.frame(this.rallyAcceptanceCriteria.value).$("").setValue(rallyAcceptanceCriteria);
    }

    setRallyCompliance(rallyCompliance) {
        this.rallyCompliance.click();
        return $("").setValue(rallyCompliance).keys("\uE007");
    }

    submitRallyFeature() {
        this.rallySubmitFeature.click().waitUntil(function () {
            return $("").waitForExist() === true
        }, process.env.RALLY_TIMEOUT, 'rally timeout error')
        
        browser.pause(3000); // Pause before fetching Formatted Id from RallyAPI.
    }

    confirmRallySuccessfulSubmission(rallyFeatureName) {
        var request = require('request');

        var rallyFormattedId = [];

        rallyFormattedId = browser.call(function () {
            return new Promise(function (resolve, reject) {

                //Rally EndPoint
                const rallyEndPoint = "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature";

                // Build Query String using Feature name and count.
                let queryString = "?query=(Name = " + "\"" + rallyFeatureName + "\"" + ")" + "&fetch=FormattedID&pagesize=1";

                request({
                    url: rallyEndPoint.concat(queryString),
                    method: 'GET',
                    followRedirect: true,
                    timeout: 10000,
                    maxRedirects: 10,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.RALLYAPIKEY,
                        'Accept-Charset': 'utf-8',
                        'ZSESSIONID': process.env.ZSESSIONID
                    }

                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        console.log(`Success statusCode: ${response.statusCode}  ${response.statusMessage} \n`);

                        // Parse JSON Response
                        let jsonObj = JSON.parse(body);
                        let results = jsonObj.QueryResult && jsonObj.QueryResult.Results || [];
                        let formattedId = results.map(r => r.FormattedID);
                        resolve(formattedId);

                    }

                    else {
                        console.log(`Error statusCode: ${response.statusCode}  ${response.statusMessage}`);
                        reject(new Error("Rally API Failure"));
                    }

                });

            });

        }); //end browser.call

        console.log(rallyFormattedId + " has been successfully created");
        return rallyFormattedId.toString();

    } //confirmRallySuccessfulSubmission

} // end class RallyCreateFeature_Page

module.exports = new RallyCreateFeature_Page();