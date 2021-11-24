const { createCanvas, loadImage } = require('canvas');
const Router = require("@koa/router");
const log4js = require('log4js');
const { ErrorResponse } = require('../../model/response');
const router = new Router();

const logger = log4js.getLogger();
logger.level = "info";

const map = new Map();
const canvasBg = createCanvas(356, 200);
const canvasBl = createCanvas(300, 200);
const getImgPath = () => `https://picsum.photos/300/200/?image=${Math.floor(Math.random() * 1000)}`;
const ctxBg = canvasBg.getContext('2d');
const ctxBl = canvasBl.getContext('2d');
const l = 40;
const r = 8;
const drawPath = (ctx, x, y, operation) => {
    logger.info("drawPath:", x, y);
    let PI = Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
    ctx.lineTo(x + l, y);
    ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
    ctx.lineTo(x + l, y + l);
    ctx.lineTo(x, y + l);
    // anticlockwise为一个布尔值。为true时，是逆时针方向，否则顺时针方向
    ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.stroke();
    ctx.globalCompositeOperation = 'destination-over';
    // 判断是填充还是裁切, 裁切主要用于生成图案滑块
    operation === 'fill' ? ctx.fill() : ctx.clip();
};


const drawBlock = (img, position) => {
    const L = l + 2 * r;
    const [x, y] = position;
    logger.info("drawBlock:", x, y);
    drawPath(ctxBl, x, y, 'clip');
    ctxBl.drawImage(img, 0, 0, 300, 200);
    console.log(canvasBl.toDataURL());
    const y1 = y - r * 2 + 1;
    const ImageData = ctxBl.getImageData(x - 1, y1, L, L);
    // 调整滑块画布宽度
    ctxBg.putImageData(ImageData, 300, y1);
};

const initContainer = (position) => {
    return new Promise((resolve, reject) => {
        const imgPath = getImgPath();
        ctxBg.clearRect(0, 0, 356, 200);
        ctxBl.clearRect(0, 0, 300, 200);
        loadImage(imgPath).then((img) => {
            drawPath(ctxBg, ...position, 'fill');
            ctxBg.drawImage(img, 0, 0, 300, 200);
            drawBlock(img, position);
            resolve(canvasBg.toDataURL());
        }).catch(reject);
    })
};



/**
 *  Buffer to Stream
 *  const {Duplex} = require('stream'); // Native Node Module 
 *   function bufferToStream(myBuuffer) {
 *       let tmp = new Duplex();
 *       tmp.push(myBuuffer);
 *       tmp.push(null);
 *       return tmp;
 *   }
 *
 *   const myReadableStream = bufferToStream(your_buffer);
 *
 *   // use myReadableStream anywhere you would use a stream 
 *   // created using fs.createReadStream('some_path.ext');
 *   // For really large streams, you may want to pipe the buffer into the Duplex.
 */
router.get('/slide/:id', async (ctx) => {
    const imgPath = getImgPath();
    logger.info("图片地址：", imgPath);
    const params = ctx.params;
    const { id } = params;
    const x = Math.ceil(Math.random() * 240);
    const y = Math.ceil(Math.random() * 140);
    map.set(id, x);
    logger.info("position: ", x, y)
    try {
        const data = await initContainer([x, y]);
        //必须去掉前缀
        const base64 = data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64, "base64");
        // https://tool.oschina.net/commons/ content-type对照表
        ctx.set('Content-Type', 'image/jpeg');
        ctx.length = Buffer.byteLength(buffer);
        ctx.body = buffer;
        // 以流的方式传给前端
        // const filePath = path.resolve(__dirname, '../../upload-files/d3eb4d604cf311ecb40481617319fffc.jpg')
        // ctx.body = fs.createReadStream(filePath);
    } catch (error) {
        ctx.status = 404;
        ctx.body = new ErrorResponse(404, "图片获取失败")
    }
})


module.exports = router.routes();
