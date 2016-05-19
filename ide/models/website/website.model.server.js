var mongoose = require("mongoose");
var q = require("q");
module.exports = function () {
    var ApplicationSchema = require("./website.schema.server.js")();
    var Application = mongoose.model("Application", ApplicationSchema);

    var api = {
        createApplication: createApplication,
        findApplicationsForUsername: findApplicationsForUsername,
        findApplicationById: findApplicationById,
        updateApplication: updateApplication,
        removeApplication: removeApplication,
        getMongooseModel: getMongooseModel
    };
    return api;

    function getMongooseModel() {
        return Application;
    }

    function updateApplication(applicationId, application) {
        return Application.update(
            {_id: applicationId},
            {$set: application}
        );
    }

    function removeApplication(applicationId) {
        return Application.remove().where("_id").equals(applicationId);
    }

    function findApplicationById (applicationId) {
        return Application.findById (applicationId);
    }

    function findApplicationsForUsername (username) {
        var deferred = q.defer();
        Application
            .find(
                {developerUsername: username},
                function (err, applications) {
                    if (!err) {
                        deferred.resolve (applications);
                    } else {
                        deferred.reject (err);
                    }
                }
            );
        return deferred.promise;
    }

    function createApplication (application) {
        var deferred = q.defer();
        Application.create (application,
            function (err, application) {
                if (!err) {
                    deferred.resolve(application);
                } else {
                    deferred.reject(err);
                }
        });
        return deferred.promise;
    }
};