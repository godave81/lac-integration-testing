module.exports = {

    setRallyInstance: function (rallyURL, rallyTitle) {

        console.log("Navigating to " + rallyURL + "\n");
        browser.url(rallyURL).pause(500);

        browser.waitUntil(function () {
            return (browser.isVisible(".smb-DataTable")); //wait for rallygrid tree to be visible.
        }, process.env.RALLY_TIMEOUT, 'expected rally portfolio items page not to timeout');

        expect(rallyURL).to.equal(browser.getUrl()); // Assert rally home url
        expect(rallyTitle).to.equal(browser.getTitle()); //Assert Rally home page title.
    },

    setJiraInstance: function (jiraURL, jiraTitle) {
        
        console.log("Navigating to " + jiraURL + "\n");
        browser.url(jiraURL);
        
        browser.waitUntil(function() {
            return (browser.isVisible("")); // Wait for page header elements to be visible.
        }, process.env.JIRA_TIMEOUT, 'expected jira home page not to timeout');
        

        expect(jiraURL).to.equal(browser.getUrl()); //Assert jira home url
        expect(jiraTitle).to.equal(browser.getTitle()); //Assert jira home page title
    }

};