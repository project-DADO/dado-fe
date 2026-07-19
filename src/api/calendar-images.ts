import { apiFetch } from "@/api/client";
import type {
  DirectImageUploadRequest,
  DirectImageUploadResponse,
} from "@/types/calendar-image";

export async function uploadDirectImage(
  request: DirectImageUploadRequest,
): Promise<DirectImageUploadResponse> {
  const formData = new FormData();
  formData.append("calendarId", String(request.calendarId));
  formData.append("recordDate", request.recordDate);
  formData.append("imageFile", request.imageFile, "drawing.png");

  return apiFetch<DirectImageUploadResponse>(
    "/api/v1/calendars/images/direct",
    {
      method: "POST",
      body: formData,
    },
  );
}
