const getDetails = (data) => {
    let merged_vals = [];
    let countforEachProp = [];
    let propnames = data.map(ele => ele.property);
    data.forEach(prop => {
        let values = prop.values.map(item => item.val);
        prop.values = values;
    })
    data.forEach(item => {
        countforEachProp.push(item.values.length)
        merged_vals = [...merged_vals, ...item.values]
    }
    )
    return {
        merged_vals: merged_vals,
        countforEachProp: countforEachProp,
        propnames: propnames
    }
}

const refineInput = (input, type) => {
    let properties = []
    input.forEach(ele => {
        let pval = [];
        ele.values.forEach((et) => {
            pval.push({
                name: et.name,
                val: et.val
            })
        })
        properties.push({
            property: ele.property,
            values: pval
        })
    })
    let { merged_vals, countforEachProp, propnames } = getDetails(properties);
   
    let tablename;
    if (type === "auto") {
        tablename = "autofacttable"
    }
    else {
        tablename = "collegefacttable"
    }
    let res = { query: makeQuery(propnames, tablename, countforEachProp), vals: merged_vals };
   
    return res;
}

const makeQuery = (propames, tablename, countforEachProp) => {
    let begin = "SELECT * FROM " + tablename + " where ";
    for (let j = 0; j < propames.length; j++) {
        begin += propames[j];
        begin += " in (";
     
        for (let k = 0; k < countforEachProp[j] - 1; k++) {
            begin += "?,";
        }
        begin += "?) AND ";
    }
    begin = begin.slice(0, begin.length - 4);
    return begin;
}


module.exports = {
    getDetails,
    refineInput,
    makeQuery
}