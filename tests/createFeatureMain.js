const config = require('../config/credentials/config.js');
const rallyFeature = require('../common/rally/createFeature/createRallyFeature.js');
const jiraFeature = require('../common/jira/createFeature/createFeatureJira.js');
const jiraSearch = require('../common/rally/searchFeature/performJiraSearch.js');
const rallySearch = require('../common/jira/searchFeature/performRallySearch.js');
const envInstance = require('../config/credentials/setEnvInstance.js');

function executeRallyFeaturesTC (sourceUrl,sourceInputTitle, targetUrl, targetInputTitle) {

    var shortTitle = sourceInputTitle.split(' › ',1).toString();

  
    it(shortTitle + ': Create Rally Feature - minimum required fields ', function () {

      //Test Data
      var data = {testCaseName: this.test.title, rallyStatus: 'Funnel'};
      
      //Set Rally Env
       envInstance.setRallyInstance(sourceUrl,sourceInputTitle);
      
      // Call Create Feature
      var rallyId = rallyFeature(data.testCaseName,data.rallyStatus);
      
      // Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);
      
      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);

      // //Perform Test Assertions JIRA
      let jiraRallyId = browser.getText("");
      expect(rallyId).to.include(jiraRallyId.toString().trim()); // check Rally id appears in Jira

    });

    it(shortTitle + ': Create Rally Feature - all integrated fields ', function () {
      
      //Test data
      var data = {testCaseName: this.test.title, rallyStatus: 'Funnel',rallyPreliminaryEstimate: 'XS', rallyCompliance: null ,rallyInvestmentCategory: null, rallyDescription: 'hello', rallyAcceptanceCriteria: 'done'};
      
      //Set Rally Env
      envInstance.setRallyInstance(sourceUrl,sourceInputTitle);

      // // Call Create Feature
      var rallyId = rallyFeature(data.testCaseName,data.rallyStatus,data.rallyPreliminaryEstimate,data.rallyInvestmentCategory, data.rallyCompliance, data.rallyDescription, data.rallyAcceptanceCriteria);

      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);

      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);

      //Perform Test Assertions JIRA
      expect(rallyId).to.equal(browser.getText("")); //check Rally id appears in Jira
      expect(data.rallyDescription).to.equal(browser.getText(""));
      expect(data.rallyAcceptanceCriteria).to.equal(browser.getText(""));

    });

    it(shortTitle + ': Create Rally Feature - description with special HTML formatting', function () {
      
      //Test data
      var data = {testCaseName: this.test.title, rallyDescription: "<!DOCTYPE html> <html> <head> <title>Page Title</title> </head> <body>  <h1>This is a Heading</h1> <p>This is a paragraph.</p>  </body> </html>"}

       //Set Rally Env
       envInstance.setRallyInstance(sourceUrl,sourceInputTitle);

      // Call Create Feature Function
      var rallyId = rallyFeature(data.testCaseName,null,null,null,null,data.rallyDescription,null);

      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);

      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);

      //Perform Test Assertions JIRA
      expect(rallyId).to.equal(browser.getText("")); // check Rally id appears in Jira
      expect(data.rallyDescription).to.include('<html>'); // Validate JIRA Description include HTML.

    });
  
    it(shortTitle +': Create Rally Feature - acceptance criteria with special HTML formatting', function () {
       
      //Test data
       var data = {testCaseName: this.test.title, rallyAcceptanceCriteria: "<!DOCTYPE html> <html> <head> <style> body {background-color: powderblue;} h1   {color: blue;} p    {color: red;} </style> </head> <body>  <h1>This is a heading</h1> <p>This is a paragraph.</p>  </body> </html>"};

      //Set Rally Env
      envInstance.setRallyInstance(sourceUrl,sourceInputTitle);

      // Call Create Feature Function
      var rallyId = rallyFeature(data.testCaseName,null,null,null,null,null, data.rallyAcceptanceCriteria);

      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);

      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);
      
      //Perform Test Assertions JIRA
      expect(rallyId).to.equal(browser.getText("")); // check Rally id appears in Jira
      expect(data.rallyAcceptanceCriteria).to.include('<html>'); // Validate JIRA Acceptance Criteria include HTML.
      
    });

    
    it(shortTitle + ': Create Rally Feature - no status value', function () {
      
      //Test data
      var data = {testCaseName: this.test.title, rallyPreliminaryEstimate: "XS", rallyDescription: "test", rallyAcceptanceCriteria: "done"};

       //Set Rally Env
       envInstance.setRallyInstance(sourceUrl,sourceInputTitle);
      
      //Create Feature
      var rallyId = rallyFeature(data.testCaseName,null,data.rallyPreliminaryEstimate,null, null, data.rallyDescription, data.rallyAcceptanceCriteria);

      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);
  
      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);      

      //Perform Test Assertions JIRA
      expect(data.rallyPreliminaryEstimate).to.include(browser.getText(""));  //XS(13 == X13)
      expect(data.rallyDescription).to.equal(browser.getText(""));
      expect(data.rallyAcceptanceCriteria).to.equal(browser.getText(""));

    });

    it(shortTitle + ': Create Rally Feature - no acceptance criteria', function () {

      //Test data
      var data = {testCaseName: this.test.title,rallyStatus: 'Funnel',rallyPreliminaryEstimate: "XS", rallyDescription: 'hello'};
      
      //Set Rally Env
      envInstance.setRallyInstance(sourceUrl,sourceInputTitle);

      // Call Create Feature Function
      var rallyId = rallyFeature(data.testCaseName,data.rallyStatus,data.rallyPreliminaryEstimate,null, null, data.rallyDescription);
      
      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);

      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);

      //Perform Test Assertions JIRA
      expect(rallyId).to.equal(browser.getText("")); // check Rally id appears in Jira
      expect(data.rallyPreliminaryEstimate).to.include(browser.getText(""));  //XS(13 == X13)
      expect(data.rallyDescription).to.equal(browser.getText(""));
      expect(browser.isVisible("")).to.be.false; // no Acceptance Criteria set to false.

    });

    it(shortTitle + ': Create Rally Feature- no description', function () {
    
      //Test data
      var data = {testCaseName: this.test.title,rallyStatus: 'Funnel',rallyPreliminaryEstimate: "XS", rallyAcceptanceCriteria: "done" };

      //Set Rally Env
      envInstance.setRallyInstance(sourceUrl,sourceInputTitle);

      // Call Create Feature Function
      var rallyId = rallyFeature(data.testCaseName,data.rallyStatus,data.rallyPreliminaryEstimate,null, null,null, data.rallyAcceptanceCriteria);
          
      //Set Jira Instance
      envInstance.setJiraInstance(targetUrl,targetInputTitle);
 
      // call jiraSearch using rallyId
      jiraSearch(targetUrl,rallyId,data.testCaseName);

      //Perform Test Assertions JIRA
      expect(data.testCaseName).to.equal(browser.getText("")); // validate AC Feature === JIRA Feature Name
      expect(rallyId).to.equal(browser.getText("")); // check Rally id appears in Jira
      expect(data.rallyPreliminaryEstimate).to.include(browser.getText(""));  //XS(13 == X13)
      expect(data.rallyAcceptanceCriteria).to.equal(browser.getText(""));
      expect(browser.getText("")).to.include("Click to add description"); // no Description default value in testJiraPNC.

    });

  }; //end executeRallyFeaturesTests

 
function executeJiraFeaturesTC (sourceUrl, sourceInputTitle, targetUrl, targetInputTitle) {
  
  var shortTitle = sourceInputTitle.split('-').pop().trim();

  it(shortTitle + ': Create Jira Feature without Team', function () {

    //Test Data
    var data = {testCaseName: this.test.title};
  
    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);
    
    // Create Feature
    var jiraId = jiraFeature(data.testCaseName);
    
    // //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);

    // //Rally Search
    rallySearch(targetUrl,jiraId,data.testCaseName);

    //Perform Test Assertions Rally
    browser.pause(3000); //wait
    expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId appears in rally.
  });

  

  it(shortTitle + ': Create Jira Feature with Team', function () {

    //Test Data
    var data = { testCaseName: this.test.title, isjiraTeamName: true };

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl, sourceInputTitle);

    // Create Feature
    var jiraId = jiraFeature(data.testCaseName, data.isjiraTeamName);

    // //Set Rally Instance
    envInstance.setRallyInstance(targetUrl, targetInputTitle);

    // //Rally Search
    rallySearch(targetUrl, jiraId, data.testCaseName);

    //Perform Test Assertions Rally
    browser.pause(3000); //wait
    expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId appears in rally.
  });



  it(shortTitle + ': Create Jira Feature - all integrated fields', function () {

    //Test Data //Run the Business
    var data = {testCaseName: this.test.title,isjiraTeamName:false, jiraDescription:"hi", jiraAcceptanceCriteria:"done", jiraPreliminaryEstimate:"XS (13)", jiraCompliance:"", jiraInvestmentCategory:""};

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);
    
    // Create Feature
    var jiraId = jiraFeature(data.testCaseName,data.isjiraTeamName,data.jiraDescription,data.jiraAcceptanceCriteria,data.jiraPreliminaryEstimate,data.jiraCompliance,data.jiraInvestmentCategory);

    //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);
 
     //Rally Search
     rallySearch(targetUrl,jiraId,data.testCaseName);

     //Perform Test Assertions Rally
     browser.pause(3000); //wait
     expect(jiraId).to.equal(browser.getText("")); // validate FeatureId
     expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
     expect(data.jiraPreliminaryEstimate).to.include(browser.getText(""));   //jiraPreliminaryEstimate
     expect(data.jiraInvestmentCategory).to.include(browser.getText(""));  //"Run the Business"
     expect(data.jiraCompliance).to.equal(browser.getText("")); // Compliance
     var descFrame = $("").value;
     expect(data.jiraDescription).to.equal(browser.frame(descFrame).getText("")); //assert Description
     browser.frameParent(); //Change focus of descFrame
     var accptFrame = $("").value;
     expect(data.jiraAcceptanceCriteria).to.equal(browser.frame(accptFrame).getText("")); //Assert Acceptance Criteria.
    
  });
    
  it(shortTitle + ': Create Jira Feature - description with special HTML formatting', function () {

    //Test Data
    var data = {testCaseName: this.test.title,isjiraTeamName:false,jiraDescription:"'<!DOCTYPE html> <html> <head> <title>Page Title</title> </head> <body> <h1>This is a Heading</h1> <p>This is a paragraph.</p> </body> </html>'", jiraAcceptanceCriteria:"done", jiraPreliminaryEstimate:"XS (13)"};

    //Set JIRA Env
     envInstance.setJiraInstance(sourceUrl,sourceInputTitle);

    // Create Feature
    var jiraId = jiraFeature(data.testCaseName,data.isjiraTeamName,data.jiraDescription,data.jiraAcceptanceCriteria,data.jiraPreliminaryEstimate);

    //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);
 
    //Rally Search
    rallySearch(targetUrl,jiraId,data.testCaseName);

     //Perform Test Assertions
    browser.pause(3000); //wait
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId
    expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
    var descFrame = $("").value;
    expect(data.jiraDescription).to.equal(browser.frame(descFrame).getText("")); //assert Description

  });

  it(shortTitle + ': Create Jira Feature - no status value', function () {
    
    //Test Data
    var data = {testCaseName: this.test.title,isjiraTeamName:false,};

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);

    // Create Feature
    var jiraId = jiraFeature(data.testCaseName,data.isjiraTeamName);

    //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);
 
    //Rally Search
    rallySearch(targetUrl,jiraId,data.testCaseName);

     //Perform Test Assertions
    browser.pause(3000); //wait
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId
    expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
    expect("Funnel").to.equal(browser.getText("")); //// status value = Funnel
  });

  it(shortTitle + ': Create Jira Feature- no acceptance criteria', function () {

    //Test Data
    var data = {testCaseName: this.test.title,isjiraTeamName:false,};

    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);

    // Create Feature
    var jiraId = jiraFeature(data.testCaseName,data.isjiraTeamName);

    //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);
 
    //Rally Search
    rallySearch(targetUrl,jiraId,data.testCaseName);

     //Perform Test Assertions
    browser.pause(3000); //wait
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId
    expect(data.testCaseName).to.equal(browser.getText("")); // validate Rally Feature Name
    expect(browser.getText("")).to.be.empty; //Assert Acceptance Criteria is not populated.

  });

  it(shortTitle + ': Create Jira Feature- No Description', function () {
    
    //Test Data
    var data = {testCaseName: this.test.title};
  
    //Set JIRA Env
    envInstance.setJiraInstance(sourceUrl,sourceInputTitle);
    
    // Create Feature
    var jiraId = jiraFeature(data.testCaseName);
    
   
    // //Set Rally Instance
    envInstance.setRallyInstance(targetUrl,targetInputTitle);

    // //Rally Search
    rallySearch(targetUrl,jiraId,data.testCaseName);

    //Perform Test Assertions Rally
    browser.pause(3000); //wait
    expect(jiraId).to.equal(browser.getText("")); // validate FeatureId appears in rally. 

  });



 }; // end of  executeJiraFeaturesTC


describe('Create Features: Test Suite', function () {

  //Get Inputs
  let source = config.getSourceConfig();
  let target = config.getTargetConfig();

  if (source.sourceInput.includes('rallyTest')) {
    executeRallyFeaturesTC(source.sourceInputUrl, source.sourceInputTitle, target.targetInputUrl, target.targetInputTitle);
  }

  else if (source.sourceInput.includes('testJira')) {
    executeJiraFeaturesTC(source.sourceInputUrl, source.sourceInputTitle, target.targetInputUrl, target.targetInputTitle);
  }

  else {
    throw Error("Invalid Arguments. Check Inputs");
  }


}); // end Mocha describe