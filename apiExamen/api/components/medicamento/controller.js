const { Medicamento } = require("../../../store/db");

const insert=async(req)=>{
    let response={};
    let{descripcion}=req.body;
    let itemInsert=await Medicamento.create({descripcion});
    response.code=1;
    response.data=itemInsert;

    return response;
}

const list=async(req)=>{
    let response={};
    response.code=1;
    response.data=await Medicamento.findAll();
    return response;
}

module.exports={
    insert,
    list
}