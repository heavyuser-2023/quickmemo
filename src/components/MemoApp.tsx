import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Trash2, Edit3, Plus, Search } from "lucide-react";

export default function MemoApp() {
  const memos = useQuery(api.memos.getMemos);
  const createMemo = useMutation(api.memos.createMemo);
  const updateMemo = useMutation(api.memos.updateMemo);
  const deleteMemo = useMutation(api.memos.deleteMemo);

  const [selectedMemoId, setSelectedMemoId] = useState<Id<"memos"> | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // 로딩 상태 처리
  if (memos === undefined) {
    return (
      <div className="flex w-full h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSelectMemo = (memo: typeof memos[0]) => {
    setSelectedMemoId(memo._id);
    setTitle(memo.title);
    setContent(memo.content);
    setIsEditing(false); // 리스트 클릭 시 단순 조회 모드
  };

  const handleNewMemo = () => {
    setSelectedMemoId(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    if (selectedMemoId) {
      // 기존 메모 업데이트
      await updateMemo({ id: selectedMemoId, title, content });
      setIsEditing(false); // 저장 후 조회 모드로
    } else {
      // 새 메모 생성
      const newId = await createMemo({ title, content });
      setSelectedMemoId(newId);
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: Id<"memos">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("정말 이 메모를 삭제하시겠습니까?")) return;
    
    await deleteMemo({ id });
    if (selectedMemoId === id) {
      handleNewMemo();
    }
  };

  const enableEditMode = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-[75vh] w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      
      {/* 1. 사이드바 (메모 리스트) */}
      <div className="w-full md:w-1/3 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col h-1/3 md:h-full">
        {/* 사이드바 헤더 */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-500" />
            내 메모
          </h2>
          <button
            onClick={handleNewMemo}
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
            title="새 메모"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {memos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 space-y-3">
              <Search className="w-8 h-8 opacity-50" />
              <p className="text-sm">저장된 메모가 없습니다.</p>
            </div>
          ) : (
            memos.map((memo) => (
              <div
                key={memo._id}
                onClick={() => handleSelectMemo(memo)}
                className={`group cursor-pointer p-4 rounded-xl transition-all duration-200 border ${
                  selectedMemoId === memo._id
                    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 shadow-sm"
                    : "bg-white border-transparent hover:border-gray-200 dark:bg-gray-800 dark:hover:border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-semibold truncate ${selectedMemoId === memo._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                    {memo.title || "제목 없음"}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(memo._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate line-clamp-2 white-space-normal">
                  {memo.content || "내용 없음"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. 메인 에디터 영역 */}
      <div className="w-full md:w-2/3 flex flex-col h-2/3 md:h-full bg-white dark:bg-gray-900">
        {!selectedMemoId && !isEditing ? (
          // 선택된 메모가 없을 때의 플레이스홀더 화면
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <Edit3 className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">사이드바에서 메모를 선택하거나 새 메모를 작성해보세요.</p>
          </div>
        ) : (
          // 작성/수정/조회 화면
          <div className="flex flex-col h-full p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!isEditing}
                placeholder="제목을 입력하세요"
                className={`w-full text-3xl font-bold bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 ${!isEditing ? "opacity-90 outline-none" : ""}`}
              />
              
              {/* 편집 관련 버튼들 */}
              <div className="flex items-center gap-2 pl-4">
                {!isEditing ? (
                  <button
                    onClick={enableEditMode}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors whitespace-nowrap"
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={!title.trim() && !content.trim()}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                  >
                    저장
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={!isEditing}
              placeholder="여기에 자유롭게 내용을 작성하세요..."
              className={`flex-1 w-full resize-none bg-transparent border-none focus:ring-0 p-0 text-lg text-gray-700 dark:text-gray-300 leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 ${!isEditing ? "outline-none" : ""}`}
            />
          </div>
        )}
      </div>
      
    </div>
  );
}
