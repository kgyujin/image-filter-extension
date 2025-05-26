// toggle 상태 읽어오기 및 초기 UI 설정
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleFilter");
  const label = document.getElementById("statusLabel");

  // 저장된 상태 불러오기
  chrome.storage.local.get(["filterEnabled"], (result) => {
    const isEnabled = result.filterEnabled ?? false;
    toggle.checked = isEnabled;
    label.textContent = isEnabled ? "ON" : "OFF";
  });

  // 토글 변경 이벤트 처리
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;
    label.textContent = isEnabled ? "ON" : "OFF";

    // 상태 저장
    chrome.storage.local.set({ filterEnabled: isEnabled });

    // 현재 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: isEnabled ? "enableAllFilters" : "disableAllFilters"
      });
    });
  });
});