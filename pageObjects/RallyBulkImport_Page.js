class RallyBulkImport_Page {

    /* Enter Rally Bulk Import Selectors */
    get rallyimportExportButton() { return $(""); }
    get rallyDropdownContentWrapper() { return $(""); }
    get rallyImportDropDown() { return $(""); }
    get rallyfileUploadButton() { return $(""); }
    get rallyImportButton() { return $(""); }
    get rallyAlertMessage() { return $(""); }


    navigateRallyBulkCreationSetup() {

        //Open Rally Portfolio Items Bulk Import Screen
        this.rallyimportExportButton.click();
        this.rallyDropdownContentWrapper.waitForVisible();

        //  waitUntil rallyPortfolioItemImporterPopUp is visible.returns true.
        this.rallyImportDropDown.click().waitUntil(function () {
            return ($("").isVisible() === true);
        }, process.env.RALLY_TIMEOUT, 'timeout occured navigating to Rally Portfolio Items Bulk Import Window');

    }

    uploadRallyFeatureCSVTemplate(filePath) {

        //Upload file.
        console.log("Uploading Rally Portfolio Items CSV Template " + filePath + "\n");
        this.rallyfileUploadButton.addValue(filePath);
    }

    confirmRallyBulkSubmission() {

        // Submit and wait.
        this.rallyImportButton.click();

        var isSuccessfullSubmission = browser.waitUntil(function () {
            return (browser.isVisible("") === true); //  waitUntil csv file is uploaded.
        }, process.env.RALLY_TIMEOUT, 'Timeout occured uploading Rally CSV file.');

        var rallyAlertMessage = $("").getText().toString();

        if (isSuccessfullSubmission) {
            console.log(rallyAlertMessage); //print confirmation message
        }

        else {
            console.log("Rally import items was unsuccessful");
            assert.fail();
        }

        // extact digits from message and return featureCount
        let rallyFeatureCount = parseInt(rallyAlertMessage.replace(/\D/g, '').trim());
        let rallyInputBulkCount = parseInt(process.env.BULKCOUNT);

        // Assert expected Bulk Import Count with actual results.
        expect(rallyInputBulkCount).to.equal((rallyFeatureCount));

        return rallyFeatureCount;
    }

    getBulkImportFeatureName(rallyCSV) {
        const fs = require('fs');
        console.log(rallyCSV + "\n");

        let fileContents = fs.readFileSync(rallyCSV, { encoding: 'utf8' }, function (err) {
            if (err) throw err;
            console.error(`No data found in ${fileContents}`);
        });


        //Extract featureName  from  input CSV file
        let fileContentsArray = fileContents.toString().split(",");
        let rallyFeatureName = fileContentsArray.filter((el) => { return el.includes("Create Rally Bulk Feature") });

        return rallyFeatureName.pop().trim();

    }

    getBulkImportResultsUrl(rallyUrl, rallyFeatureName) {

        let queryString = "search?keywords=" + '"' + rallyFeatureName + '"';
        let rallyResultsUrl = rallyUrl.replace("portfolioitemstreegrid",queryString);

        return rallyResultsUrl.trim();
    }

    getBulkImportFormattedIds(rallyFeatureName, rallyFeatureCount) {
        var request = require('request');

        var rallyFormattedIds = [];

        rallyFormattedIds = browser.call(function () {
            return new Promise(function (resolve, reject) {

                //Rally EndPoint
                const rallyEndPoint = "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature";

                // Build Query String using Feature name and count.
                let queryString = "?query=(Name = " + "\"" + rallyFeatureName + "\"" + ")" + "&fetch=FormattedID&pagesize=" + rallyFeatureCount;
                
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
                        let formattedIDs = results.map(r => r.FormattedID);
                        resolve(formattedIDs);

                    }

                    else {
                        console.log(`Error statusCode: ${response.statusCode}  ${response.statusMessage}`);
                        reject(new Error("Rally API Failure"));
                    }

                });

            });

        }); //end browser.call

        return rallyFormattedIds;

    } // getBulkImportFormattedIds


    exportBulkImportResults(rallyURL, rallyFeatureName, rallyFeatureCount, rallyFeatureIds) {
        
        const fs = require('fs');
        const path = require('path');

        let dirPath = path.dirname(process.env.RALLY_BULK_OUTPUT_PATH); // returns directory from path
        let rallyFileName = path.basename(process.env.RALLY_BULK_OUTPUT_PATH); //return filename from path
        const exportPath = path.join(dirPath, rallyFileName);

        fs.writeFileSync(exportPath, rallyURL, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, rallyFeatureIds, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, rallyFeatureName, function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, "\n", function (err) {
            if (err) throw err;
        });

        fs.appendFileSync(exportPath, rallyFeatureCount, function (err) {
            if (err) throw err;
        });

        console.log(`Export Rally Bulk Import Results to ${exportPath} \n`);
    }

} // end class RallyBulkImport_Page

module.exports = new RallyBulkImport_Page(); 