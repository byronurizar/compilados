const { Consulta, ConsultaEnfermedad, ConsultaMedicamento, Paciente, Doctor, Enfermedad, Medicamento } = require("../../../store/db");

const insert = async (req) => {
    let response = {};
    let { pacienteId, doctorId, listEnfermedad = [], listMedicamento = [] } = req.body;
    console.log(req.body)
    if (pacienteId > 0) {
        if (doctorId > 0) {
            if (listEnfermedad <= 0 && listMedicamento <= 0) {
                response.code = -1;
                response.data = "Para poder registrar la consulta debe de ingresar una o más enfermedades y/o uno o más medicamentos";
            } else {
                let itemConsulta = await Consulta.create({
                    pacienteId,
                    doctorId
                });
                if (itemConsulta) {
                    let { consultaId } = itemConsulta;
                    for await (item of listEnfermedad) {
                        let { enfermedadId } = item;
                        await ConsultaEnfermedad.create({
                            consultaId,
                            enfermedadId
                        });
                    }
                    for await (item of listMedicamento) {
                        let { medicamentoId } = item;
                        await ConsultaMedicamento.create({
                            consultaId,
                            medicamentoId
                        });
                    }
                    response.code = 1;
                    response.data = "Consulta registrada exitosamente";
                } else {
                    response.code = -1;
                    response.data = "Ocurrió un error al intentar registrar la consulta";
                }
            }

        } else {
            response.code = -1;
            response.data = "La información del doctor no es válida";
        }

    } else {
        response.code = -1;
        response.data = "La información del paciente ingresada no es valida";
    }

    return response;
}

const list = async (req) => {
    let response = {};
    response.code = 1;
    response.data = await Consulta.findAll({
        include: [
            {
                model: Doctor,
                as: "Doctor",
                required: true
            },
            {
                model: Paciente,
                as: "Paciente",
                required: true
            }
        ]
    });
    return response;
}
const listDetalle = async (req) => {
    let{id}=req.params;
    let response = {};
    response.code = 1;
    
    let enfermedades=await ConsultaEnfermedad.findAll({
        include: [
            {
                model: Enfermedad,
                as: "Enfermedad",
                required: true
            }
        ],
        where:{consultaId:id}
    });

    let medicamentos=await ConsultaMedicamento.findAll({
        include: [
            {
                model: Medicamento,
                as: "Medicamento",
                required: true
            }
        ],
        where:{consultaId:id}
    });

    let data={};
    data.enfermedades=enfermedades;
    data.medicamentos=medicamentos;
    response.data=data;

    return response;
}


const update = async (req) => {
    let response = {};
    let { id } = req.params;
    if (Number(id) > 0) {
        const dataActual = await Paciente.findOne({
            where: { pacienteId: id }
        });

        if (dataActual) {
            let { nombre, direccion, telefono } = req.body;
            let data = {
                nombre,
                direccion,
                telefono,
                fecha_ult_mod: new Date()
            }
            const resultado = await Paciente.update(data, {
                where: {
                    pacienteId: id
                }
            });

            if (resultado > 0) {
                response.code = 1;
                response.data = "Información del paciente actualizada exitosamente";
                return response;
            } else {
                response.code = 0;
                response.data = "No existen cambios para aplicar";
                return response;
            }
        } else {
            response.code = 0;
            response.data = "El código del paciente ingresado no existe";
            return response;
        }

    } else {
        response.code = 0;
        response.data = "El código del paciente ingresado no existe";
        return response;
    }
}

module.exports = {
    insert,
    list,
    update,
    listDetalle
}