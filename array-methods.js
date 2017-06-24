/* jshint esversion: 6 */
var dataset = require('./dataset.json');

/*
  create an array with accounts from bankBalances that are
  greater than 100000
  assign the resulting new array to `hundredThousandairs`
*/

function oneHundredThousand(account) {
  return account.amount > 100000;
}

var hundredThousandairs = dataset.bankBalances
.filter ( oneHundredThousand );

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `rounded`

  `rounded` value is `amount` rounded to the nearest dollar

  Example:
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting new array to `datasetWithRoundedDollar`
*/
function roundToTheDollar(account) {
  return {
    'amount' : account.amount,
    'rounded' : Math.round(account.amount)
  };
}

var datasetWithRoundedDollar = dataset.bankBalances.map( roundToTheDollar );

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `roundedDime`

  `roundedDime` value is `amount` rounded to the nearest 10th of a cent

  Example 1
    {
      "amount": "134758.46",
      "state": "HI"
      "roundedDime": 134758.5
    }
  Example 2
    {
      "amount": "134758.44",
      "state": "HI"
      "roundedDime": 134758.4
    }
  assign the resulting new array to `roundedDime`
*/
var datasetWithRoundedDime = dataset.bankBalances.map( (account) => {
  return {
    'amount' : account.amount,
    'roundedDime' : Math.round(account.amount * 10) / 10
  };
});

// set sumOfBankBalances to be the sum of all value held at `amount` for each bank object
function roundToNearestCent(bankTotals, currentNum) {
  return Math.round((bankTotals += parseFloat(currentNum.amount)) * 100) / 100;
}

var sumOfBankBalances = dataset.bankBalances.reduce( roundToNearestCent, 0);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take each `amount` and add 18.9% interest to it rounded to the nearest cent
  and then sum it all up into one value saved to `sumOfInterests`
 */

 // function excludeTheseStates(nonStates) {
 //  return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf(chosenStates.state) !== -1;
 // }


var sumOfInterests = dataset.bankBalances
.filter( (chosenStates) => {
  return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf(chosenStates.state) !== -1;
})
.reduce( (taxTotals, currentStateAmount) => {
  return Math.round((taxTotals + Math.round(currentStateAmount.amount * 0.189 * 100) / 100) * 100) / 100;
},0);

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table where

  the key is:
    the two letter state abbreviation
  and the value is:
    the sum of all amounts from that state
    the value must be rounded to the nearest cent

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */
var stateSums = dataset.bankBalances.reduce( (statesTotal, currentState) => {
  if ( !statesTotal.hasOwnProperty(currentState.state) ) {
    statesTotal[currentState.state] = 0;
  }
  statesTotal[currentState.state] += parseFloat(currentState.amount);
  statesTotal[currentState.state] = Math.round(statesTotal[currentState.state] * 100) / 100;
  return statesTotal;
},{});

/*
  Excluding the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take the `amount` of all other states and add 18.9% interest to it. Only sum values greater than 50,000 and save it to `sumOfHIghInterests`

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

 var sumOfHighInterests = Object.keys(stateSums).filter( (state) => {
  return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf(state) === -1;
})
.map( (state) => {
  return {
    state : state,
    combinedAmount : stateSums[state]
  };
})
.map( (account) => {
  return {
    interest : account.combinedAmount * 18.9 / 100
  };
})
.filter( (account) => {
  return account.interest > 50000;
})
.reduce( (prevInterest, currTotal) => {
  sum = prevInterest + currTotal.interest;
  return Math.round(sum * 100) / 100;
}, 0);

/*
  set `lowerSumStates` to be an array of two letter state
  abbreviations of each state where the sum of amounts
  in the state is less than 1,000,000
 */

var lowerSumStates = Object.keys(stateSums).filter( (state) => {
  return stateSums[state] < 1000000;
} );

/*
  aggregate the sum of each state into one hash table
  `higherStateSums` should be the sum of all states with totals greater than 1,000,000
 */
var higherStateSums = Object.keys(stateSums).filter( (state) => {
  return stateSums[state] > 1000000;
})
.map( (state) => {
  return {
    state : state,
    combinedAmount : stateSums[state]
  };
})
.reduce( (combinedTotal, nextTotalToBeAddedTo) => {
  sum = combinedTotal + nextTotalToBeAddedTo.combinedAmount;
  return sum;
},0);


/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware

  Check if all of these states have a sum of account values
  greater than 2,550,000

  if true set `areStatesInHigherStateSum` to `true`
  otherwise set it to `false`
 */
var areStatesInHigherStateSum = Object.keys(stateSums).filter( (state) => {
  return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf(state) !== -1;
})
.map(  (state) => {
  return {
    state : state,
    combinedAmount : stateSums[state]
  };
})
.every( (account) => {
  return account > 2550000;
});

/*
  Stretch Goal && Final Boss

  set `anyStatesInHigherStateSum` to be `true` if
  any of these states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  have a sum of account values greater than 2,550,000
  otherwise set it to be `false`
 */
var anyStatesInHigherStateSum = Object.keys(stateSums).filter( (state) => {
  return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf(state) !== -1;
})
.map(  (state) => {
  return {
    state : state,
    combinedAmount : stateSums[state]
  };
})
.some( (account) => {
  return account.combinedAmount > 2550000;
});


module.exports = {
  hundredThousandairs : hundredThousandairs,
  datasetWithRoundedDollar : datasetWithRoundedDollar,
  datasetWithRoundedDime : datasetWithRoundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
