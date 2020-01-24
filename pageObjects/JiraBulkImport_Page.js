class JiraBulkImport_Page {

    /* Enter JIRA Bulk Import Selectors and methods */
    get fileUploadButton()           { return $(""); }
    get nextButton()                 { return $(""); }
    get jiraProjectNameField()       { return $(""); }
    get jiraFeatureName()            { return $(""); }
    get jiraFeatureNameCheckbox()    { return $(""); }
    get jiraIssueType()              { return $(""); }
    get jiraIssueTypeCheckbox()      { return $(""); }
    get jiraSummary()                { return $(""); }
    get jiraSummaryCheckBox()        { return $(""); }
    get jiraValidateButton()         { return $("");}
    get jiraLogsUrl()                { return $("");}
    get jiraCreatedIssuesUrl()       { return $(""); }
    get jiraResultsScreen()          { return $(""); }
    get jiraBulkTotalIndicator()     { return $(""); }
    get jiraissueSummaryIndicator()  { return $(""); }
    get jiraLogsFeaturesIds()        { return $(""); }
    

    navigateJiraBulkCreationSetup(bulkCreateURL) {
        browser.url(bulkCreateURL).waitUntil(function () {
            return (browser.getText("") === "Bulk Create Setup"); //  waitUntil returns true once page header elements is visible.
        }, process.env.JIRA_TIMEOUT, 'timeout occured navigateJiraBulkCreationSetup()');
    }
    //#uploadedFileSection > div
    uploadJiraFeatureCSVTemplate(filePath) {
        this.fileUploadButton.setValue(filePath).waitUntil(function () {
            return (browser.isVisible("") === true); //  waitUntil csv file is uploaded.
        }, process.env.JIRA_TIMEOUT, 'timeout occured uploading Jira CSV file.');
    }

    navigateJiraBulkCreationSettings() {
        this.nextButton.click().waitUntil(function() {
            return (browser.getText("") === "Settings"); // Wait for page header elements to be visible.
        }, process.env.JIRA_TIMEOUT,'timeout occured during navigateJiraBulkCreationSettings()');
    }

    setJiraProjectName(sourceUrl) {
        if (sourceUrl.includes("")) { //enter url
            this.jiraProjectNameField.click();
            this.jiraProjectNameField.setValue("").keys("\uE007");
        }

        else {
            throw new Error("Invalid selection");
        }
    }

    navigateJiraBulkCreationMapFields() {
        this.nextButton.click().waitUntil(function() {
            return (browser.getText("") === "Map fields"); // Wait for page header elements to be visible.
        }, process.env.JIRA_TIMEOUT,'timeout occured during navigateJiraBulkCreationMapFields');
    }

    setJiraMapFields(jiraFeatureName, jiraIssueType, jiraSummaryField) {

        this.jiraFeatureName.click();
        this.jiraFeatureName.setValue(jiraFeatureName).keys("\uE004"); //map jiraFeatureName field with Feature Name and tab.
        this.jiraFeatureNameCheckbox.click(); //click checkbox to map feature name field

        this.jiraIssueType.click();
        this.jiraIssueType.setValue(jiraIssueType).keys("\uE004"); //map issueType field with issueType and tab.
        this.jiraIssueTypeCheckbox.click(); //click checkbox to map issueType field

        this.jiraSummary.click();
        this.jiraSummary.setValue(jiraSummaryField).keys("\uE004"); //set minimum required field Summary and tab.
        this.jiraSummaryCheckBox.click(); // click checkbox to map summary field.
    }

    navigateJiraBulkCreationMapValues() {
        this.nextButton.click().waitUntil(function () {
            return (browser.getText("") === "Map values"); // Wait for page header elements to be visible.
        }, process.env.JIRA_TIMEOUT, 'timeout occured during navigateJiraBulkCreationMapValues');
    }

    validateSubmitJiraMapValues() {
        this.jiraValidateButton.click();
        
         let isSuccess = browser.waitUntil(function() {
            return (browser.getText("") === "Success! The validator didn't find anything wrong. You can now safely begin your import!"); // Wait for page header elements to be visible.
        }, process.env.JIRA_TIMEOUT,'timeout occured during validateJiraBullkImport()');

        if(isSuccess) { //if validation is true
            this.nextButton.click(); //Submit Bulk Import for Processing.
        }
        else {
            throw new Error("Validation failed. Check CSV file");
        }
    }

    confirmJiraBulkSubmission() {

        let confirmBulkImportResults = browser.waitUntil(function () {
            return browser.isVisible(""); // Wait until finish results message is visible
        }, process.env.JIRA_TIMEOUT, 'timeout occured during confirmJiraBulkSubmission()'); // wait up to 10 minutes

        if (confirmBulkImportResults) {
            var jiraLogs = this.jiraLogsUrl.getAttribute("href"); //get URL location of logs
            console.log(`Download a detailed log at ${jiraLogs}\n`);

            var jiraCreatedIssuesLink = this.jiraCreatedIssuesUrl.getAttribute("href");
            console.log(`Check Created Issues at ${jiraCreatedIssuesLink}\n`);

            // Navigate to jira Home Search Screen
            this.jiraResultsScreen.click();

            //Assertion to Validate CSV Bulk Create count equals jira issues indicator
            var jiraBulkTotalIndicator = this.jiraBulkTotalIndicator.getText();
            expect(process.env.BULKCOUNT).to.equal(jiraBulkTotalIndicator.split("of").pop().trim());
        } // end if

        else {
            throw new Error(`Error occured during the Jira Bulk Import Process. Please refer to Jira logs at ${jiraLogs} \n`);
        }

        let jiraIssueSummary = this.jiraissueSummaryIndicator.getText();
        let jiraFeatureArray = this.getJiraFeatures(jiraLogs);

        //Create an jiraBulkObject Object and return results
        let jiraBulkObject = {
            jiraTitle: jiraIssueSummary,
            totalJiraIds: jiraFeatureArray,
            totalJiraIdsCount: jiraFeatureArray.length,
            jiraURL: jiraCreatedIssuesLink
        };

        return jiraBulkObject;

    }
        
    getJiraFeatures(jiraLogsUrl) {

        //Navigate to the logs file
        browser.url(jiraLogsUrl).pause(3000);
        let text = this.jiraLogsFeaturesIds.getText(); //get logs text

        //Search for Jira IDS starting with UpperCase A-Z-, the 'g' flag performs a global match, rather than a signle match and stopping. 
        let regex = new RegExp(/\[[A-Z/-/ ].*\],/, 'g');
        let jiraIdsArray = text.match(regex);

        // Filter Results remove "[]" ","
        return jiraIdsArray.map(function (el) { return el.replace(/\[|],.*/g, "").trim() });
    }
        
    
    exportBulkImportResults(jiraBulkObjectIds,jiraURL, jiraFeatureName,jiraFeatureNameCount) {
        //Writes JiraIds, Url, FeatureName and count.
        const fs = require('fs');
        const path = require('path');

        let dirPath = path.dirname(process.env.JIRA_BULK_OUTPUT_PATH); // returns directory from path
        let jiraFileName = path.basename(process.env.JIRA_BULK_OUTPUT_PATH); //return filename from path
        const exportPath = path.join(dirPath, jiraFileName);

        fs.writeFileSync(exportPath, jiraURL, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, jiraBulkObjectIds, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, jiraFeatureName, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, jiraFeatureNameCount, function (err) {
            if (err) throw err;
        });

        console.log(`Export Jira Bulk Import Results to ${exportPath} \n`);
    }

} // end class JiraBulkImport_Page

module.exports = new JiraBulkImport_Page(); 