var request = require('request');

module.exports = (

    function apiRallyToJiraVerifyBulkCreate(jiraUrl, featureName, featureNameCount) {


        console.log(`Validating Features are synched to Jira \n`);

        browser.call(function () {
            return new Promise(function (resolve, reject) {

                //Invoke SetInterval Every 10 seconds to check all created Features are synched to JIRA.
                var jiraTimer = setInterval(() => {

                    //JIRA EndPoint
                    const jiraEndPoint = jiraUrl.replace("secure/Dashboard.jspa", "rest/api/2/search");
                    var queryString = "?jql=text~" + "\"" + featureName + "\"" + "&maxResults=" + featureNameCount + "&validateQuery=true&fields=summary";


                    console.log("Calling jiraEndPoint " + jiraEndPoint.concat(queryString));

                    request({
                        url: jiraEndPoint.concat(queryString),
                        method: 'GET',
                        followRedirect: true,
                        timeout: 10000,
                        maxRedirects: 10,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': process.env.JIRAAPIKEY,
                            'Accept-Charset': 'utf-8',
                            'ZSESSIONID': process.env.ZSESSIONID
                        }

                    }, function (error, response, body) {

                        if (!error && response.statusCode === 200) {

                            console.log(`Success statusCode: ${response.statusCode}  ${response.statusMessage} \n`);
                            let jsonObj = JSON.parse(body);

                            //Extract Total value from JSON
                            let jiraTotal = jsonObj.total;

                            if (jiraTotal === featureNameCount) {
                                console.log(`${jiraTotal} Features Synched to ${jiraUrl} \n`);
                                resolve();

                                //Stop Timer
                                setTimeout(() => { clearInterval(jiraTimer) });
                            }

                            else {
                                console.log(`Waiting.. Current Features synch count:  ${jiraTotal}`);
                            }

                        }

                        else {
                            console.log(`Error statusCode: ${response.statusCode}  ${response.statusMessage}`);
                            reject(new Error("JIRA API Failure"));
                        }

                    });

                }, 10000);  // run every 10 seconds intervals.

                // Set API Time out value in ms. 5min.
                setTimeout(() => { clearInterval(jiraTimer) }, 3000000);

            }); // end promises

        }); // end function ApiRallyToJiraVerifyBulkCreate 

    });  //end module.exports