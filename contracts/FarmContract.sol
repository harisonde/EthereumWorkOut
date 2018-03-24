pragma solidity ^0.4.18;

contract FarmContract{
    address insuranceProvider;
    mapping(address => InsuredDetails) customerDetailsMap;
    mapping(string  => CoverageDetails[]) coverageTypeAndDetailsMap;

    struct CoverageDetails{
        address insuredAddres;
        string coverageType;
        uint coverageAmount;
    }

    struct InsuredDetails{
        address insuredAddres;
        string firstName;
        string lastName;
        uint longitude;
        uint latitude;
    }

    function FarmContract() payable public {
        insuranceProvider = msg.sender;
    }

    modifier ownerOnly(address _owner){
        require(msg.sender == _owner);
        _;
    }

    function getInsuredDetails(address _insuredAddress) public ownerOnly(insuranceProvider)
    view returns(string, string) {
        return (customerDetailsMap[_insuredAddress].firstName,
        customerDetailsMap[_insuredAddress].lastName);
    }

    function getQuote() public pure returns(uint){
        // uint _langitude, uint _latitude, bytes32 _coverageType,
        //                 uint _coverageAmount
        return 100;
    }

    function bind(string _firstName, string _lastName, string _coverageType,
                    uint _coverageAmount, uint premium) payable public {
          InsuredDetails storage details = customerDetailsMap[msg.sender];
          details.insuredAddres = msg.sender;
          details.firstName = _firstName;
          details.lastName = _lastName;

          CoverageDetails[] storage covDetailsArray = coverageTypeAndDetailsMap[_coverageType];

          CoverageDetails memory covDetails;
          covDetails.coverageType = _coverageType;
          covDetails.coverageAmount =_coverageAmount;
          covDetails.insuredAddres = msg.sender;

          covDetailsArray.push(covDetails);

           require(msg.sender.balance > premium);
           insuranceProvider.transfer(premium);
     }

      function claimProcessing(string _coverageType) public{
         CoverageDetails[] memory covDetailsArray = coverageTypeAndDetailsMap[_coverageType];
         CoverageDetails memory covDetails;
         for(uint i =0; i < covDetailsArray.length; i++){
           covDetails = covDetailsArray[i];
           if(insuranceProvider.balance >= covDetails.coverageAmount){
                covDetails.insuredAddres.transfer(covDetails.coverageAmount);
           }
         }
    }

    function deposit(uint256 amount) payable public {
        require(msg.value == amount);
    }

    function getBalance(address balanceAddress) public view returns(uint){
        return balanceAddress.balance;
    }
}
