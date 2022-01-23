 //SPDX-License-Identifier: UNLICENSED
 pragma solidity 0.8.11;

// store a single data point and allow fetching/updating of that datapoint
 contract SimpleStorage {
    
    // data point
    string public storedData;

    event myEventTest(string eventOutput);

    // changing state = gas fee
    function set(string memory myText) public {
        storedData = myText;
        emit myEventTest(myText);
    }

    //
    function get() public view returns (string memory){
        return storedData;
    }
 }