var q = require("q");
var mongoose = require("mongoose");

module.exports = function(applicationModel) {

    var StatementSchema = require("./statement.schema.server.js")();
    var StatementModel  = mongoose.model("StatementModel", StatementSchema);

    var ScriptSchema = require("./script.schema.server.js")();
    var ScriptModel  = mongoose.model("ScriptModel", ScriptSchema);

    var api = {
        saveScript : saveScript,
        findScript : findScript,
        addStatement : addStatement,
        findStatement: findStatement
    };
    return api;

    function findStatement(scope) {

        var deferred = q.defer();

        // retrieve application since we need all variables in the application
        applicationModel
            .findApplicationById(scope.applicationId)
            .then(
                function(application) {
                    
                    // get all variables from the application
                    // TODO: modularize retrieving all variables
                    var variables = [];
                    var pages = application.pages;
                    for(var i in pages) {
                        var page = pages[i];
                        var widgets = page.widgets;
                        for(var j in widgets) {
                            var widget = widgets[j];
                            if(widget.name) {
                                variables.push(widget.name);
                            }
                        }
                    }

                    // get the statement
                    var statement = application
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId)
                        .button.script
                        .statements.id(scope.statementId);

                    // add the variables to the statement
                    // so we can render them in the dropdowns
                    statement.variables = variables;
                    
                    deferred.resolve(statement);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }

    function addStatement(scope) {
        
        // use q because we want to control exactly we want to resolve
        // we want to resolve the script, not the application
        var deferred = q.defer();

        applicationModel
            .findApplicationById(scope.applicationId)
            .then(
                function(application) {
                    var widget = application
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if(!widget.button || !widget.button.script) {
                        widget.button = {
                            script: new ScriptModel()
                        };
                    }

                    var statement = new StatementModel({
                        statementType: scope.statementType
                    });

                    widget.button.script.statements.push(statement);

                    return application.save();
                },
                function(err) {
                    deferred.reject(err);
                }
            )
            .then(
                function(application) {
                    var widget = application
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);
                    deferred.resolve(widget);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }

    function saveScript(scope, script) {
        return applicationModel
            .findApplicationById(scope.applicationId)
            .then(
                function(application) {
                    var widget = application
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if(!widget.button) {
                        widget.button = {};
                    }

                    widget.button.script = script;
                    application.save();
                }
            );
    }

    function findScript(scope) {

        var deferred = q.defer();

        applicationModel
            .findApplicationById(scope.applicationId)
            .then(
                function(application) {
                    var widget = application
                        .pages.id(scope.pageId)
                        .widgets.id(scope.widgetId);

                    if (widget.button && widget.button.script) {
                        deferred.resolve(widget.button.script);
                    } else {
                        deferred.resolve({});
                    }
                },
                function(err) {
                    deferred.reject(err);
                }
            );

        return deferred.promise;
    }
}