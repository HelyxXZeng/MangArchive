import { formatDistanceToNow } from "date-fns";

const useTimeAgo = (date: string) => {
  // const { t } = useTranslation('utils-time'); // Sử dụng đúng namespace

  // Kiểm tra xem date có phải là chuỗi hợp lệ không
  const parsedDate = new Date(date);
  // Kiểm tra nếu parsedDate không hợp lệ
  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date:", date);
    return ""; // Trả về chuỗi rỗng hoặc thông báo lỗi nếu ngày không hợp lệ
  }

  // Sử dụng date-fns để tính khoảng cách thời gian
  const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

  // Tách thời gian và đơn vị từ kết quả trả về
  const [...unitArray] = timeAgo.split(" "); // Sử dụng spread để lấy phần còn lại là đơn vị
  const unit = unitArray.join(" "); // Ghép lại nếu có nhiều từ cho đơn vị

  // Đảm bảo count là kiểu số và unit được trả về trong tiếng Anh

  // console.log(parsedDate, unit);  // Xem kết quả

  // Trả về chuỗi "số lượng đơn vị" thay vì dịch
  return `${unit}`;
};

export default useTimeAgo;
