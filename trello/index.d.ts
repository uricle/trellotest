declare class Trello {
    uri: string;
    key: string;
    token: string;
    constructor (key: string, token: string);

    createQuery(): {key: string, token: string};
    makeRequest(requestMethod: trello.method, path: string, options: {}, callback?: (error: any, result: any)=> void): Promise<any>;

    // get
    getBoards(memberId: string, callback: (error: any, result: string | trello.BoardObject[]) => void): Promise<any>;
    getCardsOnBoard(boardId: string, callback: (error: any, result: string | trello.CardObject[]) => void): Promise<any>;
    getChecklistsOnCard(cardId: string, callback: (error: any, result: string | trello.ChecklistObject[]) => void): Promise<any>;

    // put
    updateCard(cardId: string, field: string, value: {}, callback: (error:any, response:any, body:any) => void): Promise<any>;
}
declare namespace trello {
    // https://trello.readme.io/v1.0/reference#introduction
    interface BoardObject {
        id: string;
        name: string;
        desc: string;
        descData: string | null;
        closed: boolean;
        idorganization: string;
        pinned: boolean;
        url: string;
        shortUrl: string;
        prefs: object;
        labelNames: object;
    }
    interface Bardges {
        votes: number;
        vieweingMemberVoted: boolean;
        subscribed: boolean;
        fogbugz: string;
        checkItems: number;
        checkItemsChecked: number;
        comments: number;
        attachments: number;
        description: boolean;
        due: Date | null;
        dueComplete: boolean;
    }
    interface CardObject {
        id: string;
        bardges: Bardges;
        checkItemStates: any[];
        closed: boolean;
        dateLastActivity: Date;
        desc: string;
        descData: Object;
        due: Date;
        dueComplete: boolean;
        email: string;
        idAttachmentCover: string;
        idBoard: string;
        idChecklists: string[];
        idLabels: string[];
        idList: string;
        idMembers: string[];
        idMembersVoted: string[];
        idShort: number;
        labels: any[];
        manualCoverAttachment: boolean;
        name: string;
        pos: number;
        shortLink: string;
        shortUrl: string;
        subscribed: boolean;
        url: string;
    }
    export interface CheckItem {
        state: string;
        idChecklist: string;
        id: string;
        name: string;
        nameData: string;
        pos: number;
    }
    interface ChecklistObject {
        id: string;
        idBoard: string;
        idCard: string;
        name: string;
        pos: number;
        checkItems: CheckItem[];
    }
    type method = 'post' | 'get' | 'put' | 'delete';
}

export = Trello;
