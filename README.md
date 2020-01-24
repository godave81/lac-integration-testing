# Description
This repo contains a webdriverio javascript open source test automtation framework that automates creation of rally and jira work items for use in Rally-Jira Integration projects.
* Automated browser tests to perform end to end functional testing of the LAC rally-Jira integration framework.
* Includes a set of regression test cases that automates feature creation of integrated fields and asserts them in destination application (Rally or Jira).
* Includes a test harness that allows users to define source and destination (can be Rally ART level , team level, Jira environments.) to drive automation tests.
* Load Tests that simulate large bi-directional bulk loads for Rally-Jira. see SoapUI-LoadTest


# Install Dependencies
Pre Install Java JRE, Node 8.x using Chrome 77.0.3865.90 (Official Build) (64-bit) or higher

$ node -v --> v8.9.4

$ java -version --> JRE 1.8 or higher.

Open Chrome Browser and type chrome://version/

Install Microsoft Build Tools (On Windows machines)
https://www.microsoft.com/en-us/download/details.aspx?id=48159


# Project Setup
* Open git and copy url to clipboard "Clone with SSH" repo.  
$ From a bash terminal, git clone "url"  
$ mv lac-integration-testing/ webdriverioFramework/  
$ cp -r webdriverioFramework/ /c/webdriverioFramework/  
$ cd /c/webdriverioFramework/  
$ rm -rf .git  
$ npm install  

# Install and Start Selenium Server
$ npm install selenium-standalone@latest -g  
$ selenium-standalone install && selenium-standalone start  

# Project configuration
* wdio.conf.js - contains global configurations for Webdriver io, including timeout settings, Mocha webhooks, browser and reporter settings, etc.
* package.json - contains meta data level information defining project dependencies, etc.

# Folder Structure
* /tests - Automation Tests go in the "/test" folder. Stores test suites defined in Mocha BDD.
* /pageObjects - Centralize location to store html selectors and methods as page objects.
* /config - Data Source specific configuration for Rally and Jira.
* /errorShots - Stores screenshots containing errors. Folder created after test execution.
* /common -  Global methods for Jira and Rally tests.
* /reports - Directory storing reporters defined in wdio.config. Reporters included are dot, junit and allure reporter. Folder created after test execution.
* /node_modules - Stores all installed npm modules and run times.
* /data - Stores results derived from generating a Bulk Import CSV file found in util folder.
* /util - utilty stores source code to assist with creating a Bulk Import file.

# Configure Test Automation Global Settings
browser/ headless mode, test reporters(Junit/Allure), Mocha setup and teardown scripts,etc.  
$ nano ./webdriverioFramework/wdio.conf.js  

# Report Configuration
Note: This setup is preconfigured to use dot, junit and allure reports.  
Open "wdio.conf.js"  
Search for "reporters"  
To set your reports enter values inside brackets.  
reporters: ['dot','junit','allure']  

# Headless Browser Mode
Open "wdio.config.js"  
Search for "chromeOptions"  
All tests run using Chrome Browser. Below are args that can be passed into Selenium to execute tests in headless mode(performs test execution in background.). To execute tests via GUI, remove '--headless' switch.  
For a list of Chrome Options, visit https://stackoverflow.com/questions/38335671/where-can-i-find-a-list-of-all-available-chromeoption-arguments
args: ['--headless','--disable-gpu']


# Define entries for Rally-Jira instances as SOURCE/TARGET mappings.
$ nano webdriverioFramework/config/credentials/dataSources.json

# Test Configurations.
$ touch .env

* Open .env file and enter in the source and target values, API KEYS, etc as new lines in the form NAME=VALUE.  
Example:  
SOURCE=rallyTest //Entries for SOURCE/TARGET mappings are defined in "\config\credentials\dataSources.json"  
TARGET=testJira // Entries for SOURCE/TARGET mappings are defined in "\config\credentials\dataSources.json"     
CSV=RALLY-CSV  // either "JIRA-CSV" or "RALLY-CSV"  
BULKCOUNT=100 //Enter Number 100 to 500  
RALLY_TIMEOUT=  //rally wdio waitUntil timeout interval in (ms)  
JIRA_TIMEOUT=   //jira wdio waitUntil timeout interval in (ms)  
RALLY_BULK_IMPORT_PATH= C:\webdriverioFramework\data\bulkImport\PortfolioItemImportTemplate.csv  
JIRA_BULK_IMPORT_PATH=C:\webdriverioFramework\data\bulkImport\FeatureTestImportTemplate.csv  
RALLY_BULK_OUTPUT_PATH= //provide an output path to export Rally bulk import results.  i.e. C:\webdriverioFramework\data\bulkImportResults\rallyBulk.csv  
JIRA_BULK_OUTPUT_PATH=  //provide an output path to export Jira bulk import results.   i.e  C:\webdriverioFramework\data\bulkImportResults\jirabulk.csvs  
RALLYAPIKEY= // Rally API Token Key from Rally to Authenticate using APIs.  Create Rally API key at https://rally1.rallydev.com/login/accounts/index.html#/apps  
ZSESSIONID= // Enter Rally API Key to allow full authentication.  
JIRAAPIKEY= // JIRA API keys from Jira to Authenticate using APIs.  

# Update page objects for Rally and Jira
open pageObjects folder.  

# Start Selenium
* Open a new Git Bash terminal, Selenium server need to start once prior to running tests.  
$ selenium-standalone start

# Execute Tests 
* By default, tests run in headless mode using Chrome Browser). npm test command will execute all tests found in the /tests folder. 
* To execute single test, replace "yourtestcaseName" with test found in the /tests folder. use the WDIO spec flag: The double dash indicates switches passed into wdio.  
$ npm test  
$ npm test -- --spec=tests/"testcaseName".js  

# Execute Bulk Import Tests. 
* To run Bulk Import Load Tests, the "createCSV" utility will generate a CSV file and save in ./data/ bulkImport directory. Run npm test to execute Bulk Import test cases using the CSV file as input.  

* All successful Bulk Import results export to ./data/bulkImportResults  
$ mkdir -p /data/bulkImport && mkdir -p /data/bulkImportResults  
$ npm run createCSV  
$ selenium-standalone start  
$ npm test -- --spec=tests/createFeatureBulk.js  

# Test Execution Reports
* Running Allure Reports, After test execution, the below command will parse an XML (created in /reports/allure-results) and display an HTML style report in the browser.  
$ npm run allure  

# SoapUI-LoadTest
* Install SOAP UI or Ready API software
* Import Stress Test Project
Select File > Import Project > Specify the .xml project file. > Click Open.  
Open Git Bash. Create a Folder Directory $ mkdir /c/stressTest  
Update API Keys for Rally and Jira  
Execute Ready API Tests.  

* Project Preferences
HTTP > Socket timeout(ms) > Set to 750000  (To Resolve Java Socket Timeout Issue when running Large SOAP UI Tests)
Close Connections after request (For running Large Load UI Tests).


# Troubleshooting
* Web Driverio does not run on my MAC?
Please update webdriverio "require modules" to MAC HOME paths found in tests suites. Location is "webdriverioFramework/tests" folder.

* If there a SSL error when installing dependencies, please update bash profile to ignore SSL check.
$ export NODE_TLS_REJECT_UNAUTHORIZED=0

* Fibers issue. Unable to install wdio with Node version Node-js_10.15.3_1.0.0
Remove Node version 10.x and Please install node version 8.9.4.1.

* Unable to make API calls to Rally/JIRA. Error statusCode: 401  Full authentication is required to access this resource.  
Reset API Key and add a cookie variable to the .env file. This Api keys will be used to authenticate into the application backend by passing in the HTTP Header to remember session state.  
i.e.
RALLYAPIKEY="mykey"  
JIRAAPIKEY="mykey"  
ZSESSIONID="mykey"  

# Resources
WebdriverIO Documentation - http://v4.webdriver.io/  
Mocha Documentation       - https://mochajs.org/  
Chai Assertion Lobrary    - https://www.chaijs.com/             
Sauce Labs Documentation  - https://wiki.saucelabs.com/  
SeleniumHQ Documentation  - http://www.seleniumhq.org/docs/  
Node Documentation        - https://nodejs.org/en/docs/  