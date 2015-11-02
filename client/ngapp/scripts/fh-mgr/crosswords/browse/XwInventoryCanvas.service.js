(function() {
  'use strict';

  module.exports = XwInventoryCanvas;
  XwInventoryCanvas.$inject = ['Studio', 'RepositoryDomainPackage'];

  function XwInventoryCanvas(Studio, RepositoryDomainPackage) {
    // var Folder = RepositoryDomainPackage.Folder;
    var RootFolder = Studio.getRootFolder();
    // var someFolder = Studio.getFolderByPath('/a/b/c');
    RootFolder = RepositoryDomainPackage.RootFolder;

    // this.documentCacheManager = Studio;
    this.rootFolder = RootFolder;
    // this.rootFolder = documentCacheManager.getRootFolder();
    this.rootFolder.traverse().then(
      function (data) {
        console.log(data);
        var namespace, children, item;

        do {
          namespace = data.next();
          console.log('Key:', namespace.value.documentKind);
          children = namespace.value.children;
          do {
            item = children.next();
            console.log('-- Item:', item.value);
          } while (! item.done);
        } while (! namespace.done);
      }
    );
  }
}).call(window);
