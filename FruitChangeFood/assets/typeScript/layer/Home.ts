import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Home')
export class Home extends Component {

    layerGet: Node = null;
    layerBook: Node = null;
    layerRank: Node = null;

    onLoad() {
        this.layerBook = this.node.getChildByName("LayerBook");
        this.layerGet = this.node.getChildByName("LayerGet");
        this.layerRank = this.node.getChildByName("LayerRank");
    }

    onBtnGet() {
        this.layerGet.active = true;
    }

    onBtnBook() {
        this.layerBook.active = true;
    }

    onBtnRank() {
        this.layerRank.active = true;
    }

    onCloseLayer() {
        this.layerGet.active = false;
        this.layerBook.active = false;
        this.layerRank.active = false;
    }

    onBtnStart() {

    }
}

