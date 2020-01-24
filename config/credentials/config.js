const fs = require("fs");

module.exports = {

    getSource: function (configName) {
        return configName;
    },

    getTarget: function (configName) {
        return configName;
    },

    getUrl: function (configName) {

        var contents = fs.readFileSync("./config/credentials/dataSources.json");
        var json = JSON.parse(contents);

        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (obj.name === configName)
                return obj.url;
        }

    },

    getTitle: function (configName) {

        var contents = fs.readFileSync("./config/credentials/dataSources.json");
        var json = JSON.parse(contents);

        for (var i = 0; i < json.length; i++) {
            var obj = json[i];
            if (obj.name === configName)
                return obj.title;
        }

    },

    getSourceConfig: function () {

        let sourceInput = process.env.SOURCE;

        return sourceInputObj = {
            sourceInput: this.getSource(sourceInput),
            sourceInputUrl: this.getUrl(sourceInput),
            sourceInputTitle: this.getTitle(sourceInput)
        };
    },

    getTargetConfig: function () {

        let targetInput = process.env.TARGET;

        return targetInputObj = {
            targetInput: this.getSource(targetInput),
            targetInputUrl: this.getUrl(targetInput),
            targetInputTitle: this.getTitle(targetInput)
        };
    }

};

