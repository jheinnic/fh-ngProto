'use strict'

module.exports = ModelObject

###*
# Base class to help Documents keep track of their contained objects and to help Objects find their
# immediate parent and root ancestor DataObject containers.
###
class ModelObject
  @getSuperType: ->
    retVal = undefined
    if @ != ModelObject then retVal = @__super__.constructor
    return retVal
  @isSuperTypeOf: (target) ->
    throw new Error("target argument must be defined") unless target?
    return @::.isPrototypeOf(target::)
  @isSubTypeOf: (target) ->
    throw new Error("target argument must be defined") unless target?
    return target::.isPrototypeOf(@::)

  getType: -> return @constructor
  getSuperType: -> return @getType().getSuperType()
  hasSuperTypeOf: (target) -> return @getType().isSuperTypeOf(target)
  hasSubTypeOf: (target) -> return @getType().isSubTypeOf(target)

  equals: (other) -> return @ == other
