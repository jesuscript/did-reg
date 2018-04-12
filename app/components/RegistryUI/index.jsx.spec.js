import {Observable,ReplaySubject} from 'rx'


describe("RegistryUI", function(){
  describe("model", function(){
    it.skip("", function(done){
      this.timeout(400)
      var props$ = new ReplaySubject(1)

      props$.subscribe(x => {
        console.log("sub", x)

      })

      Observable.of(1).subscribe(props$)
      
      props$.subscribe(x => {
        console.log("subx", x)
        done()
      })
    })
  })
})
