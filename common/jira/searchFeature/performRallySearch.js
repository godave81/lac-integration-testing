module.exports = (function (rallyurl, jiraId, testCaseName) {

    browser.pause(10000); // Wait for LAC
    var completedFlag = false;
    var i = 0;

    try {
        var searchString = "search?keywords=" + '"' + jiraId + '"';
        var rallySearchString = rallyurl.replace("portfolioitemstreegrid", searchString);
        console.log(rallySearchString);
        browser.url(rallySearchString).pause(10000); //Submit Search
    }

    catch (error) {
        console.log(testCaseName + "Incorrect Search URL" + '\n');
        console.error(error);
    }

    while (!completedFlag) {

        var isTestcaseResults = browser.isVisible("");  // enter selector for test case results

        if(i > 5) {
            console.log("exceeded retry limit: skipping test");
            break;
        }

        if (!isTestcaseResults) {

            browser.refresh();
            browser.pause(10000);
            i++;
        }

        else {
            browser.waitForExist(""); // enter selector for rally results.

            if (testCaseName.includes(browser.getText(""))) { // selector for Test Case Name
                isTestcaseResults = true;
                completedFlag = true;
                break;
            }
        }

    } // end while

    //navigate to Rally Feature
    browser.click("").waitForVisible(""); //enter selector to wait to Open Rally Feature ViewPort and perform assertions.
});