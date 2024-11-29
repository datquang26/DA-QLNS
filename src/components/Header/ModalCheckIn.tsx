

import { useEffect, useRef, useState } from "react";
import { Button, Modal, Form, DatePicker, message, Spin } from "antd";
import moment from "moment";
import { useForm } from "antd/es/form/Form";
import { validateMessages } from "@/services/constant";
import { ATTENDANCE_SERVICE, AUTH_SERVICE, ORDER_SERVICE } from "@/services/api.service";
import { getItem } from "@/services/helpers.service";
import { postFormMethodFPT } from "@/services/apiService.service";
import { Color } from "antd/es/color-picker";

const ModalCheckIn = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getItem('user'));
  const [form] = useForm();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [imageData, setImageData] = useState<string | null>(null); // Dữ liệu ảnh đã chụp
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const minDate = moment();

  const disableDates = (current: any) => {
    return current && (current < minDate.startOf('day') || current > minDate.startOf('day'));
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    stopCamera();
  };

  const getImageBlobFromUrl = async (url: string) => {
    const response = await fetch(url);
    
    // Chuyển ảnh CCCD thành Blob
    const blob = await response.blob();
    return blob
  }

  const base64ToBlob = (base64, mimeType) => {
    // Tách phần base64 (bỏ phần `data:image/png;base64,`)
    const byteCharacters = atob(base64.split(',')[1]);
    
    // Tạo mảng chứa các byte của ảnh
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    // Tạo Blob từ mảng byte
    return new Blob(byteArrays, { type: mimeType });
  };
  

  const faceMatch = async () => {
    // Nếu có ảnh đã chụp, thêm vào dữ liệu
    if (!imageData) {
      message.error("Vui lòng xác thực khuôn mặt");
      return;
    }
    const imageBlob = await base64ToBlob(imageData, "image/png");
    const formData = new FormData();
    const res = await AUTH_SERVICE.show();
    const cccdImg = res?.data?.cccdImg;
    const cccdBlob = await getImageBlobFromUrl(cccdImg);
    
    formData.append("file[]", imageBlob)
    formData.append("file[]", cccdBlob)
    if (!cccdImg) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
      return;
    }

    setLoading(true)

    postFormMethodFPT("/dmp/checkface/v1", formData)
      .then(data => {
        console.log(data)

        const isMatch = data.data.data?.isMatch;
        console.log(isMatch)
        if (!isMatch) {
          message.error("Khuôn mặt không khớp, vui lòng chụp lại ảnh khuôn mặt!")
        } else {
          handleSubmit();
        }
      })
      .catch(err => {
        message.error("Vui lòng chụp lại ảnh khuôn mặt!")
      })
      .finally(() => {
        setLoading(false)
      });
  }

  const handleSubmit = async () => {
    let data: any = form.getFieldsValue();
    data.check_in = moment(data.check_in).format('yyyy-MM-DD');
    data.full_name = user?.name;
    data.email = user?.email;
    data.user_id = user?.id;
    data.type = 'ALL';

    setLoading(true);
    const response: any = await ATTENDANCE_SERVICE.store(data);
    setLoading(false);
    if (response?.status === 'success') {
      message.success('Chấm công thành công!');
      form.resetFields();
      setOpen(false);
      if (window.location.pathname?.includes('attendance')) {
        window.location.reload();
      }
    } else {
      message.error(response?.message, 5000);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  // Bắt đầu camera
  const startCamera = async () => {
    // Kiểm tra videoRef trước khi truy cập
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Chạy video
        setIsCameraOn(true);
      } catch (err) {
        message.error('Không thể truy cập camera');
        console.error(err);
      }
    } else {
      console.error("videoRef is null when starting the camera");
    }
  };

  // Dừng camera
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraOn(false);
  };

  // Chụp ảnh từ luồng video
  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context && videoRef.current) {
        // Đặt kích thước canvas sao cho phù hợp với kích thước video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Vẽ video lên canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Lấy dữ liệu ảnh từ canvas dưới dạng Base64
        const image = canvas.toDataURL("image/png");
        setImageData(image); // Lưu ảnh đã chụp
        setIsCameraOn(false);
      }
    }
  };

  // Callback khi video được load
  const handleVideoLoaded = () => {
    console.log('Video loaded successfully');
  };

  // Cleanup camera khi component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Mở camera khi modal được mở
  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        if (videoRef.current) {
          startCamera(); // Bật camera sau khi videoRef được gán
        }
      }, 0);
      return () => clearTimeout(timeoutId); // Dọn dẹp khi modal đóng
    }
  }, [open]);

  return (
    <li className="relative">
      <Button type="primary" onClick={showModal}>
        Chấm công
      </Button>
      <Modal
        open={open}
        centered={true}
        title="Chấm công"
        onCancel={handleCancel}
        footer={false}
      >
        {loading && (
          <div className="loading-overlay">
            <Spin size="large" />
          </div>
        )}
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          form={form}
          onFinish={faceMatch}
          validateMessages={validateMessages}
          layout="horizontal"
          style={{ maxWidth: 500 }}
        >
          <Form.Item label="Thời gian" name={'check_in'}
            rules={[{ required: true, message: 'Thời gian không được để trống' }]} >
            <DatePicker format={'DD-MM-YYYY'} placeholder="Chọn thời gian" className="w-full" />
          </Form.Item>

          {/* Nút bật/tắt camera */}
          <div className="flex gap-4 mb-4">
            <Button
              type="default"
              onClick={isCameraOn ? stopCamera : startCamera}
            >
              {isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
            </Button>
            <label style={{color: "red"}}>Vui lòng bỏ các vật dụng che mặt!</label>
          </div>

          <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width="100%"
                height="auto"
                onLoadedMetadata={handleVideoLoaded} // Callback khi video đã tải
                style={{
                  width: '100%',          // Đảm bảo video chiếm 100% chiều rộng
                  height: 'auto',         // Chiều cao tự động để giữ tỷ lệ
                  objectFit: 'cover',     // Đảm bảo video không bị méo, lấp đầy container
                  border: '1px solid black',  // Thêm viền xung quanh video
                  display: isCameraOn ? "block" : "none"
                }}
              />
            </div>

          {/* Canvas để chụp ảnh */}
          {isCameraOn && (
            <div className="mb-4">
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <Button type="default" onClick={captureImage}>
                Chụp ảnh
              </Button>
            </div>
          )}

          {/* Hiển thị ảnh đã chụp */}
          {imageData && (
            <div className="mb-4">
              <img src={imageData} alt="Captured" style={{ width: "100%" }} />
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>
            <button type="submit" className="btn px-6 bg-primary rounded-md text-white hover:bg-opacity-90">
              Xác nhận
            </button>
          </div>
        </Form>
      </Modal>
    </li>
  );
};

export default ModalCheckIn;









