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
    var m = moment().format('M');
    var y = moment().format('YYYY');

    this.user = {};
    this.events = [];
    this.eventSource = {};
    this.newEvent = {
        showEventForm: false,
        start: null,
        title: null,
        className: null
    };
    this.config =  {
        calendar:{
            lang: 'fr',
            editable: true,
            header:{
                left: '',
                center: 'title',
                right: ''
            },
            eventResize: eventResize,
            dayClick: dayClick,
            eventDrop: eventDrop
        }
    };
    this.nextMonth = nextMonth;
    this.prevMonth = prevMonth;
    this.addNewEvent = addNewEvent;

    // Contrairement à la page de login, le require n'est pas resolved tout de suite.
    // (dans login, le controller required est appellé dans une promise) donc a le temps d'être bindé
    // onInit permet d'attendre que tous les controllers et bindings soient loadés
    this.$onInit = function() {
        // user infos depuis le components parent
        vm.user = vm.intranet.getUser();
        // liste d'events
        renderCalendar(y);
    };

    function nextMonth() {
        uiCalendarConfig.calendars['absences'].fullCalendar('next');
    };
    function prevMonth() {
        uiCalendarConfig.calendars['absences'].fullCalendar('prev');
    };
    function addNewEvent() {
        vm.newEvent.showEventForm = false;
        var tempEventSource = {events: [{
            title: vm.newEvent.title,
            start: vm.newEvent.start,
            className: vm.newEvent.className
        }]};
        uiCalendarConfig.calendars['absences'].fullCalendar('addEventSource', tempEventSource);
        eventService.enregistrerEvent(vm.newEvent).then(function(data) {
            console.log(data); //data.name = 'error' //data.detail
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
        vm.newEvent.showEventForm = true;
        vm.newEvent.start = date.format().toString();
    };
    function eventDrop(event, delta, revertFunc) {
        var endDate = event.end == null ? null : event.end.format().toString();
        var startDate = event.start.format().toString();
        console.log(moment(startDate, 'YYYY-MM-DD').toString());
        if(endDate != null)
            console.log(moment(endDate, 'YYYY-MM-DD').subtract(1, 's').toString());
    };

    function renderCalendar(y) {
        // liste d'events
        eventService.getEvents(y).then(function(events) {
            vm.events = events.data;
            vm.eventSource = {
                events: vm.events
            };
            uiCalendarConfig.calendars['absences'].fullCalendar('addEventSource', vm.eventSource);
            // vm.eventSource.events.splice(0, vm.eventSource.events);
            // uiCalendarConfig.calendars['absences'].fullCalendar('removeEvents');
            // uiCalendarConfig.calendars['absences'].fullCalendar('removeEventSource', vm.eventSource);
            // uiCalendarConfig.calendars['absences'].fullCalendar('refetchEventSources', vm.eventSource);
            // uiCalendarConfig.calendars['absences'].fullCalendar('rerenderEvents');
        });
    };
};

angular
    .module('app')
    .component('home', home)
    .controller('homeController', homeController);