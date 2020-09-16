const Router = require("@koa/router");
const router = new Router();
const { createProject, createElements } = require("../../db/primary-electrical-overview");

router.put("/project-create", async (ctx) => {
    const { body } = ctx.request;
    const { projectInfo, elements } = body;
    let resProj, resEle;
    try {
        resProj = createProject(projectInfo.projectName, projectInfo.projectId);
        resEle = createElements(projectInfo.projectId, elements);
    } catch (error) {}
    console.log(resProj);
    console.log(resEle);
    ctx.body = {
        code: 200,
        message: "访问成功",
    };
});

router.get("/testCancelToken", async (ctx) => {
    // const { body } = ctx.request;
    // console.log(body);
    // ctx.body = {
    //     code: 200,
    //     message: "访问成功",
    // };
    // return;
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve("success");
        }, 10000);
    });
    ctx.body = {
        code: 200,
        message: "访问成功",
    };
});
module.exports = router.routes();
