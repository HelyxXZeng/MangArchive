export const phraseImageUrl = (data: any): string => {
  //   console.log(data, Array.isArray(data));
  if (Array.isArray(data)) {
    const firstImage = data[0];
    if (typeof firstImage === "string") {
      try {
        const parsedData = JSON.parse(firstImage);
        return parsedData?.publicUrl || ""; // Trả về publicUrl nếu có
      } catch {
        return firstImage; // Nếu không phải JSON, trả về chuỗi URL thô
      }
    }
  } else if (typeof data === "string") {
    // Trường hợp đối tượng JSON dạng chuỗi, ví dụ '{"publicUrl": "https://..."}'
    try {
      const parsedData = JSON.parse(data);
      return parsedData?.publicUrl || "";
    } catch {
      return data; // Nếu không phải JSON, trả về chuỗi URL thô
    }
  }
  return ""; // Nếu không có dữ liệu hợp lệ
};
