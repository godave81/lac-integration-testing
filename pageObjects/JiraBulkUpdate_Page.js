class JiraBulkUpdate_Page {

    /* Enter JIRA Bulk Update Selectors */
    get bulkEditAllCheckBox()                { return $(""); }
    get nextButton()                         { return $(""); }
    get jiraStatusEditRadioButton()          { return $(""); }
    get jiraEditOperationLabel()             { return $(""); }
    get jiraStatusTransitionRadioButton()    { return $(""); }
    get jiraTransitionOperationLabel()       { return $(""); }
    get jiraOperationsAnalyzingRadioButton() { return $(""); }
    get jiraAcknowledgeButton()              { return $(""); }
    get jiraConfirmBulkUpdatesButton()       { return $(""); }
    get jiraStatusResultsAssertion()         { return $(""); }
    get jiraPreliminaryEstimate()            { return $(""); }
    get jiraPreliminaryEstimateAssertion()   { return $(""); }


    jiraFeatureImportResults(jiraFeatureImportResults) {
        const fs = require('fs');
        const path = require('path');

        let dirPath = path.dirname(jiraFeatureImportResults); // returns directory from path
        let fileName = path.basename(jiraFeatureImportResults); //return filename from path
        const jiraFeatureImportResultsPath = path.join(dirPath, fileName);

        let fileContents = fs.readFileSync(jiraFeatureImportResultsPath, { encoding: 'utf8' }, function (err) {
            if (err) throw err;
            console.error(`No data found in ${fileContents}`);
        });

        //Extract file contents from CSV Results file
        var fileContentsArray = fileContents.toString().split("\n");

        let fileContentsObj = {
            url: fileContentsArray.shift().toString(),
            featureName: fileContentsArray.filter((el) => { return el.includes("Create Jira Bulk Feature") }).toString(),
            featureCount: parseInt(fileContentsArray.pop())
        };

        return fileContentsObj;
    }

    navigateJiraBulkOperation(fileContentsUrl) {
        //Navigate to Jira Search and display jiraFeatureImportResults
        browser.url(fileContentsUrl).waitUntil(function () {
            return (browser.isVisible("") === true); //  waitUntil jira nav results elements are visible.
        }, process.env.JIRA_TIMEOUT, 'timeout occured navigateJiraSearch Results');


        //Navigate to Bulk Operation Wizard
        browser.click("").waitUntil(function () {
            return (browser.isVisible("#bulkedit_all") === true); //  waitUntil Bulk edit button is displayed.
        }, process.env.JIRA_TIMEOUT, 'timeout occured  trying to Perform Bulk Edit Action');

        browser.click("").waitUntil(function () {
            return (browser.isVisible("") === true); //  waitUntil Step 1 of 4: Choose Issues is displayed.
        }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulkOperation Step 1 of 4: Choose Issues');
    }

    navigatetoJiraChooseIssues() {
        //Step 1 of 4: Choose Issues
        this.bulkEditAllCheckBox.click();

        //click next button
        this.nextButton.click().waitUntil(function () {
            return (browser.isVisible("") === true); //  waitUntil Step 2 of 4: Choose Operations is displayed.
        }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 2 of 4: Choose Operation');
    }

    navigatetoJiraChooseOperation(statusSelection) {

        let jiraOperationSelection = undefined;

        if (statusSelection.includes("Analyzing")) {
            //Step 2 of 4: Choose Operation. Select Transition Status
            this.jiraStatusTransitionRadioButton.click();
            jiraOperationSelection = this.jiraTransitionOperationLabel.getText();
            
            //Navigate to Operations Details
            this.nextButton.click().waitUntil(function () {
                return (browser.isVisible("") === true); //  waitUntil Step 3 of 4: Operation Details is displayed.
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 3 of 4: Choose Details');
        }

        else if (statusSelection.includes("XS")) {
            //Step 2 of 4: Choose Operation. Select Edit Status
            this.jiraStatusEditRadioButton.click();
            jiraOperationSelection = this.jiraEditOperationLabel.getText();
    
            //Navigate to Operations Details
            this.nextButton.click().waitUntil(function () {
                return (browser.isVisible("") === true); //  waitUntil Step 3 of 4: Operation Details is displayed.
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 3 of 4: Choose Details');

        }
        console.log(`${jiraOperationSelection} workflow selected \n`);

        return jiraOperationSelection;
    }

    navigateJiraOperationDetails(jiraOperationDetailsSelection) {

        if (jiraOperationDetailsSelection.includes("Transition Issues")) {
            //Step 3 of 4: Choose Details. Update Status to "Analyzing"
            this.jiraOperationsAnalyzingRadioButton.click();

            //Navigate to Transition Issues Bulk Edit
            this.nextButton.click().waitUntil(function () {
                return (browser.isVisible("") === true);
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 4 of 4: Transition Issues');
        }

        else if (jiraOperationDetailsSelection.includes("Edit Issues")) {

            let url = browser.getUrl(); //get current Jira ENV URL

            //Step 3 of 4: Choose Details based on JiraENV. Update "Preliminary Estimate" Field to XS.
            if (url.includes('')) { //enter Jira URL
                this.jiraPreliminaryEstimate.click().$("").click();
            }

            //Navigate to Transition Issues Bulk Edit
            this.nextButton.click().waitUntil(function () {
                return (browser.isVisible("") === true);
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 4 of 4: Transition Issues'); 
        }
    }

    navigateJiraConfirmBulkUpdate(statusSelection, testCaseName) {

        if (testCaseName.includes("Update Status Field")) {
            //Step 4 of 4: Transition Issues: Bulk Workflow Transition Confirmation
            this.nextButton.click().waitUntil(function () {
                return (browser.isVisible("") === true); //  waitUntil Step 4 of 4: Confirmation is displayed.
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Step 4 of 4: Transition Issues');

            //Confirm Button and Bulk Operation In Progress
            this.nextButton.click().waitUntil(function () {
                return (browser.getText("") === "Bulk operation is 100% complete."); //  waitUntil 1.5 minutes Step 4 of 4: Confirmation is displayed.
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Progress Bar');
        }

        else if (testCaseName.includes("Update Preliminary Estimate Field")) {
            //Confirm Button and Bulk Operation In Progress
            this.jiraConfirmBulkUpdatesButton.click().waitUntil(function () {
                return (browser.getText("") === "Bulk operation is 100% complete."); //  waitUntil 1.5 minutes Step 4 of 4: Confirmation is displayed.
            }, process.env.JIRA_TIMEOUT, 'timeout occured  during navigateJiraBulk Operation Progress Bar');
        }

        //Acknowledge and Navigate back to Jira Results
        let isAcknowledge = this.jiraAcknowledgeButton.click().waitUntil(function () {
            return (browser.isVisible("") === true && browser.isVisible("#status-val > span") === true); //  waitUntil jira nav results elements are visible with updated status.
        }, process.env.JIRA_TIMEOUT, 'timeout occured after clicking on the Acknowledge button navigateJiraSearch Results');

        //if User Acknowledged is true, Assert
        
        if (isAcknowledge) {

            if (statusSelection.includes("Analyzing")) {
                //Assertions
                expect(statusSelection.toUpperCase()).to.equal(this.jiraStatusResultsAssertion.getText()); // expected 'ANALYZING' to equal 'ANALYZING' 
            }

            else if (statusSelection.includes("XS")) {
                let url = browser.getUrl();

                //Assert all jira instances except for testbank
                if (!url.includes('testbank ')) {
                    expect(statusSelection.toUpperCase()).to.equal(this.jiraPreliminaryEstimateAssertion.getText()); // expected 'XS' to equal XS
                }


                else { //Assert testJiraBank
                    expect(statusSelection.toUpperCase()).to.equal(this.jiraPreliminaryEstimateAssertionBNK.getText()); // expected 'XS' to equal XS
                }
            }
        }
    }

} // end class JiraBulkUpdate_Page

module.exports = new JiraBulkUpdate_Page();