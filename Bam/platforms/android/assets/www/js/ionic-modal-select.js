﻿var modalSelectTemplates = modalSelectTemplates || {}; modalSelectTemplates['modal-template-multiple.html'] = ' <ion-modal-view class="ionic-select-modal" ng-class="::ui.modalClass">\n' +
    '    <ion-header-bar ng-class="::ui.subHeaderClass">\n' +
    '      <h1 class="title">{{::ui.modalTitle}} MULTIPLE</h1>\n' +
    '    </ion-header-bar>\n' +
    '    <ion-content>\n' +
    '\n' +
    '    <div ng-if="!ui.shortList">\n' +
    '        <div class="text-center" ng-if="!showList" style="padding-top:40px;">\n' +
    '            <h4 class="muted">{{::ui.loadListMessage}}</h4>\n' +
    '            <p>\n' +
    '                <ion-spinner></ion-spinner>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div class="list" ng-if="showList" class="animate-if">\n' +
    '            <div class="item item-text-wrap" collection-repeat="option in options track by $index" ng-click="setOption(option)" ng-class="{\'{{::ui.selectedClass}}\': getSelectedValue(option) == ui.value}"> \n' +
    '                <div compile="inner" compile-once="true"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="ui.shortList">\n' +
    '        <div class="list">\n' +
    '            <div class="item item-checkbox" ng-repeat="option in options track by $index">\n' +
    '                <label class="checkbox">\n' +
    '                    <input type="checkbox" ng-model="isChecked[$index]">\n' +
    '                </label>\n' +
    '                <div compile="inner" compile-once="true"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    </ion-content>\n' +
    '    <ion-footer-bar ng-click="closeModal()" ng-class="::ui.headerFooterClass">\n' +
    '      <h1 class="title">{{ui.cancelButton}}</h1>\n' +
    '    </ion-footer-bar>\n' +
    '</ion-modal-view>\n' +
    '';

var modalSelectTemplates = modalSelectTemplates || {}; modalSelectTemplates['modal-template.html'] = ' <ion-modal-view class="ionic-select-modal" ng-class="::ui.modalClass">\n' +
    '    <ion-header-bar ng-class="::ui.subHeaderClass">\n' +
    '      <h1 class="title">{{::ui.modalTitle}}</h1>\n' +
    '    </ion-header-bar>\n' +
    '\n' +
    '    <div class="bar bar-subheader item-input-inset" ng-class="::ui.subHeaderClass" ng-if="ui.hasSearch">\n' +
    '      <label class="item-input-wrapper">\n' +
    '        <i class="icon ion-ios-search placeholder-icon"></i>\n' +
    '        <input type="search" placeholder="Search" ng-model="ui.searchValue">\n' +
    '      </label>\n' +
    '    </div>\n' +
    '\n' +
    '    <ion-content class="has-header" ng-class="{\'has-subheader\':ui.hasSearch}">\n' +
    '\n' +
    '    <div ng-if="!ui.shortList">\n' +
    '        <div class="text-center" ng-if="!showList" style="padding-top:40px;">\n' +
    '            <h4 class="muted">{{::ui.loadListMessage}}</h4>\n' +
    '            <p>\n' +
    '                <ion-spinner></ion-spinner>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div class="list" ng-if="showList" class="animate-if">\n' +
    '            <div class="item item-text-wrap" collection-repeat="option in options track by $index" ng-click="setOption(option)" ng-class="{\'{{::ui.selectedClass}}\': getSelectedValue(option) == ui.value}"> \n' +
    '                <div compile="inner" compile-once="true"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="ui.shortList">\n' +
    '        <div class="list">\n' +
    '            <div class="item item-text-wrap" ng-repeat="option in options track by $index" ng-click="setOption(option)" ng-class="{\'{{::ui.selectedClass}}\': getSelectedValue(option) == ui.value}">\n' +
    '                <div compile="inner" compile-once="true"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    </ion-content>\n' +
    '    <ion-footer-bar ng-click="closeModal()" ng-class="::ui.headerFooterClass">\n' +
    '        <h1 class="title">{{ui.cancelButton}}</h1>\n' +
    '    </ion-footer-bar>\n' +
    '\n' +
    '</ion-modal-view>\n' +
    '';

/*!
 * Copyright 2015 Inmagik SRL.
 * http://www.inmagik.com/
 *
 * ionic-modal-select, v1.0.0
 * Modal select directive for Ionic framework.
 * 
 * By @bianchimro
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */



(function () {

    angular.module('ionic-modal-select', [])

    .directive('compile', ['$compile', function ($compile) {
        return function (scope, iElement, iAttrs) {
            var x = scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(iAttrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    iElement.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(iElement.contents())(scope);

                    //deactivate watch if "compile-once" is set to "true"
                    if (iAttrs.compileOnce === 'true') {
                        x();
                    }
                }
            );
        };
    }])

    .directive('modalSelect', ['$ionicModal', '$timeout', '$filter', function ($ionicModal, $timeout, $filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: { options: "=", optionGetter: "&", onSelect: "&" },
            link: function (scope, iElement, iAttrs, ngModelController, transclude) {

                var shortList;
                var shortListBreak = iAttrs.shortListBreak ? parseInt(iAttrs.shortListBreak) : 10;
                var setFromProperty = iAttrs.optionProperty;
                var onOptionSelect = iAttrs.optionGetter;

                //#todo: multiple is not working right now
                var multiple = iAttrs.multiple ? true : false;
                if (multiple) {
                    scope.checkedItems = [];
                }

                scope.ui = {
                    modalTitle: iAttrs.modalTitle || 'Select an option',
                    okButton: iAttrs.okButton || 'OK',
                    hideReset: iAttrs.hideReset !== "true" ? false : true,
                    resetButton: iAttrs.okButton || 'Reset',
                    cancelButton: iAttrs.cancelButton || 'Cancel',
                    loadListMessage: iAttrs.loadListMessage || 'Loading',
                    modalClass: iAttrs.modalClass || '',
                    headerFooterClass: iAttrs.headerFooterClass || 'bar-stable',
                    value: null,
                    selectedClass: iAttrs.selectedClass || 'option-selected',
                    //search stuff
                    hasSearch: iAttrs.hasSearch !== "true" ? false : true,
                    searchValue: '',
                    subHeaderClass: iAttrs.subHeaderClass || 'bar-stable',
                    cancelSearchButton: iAttrs.cancelSearchButton || 'Cancel',

                };

                // getting options template
                var opt = iElement[0].querySelector('.option');
                if (!opt) {
                    throw new Error({
                        name: 'modalSelectError:noOptionTemplate',
                        message: 'When using modalSelect directive you must include an element with class "option" to provide a template for your select options.',
                        toString: function () {
                            return this.name + " " + this.message;
                        }
                    });
                }
                scope.inner = angular.element(opt).html();
                angular.element(opt).remove();

                //shortList controls wether using ng-repeat instead of collection-repeat
                if (iAttrs.useCollectionRepeat === "true") {
                    shortList = false;
                } else if (iAttrs.useCollectionRepeat === "false") {
                    shortList = true;
                } else {
                    shortList = scope.options.length < shortListBreak;
                };

                scope.ui.shortList = shortList;

                ngModelController.$render = function () {
                    scope.ui.value = ngModelController.$viewValue;
                };

                var getSelectedValue = scope.getSelectedValue = function (option) {
                    if (!option) {
                        return null;
                    }
                    if (onOptionSelect) {
                        var out = scope.optionGetter({ option: option });
                        return out;
                    }
                    if (setFromProperty) {
                        val = option[setFromProperty]
                    } else {
                        val = option;
                    }
                    return val;
                };

                scope.setOption = function (option) {
                    var oldValue = ngModelController.$viewValue;
                    var val = getSelectedValue(option);
                    ngModelController.$setViewValue(val);
                    ngModelController.$render();
                    scope.closeModal();
                    if (scope.onSelect) {
                        scope.onSelect({ newValue: val, oldValue: oldValue });
                    }
                };

                scope.unsetValue = function () {
                    $timeout(function () {
                        ngModelController.$setViewValue("");
                        ngModelController.$render();
                        scope.modal.hide();
                        scope.showList = false;
                    });
                };

                scope.closeModal = function () {
                    scope.modal.hide().then(function () {
                        scope.showList = false;
                    });
                };

                //loading the modal
                var modalTpl = multiple ? 'modal-template-multiple.html' : 'modal-template.html';
                scope.modal = $ionicModal.fromTemplate(
                    modalSelectTemplates[modalTpl],
                    { scope: scope }
                );

                scope.$on('$destroy', function () {
                    scope.modal.remove();
                });

                iElement.on('click', function () {
                    if (shortList) {
                        scope.showList = true;
                        scope.modal.show()
                    } else {
                        scope.modal.show()
                        .then(function () {
                            scope.showList = true;
                        });
                    }
                });

                //filter function
                if (scope.ui.hasSearch) {
                    var allOptions = angular.copy(scope.options);
                    scope.$watch('ui.searchValue', function (nv) {
                        scope.options = $filter('filter')(allOptions, nv);
                    });
                    scope.clearSearch = function () {
                        scope.ui.searchValue = '';
                    }
                }



                ngModelController.$render();

            }
        };
    }])

})();