process.on('message', (num) => {
    const result = {};
    for(let i = 0; i < num; i++){
        const num = Math.floor(Math.random() * 1000) + 1;
        const cant = result[num] ? result[num] + 1 : 1;
        result[num] = cant;
    }
    process.send({result: result});
})