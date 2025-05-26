// toggle 상태 읽어오기 및 초기 UI 설정
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleFilter");
  const label = document.getElementById("statusLabel");

  // 저장된 상태 불러오기
  chrome.storage.local.get(["filterEnabled"], (result) => {
    const isEnabled = result.filterEnabled ?? false;
    toggle.checked = isEnabled;
    label.textContent = isEnabled ? "ON" : "OFF";

    // 초기 아이콘 설정
    updateIcon(isEnabled);
  });

  // 토글 변경 이벤트 처리
  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;
    label.textContent = isEnabled ? "ON" : "OFF";

    // 상태 저장
    chrome.storage.local.set({ filterEnabled: isEnabled });

    // 아이콘 상태 변경
    updateIcon(isEnabled);

    // 현재 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: isEnabled ? "enableAllFilters" : "disableAllFilters"
      });
    });
  });
});

// 확장 아이콘 상태에 따라 이미지 변경
function updateIcon(isEnabled) {
  const iconPath = isEnabled ? "icons/icon128_on.png" : "icons/icon128_off.png";

  chrome.action.setIcon({
    path: {
      "16": iconPath,
      "48": iconPath,
      "128": iconPath
    }
  });
}