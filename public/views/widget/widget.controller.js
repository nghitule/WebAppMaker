(function () {
    angular
        .module ("WebAppMakerApp")
        .controller ("WidgetListController", widgetListController)
        .controller ("WidgetEditController", widgetEditController)
        .controller ("ChooseWidgetController", chooseWidgetController);

    function widgetEditController($routeParams, WidgetService, $location) {

        var vm = this;
        vm.username      = $routeParams.username;
        vm.applicationId = $routeParams.applicationId;
        vm.pageId        = $routeParams.pageId;
        vm.widgetId      = $routeParams.widgetId;

        vm.updateWidget  = updateWidget;

        function init() {
            WidgetService
                .findWidgetById(vm.applicationId, vm.pageId, vm.widgetId)
                .then(
                    function(response){
                        vm.widget = response.data;
                    },
                    function(error){
                        vm.error = err;
                    }
                );
        }
        init();

        function updateWidget(widget) {
            WidgetService
                .updateWidget(vm.applicationId, vm.pageId, vm.widgetId, widget)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.username+"/application/"+vm.applicationId+"/page/"+vm.pageId+"/widget");
                    },
                    function(error) {
                        vm.error = error;
                    }
                );
        }
    }

    function widgetListController ($routeParams, WidgetService, $location) {

        var vm = this;
        vm.username      = $routeParams.username;
        vm.applicationId = $routeParams.applicationId;
        vm.pageId        = $routeParams.pageId;

        function init() {
            WidgetService
                .getWidgets(vm.applicationId, vm.pageId)
                .then(
                    function(response) {
                        vm.widgets = response.data;
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
        init();

    }

    function chooseWidgetController ($routeParams, WidgetService, $location) {

        var vm = this;

        vm.username = $routeParams.username;
        vm.applicationId = $routeParams.applicationId;
        vm.pageId        = $routeParams.pageId;

        vm.selectWidget = selectWidget;

        function selectWidget(widgetType) {
            WidgetService
                .addWidget(vm.applicationId, vm.pageId, widgetType)
                .then(
                    function(response) {
                        $location.url("/developer/"+vm.username+"/application/"+vm.applicationId+"/page/"+vm.pageId+"/widget");
                    },
                    function(err) {
                        vm.error = err;
                    }
                );
        }
    }

})();