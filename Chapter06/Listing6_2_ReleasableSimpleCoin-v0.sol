contract ReleasableSimpleCoin {
    bool public released = false;//#A

    … //#B

    function release() onlyOwner { //#C
        released = true;
    }

    function transfer(address _to, uint256 _amount) public {
        require(_to != 0x0); 
        require(coinBalance[msg.sender] > _amount);
        require(coinBalance[_to] + _amount >= coinBalance[_to] );
         
        if (released ) { //#D
            coinBalance[msg.sender] -= _amount;  
            coinBalance[_to] += _amount;   
            emit Transfer(msg.sender, _to, _amount);  
        }
		
		revert();//#E
    }

    function transferFrom(address _from, address _to, uint256 _amount) 
        public returns (bool success) {
        require(_to != 0x0);  
        require(coinBalance[_from] > _amount); 
        require(coinBalance[_to] + _amount >= coinBalance[_to] ); 
        require(_amount <= allowance[_from][msg.sender]);  

        if (released ) { //#D
            coinBalance[_from] -= _amount; 
            coinBalance[_to] += _amount; 
            allowance[_from][msg.sender] -= _amount;
            emit Transfer(_from, _to, _amount);
			
			return true;
        }

		revert();//#E
    }
    

    … //#B
    
}
/*
#A flag determining whether the token is released
#B same SimpleCoin code as before
#C new function to release the coin; it can be called only by the contract owner
#D now the transfer logic can be executed only if the token has been released
#E if the token has not been released the state is reverted
*/
