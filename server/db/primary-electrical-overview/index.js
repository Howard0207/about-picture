const executeSql = require("../mysql");

const createProject = (projectId, projectName) => {
    const sql = `insert into electrical_project values('${projectId}', '${projectName}')`;
    console.log(sql);
    return executeSql(sql);
};

const createElements = async (projectId, elements) => {
    let values = "";
    elements.forEach((element) => {
        let { showBorder, positionX, positionY, id, name } = element;
        showBorder = showBorder ? 1 : 0;
        values += `('${id}',${positionX},${positionY},${showBorder},'${name}','${projectId}'),`;
    });
    values = values.substr(0, values.length - 1);
    const sql = `insert into element values ${values};`;
    console.log(sql);
    executeSql(sql);
};

module.exports = {
    createProject,
    createElements,
};
