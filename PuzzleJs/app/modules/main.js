define(["knockout"], function (ko) {
    return {
        title: "Main Module",
        description: "this is the main module",
        initialize: function () { alert("main.initialize"); },
        dispose: function () { alert("main.dispose"); }
    };
});