// Besoin de forcer l'installation de fullcalendar version >2.8.0 pour que ça fontionne sur mobile
// bower uninstall fullcalendar --save (ignorer le warning des dépendances)
// bower install fullcalendar --save (choisir la bonne version dans la liste)

var home = {
    bindings: {},
    require: {
        intranet: '^^intranet'
    },
    controller: homeController,
    templateUrl: 'components/home/home.template.html'
};

function homeController(eventService, uiCalendarConfig) {
    var vm = this;
    var date = new Date();
    var m = date.getMonth();
    var y = date.getFullYear();

    this.user = {};
    this.events = [];
    this.eventSources = {};
    this.config =  {
        calendar:{
            lang: 'fr',
            editable: true,
            header:{
                left: 'month basicWeek',
                center: 'title',
                right: 'today prev,next'
            },
            eventResize: eventResize,
            dayClick: dayClick,
            eventDrop: eventDrop
        }
    };

    // Contrairement à la page de login, le require n'est pas resolved tout de suite.
    // (dans login, le controller required est appellé dans une promise) donc a le temps d'être bindé
    // onInit permet d'attendre que tous les controllers et bindings soient loadés
    this.$onInit = function() {
        // user infos depuis le components parent
        vm.user = vm.intranet.getUser();
        // liste d'events
        eventService.getEvents().then(function(events) {
            vm.events = events.data;
            vm.eventSources = {
                events: vm.events
            };
            // refresh events
            uiCalendarConfig.calendars['absences'].fullCalendar('addEventSource', vm.eventSources);
        });
    };
    
    function eventResize(event, delta, revertFunc) {
        var endDate = event.end.format().toString();
        var startDate = event.start.format().toString();
        var result = moment(endDate, 'YYYY-MM-DD').subtract(1, 's').toString();
        console.log(startDate);
        console.log(result);
    };
    function dayClick(date, jsEvent, view) {
        var tempEventSource = {events: [{title: "temp event", start: date.format().toString(), className: 'RTT'}]};
        view.calendar.addEventSource(tempEventSource);
    };
    function eventDrop(event, delta, revertFunc) {
        var endDate = event.end == null ? null : event.end.format().toString();
        var startDate = event.start.format().toString();
        console.log(moment(startDate, 'YYYY-MM-DD').toString());
        if(endDate != null)
            console.log(moment(endDate, 'YYYY-MM-DD').subtract(1, 's').toString());
    };
};

angular
    .module('app')
    .component('home', home)
    .controller('homeController', homeController);