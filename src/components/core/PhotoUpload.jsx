import { Avatar } from "@mui/material";
import { getImageSize } from "helpers";
import { useRef } from "react";
import Swal from "sweetalert2";
const PhotoUpload = ({
  value,
  onChange,
  variant,
  height,
  width,
  dimensions,
}) => {
  const inputRef = useRef();
  const handleImageChange = async (e) => {
    try {
      const file = e?.target?.files?.[0];
      if (!file) return;
      if (!dimensions) return onChange(e);
      const { width, height } = await getImageSize(URL.createObjectURL(file));
      if (width === dimensions.width && height === dimensions.height)
        return onChange(e);
      Swal.fire(
        "Invalid Dimensions",
        `Please use ${dimensions.width}x${dimensions.height} images`,
        "warning"
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Avatar
        src={
          value?.target?.files[0]
            ? URL.createObjectURL(value?.target?.files[0])
            : value
        }
        variant={variant || "rounded"}
        sx={{
          height: height || 120,
          width: width || 120,
          cursor: "pointer",
        }}
        onClick={() => inputRef.current.click()}
      />
      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
    </>
  );
};

export default PhotoUpload;
