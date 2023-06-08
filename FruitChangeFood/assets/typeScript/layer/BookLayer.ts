import { _decorator, Component, Node, Label, instantiate, SpriteFrame, Sprite, ScrollView, v2 } from 'cc';
import { JsonManager } from '../manager/JsonManager';
import { PrefabManager } from '../manager/PrefabManager';


const { ccclass, property } = _decorator;

@ccclass('Book')
export class Book extends Component {

    listPanel: Node = null;
    inited: boolean = false;

    onLoad() {
        this.listPanel = this.node.getChildByName("PanelBg").getChildByName("ListPanel").getChildByName("view").getChildByName("content");
    }

    onEnable() {
        this.initScroll();
        if (this.inited) {
            return;
        }
        this.initLayer();
    }

    initLayer() {
        if (JsonManager.bookList.length > 0) {
            for (let i = 0; i < JsonManager.bookList.length; i++) {
                let item = instantiate(PrefabManager.bookItemPrefab);
                item.getChildByName("Id").getComponent(Label).string = i < 9 ? "0" + (i + 1) : "" + (i + 1);
                item.getChildByName("Icon").getChildByName("Icon").getComponent(Sprite).spriteFrame = JsonManager.bookList[i].icon;
                item.getChildByName("Name").getComponent(Label).string = JsonManager.bookList[i].name;
                // item.getChildByName("Des").getComponent(Label).string = JsonManager.bookList[i].des;
                item.setParent(this.listPanel);
            }
            this.inited = true;
        }
    }

    initScroll() {
        let scrollView = this.node.getChildByName("PanelBg").getChildByName("ListPanel").getComponent(ScrollView);
        scrollView.scrollToOffset(v2(0, 0));
    }
}

