const Transaction = (function () { 
   
    //#A declare private variables and/or priviledged functions
    const feePercent = 0.6
   
    function precisionRound (number, precision) {
       const factor = Math.pow(10, precision)
         return Math.round(number * factor) / factor
    }
 
    return { 
       construct: function(sender, recipient, funds = 0.0) {
          this.sender = sender
          this.recipient = recipient
          this.funds = Number(funds)
          return this
       },
       netTotal: function () {
          return precisionRound(this.funds * feePercent, 2)
       }
      // declare public variables and/or functions 
 
    } 
 })();
 
 const coffee = Transaction.construct('Luke', 'Ana', 2.5)
 coffee.netTotal() // 1.5