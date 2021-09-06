const { Enfermedad } = require("../../../store/db");

const insert=async(req)=>{
    let response={};
    let{descripcion}=req.body;
    let itemEnfermedad=await Enfermedad.create({descripcion});
    response.code=1;
    response.data=itemEnfermedad;

    return response;
}

const list=async(req)=>{
    let response={};
    response.code=1;
    response.data=await Enfermedad.findAll();
    return response;
}

module.exports={
    insert,
    list
}