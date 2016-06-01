import MorphingButton, {classes,model} from "."
import {Observable} from 'rx'
import {mockDOMSource} from '@cycle/dom'
import "should"


describe("MorphingButton", function(){
  var DOM

  beforeEach(function(){
    DOM = mockDOMSource({
      button: { click: Observable.just({event: {win: true}})}
    })
    console.log(DOM)
  })

  it("reacts to clicks", function(done){
    MorphingButton({
      DOM,
      props$: Observable.of({text: ""})
    }).click$
      .subscribe((p) => {
        p.win.should.be.true()
        
        done()//testing that click triggers only once
      })
  })

  describe("model", function(){
    var label = "abc"
    
    it("emits all props on clicks", function(done){
      model({
        click$: Observable.of({event: {}})
      }, Observable.of({text: label, className: "btn"})).subscribe((state) => {
        if(state.event){
          state.text.should.be.equal(label)
          done()
        }
      })
    })

    it("emits no 'event' on props change", function(done){
      model({
        click$: Observable.of({event: {}})
      }, Observable.of({text: label, className: "btn"})).subscribe((state) => {
        if(!state.event) done()
      })
    })
  })
})
