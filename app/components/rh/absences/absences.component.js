var absences = {
    bindings: {},
    require: {
        intranet: '^^intranet'
    },
    controller: absencesController,
    templateUrl: 'components/rh/absences/absences.template.html'
};

function absencesController(rhService, NgTableParams, socketService) {
    var vm = this;
    this.valider = valider;
    this.refuser = refuser;
    this.absences = [];
    var y = moment().format('YYYY');

    this.$onInit = function() {
        // user infos depuis le components parent
        vm.user = vm.intranet.getUser();
        // récupération des demandes d'absence'
        rhService.getEvents(y).then(function(data) {
            vm.absences = data.absences;
            initTable();
        });
    }

    function valider(event) {
        rhService.validerAbsence(event).then(function(resultat) {
            socketService.emit('modification_event', vm.user.email, event.email, 'Absence validée', {eventid: event.eventid});
            updateValidationValue(event.eventid, resultat.data[0].type, resultat.data[0].validation);
            vm.tableParams.reload();
        });
    }

    function refuser(event) {
        rhService.refuserAbsence(event).then(function(resultat) {
            socketService.emit('modification_event', vm.user.email, event.email, 'Absence refusée', {eventid: event.eventid});
            updateValidationValue(event.eventid, resultat.data[0].type, resultat.data[0].validation);
            vm.tableParams.reload();
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

    function updateValidationValue(eventid, validation, validationid) {
        vm.absences.forEach(function(event, index) {
            if(event.eventid == eventid) {
                event.validationid = validationid;
                event.validation = validation;
            }
        })
    }
};

angular
    .module('app')
    .component('rhAbsences', absences)
    .controller('absencesController', absencesController);