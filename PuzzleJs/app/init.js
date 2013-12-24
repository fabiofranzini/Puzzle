require.config({
    paths: {
        "knockout": "/scripts/knockout/knockout-3.0.0.debug",
        "knockout-amd-helpers": "/scripts/knockout/knockout-amd-helpers",
        "knockout-postbox": "/scripts/knockout/knockout-postbox",
        "text": "/scripts/require/text",
        "routing": "/scripts/routie"
    }
});

require(["knockout", "routing", "knockout-amd-helpers", "knockout-postbox", "text"], function (ko) {

    ko.bindingHandlers.module.baseDir = "modules";
    ko.applyBindings({});
});
