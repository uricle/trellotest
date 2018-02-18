import yargs = require('yargs');
import Trello = require('trello');
import fs = require('fs');
let key: string = '';
let token: string = '';
const appName: string = 'trellotest';
// 1.key 取得
//  trelloにログインした状態で https://trello.com/app-key にアクセス
// 2.token 取得
//  keyとアプリ名を指定して以下にアクセス 
//  https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=${Name}&key=${Key}
// 3. {key:'keystr', token:'tokenstr'}としてtrelloConfig.jsonを作成
const argv = yargs
    .command('boardlist', 'get boardlist', (yargs: yargs.Argv) => {
        return yargs;
    }, (args: yargs.Arguments) => {
        boardlist();
    })
    .command('cardlist', 'get cardlist', (yargs: yargs.Argv) => {
        return yargs.option('boardID', { description: 'board ID', require: true });
    }, (args: any) => getCardsOnBoard(args.boardID))
    .command('checklist', 'get checklist', (yargs: yargs.Argv) => {
        return yargs.option('cardID', { description: 'card ID', require: true });
    }, (args) => getCheckListOnCard(args.cardID))
    .command('uncheckAll', 'all uncheck on card', yargs => {
        return yargs.option('cardID', { require: true });
    }, (args) => uncheckAllItemOnCard(args.cardID))
    .argv;

function boardlist() {
    readConfig();
    console.log('boardlist');
    const trello = new Trello(key, token);
    trello.getBoards('me', (error, result) => {
        if (result instanceof Array) {
            const shortDB = result.map((value) => {
                return { id: value.id, name: value.name };
            });
            console.log(shortDB);
        }
        if (typeof (result) === 'string') {
            console.log(result);
        }
    });
}
function getCardsOnBoard(boardID: string) {
    readConfig();
    console.log(`get card list on ${boardID}`);
    const trello = new Trello(key, token);
    trello.getCardsOnBoard(boardID, (error, result) => {
        if (result instanceof Array) {
            const cards = result.map((value) => {
                return { id: value.id, name: value.name, checklist: value.idChecklists };
            });
            console.log(cards);
        }
        if (typeof result === 'string') {
            console.log(result);
        }
    });
}
function getCheckListOnCard(cardID: string) {
    readConfig();
    const trello = new Trello(key, token);
    trello.getChecklistsOnCard(cardID, (error, result) => {
        if (result instanceof Array) {
            const checkList = result.map((value) => {
                return {
                    id: value.id, name: value.name, list:
                        value.checkItems.map((item) => { return { id: item.id, name: item.name, state: item.state } })
                };
            });
            console.log(checkList);
            checkList.forEach((cl) => {
                cl.list.forEach(item => {
                    console.log(item);
                });
            });
        }
        if (typeof result === 'string') {
            console.log(result);
        }
    });
}
function unCheckItem(cardID: string, checkItemID: string) {
    readConfig();
    const trello = new Trello(key, token);
    trello.makeRequest('put',
        `/1/cards/${cardID}/checkItem/${checkItemID}`,
        { state: 'incomplete' })
        .then((response) => {
            // console.log(`unchecked: ${response.id} : ${response.name}`);
        });
}

function uncheckAllItemOnCard(cardID: string) {
    readConfig();
    const trello = new Trello(key, token);
    trello.getChecklistsOnCard(cardID, (error, result) => {
        if (result instanceof Array) {
            result.forEach((checkList) => {
                checkList.checkItems.forEach((checkItem) => {
                    if (checkItem.state === 'complete') {
                        unCheckItem(cardID, checkItem.id);
                    }
                });
            });
        }
        if (typeof result === 'string') {
            console.log(result);
        }
    });
}
function readConfig() {
    if (key !== '' && token !== '') {
        return;
    }
    const configFile = 'trelloConfig.json';
    const hasConfig = fs.existsSync(configFile);
    if (!hasConfig) {
        throw new Error('need trelloConfig.json');
    }
    const settings = JSON.parse(fs.readFileSync(configFile).toString());
    key = settings.key;
    token = settings.token;
}
