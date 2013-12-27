﻿// knockout-amd-helpers 0.6 | (c) 2013 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
// Base on knockout-amd-helpers 0.6 | (c) 2013 Ryan Niemeyer |  http://www.opensource.org/licenses/mit-license
define(["require", "knockout"], function (require, ko) {

    //helper functions to support the binding and template engine (whole lib is wrapped in an IIFE)
    var unwrap = ko.utils.unwrapObservable,
        //call a constructor function with a variable number of arguments
        construct = function (Constructor, args) {
            var instance,
                Wrapper = function () {
                    return Constructor.apply(this, args || []);
                };

            Wrapper.prototype = Constructor.prototype;
            instance = new Wrapper();
            instance.constructor = Constructor;

            return instance;
        },
        addTrailingSlash = function (path) {
            return path && path.replace(/\/?$/, "/");
        },
        isAnonymous = function (node) {
            var el = ko.virtualElements.firstChild(node);

            while (el) {
                if (el.nodeType === 1 || el.nodeType === 8) {
                    return true;
                }

                el = ko.virtualElements.nextSibling(el);
            }

            return false;
        };

    //an AMD helper binding that allows declarative module loading/binding
    ko.bindingHandlers.module = {
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            var extendedContext, disposeModule,
                value = valueAccessor(),
                options = unwrap(value),
                templateBinding = {},
                initializer = ko.bindingHandlers.module.initializer,
                disposeMethod = ko.bindingHandlers.module.disposeMethod;

            //build up a proper template binding object
            if (options && typeof options === "object") {
                templateBinding.templateEngine = options.templateEngine;

                //afterRender could be different for each module, create a wrapper
                templateBinding.afterRender = function () {
                    var options = unwrap(valueAccessor());

                    if (options && typeof options.afterRender === "function") {
                        options.afterRender.apply(this, arguments);
                    }
                };
            }

            //if this is not an anonymous template, then build a function to properly return the template name
            if (!isAnonymous(element)) {
                templateBinding.name = function () {
                    var template = unwrap(value);
                    return ((template && typeof template === "object") ? unwrap(template.template || template.name) : template) || "";
                };
            }

            //set the data to an observable, that we will fill when the module is ready
            templateBinding.data = ko.observable();
            templateBinding["if"] = templateBinding.data;

            //actually apply the template binding that we built. extend the context to include a $module property
            ko.applyBindingsToNode(element, { template: templateBinding }, extendedContext = context.extend({ $module: null }));

            //disposal function to use when a module is swapped or element is removed
            disposeModule = function () {
                //avoid any dependencies
                ko.computed(function () {
                    var currentData = templateBinding.data();
                    if (currentData) {
                        if (typeof currentData[disposeMethod] === "function") {
                            currentData[disposeMethod].call(currentData);
                            currentData = null;
                        }

                        templateBinding.data(null);
                    }
                }).dispose();
            };

            //now that we have bound our element using the template binding, pull the module and populate the observable.
            ko.computed({
                read: function () {
                    //module name could be in an observable
                    var initialArgs,
                        moduleName = unwrap(value);

                    //observable could return an object that contains a name property
                    if (moduleName && typeof moduleName === "object") {
                        //initializer/dispose function name can be overridden
                        initializer = moduleName.initializer || initializer;
                        disposeMethod = moduleName.disposeMethod || disposeMethod;

                        //get the current copy of data to pass into module
                        initialArgs = [].concat(unwrap(moduleName.data));

                        //name property could be observable
                        moduleName = unwrap(moduleName.name);
                    }

                    //if there is a current module and it has a dispose callback, execute it and clear the data
                    disposeModule();

                    //at this point, if we have a module name, then require it dynamically
                    if (moduleName) {
                        require([addTrailingSlash(ko.bindingHandlers.module.baseDir) + moduleName], function (mod) {
                            //if it is a constructor function then create a new instance
                            if (typeof mod === "function") {
                                mod = construct(mod, initialArgs);
                            }
                            else {
                                //if it has an appropriate initializer function, then call it
                                if (mod && mod[initializer]) {
                                    //if the function has a return value, then use it as the data
                                    mod = mod[initializer].apply(mod, initialArgs || []) || mod;
                                }
                            }

                            //update the data that we are binding against
                            extendedContext.$module = mod;
                            templateBinding.data(mod);
                        });
                    }
                },
                disposeWhenNodeIsRemoved: element
            });

            //optionally call module disposal when removing an element
            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeModule);

            return { controlsDescendantBindings: true };
        },
        baseDir: "",
        initializer: "initialize",
        disposeMethod: "dispose"
    };

    //support KO 2.0 that did not export ko.virtualElements
    if (ko.virtualElements) {
        ko.virtualElements.allowedBindings.module = true;
    }
});