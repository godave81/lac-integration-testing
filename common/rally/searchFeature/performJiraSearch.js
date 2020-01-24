module.exports = (function (jiraUrl, rallyId, testCaseName) {
    
    var queryString = "/issues/?jql=text~" + rallyId;
    
    var jiraSearchString = jiraUrl.replace("/secure/Dashboard.jspa", queryString);
    console.log(`Performing Jira Search using ${jiraSearchString} \n` );

    try {
        var completedFlag = false;
        var i = 0;
        browser.url(jiraSearchString); //Submit
        browser.pause(15000); // Wait for results page,
    }
    catch (error) {
        console.log(testCaseName + "Incorrect Search URL" + '\n');
        console.error(error);
    }

    while (!completedFlag) {
        var jiraResultsTitle = browser.getTitle();


        if (jiraResultsTitle.includes(testCaseName) || (i >= 6)) { //Try searching x times or skip test.
            completedFlag = true;
            break;
        }

        else {
            browser.url(jiraSearchString); //Reload page
            browser.pause(6000);
            i++;
        }
    }

});