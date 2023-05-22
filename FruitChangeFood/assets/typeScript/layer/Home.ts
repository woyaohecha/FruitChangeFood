import { _decorator, Component, Node, UITransform, view } from 'cc';
import { WXManager } from '../manager/WXManager';
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

    start() {
        let btnRank = this.node.getChildByName("Home").getChildByName("BtnRank");
        let caNode = this.node.getChildByName("Home");
        let btnInfo = this.getBtnRankRect(btnRank, caNode);
        WXManager.wxLogin(btnInfo, this.onBtnRank.bind(this));

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

    getBtnRankRect(btn: Node, caNode: Node) {
        // wx.getSystemInfo 的同步版本
        let sys = window["wx"].getSystemInfoSync();
        let rect = btn.getComponent(UITransform).getBoundingBoxToWorld();
        let ratio = view.getDevicePixelRatio();
        let scale = view.getScaleX();
        let factor = scale / ratio;

        let diffY = caNode.getComponent(UITransform).height - view.getDesignResolutionSize().height;
        let left = rect.x * factor;
        let top = sys.screenHeight - (rect.y + rect.height) * factor - diffY / 2 * factor;
        let w = rect.width * factor;
        let h = rect.height * factor;

        // 手机屏幕 的区域 rect
        let srect = { left: left, top: top, width: w, height: h };
        return srect;
    }
}

