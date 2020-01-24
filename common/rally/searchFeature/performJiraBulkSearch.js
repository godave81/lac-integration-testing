module.exports = (function jiraBulkSearchResults(jiraUrl, featureName, featureNameCount) {

    var searchString = "/issues/?jql=text~" + '"' + featureName + '"';
    var jiraSearchString = jiraUrl.replace("/secure/Dashboard.jspa", searchString);

    console.log(`View ${featureNameCount} Features at Jira ${jiraSearchString} \n`);
});