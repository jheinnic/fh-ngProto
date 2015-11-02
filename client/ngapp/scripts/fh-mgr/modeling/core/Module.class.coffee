'use strict'

module.exports = Module

###
# Modules are classes designed to be reused as run-time mixins rather
# compile-time subclasses.
#
# When a module extends a module, the extended module's properties are copied as
# properties of the extending module.  The extending class acquires new class
# properties from the extended module's class properties.

# When an module includes a module, the included module's properties are copied as
# properties of the extending class's prototype.  Instance of the including class
# acquire new properties from the included module's class properties.
#
# The extend operation is meant for objects, whereas include is meant
# to be used on type constructor functions.
#
# In either case, a module can declare a function to be called when it
# is extended or included.  The object properties named 'extended' and
# 'included' are reserved for this purpose and are never copied during
# either operation.
###
class Module
  moduleKeywords = ['extended', 'included']

  @extend: (obj) ->
    for key, value of obj when key not in moduleKeywords
      @[key] = value

    obj.extended?.apply(@)
    return this

  @include: (obj) ->
    for key, value of obj when key not in moduleKeywords
      # Assign properties to the prototype
      @::[key] = value

    obj.included?.apply(@)
    return this
