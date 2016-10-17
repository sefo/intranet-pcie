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

function homeController(eventService, uiCalendarConfig, socketService, rhService) {
    var vm = this;
    var m = moment().format('M');
    var y = moment().format('YYYY');

    this.user = {};
    this.myRH = {};
    this.events = [];
    this.selectedEvent = {};
    this.selectedCalEvent = {};
    this.showEditingEventForm = false;
    this.eventSource = {};
    this.typeEvents = [];
    this.newEvent = {
        showEventForm: false,
        start: null,
        title: null,
        type: null
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
            eventRender: eventRender,
            eventClick: eventClick,
            eventResize: eventResize,
            dayClick: dayClick,
            eventDrop: eventDrop
        }
    };
    this.nextMonth = nextMonth;
    this.prevMonth = prevMonth;
    this.addNewEvent = addNewEvent;
    this.updateEvent = updateEvent;
    this.deleteEvent = deleteEvent;

    // Contrairement à la page de login, le require n'est pas resolved tout de suite.
    // (dans login, le controller required est appellé dans une promise) donc a le temps d'être bindé
    // onInit permet d'attendre que tous les controllers et bindings soient loadés
    this.$onInit = function() {
        // infos RH (pour l'instant besoin que du mail pour les notifications')
        rhService.getRH().then(function(result) {
            vm.myRH = result[0];
        });
        // user infos depuis le components parent
        vm.user = vm.intranet.getUser();
        // liste d'events
        renderCalendar(y);
        // types d'absences
        eventService.getTypes().then(function(data) {
            vm.typeEvents = data.data;
        });
    }

    function nextMonth() {
        uiCalendarConfig.calendars['absences'].fullCalendar('next');
    }
    function prevMonth() {
        uiCalendarConfig.calendars['absences'].fullCalendar('prev');
    }
    function addNewEvent() {
        vm.newEvent.showEventForm = false;
        var tempEventSource = {events: [{
            title: vm.newEvent.title,
            start: vm.newEvent.start,
            className: vm.newEvent.type.type_code,
            typeid: vm.newEvent.type.id,
            eventid: null
        }]};
        eventService.enregistrerEvent(vm.newEvent).then(function(event) {
            socketService.emit('modification_event', vm.user.email, vm.myRH.email, 'Nouvelle demande d\'absence', {eventid: event.eventid});
            tempEventSource.events[0].eventid = event.id;
            uiCalendarConfig.calendars['absences'].fullCalendar('addEventSource', tempEventSource);
        });
    }
    
    function eventClick(calEvent, jsEvent, view) {
        var startDate = calEvent.start.format('YYYY-MM-DD');
        var endDate = calEvent.end == null ? startDate : calEvent.end.format('YYYY-MM-DD');
        vm.selectedCalEvent = calEvent;
        vm.selectedEvent.id = calEvent.eventid;
        vm.selectedEvent.title = calEvent.title;
        vm.selectedEvent.selectedType = {id: calEvent.typeid, type_code: calEvent.className[0]};
        vm.selectedEvent.start = startDate;
        vm.selectedEvent.end = endDate;
        vm.showEditingEventForm = true;
    }
    function eventResize(event, delta, revertFunc) {
        var startDate = event.start.format('YYYY-MM-DD');
        var endDate = event.end == null ? startDate : event.end.format('YYYY-MM-DD');
        vm.selectedCalEvent = event;
        vm.selectedEvent.id = event.eventid;
        vm.selectedEvent.title = event.title;
        vm.selectedEvent.selectedType = {id: event.typeid, type_code: event.className[0]};
        vm.selectedEvent.start = startDate;
        vm.selectedEvent.end = endDate;
        updateEvent();
    }
    function eventRender(event, element) {
        if(event.validation == 2)
            element.find(".fc-title").prepend("<i class='validation-icon glyphicon glyphicon-ok-circle btn-success' title='Validé'></i>");
        else if(event.validation == 1)
            element.find(".fc-title").prepend("<i class='validation-icon glyphicon glyphicon-remove-circle btn-danger' title='Refusé'></i>");
        else
            element.find(".fc-title").prepend("<i class='validation-icon glyphicon glyphicon-bell btn-warning' title='A valider'></i>");
    }
    function dayClick(date, jsEvent, view) {
        vm.newEvent.showEventForm = true;
        vm.newEvent.start = date.format().toString();
    }
    function eventDrop(event, delta, revertFunc) {
        var startDate = event.start.format('YYYY-MM-DD');
        var endDate = event.end == null ? startDate : event.end.format('YYYY-MM-DD');
        vm.selectedCalEvent = event;
        vm.selectedEvent.id = event.eventid;
        vm.selectedEvent.title = event.title;
        vm.selectedEvent.selectedType = {id: event.typeid, type_code: event.className[0]};
        vm.selectedEvent.start = startDate;
        vm.selectedEvent.end = endDate;
        updateEvent();
    }
    function updateEvent() {
        eventService.updateEvent(vm.selectedEvent).then(function() {
            // publie l'évènement vers le serveur pour informer les RH
            socketService.emit('modification_event', vm.user.email, vm.myRH.email, 'Absence modifiée', {eventid: vm.selectedEvent.id});
            vm.selectedCalEvent.title = vm.selectedEvent.title;
            vm.selectedCalEvent.className[0] = vm.selectedEvent.selectedType.type_code;
            vm.selectedCalEvent.typeid = vm.selectedEvent.selectedType.id;
            vm.selectedCalEvent.validation = 5;
            uiCalendarConfig.calendars['absences'].fullCalendar('updateEvent', vm.selectedCalEvent);
            vm.showEditingEventForm = false;
            vm.selectedEvent = {};
            vm.selectedCalEvent = {};
        });
    }
    function deleteEvent() {
        eventService.supprimerEvent(vm.selectedEvent.id).then(function() {
            uiCalendarConfig.calendars['absences'].fullCalendar('removeEvents', vm.selectedCalEvent._id);
            vm.showEditingEventForm = false;
            // publie l'évènement vers le serveur pour informer les RH
            socketService.emit('modification_event', vm.user.email, vm.myRH.email, 'Absence suprimée', {eventid: vm.selectedEvent.id});
            vm.selectedEvent = {};
            vm.selectedCalEvent = {};
        });
    }

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
    }

}

angular
    .module('app')
    .component('home', home)
    .controller('homeController', homeController);