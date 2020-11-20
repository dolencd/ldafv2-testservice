const crypto = require("crypto");
const _ = require("lodash")

const handleMessage = (event, context, callback) => {
    console.log("handleMessage", event, context)
    const newTime = _.now()
    const deltaTime = context.time ? newTime - context.time : 0;
    context.time = newTime;
    callback(context, {
        returnNumber: (event.params && event.params.returnNumber) ? event.params.returnNumber : 0,
        deltaTime
    })
}

const getHash = (data) => {
    console.log("getHash", data)
    return crypto.createHash("sha256").update(data).digest();
}

const updateValue = (event, context, callback) => {
    console.log("updateValue", event, context)
    context.storedValue = event.params.value;
    callback(context);
}

const hashData = (event, context, callback) => {
    console.log("hashData", event, context)
    let {data, repetitions} = event.params;

    data = Buffer.from(data, "hex")
    for(let i = 0; i < repetitions; i++){
        data = getHash(data);
    }

    callback(null, {
        hash: data.toString("hex")
    })

}

const add = (event, context, callback) => {
    console.log("add", event, context)
    if(!context.storedValue){
        if(process.env.S_INITIAL_VALUE){
            context.storedValue = parseInt(process.env.S_INITIAL_VALUE);
        }
        else {
            context.storedValue = 0;
        }
    }

    callback(context, {
        value: context.storedValue + event.params.value
    });
}


module.exports = {
    handleMessage,
    hashData,
    updateValue,
    add
}
