var absences = {
    bindings: {},
    controller: absencesController,
    templateUrl: 'components/rh/absences/absences.template.html'
};

function absencesController(rhService, NgTableParams) {
    var vm = this;
    this.absences = [];
    var y = moment().format('YYYY');

    this.$onInit = function() {
        rhService.getEvents(y).then(function(events) {
            vm.absences = events.data;
            initTable();
            console.log(events.data);
        });
    }

    function initTable() {
        vm.tableParams = new NgTableParams({
            page: 1,
            count: 10
        }, {
            total: vm.absences.length,
            dataset: vm.absences
        });
    }
};

angular
    .module('app')
    .component('rhAbsences', absences)
    .controller('absencesController', absencesController);