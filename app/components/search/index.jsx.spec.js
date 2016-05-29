import Search from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import "should"

describe("Search", function(){
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
    Search({
      props$: Observable.of({searchQuery: ""}),
      DOM
    }).value$.first().subscribe((x) =>{
      x.should.be.equal("")
      done()
    })
  });
  
  it("emits user input", function(done){
    Search({
      props$: Observable.of({searchQuery: ""}),
      DOM
    }).value$.last().subscribe((x) =>{
      x.should.be.equal(input)
      done()
    })
  })
})
