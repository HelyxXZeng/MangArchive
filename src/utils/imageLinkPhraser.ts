export const getCommentImageUrl = (data: any): string => {
  if (Array.isArray(data) && data.length > 0) {
    const firstImage = data[0];
    if (typeof firstImage === "string") {
      try {
        const parsedData = JSON.parse(firstImage);
        return parsedData?.publicUrl || ""; // Trả về publicUrl nếu có
      } catch {
        return firstImage; // Nếu không phải JSON, trả về chuỗi URL thô
      }
    }
  }
  return ""; // Nếu không có dữ liệu hợp lệ
};
