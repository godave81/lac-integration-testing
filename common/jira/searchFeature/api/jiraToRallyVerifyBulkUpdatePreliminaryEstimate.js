var request = require('request');

module.exports = (

    function apiJiraToRallyVerifyBulkUpdatePreliminaryEstimate(rallyUrl, featureName, featureNameCount, statusField) {

        console.log(`Validating ${statusField} status updated in Rally \n`);

        browser.call(function () {
            return new Promise(function (resolve, reject) {

                //Invoke SetInterval Every 10 seconds to check all created Features are synched to Rally.
                var rallyTimer = setInterval(() => {

                    //Rally EndPoint
                    const rallyEndPoint = "https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature";


                    // Build Query String for status updates.
                    let queryString = "?query=((Name = " + "\"" + featureName + "\"" + ")" +  " and (PreliminaryEstimate.Name contains "+""+statusField+""+"))" + "&pagesize=1";

        
                    console.log("Calling rallyEndPoint " + rallyEndPoint.concat(queryString));

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

                        if (!error && response.statusCode === 200) {

                            console.log(`Success statusCode: ${response.statusCode}  ${response.statusMessage} \n`);

                            // Parse JSON Response
                            let jsonObj = JSON.parse(body);

                            for (let key in jsonObj) {

                                // Get Object Response.
                                var properties = jsonObj[key];

                                // get key value pairs and assign to a Map Object.
                                var map = new Map(Object.entries(properties));

                                // get value based on the TotalResultCount key.
                                var TotalResultCount = map.get("TotalResultCount");

                                // if all features are synched. echo and stop.
                                if (TotalResultCount === featureNameCount) {

                                    console.log(`${TotalResultCount} Features Updated to ${statusField} status in ${rallyUrl} \n`);
                                    resolve();

                                    //Stop Timer
                                    setTimeout(() => { clearInterval(rallyTimer); });
                                }

                                else { 
                                    console.log(`Waiting.. Current Features synch updated:  ${TotalResultCount}`);
                                }
                            }
                        }

                        else {
                            console.log(`Error statusCode: ${response.statusCode}  ${response.statusMessage}`);
                            reject(new Error("Rally API Failure"));
                        }

                    });

                }, 10000);  // run every 10 seconds intervals.

                // Set API Time out value in ms. 5min.
                setTimeout(() => { clearInterval(rallyTimer); }, 300000);
            });
                
        }); // end browser.call

    });