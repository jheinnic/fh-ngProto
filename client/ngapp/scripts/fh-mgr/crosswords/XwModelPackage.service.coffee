'use strict'

module.exports = XwModelPackage

class XwModelPackage
  $inject = [
    'CoreModelPackage'
    'DocumentModelPackage'
    'RepositoryModelPackage'
  ]

  constructor:
    (CoreModelPackage, DocumentModelPackage, RepositoryModelPackage) ->
      @Enum = CoreModelPackage.Enum
      {@AbstractDocument, @DocumentKind, @ExportRoleKind, @ModelObject} = RepositoryModelPackage
      {@Canvas, @Folder, @Document} = DocumentModelPackage

## TODO:  Eliminate replication of this code in jchpft-backend/lib/xwprovider.js
