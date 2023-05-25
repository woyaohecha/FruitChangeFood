import { _decorator, Component, Node, instantiate, Label, Sprite, ScrollView, v2, assetManager, SpriteFrame, resources, Texture2D, SpringJoint2D, ImageAsset } from 'cc';
import { HttpManager } from '../manager/HttpManager';
import { PrefabManager } from '../manager/PrefabManager';
import Tools from '../Tools';

const { ccclass, property } = _decorator;

@ccclass('Rank')
export class Rank extends Component {
    listPanel: Node = null;
    data: any[] = [];
    inited: boolean = false;
    defaultImage: SpriteFrame = null;

    onLoad() {
        this.listPanel = this.node.getChildByName("PanelBg").getChildByName("ListPanel").getChildByName("view").getChildByName("content");
    }

    onEnable() {
        this.initScroll();
        if (this.inited) {
            return;
        }
        this.setLayer();
    }

    setLayer() {
        let self = this;
        if (this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
                let item = instantiate(PrefabManager.rankItemPrefab);
                item.getChildByName("RankNum").getComponent(Label).string = (i + 1) + ".";
                item.getChildByName("Name").getComponent(Label).string = this.data[i].nickname;
                item.getChildByName("ScoreAndTime").getChildByName("Score").getComponent(Label).string = this.data[i].level_max;
                item.getChildByName("ScoreAndTime").getChildByName("Time").getComponent(Label).string = Tools.timeFormat(this.data[i].level_time);

                let imageUrl: string = this.data[i].img;

                let profile = item.getChildByName("Profile").getChildByName("Mask").getChildByName("Image").getComponent(Sprite);
                console.log("profile:", profile)
                console.log("头像地址:", imageUrl.substring(-1, 8), imageUrl);
                if (imageUrl.substring(-1, 8) == "https://") {
                    assetManager.loadRemote(imageUrl, { ext: '.jpg' }, (e, asset: ImageAsset) => {
                        if (e) {
                            console.log(e);
                            return;
                        }
                        console.log("加载头像成功:", asset, typeof (asset));
                        let sp = new SpriteFrame();
                        let tex = new Texture2D();
                        tex.image = asset;
                        sp.texture = tex;
                        profile.spriteFrame = sp;
                    })
                }
                item.setParent(this.listPanel);
            }
            this.inited = true;
        } else {
            HttpManager.getRank((res) => {
                self.data = JSON.parse(res).data.rankList;
                console.log("获取排行榜数据:", self.data);
                self.setLayer();
            });
        }
    }

    initScroll() {
        let scrollView = this.node.getChildByName("PanelBg").getChildByName("ListPanel").getComponent(ScrollView);
        scrollView.scrollToOffset(v2(0, 0));
    }
}

