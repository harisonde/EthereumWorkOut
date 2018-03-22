const assert = require('assert');
const ganache = require('ganache-cli');
 const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

class Car{
  drive(){
    return "Okay!!! Will drive";
  }

  park(){
    return "parked!!!";
  }
}

let car;

beforeEach(() => {
  car = new Car();
});

describe('Test Car functionalities', () => {
  it('verify park method', () => {
      assert.equal("parked!!!", car.park());
  });
  it('verify drive method', () =>{
    assert.equal("Okay!!! Will drive",car.drive())
  });
});
