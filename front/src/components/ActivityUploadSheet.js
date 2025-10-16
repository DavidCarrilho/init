import React, { useState, useRef } from 'react';
import { 
  AttachFile, 
  CameraAlt, 
  Close, 
  Check, 
  Crop,
  CloudUpload 
} from '@mui/icons-material';

const ActivityUploadSheet = ({ isOpen, onClose, onUpload, studentId }) => {
  const [step, setStep] = useState('select'); // 'select', 'camera', 'crop', 'uploading'
  const [capturedImage, setCapturedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        await onUpload(file, 'file');
        // onClose(); // Não fechar automaticamente
        setStep('select');
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload do arquivo');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usar câmera traseira em celulares
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setStep('camera');
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Erro ao acessar a câmera. Verifique as permissões.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        setCapturedImage(blob);
        setStep('crop');
      }, 'image/jpeg', 0.8);
      
      // Parar a câmera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleCropAccept = () => {
    // Por enquanto, usar a imagem original (sem recorte)
    setCroppedImage(capturedImage);
    confirmPhoto();
  };

  const confirmPhoto = async () => {
    const imageToUpload = croppedImage || capturedImage;
    
    if (imageToUpload) {
      setIsUploading(true);
      try {
        // Criar um arquivo a partir do blob
        const file = new File([imageToUpload], `atividade_${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        await onUpload(file, 'camera');
        // onClose(); // Não fechar automaticamente
        resetState();
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload da foto');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetState = () => {
    setStep('select');
    setCapturedImage(null);
    setCroppedImage(null);
    setIsUploading(false);
    
    // Limpar stream se ainda estiver ativo
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="bottom-sheet-overlay" onClick={handleClose} />
      
      {/* Bottom Sheet */}
      <div className="bottom-sheet">
        <div className="bottom-sheet-header">
          <div className="bottom-sheet-handle" />
          <button className="bottom-sheet-close" onClick={handleClose}>
            <Close />
          </button>
        </div>

        {/* Conteúdo baseado no step */}
        {step === 'select' && (
          <div className="bottom-sheet-content">
            <h3>Enviar Atividade para Adaptação</h3>
            <p>Como você gostaria de enviar a atividade?</p>
            
            <div className="upload-options">
              <button className="upload-option" onClick={handleFileSelect}>
                <AttachFile style={{ fontSize: 32 }} />
                <span>Anexar Arquivo</span>
                <small>PDF, imagem ou documento</small>
              </button>
              
              <button className="upload-option" onClick={startCamera}>
                <CameraAlt style={{ fontSize: 32 }} />
                <span>Usar Câmera</span>
                <small>Fotografar a atividade</small>
              </button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="bottom-sheet-content camera-content">
            <h3>Fotografar Atividade</h3>
            
            <div className="camera-preview">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="camera-video"
              />
            </div>
            
            <div className="camera-controls">
              <button className="camera-button" onClick={capturePhoto}>
                <div className="camera-button-inner" />
              </button>
            </div>
          </div>
        )}

        {step === 'crop' && (
          <div className="bottom-sheet-content crop-content">
            <h3>Confirmar Foto</h3>
            
            <div className="photo-preview">
              {capturedImage && (
                <img 
                  src={URL.createObjectURL(capturedImage)} 
                  alt="Foto capturada" 
                  className="captured-photo"
                />
              )}
            </div>
            
            <div className="crop-actions">
              <button className="crop-button secondary" onClick={() => setStep('camera')}>
                Tirar Nova Foto
              </button>
              <button className="crop-button primary" onClick={handleCropAccept}>
                <Check style={{ marginRight: '8px' }} />
                Confirmar Foto
              </button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="bottom-sheet-content uploading-content">
            <div className="uploading-indicator">
              <CloudUpload style={{ fontSize: 48, color: '#007bff' }} />
              <h3>Enviando atividade...</h3>
              <p>Aguarde enquanto processamos sua atividade</p>
            </div>
          </div>
        )}

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
};

export default ActivityUploadSheet;