import React, { useRef, useState, useEffect } from "react";
import "../css/drawingWithpaint.css";

interface PenOption {
  id: number;
  name: string;
  color: string;
  thick: number;
  opacity: number; // 연필 느낌 표현을 위한 투명도 옵션
  shadowBlur: number; // 번짐 효과
  isEraser?: boolean;
}

// 💡 메인 캘린더 컴포넌트(`mainPage.tsx`)와 안전하게 연동하기 위한 프롭스 인터페이스 규격
interface DrawingWithPaintProps {
  onInsert: (imgDataUrl: string) => void; // 완성된 이미지를 부모에게 보낼 콜백 함수
  selectedDate: string; // 현재 그리기를 진행 중인 타겟 날짜 문자열
}

// 💡 컴포넌트 이름의 첫 글자를 대문자(DrawingWithPaint)로 정립하여 React 표준 규격을 준수합니다.
const DrawingWithPaint: React.FC<DrawingWithPaintProps> = ({
  onInsert,
  selectedDate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Undo/Redo 관리를 위한 역사(History) Stack 데이터 저장소
  const historyStack = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // 다채로운 기본 펜 라인업 구성 (연필, 일반펜, 네임펜, 형광펜, 지우개)
  const [penOptions, setPenOptions] = useState<PenOption[]>([
    {
      id: 1,
      name: "연필",
      color: "#000000",
      thick: 2,
      opacity: 0.4,
      shadowBlur: 1,
    },
    {
      id: 2,
      name: "일반펜",
      color: "#FF0000",
      thick: 4,
      opacity: 0.9,
      shadowBlur: 0,
    },
    {
      id: 3,
      name: "네임펜",
      color: "#0000FF",
      thick: 8,
      opacity: 1.0,
      shadowBlur: 0,
    },
    {
      id: 4,
      name: "형광펜",
      color: "#008000",
      thick: 18,
      opacity: 0.3,
      shadowBlur: 2,
    },
    {
      id: 5,
      name: "지우개",
      color: "#FFFFFF",
      thick: 30,
      opacity: 1.0,
      shadowBlur: 0,
      isEraser: true,
    },
  ]);

  const [selectedPen, setSelectedPen] = useState<PenOption>(penOptions[0]);
  const colorPickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 450;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;

    // 초기 흰 도화지 배경 채우기
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 최초 빈 도화지 상태를 히스토리 스택의 '첫 번째(0번)'로 명확히 저장
    const initialDataUrl = canvas.toDataURL();
    historyStack.current = [initialDataUrl];
    historyIndex.current = 0;
  }, []);

  // 펜 옵션 변경 시 스타일 동기화 로직
  useEffect(() => {
    if (!contextRef.current) return;
    const ctx = contextRef.current;

    ctx.strokeStyle = selectedPen.color;
    ctx.lineWidth = selectedPen.thick;

    if (selectedPen.isEraser) {
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    } else {
      ctx.globalAlpha = selectedPen.opacity;
      if (selectedPen.shadowBlur > 0) {
        ctx.shadowBlur = selectedPen.shadowBlur;
        ctx.shadowColor = selectedPen.color;
      } else {
        ctx.shadowBlur = 0;
      }
    }
  }, [selectedPen]);

  // 히스토리에 현재 Canvas 상태 스냅샷 저장
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();

    if (historyIndex.current < historyStack.current.length - 1) {
      historyStack.current = historyStack.current.slice(
        0,
        historyIndex.current + 1,
      );
    }

    historyStack.current.push(dataUrl);
    historyIndex.current = historyStack.current.length - 1;
  };

  // 저장된 특정 시점의 이미지 스냅샷을 캔버스 화면에 깨끗하게 복원
  const loadHistoryState = (index: number) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (
      !canvas ||
      !context ||
      index < 0 ||
      index >= historyStack.current.length
    )
      return;

    const img = new Image();
    img.src = historyStack.current[index];
    img.onload = () => {
      const currentAlpha = context.globalAlpha;
      const currentShadow = context.shadowBlur;

      context.globalAlpha = 1.0;
      context.shadowBlur = 0;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      context.globalAlpha = currentAlpha;
      context.shadowBlur = currentShadow;

      historyIndex.current = index;
    };
  };

  // [되돌리기 - Undo] 버튼
  const handleUndo = () => {
    if (historyIndex.current > 0) {
      loadHistoryState(historyIndex.current - 1);
    }
  };

  // [앞으로 돌리기 - Redo] 버튼
  const handleRedo = () => {
    if (historyIndex.current < historyStack.current.length - 1) {
      loadHistoryState(historyIndex.current + 1);
    }
  };

  // 그리기 이벤트 핸들러 핸들링
  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  // 💡 [회색 바탕 현상 수정 완료] 다시 그리기 제어 함수
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // 현재 펜의 투명도(`globalAlpha`)와 번짐 효과(`shadowBlur`) 설정을 백업합니다.
    const currentAlpha = context.globalAlpha;
    const currentShadow = context.shadowBlur;

    // 순백색으로 채우기 위해 알파값을 1.0으로, 그림자 번짐을 0으로 강제 초기화합니다.
    context.globalAlpha = 1.0;
    context.shadowBlur = 0;

    // 도화지 전체 면적을 완전한 흰색으로 투명도 없이 채웁니다.
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 채우기가 끝난 후 사용자가 쓰던 원래 펜의 투명도와 번짐 스타일로 원상복구합니다.
    context.globalAlpha = currentAlpha;
    context.shadowBlur = currentShadow;

    // 초기화된 깨끗한 화폭 상태를 역사(History) 스택에 기록합니다.
    saveToHistory();
  };

  // 💡 [삽입하기] 함수 개편: 부모 컴포넌트(`mainPage.tsx`)로 캔버스 스냅샷 데이터 전달
  const handleInsert = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 현재 캔버스 스크린을 Base64 주소값(PNG 형태)으로 변환 압축
    const dataUrl = canvas.toDataURL("image/png");

    // 부모의 매핑 스토리지 객체에 저장 콜백 트리거 가동
    onInsert(dataUrl);
    alert(`${selectedDate} 칸에 그림이 성공적으로 삽입되었습니다!`);
  };

  // 펜 클릭 제어 로직
  const handlePenClick = (pen: PenOption) => {
    if (pen.isEraser) {
      setSelectedPen(pen);
      return;
    }

    if (selectedPen.id === pen.id) {
      colorPickerRef.current?.click();
    } else {
      setSelectedPen(pen);
    }
  };

  // 컬러 피커 선택 완료 시 색 변경 적용
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextColor = e.target.value;
    if (selectedPen.isEraser) return;

    setPenOptions((prev) =>
      prev.map((p) =>
        p.id === selectedPen.id ? { ...p, color: nextColor } : p,
      ),
    );
    setSelectedPen((prev) => ({ ...prev, color: nextColor }));
  };

  return (
    <div className="paint-container">
      {/* 상단 헤더 바 */}
      <header className="paint-header">
        <div className="header-logo">
          <div className="logo-icon">🐤</div>
          <span className="logo-text">DADO</span>
        </div>
        {/* 현재 어떤 날짜를 작업 중인지 안내 표시 상단 배치 */}
        <div
          className="paint-date-indicator"
          style={{ fontWeight: "bold", color: "#666" }}
        >
          {selectedDate} 그리기
        </div>
        <div className="header-user">🧑</div>
      </header>

      {/* 메인 프레임 */}
      <main className="paint-main">
        <h2 className="paint-title">다두의 그림판</h2>

        <div className="canvas-wrapper">
          {/* 왼쪽 툴바 트레이 박스 */}
          <div className="tool-tray">
            {penOptions.map((pen) => (
              <button
                key={pen.id}
                onClick={() => handlePenClick(pen)}
                className={`tool-button ${selectedPen.id === pen.id ? "active" : ""}`}
                title={
                  !pen.isEraser
                    ? `${pen.name} (한번 더 눌러 색상 변경)`
                    : "지우개"
                }
              >
                {!pen.isEraser ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      className="pen-body"
                      style={{ backgroundColor: pen.color }}
                    />
                    <div
                      className="pen-tip"
                      style={{ borderLeftColor: pen.color }}
                    />
                  </div>
                ) : (
                  <div className="eraser-tool">지우개</div>
                )}
              </button>
            ))}

            <input
              ref={colorPickerRef}
              type="color"
              style={{
                width: 0,
                height: 0,
                padding: 0,
                border: "none",
                visibility: "hidden",
                position: "absolute",
              }}
              onChange={handleColorChange}
              value={selectedPen.isEraser ? "#ffffff" : selectedPen.color}
            />

            {/* 되돌리기(←) / 앞으로 돌리기(→) 화살표 제어 그룹 */}
            <div className="arrow-group">
              <button
                className="arrow-btn"
                onClick={handleUndo}
                title="되돌리기 (Undo)"
              >
                ←
              </button>
              <button
                className="arrow-btn"
                onClick={handleRedo}
                title="앞으로 돌리기 (Redo)"
              >
                →
              </button>
            </div>
          </div>

          {/* 실제 도화지 Canvas 영역 */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="paint-canvas"
          />
        </div>

        {/* 하단 액션 동작 바 */}
        <div className="action-group">
          <button onClick={clearCanvas} className="action-btn">
            다시 그리기
          </button>
          <button onClick={handleInsert} className="action-btn">
            삽입하기
          </button>
        </div>
      </main>
    </div>
  );
};

// 💡 하단 export도 올바른 대소문자 이름인 DrawingWithPaint로 매칭하여 내보냅니다.
export default DrawingWithPaint;
