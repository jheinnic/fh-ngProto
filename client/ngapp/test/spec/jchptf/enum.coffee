'use strict'

should = require('chai').should

describe('Configuring the Repository service', () ->
  Enum

  # Reacquire the Enum base class before each test.
  beforeEach( () ->
    Enum = require '../../scripts/enum'
  )

  it('should not allow direct instantiation', () -> )

  it('should allow subclasses', () ->
    class TestEnum extends Enum
    should(TestEnum).exist
  )
)
