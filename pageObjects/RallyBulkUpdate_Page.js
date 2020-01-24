class RallyaBulkUpdate_Page {
    /* Enters Rally Bulk Update Selectors */
    get rallyLoadingElement()                 { return $(""); }
    get rallyWorkItemTextBox()                { return $(""); }
    get rallyTotalWorkItemsCount()            { return $(""); }
    get rallyCheckBoxAll()                    { return $("")}
    get rallyBulkEditButton()                 { return $(""); }
    get rallyBulkEditField()                  { return $(""); }
    get rallyBulkEditFieldTextBox()           { return $(""); }
    get rallyBulkEditFieldValue()             { return $(""); }
    get rallyBulkEditFieldValueTextBox()      { return $(""); }
    get rallyBulkEditSubmitButton()           { return $(""); }
    get rallyBulkEditSuccessMessage()         { return $(""); }
    get rallyPageSelectButtons()              { return $$(""); } //$$ to fetch all elements in the HTML DOM
    get rallyPageSelectNextButton()           { return $(""); }
    get rallyTotalItemsSelected()             { return $(""); }

    //Methods
    rallyFeatureImportResults(rallyFeatureImportResults) {
        const fs = require('fs');

        let fileContents = fs.readFileSync(rallyFeatureImportResults, { encoding: 'utf8' }, function (err) {
            if (err) throw err;
            console.error(`No data found in ${fileContents}`);
        });

        //Extract file contents from CSV Results file
        var fileContentsArray = fileContents.toString().split("\n");

        let fileContentsObj = {
            url: fileContentsArray.shift().toString(),
            featureName: fileContentsArray.filter((el) => { return el.includes("Create Rally Bulk Feature") }).toString(),
            featureCount: parseInt(fileContentsArray.pop())
        };

        return fileContentsObj;
    }

    navigateRallyFilterFeatures(featureName, featureCount) {

        //Wait for rallyWorkItemTextBox to be enabled
        this.rallyWorkItemTextBox.waitForEnabled();

        //Enter Feature Name and wait for filtered results
        this.rallyWorkItemTextBox.setValue(featureName).keys("\uE004");
        browser.waitUntil(function () {
            return (browser.getText("") === `Total Work Items: ${featureCount}`);
        }, process.env.RALLY_TIMEOUT, 'Timeout view Rally filter results');

        //Assert Filtered Features Count equals expected Features Count.
        let filterCount = this.rallyTotalWorkItemsCount.getText().split(":").pop().trim();
        expect(parseInt(filterCount)).to.equal(featureCount);
        
        return parseInt(filterCount);
    }

    navigateRallyBulkEditDisplayPanel(bulkFilterCount) {

        
        // Select all Portfolio Items Filter Resutls if less than 200 items displayed on Rally UI.
        if (bulkFilterCount <= 200) {

            //checkbox-selectAll
            this.rallyCheckBoxAll.click().waitUntil(function () {
                return browser.isVisible("");
            }, process.env.RALLY_TIMEOUT, 'Timeout Rally click on Bulk Edit Button');

            // Extact number from selected elements and Assert selected items vs filtered items.
            let itemsSelectedMessage = this.rallyTotalItemsSelected.getText();
            console.log(itemsSelectedMessage);

            let itemsSelectedCount = parseInt(itemsSelectedMessage.replace(/\D/g, '').trim());
            expect(itemsSelectedCount).to.equal(bulkFilterCount);

            //select Bulk Edit Operation and wait for Bulk Edit Display Panel to Display.
            this.rallyBulkEditButton.click().waitUntil(function () {
                return browser.isVisible("");
            }, process.env.RALLY_TIMEOUT, 'Timeout Rally view Bulk Edit Display Panel');

        }
        // select all Portfolio Items greater than 500. Navigate all page # and select remaining Portfolio Items.
        else {

            //checkbox-selectAll
            this.rallyCheckBoxAll.click().waitUntil(function () {
                return browser.isVisible("");
            }, process.env.RALLY_TIMEOUT, 'Timeout Rally click on Bulk Edit Button');

            //Get All Page Numbers From Rally Filter Results.
            let pageNumberButtons = this.rallyPageSelectButtons;
            let pageNumberCount = pageNumberButtons.map(function (el) { return el.getAttribute('type'); })

            for (let i = 0; i < pageNumberCount.length - 1; i++) {

                this.rallyPageSelectNextButton.click();
                this.rallyLoadingElement.waitForExist(true); // wait for Loading Message Not to Exist.
                this.rallyCheckBoxAll.click(); //select remaning features.
            }

            // Extract number from selected elements and Assert selected items vs filtered items.
            let itemsSelectedMessage = this.rallyTotalItemsSelected.getText();
            console.log(itemsSelectedMessage);

            let itemsSelectedCount = parseInt(itemsSelectedMessage.replace(/\D/g, '').trim());
            expect(itemsSelectedCount).to.equal(bulkFilterCount);


            //select Bulk Edit Operation and wait for Bulk Edit Display Panel to Display.
            this.rallyBulkEditButton.click().waitUntil(function () {
                return browser.isVisible("");
            }, process.env.RALLY_TIMEOUT, 'Timeout Rally view Bulk Edit Display Panel');

        } // else

    }

    rallyPerformBulkEditSelection(statusSelection) {
        
        if(statusSelection.includes("Analyzing")) {
        //Set Rally Field State
        this.rallyBulkEditField.click();    
        this.rallyBulkEditFieldTextBox.setValue("State").keys("\uE015").keys("\uE007");
        
        //Set Rally Field Value
        this.rallyBulkEditFieldValue.click();
        this.rallyBulkEditFieldValueTextBox.setValue(statusSelection).keys("\uE007"); 
        }
        
        //statusSelection select Preliminary Estimate.
        else {
            //Set Rally Field State
            this.rallyBulkEditField.click(); 
            this.rallyBulkEditFieldTextBox.setValue("Preliminary Estimate").keys("\uE015").keys("\uE007");
            
            //Set Rally Field Value to XS(13)
            this.rallyBulkEditFieldValue.click();
            this.rallyBulkEditFieldValueTextBox.setValue(statusSelection).keys("\uE007");
        }   
    }

    rallyBulkEditSubmit(){
        this.rallyBulkEditSubmitButton.click().waitUntil(function () {
            return browser.isVisible("");
        }, process.env.RALLY_TIMEOUT, 'Timeout Rally Submit');
        
        //Display Bulk Edit AlertMessage
        let rallyBulkUpdateAlertMsg = this.rallyBulkEditSuccessMessage.getText();
        
        return rallyBulkUpdateAlertMsg;
    }

    
} // end class RallyaBulkUpdate_Page

module.exports = new RallyaBulkUpdate_Page();