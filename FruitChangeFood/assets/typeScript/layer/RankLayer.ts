import { _decorator, Component, Node, instantiate, Label, Sprite, ScrollView, v2, assetManager, SpriteFrame } from 'cc';
import { HttpManager } from '../manager/HttpManager';
import { PrefabManager } from '../manager/PrefabManager';

const { ccclass, property } = _decorator;

@ccclass('Rank')
export class Rank extends Component {
    listPanel: Node = null;
    data: any[] = [];
    inited: boolean = false;

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
        if (this.data.length > 0) {
            for (let i = 0; i < this.data.length; i++) {
                let item = instantiate(PrefabManager.rankItemPrefab);
                item.getChildByName("RankNum").getComponent(Label).string = (i + 1) + ".";
                item.getChildByName("Name").getComponent(Label).string = this.data[i].nickname;
                item.getChildByName("ScoreAndTime").getChildByName("Score").getComponent(Label).string = this.data[i].level_max;
                item.getChildByName("ScoreAndTime").getChildByName("Time").getComponent(Label).string = this.data[i].level_time;

                let imageUrl = this.data[i].img;
                assetManager.loadRemote(imageUrl, SpriteFrame, (e, asset: SpriteFrame) => {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    item.getChildByName("Profile").getChildByName("Image").getComponent(Sprite).spriteFrame = asset;
                })

                item.setParent(this.listPanel);
            }
            this.inited = true;
        } else {
            HttpManager.getRank((res) => {
                this.data = JSON.parse(res).data.rankList;
                console.log(this.data);
                this.setLayer();
            });
        }
    }

    initScroll() {
        let scrollView = this.node.getChildByName("PanelBg").getChildByName("ListPanel").getComponent(ScrollView);
        scrollView.scrollToOffset(v2(0, 0));
    }
}

