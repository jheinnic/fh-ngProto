(function () {
  'use strict';

  module.exports = XwInventoryController;
  XwInventoryController.$inject = ['$scope', '$state', 'XwInventoryCanvas', 'Studio', 'RepositoryDomainPackage', 'eventAggregator'];

  function XwInventoryController($scope, $state, XwInventoryCanvas, Studio, RepositoryDomainPackage, eventAggregator) {

    this.DocumentKind = $scope.DocumentKind = RepositoryDomainPackage.DocumentKind;

    $scope.treeOptions = {
      nodeChildren: 'contents',
      dirSelectable: false,
      injectClasses: {
        ul: 'a1',
        li: 'a2',
        liSelected: 'a7',
        iExpanded: 'a3',
        iCollapsed: 'a4',
        iLeaf: 'a5',
        label: 'a6',
        labelSelected: 'a8'
      }
    };

    $scope.dataForTheTree = [
      {
        'name': 'Joe',
        'age': '21',
        'children': [
          {'name': 'Smith', 'age': '42', 'children': []},
          {
            'name': 'Gary',
            'age': '21',
            'children': [
              {
                'name': 'Jenifer',
                'age': '23',
                'children': [
                  {'name': 'Dani', 'age': '32', 'children': []},
                  {'name': 'Max', 'age': '34', 'children': []}
                ]
              }
            ]
          }
        ]
      },
      {'name': 'Albert', 'age': '33', 'children': []},
      {'name': 'Ron', 'age': '29', 'children': []}
    ];

    angular.extend(
      Object.getPrototypeOf(XwInventoryController),
      {
        openSelected: function openSelected() {
          var docId = XwInventoryCanvas.getSelectedDocumentId();
          Studio.openDocument(docId).then(
            function onPass() {
              eventAggregator.trigger('org.fh-mgr.events.openDocumentPassed', {docId: docId});
              $state.to('crosswords.tickets', {docId: docId});
            }
          ).catch(
            function onErr(error) {
              console.error('Failed to open and cache document', error);
              eventAggregator.trigger('org.fh-mgr.events.failedToOpenDocument', {docId: docId});
            }
          ).done();
        },

        computeNodeLabelCss: function computeNodeLabelCss(node) {
          var retVal;
          switch (node.getDocumentKind()) {
            case this.DocumentKind.FOLDER:
              retVal = 'badge-info node-folder';
              break;
            case this.DocumentKind.XW_TICKET:
              retVal = 'badge-ok node-ticket';
              break;
            case this.DocumentKind.XW_RESULT:
              retVal = 'badge-warning node-result';
              break;
            default:
              retVal = 'badge-danger node-unknown';
              break;
          }

          return retVal;
        },

        onSelectionChange: function onSelectionChanged(node, selected) {
          if (selected) {
            Studio.select(node);
          } else {
            Studio.deselect(node);
          }
        },

        onExpansionChange: function onExpansionChanged(node, expanded) {
          if (expanded) {
            Studio.select(node);
          } else {
            Studio.deselect(node);
          }
        }
      }
    );
  }
}).call(window);

