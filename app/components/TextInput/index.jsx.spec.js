import TextInput from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import "should"

describe("TextInput", function(){
  const input = "abc"

  var DOM
  
  beforeEach(function(){
    DOM = mockDOMSource({
      "input[type=text]": {
        keyup: Observable.just({target: {value: input}})
      }
    })
  });

  it("emits initial input", function(done){
    TextInput({
      value$: Observable.of(""),
      DOM
    }).value$.first().subscribe((x) =>{
      x.should.be.equal("")
      done()
    })
  });
  
  it("emits user input", function(done){
    TextInput({
      value$: Observable.of(""),
      DOM
    }).value$.last().subscribe((x) =>{
      x.should.be.equal(input)
      done()
    })
  })

  it("doesn't emit if value hasn't changed", function(done){
    TextInput({
      value$: Observable.of(input),
      DOM
    }).value$.subscribe((x) =>{
      done()//should trigger only once
    })
  })
})
