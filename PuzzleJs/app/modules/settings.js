define(["knockout"], function(ko) {
    return {
        title: "Settings Module",
        description: "this is the settings module",
        initialize: function () { alert("settings.initialize"); },
        dispose: function () { alert("settings.dispose"); }
    };
});