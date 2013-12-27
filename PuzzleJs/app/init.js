require.config({
    paths: {
        "routing": "/scripts/puzzle/routing",
        "knockout": "/scripts/knockout/knockout-3.0.0.debug",
        "knockout-amd-module": "/scripts/puzzle/knockout-amd-module",
        "knockout-amd-template-engine": "/scripts/puzzle/knockout-amd-template-engine",
        "knockout-postbox": "/scripts/knockout/knockout-postbox",
        "text": "/scripts/require/text"
    }
});

require(["knockout", "routing", "knockout-amd-template-engine", "knockout-amd-module", "knockout-postbox", "text"], function (ko) {

    ko.bindingHandlers.module.baseDir = "modules";
    ko.amdTemplateEngine.defaultPath = "views";
    ko.amdTemplateEngine.defaultSuffix = ".html";
    ko.applyBindings({});
});
