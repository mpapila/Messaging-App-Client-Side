
export interface Message {
    id: number,
    type: 'recipients' | 'ownmessages';
    chatRoom: string;
    text: string;
    date: Date;
    userId: number;
}

export interface LoadingState {
    isLoading: boolean
}
export interface DisplayState {
    showChat: boolean,
    showChatList: boolean
}

export interface InitialMessage {
    id: number;
    senderId: number;
    content: string;
    createdAt: Date;
    chatRoom: string
}

export interface eachCard {
    friendId: number;
    friendName: string;
    chatRoomId: string;
    latestMessage: string;
    timestamp: string | null;
}

export interface EachChatRoom {
    id: number;
    requesterId: number;
    receiverId: number;
    status: string;
    createdAt: string;
    chatRoom: string;
    requester: {
        username: string;
    };
    receiver: {
        username: string;
    };
}

export interface ChatListState {
    showAddFriend: boolean;
}
export interface ChatRoomState {
    chatRoomId?: string | null;
    chatSelected: boolean;
    newMessages: boolean;
    chatRoomIdforNewMessage: (string | null)[];
    messages: Message[]
}

export interface NewMessageState {
    newMessage: boolean
}

export interface User {
    requesterId: number;
    id: number;
    username: string;
    receiverId?: number;
}





