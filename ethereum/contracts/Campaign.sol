// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] public deployedCampaigns;

    // constructor(uint minimum) {
    //     createCampaign(minimum);
    // }

    function createCampaign(uint minimum) public {
      Campaign newCampaign = new Campaign(minimum, msg.sender);
      deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory)  {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    // address[] public approvers;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(manager == msg.sender, "The request is only submitted by manager alone!");
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, 'The value doesn\'t meet the minimum contribution');
        // approvers.push(msg.sender);
        if (!approvers[msg.sender]) {
                approvers[msg.sender] = true;
                approversCount++;
        }
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        // Improve GAS Savings
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        // requests.push(newRequest);
        // Request(description, value, recipient, false);
        // requests.push(Request({
        //     description: description,
        //     value: value,
        //     recipient: recipient,
        //     complete: false,
        //     approvalCount: 0
        // }));
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], 'Approver should have contributed some amount');
        require(!request.approvals[msg.sender], 'You have already approved!, Approval can be only done once per request');

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(!request.complete, 'The request has already been completed');
        require(request.approvalCount > (approversCount / 2), 'The appovals has not yet reached 50% of contributors');
        require(address(this).balance >= request.value, 'The Campaign value is less than the request amount') ;
        // address payable recipient = payable(request.recipient);
        (payable(request.recipient)).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}