/**
 * 操作页面内容
 */

// TODO 后续获取分数改为从github自动获取
// 获取json
const url = chrome.runtime.getURL("lib/problems.json");
console.log(url);
var objs;
$.getJSON(url, function(resp) {
    objs = resp;
    // console.log(objs);
});

window.addEventListener("load", init, false); 

const difficultyLocaleMap = {
    "EASY": {
        "en": "Easy",
        "cn": "简单",
    },
    "MEDIUM": {
        "en": "Medium",
        "cn": "中等",
    },
    "HARD": {
        "en": "Hard",
        "cn": "困难",
    }
}

function update() {
    console.log("分数更新...")
    var rows = $("*[role=rowgroup]").children();
    if (objs == undefined) {
        console.log("当前数据未获取成功, 请稍等...")
        return;
    }
    // 开始遍历
    for(var i = 0; i < rows.length; i++) {
        var children = $(rows[i]).children();
        var title = $(children[1]).text();
        var strs = title.split(".");
        // 追加分数
        var id = strs[0];
        if (objs.hasOwnProperty(id)) {
            score = objs[id]["rating"];
            console.log("题号:" + id + "\t名称:" + objs[id][`title_${localization}`] + "\trating:" + score);
            $(children[4]).children().text(score);
        } else {
            var klass = $(children[4]).children();
            if (klass.hasClass("text-olive")) {
                $(children[4]).children().text(difficultyLocaleMap.EASY[localization]);
            } else if (klass.hasClass("text-yellow")) {
                $(children[4]).children().text(difficultyLocaleMap.MEDIUM[localization]);
            } else if (klass.hasClass("text-pink")) {
                $(children[4]).children().text(difficultyLocaleMap.HARD[localization]);
            }
        }
    }
}

function init() {
    // 根据不同的url进行不同的处理
    var url = window.location.href;
    console.log("当前所在url:" + url);
    if (url.includes("problemset/all")) {
        update();  // 更新
        var observer = new MutationObserver(debounce(update, 1500)); // 延迟半秒更新
        var config = {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        }
        // 监听第一行
        observer.observe($("*[role=rowgroup] *[role=row] div")[1], config); 
        // 监听头
        var head = $("div.mb-3.flex.flex-col > div.flex.justify-between")
        if (head != undefined)  {
            observer.observe(head[0], config);
        }
    } else if (url.includes(`/leetcode.${localization}/tag`)) {  // 分类标签页
        // TODO 分类标签页分数更新
    }   

}

function debounce(callback, delay) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, [...args]);
        }, delay)
    }
}

