import TextInput from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import should from "should"

describe("TextInput", function(){
  const input = "abc",
        initProps = Observable.of({value: ""})

  var DOM
  
  beforeEach(function(){
    DOM = mockDOMSource({
      "input": {
        keyup: Observable.just({target: {value: input}})
      }
    }).select("input")
  });

  it("emits initial input", function(done){
    TextInput({
      props$: initProps,
      DOM: mockDOMSource()
    }).props$.subscribe((x) =>{
      x.should.be.ok()
      done()
    })
  });
  
  it("emits user input (once)", function(done){
    TextInput({
      props$: initProps,
      DOM
    }).props$.filter(p => p.value === input).subscribe((x) =>{
      done() //should only be called once
    })
  })

  it("doesn't emit if value hasn't changed", function(done){
    TextInput({
      props$: Observable.from([{value: input}, {value: input}]),
      DOM
    }).props$.subscribe((x) =>{
      done() //should only be called once
    })
  })

  it("shouldn't error when given undefined props", function(done){
    should.doesNotThrow(function(){
      TextInput({
        DOM,
        props$: Observable.from([undefined, {value: ""}])
      }).DOM.subscribe((p) => done())
    })
  })

})
