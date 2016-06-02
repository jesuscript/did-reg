import MorphingButton, {classes,model} from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import should from "should"


describe("MorphingButton", function(){
  var DOM

  beforeEach(function(){
    DOM = mockDOMSource({
      button: { click: Observable.just({win: true})}
    }).select("button")
  })

  it("shouldn't error when given undefined props", function(done){
    should.doesNotThrow(function(){
      MorphingButton({
        DOM: DOM,
        props$: Observable.from([undefined, {text: ""}])
      }).DOM.subscribe((p) => done())
    })
  })

  it("reacts to clicks", function(done){
    MorphingButton({
      DOM,
      props$: Observable.of({text: ""})
    }).props$
      .subscribe((p) => {
        p.click.win.should.be.true()
        
        done()//testing that click triggers only once
      })
  })

  describe("model", function(){
    var label = "abc"
    
    it("emits clicks", function(done){
      model({
        click$: Observable.of({})
      }).subscribe((p) => {
        p.click.should.be.ok()
        done()
      })
    })
  })
})
