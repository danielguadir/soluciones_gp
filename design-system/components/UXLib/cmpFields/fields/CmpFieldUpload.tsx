import React, { useState, useRef, useEffect } from "react";
import { Button as CmpButton } from "../../Button/Button";

interface FileUploaderWithPreviewProps {
  id: string;
  label?: string;
  onFileSelect: (files: File | File[] | any[] | unknown) => void;
  multiple?: boolean;
  accept?: string | Array<string>;
  maxSize?: number; // en MB
  disabled?: boolean;
  maxFiles?: number;
  nameFile?: string;
  onChange: (nameFile: string) => void;
  description?: string;
  error: string | null | undefined;
}

const FileUploaderWithPreview: React.FC<FileUploaderWithPreviewProps> = ({
  id = "",
  label = "",
  onFileSelect,
  multiple = false,
  accept = "image/*,.pdf",
  maxSize = 5, // en MB
  disabled = false,
  maxFiles = 5,
  nameFile = "",
  onChange,
  description = "",
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const arrAccept = typeof accept === "string" ? accept.split(",") : accept;

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files);
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
      handleFiles(e.target.files);
    }
  };

  const generatePreview = (file: any) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      if (file.type.startsWith("image/")) {
        reader.onload = (e: any) =>
          resolve({
            type: "image",
            url: e.target.result,
            name: file.name,
            size: file.size,
            file,
          });
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        resolve({
          type: "pdf",
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          file,
        });
      } else {
        resolve({
          type: "other",
          name: file.name,
          size: file.size,
          file,
        });
      }
    });
  };

  const handleFiles = async (files: any) => {
    // Generar vistas previas
    const filesArray = Array.from(files || []);
    const newPreviews = await Promise.all(filesArray.map(generatePreview));

    if (multiple) {
      setPreviews((prev: any) => [...prev, ...newPreviews].slice(0, maxFiles));
    } else {
      setPreviews(newPreviews);
    }

    // Llamar al callback con los archivos
    if (filesArray.length > 0) {
      const selected = multiple ? filesArray : filesArray[0];
      onFileSelect?.(selected);
    }
  };

  const removeFile = (index: any) => {
    setPreviews((prev: any) => prev.filter((_: any, i: any) => i !== index));
    const fileInput = document.getElementById(id) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
    onChange("");
    console.log("removeFile", index);
  };

  const triggerFileInput = () => {
    fileInputRef?.current?.click();
    onChange("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="file-uploader-container">
      <label htmlFor={id}>
        {(nameFile || label).split("<<")[0]}
        {(nameFile || label).split("<<")[1] !== undefined ? (
          <label
            style={{ color: "var(--primary-color)", fontWeight: "bold" }}
          >{` <<${(nameFile || label).split("<<")[1]}`}</label>
        ) : (
          ""
        )}
      </label>
      <div
        className={`file-uploader ${dragActive ? "active" : ""} ${disabled ? "disabled" : ""
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          multiple={multiple}
          accept={arrAccept.join(",")}
          disabled={disabled}
          style={{ display: "none" }}
        />

        <div
          className="upload-area"
          onClick={!disabled ? triggerFileInput : () => { }}
          title={description}
        >
          {dragActive ? (
            <p>Suelta los archivos aquí</p>
          ) : (
            <div className="content-select-file">
              <p>Arrastra y suelta archivos aquí o</p>
              <CmpButton
                className="browse-btn"
                nameBtn=""
                variant="contained"
                iconPosition="left"
                icon="upload-cloud"
                radius="10px"
                disabled={disabled}
                onClick={() => { }}
              />
              <p className="file-info">
                Formatos aceptados: {arrAccept.join(",")} | Máx. {maxSize}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {error === null && previews?.length > 0 ? (
        <div className="previews-container">
          <h3>
            Vista previa ({previews.length}{" "}
            {previews.length === 1 ? "archivo" : "archivos"})
          </h3>
          <div className="previews-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview-item">
                {preview.type === "image" && (
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="preview-image"
                  />
                )}
                {preview.type === "pdf" && (
                  <div className="pdf-preview">
                    <div className="pdf-icon">PDF</div>
                  </div>
                )}
                {preview.type === "other" && (
                  <div className="file-preview">
                    <div className="file-icon">📄</div>
                  </div>
                )}
                <div className="preview-info">
                  <span className="file-name" title={preview.name}>
                    {preview.name.length > 15
                      ? `${preview.name.substring(0, 12)}...`
                      : preview.name}
                  </span>
                  <span className="file-size">
                    {formatFileSize(preview.size)}
                  </span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                  title="Eliminar"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-previews-skeleton">
          <div className="title-ske"></div>
          <div className="previous-ske"></div>
        </div>
      )}
    </div>
  );
};

export default FileUploaderWithPreview;
