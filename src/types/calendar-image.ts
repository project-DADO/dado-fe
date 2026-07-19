export interface DirectImageUploadRequest {
  calendarId: number;
  recordDate: string;
  imageFile: File | Blob;
}

export interface CalendarImageData {
  imageId: number;
  calendarId: number;
  recordDate: string;
  imageUrl: string;
  originType: "DIRECT" | "AI";
  updatedAt: string;
}

export interface DirectImageUploadResponse {
  message: string;
  data: CalendarImageData;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
