class Register {
    constructor(props) {
        this.name = "register";
        this.color = "#55FF00";
        this.elementWidth = 10;
        this.elementHeight = 20;
        this.positionX = 100;
        this.positionY = 100;
        Object.assign(this, props);
    }
    set = (elementWidth, elementHeight, positionX, positionY) => {
        this.elementWidth = elementWidth;
        this.elementHeight = elementHeight;
        this.positionX = positionX;
        this.positionY = positionY;
    };
    setSize = (elementWidth, elementHeight) => {
        this.elementWidth = elementWidth;
        this.elementHeight = elementHeight;
    };
    setPosition(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }
    isPointInPath = (x, y) => {
        const { positionX, positionY, elementWidth, elementHeight } = this;
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
