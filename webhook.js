const stripeAPI = require('stripe')('sk_test_51NqbIGBttcRVBy3MYXkus2GMikCglZ1BBtZqOMortgPVkIiKT5ldSWRDGwTo4Vl7c0ondXjlamokmYAezlxlQBAy00Exf37gl4');

const web_hook_secret = "whsec_28a4770bcdd731cb99a4fca4431f5cbfe31b3d77d45050c038b3b11d58e88cd6";

function webhook(req,res){
    console.log("webhook called!");

    const sig = req.headers["stripe-signature"];
    let event;

    try{
        event = stripeAPI.webhooks.constructEvent(req.body, sig, web_hook_secret);
        console.log("event", event)
    }
    catch(error){
        console.log(error.message)
        return res.status(400).send(`webhook error ${error.message}`)
    }

    if(event.type === "checkout.session.completed"){
        let session = event.data.object;
        console.log("Event data", session)
    }

    return res.status(200).send({received:true})
}


module.exports = webhook;