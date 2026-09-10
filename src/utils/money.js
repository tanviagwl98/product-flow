function percentofCents(amountCents, percent){
    return Math.round((amountCents * percent) / 100)
}

function toDisplay(cents){
    return (cents / 100).toFixed(2)
}

mpdule.exports = {percentofCents, toDisplay}