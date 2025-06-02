export interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Message {
  message: string; // Content of the message
  _id: string; // Unique identifier for the message
  senderId: string; // ID of the user who sent the message
  receiverId: string; // ID of the user who received the message
  text?: string; // Content of the message
  image?: string; // Content of the message
  image_id?: string; // Content of the message
  createdAt: string; // Timestamp of when the message was sent
  updatedAt: string; // Timestamp of when the message was sent
}
export interface MessageInput {
  text?: string; // Content of the message
  image?: string; // Content of the message
}


