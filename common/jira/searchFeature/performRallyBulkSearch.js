module.exports = (function rallyBulkSearchResults(rallyUrl, featureName, featureNameCount) {

    var searchString = "search?keywords=" + '"' + featureName + '"';
    var rallySearchString = rallyUrl.replace("portfolioitemstreegrid", searchString);
    console.log(`View ${featureNameCount} Features at Rally ${rallySearchString} \n`);
});