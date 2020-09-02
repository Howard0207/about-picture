class Register {
    constructor(props) {
        this.name = "register";
        this.color = "#55FF00";
        this.elementWidth = 10;
        this.elementHeight = 20;
        this.positionX = 100;
        this.positionY = 100;
        this.selected = false;
        Object.assign(this, props);
    }
    update = (properties) => {
        Object.assign(this, properties);
    };
    isPoint = (position) => {
        const { positionX, positionY, elementWidth, elementHeight } = this;
        const { x, y } = position;
        if (
            x >= positionX - elementWidth / 2 &&
            x <= positionX + elementWidth / 2 &&
            y >= positionY - elementHeight / 2 &&
            y <= positionY + elementHeight / 2
        ) {
            return true;
        }
        return false;
    };
    render = (ctx) => {
        const { positionX, positionY, elementWidth, elementHeight } = this;
        // console.log(positionX, positionY, elementWidth, elementHeight);

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(positionX - elementWidth / 2, positionY - elementHeight / 2, elementWidth, elementHeight);
        ctx.restore();
        // const text = new Text({
        //     text: this.name,
        //     font: 12,
        //     positionX: positionX + elementWidth / 2 + 5,
        //     positionY: positionY - elementHeight / 2 + 4,
        // });
        // text.render(ctx);
        // canvasElements.push(this);
    };
}

export default Register;
