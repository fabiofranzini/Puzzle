define(["knockout", "routing"], function (ko, routing) {
    return {
        title: ko.observable(''),
        modules: ['main', 'settings'],
        currentModule: ko.observable(),
        initialize: function () {
            self = this;
            routing({
                '/main': function () { self.currentModule("main"); },
                '/:module': function (module) { self.currentModule(module); }
            });
            self.currentModule("main");
        },
    };
});