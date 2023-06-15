import { _decorator, Component, Node, Label } from 'cc';
import { JsonManager } from '../manager/JsonManager';
import Tools from '../Tools';
import { wx } from './Loading';

const { ccclass, property } = _decorator;

@ccclass('GetLayer')
export class GetLayer extends Component {

    desTop: Label = null;
    desBottom: Label = null;


    inited: boolean = false;

    onLoad() {
        this.desTop = this.node.getChildByName("Panel").getChildByName("DesPanel").getChildByName("DesTop").getComponent(Label);
        this.desBottom = this.node.getChildByName("Panel").getChildByName("DesBottom").getComponent(Label);
    }

    onEnable() {
        if (this.inited) {
            return;
        }
        this.initLayer();
    }

    initLayer() {
        if (JsonManager.getLayerInfo) {
            this.desTop.string = JsonManager.getLayerInfo.desTop;
            this.desBottom.string = JsonManager.getLayerInfo.desBottom;
            this.inited = true;
        }
    }

    onCopyBtn() {
        if (Tools.platform == "wx") {
            wx.setClipboardData({
                data: JsonManager.getLayerInfo.desTop
            });
            Tools.showCommonTips("复制成功", this.node.parent);
        }
    }

    onMiniBtn() {
        if (Tools.platform == "wx") {
            console.log("navigateToMiniProgram");
            wx.navigateToMiniProgram({
                appId: 'wxaaf796d43c4e9669',
                path: '',
                extraData: {
                    foo: 'bar'
                },
                envVersion: '',
                success(res) {
                    // 打开成功
                }
            })
        }
    }


}

