import { _decorator, Component, Node, instantiate, Label, Sprite, ScrollView, v2, assetManager, SpriteFrame, resources } from 'cc';
import { HttpManager } from '../manager/HttpManager';
import { PrefabManager } from '../manager/PrefabManager';

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
                item.getChildByName("ScoreAndTime").getChildByName("Time").getComponent(Label).string = this.data[i].level_time;

                let imageUrl = this.data[i].img;

                let profile = item.getChildByName("Profile").getChildByName("Mask").getChildByName("Image").getComponent(Sprite);
                assetManager.loadRemote(imageUrl, SpriteFrame, (e, asset: SpriteFrame) => {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    profile.spriteFrame = asset;
                })

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

